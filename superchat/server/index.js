require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fetch = global.fetch || require('node-fetch');

const { pool, init } = require('./db');

const app = express();
app.use(cors());
app.use(express.json({ limit: '8mb' }));

// serve uploaded files
const path = require('path');
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// upload endpoint: accepts JSON { image: 'data:image/...;base64,...' }
app.post('/upload', async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'image required' });

  // try to parse data URI
  const matches = image.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/);
  if (!matches) return res.status(400).json({ error: 'invalid image data' });

  const ext = matches[2] === 'png' ? 'png' : 'jpg';
  const b64 = matches[3];
  const buffer = Buffer.from(b64, 'base64');
  const filename = `${require('uuid').v4()}.${ext}`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, buffer);

  const host = process.env.SERVER_HOST || `http://localhost:${process.env.PORT || 4000}`;
  const url = `${host}/uploads/${filename}`;
  res.json({ url });
});

async function generateSystemPrompt(name, persona) {
  return `You are a fictional character named ${name}. Your personality: ${persona}. Always stay in-character. If asked who you are, respond as ${name}, not as an AI.`;
}

app.post('/characters', async (req, res) => {
  const { creator_id, name, persona_description, image } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });

  const id = uuidv4();
  const system_prompt = await generateSystemPrompt(name, persona_description || '');

  await pool.query(
    `INSERT INTO characters (id, creator_id, name, persona_description, system_prompt, image, status)
     VALUES ($1,$2,$3,$4,$5,$6,'pending')`,
    [id, creator_id || null, name, persona_description || null, system_prompt, image || null]
  );

  res.json({ id });
});

app.get('/characters/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query('SELECT * FROM characters WHERE id=$1', [id]);
  if (!rows[0]) return res.status(404).json({ error: 'not found' });
  res.json(rows[0]);
});

// simple admin auth middleware: require x-admin-key header to match ADMIN_KEY
function requireAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return res.status(403).json({ error: 'admin auth not configured' });
  const provided = req.headers['x-admin-key'];
  if (!provided || provided !== adminKey) return res.status(401).json({ error: 'unauthorized' });
  next();
}

app.get('/admin/characters', requireAdmin, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM characters ORDER BY created_at DESC');
  res.json(rows);
});

app.patch('/admin/characters/:id/status', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['pending','active','banned','flagged'].includes(status)) return res.status(400).json({ error: 'invalid status' });
  await pool.query('UPDATE characters SET status=$1 WHERE id=$2', [status, id]);
  res.json({ ok: true });
});

app.get('/admin/moderation/:character_id', requireAdmin, async (req, res) => {
  const { character_id } = req.params;
  const { rows } = await pool.query('SELECT * FROM moderation_logs WHERE character_id=$1 ORDER BY created_at DESC', [character_id]);
  res.json(rows);
});

app.post('/chat', async (req, res) => {
  const { user_id, character_id, message } = req.body;
  if (!character_id || !message) return res.status(400).json({ error: 'character_id and message required' });

  // fetch character
  const { rows } = await pool.query('SELECT * FROM characters WHERE id=$1', [character_id]);
  if (!rows[0]) return res.status(404).json({ error: 'character not found' });
  const character = rows[0];

  // fetch last 10 chat logs
  const { rows: history } = await pool.query(
    'SELECT role, message FROM chat_logs WHERE character_id=$1 ORDER BY created_at DESC LIMIT 10',
    [character_id]
  );

  // build messages for API: system + history (reverse order) + user
  const messages = [{ role: 'system', content: character.system_prompt }];
  for (let i = history.length - 1; i >= 0; i--) {
    messages.push({ role: history[i].role, content: history[i].message });
  }
  messages.push({ role: 'user', content: message });

  // Simple moderation check on user message (server-side)
  const moderation = await moderateContent(message);
  if (moderation.flagged) {
    // mark character as flagged for admin review
    await pool.query('UPDATE characters SET status=$1 WHERE id=$2', ['flagged', character_id]);
    // save the attempted user message
    const chatId = uuidv4();
    await pool.query(
      `INSERT INTO chat_logs (id, character_id, user_id, role, message)
       VALUES ($1,$2,$3,$4,$5)`,
      [chatId, character_id, user_id || null, 'user', message]
    );
    // save moderation record
    await pool.query(
      `INSERT INTO moderation_logs (id, character_id, chat_log_id, provider, reason, raw)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [uuidv4(), character_id, chatId, moderation.provider || null, moderation.reason || null, JSON.stringify(moderation.raw || moderation)]
    );
    return res.status(403).json({ error: 'message flagged by moderation', details: moderation });
  }

  // call AI provider (supports OpenAI via OPENAI_API_KEY or Gemini via GOOGLE_API_KEY)
  let assistantText = await generateAIReply(messages);

  // moderate assistant reply as well
  const mod2 = await moderateContent(assistantText);
  if (mod2.flagged) {
    await pool.query('UPDATE characters SET status=$1 WHERE id=$2', ['flagged', character_id]);
    // log moderation entry for assistant reply
    await pool.query(
      `INSERT INTO moderation_logs (id, character_id, chat_log_id, provider, reason, raw)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [uuidv4(), character_id, null, mod2.provider || null, mod2.reason || null, JSON.stringify(mod2.raw || mod2)]
    );
  }

  // save user message and assistant message
  const userChatId = uuidv4();
  await pool.query(
    `INSERT INTO chat_logs (id, character_id, user_id, role, message)
     VALUES ($1,$2,$3,$4,$5)`,
    [userChatId, character_id, user_id || null, 'user', message]
  );
  const assistantChatId = uuidv4();
  await pool.query(
    `INSERT INTO chat_logs (id, character_id, user_id, role, message)
     VALUES ($1,$2,$3,$4,$5)`,
    [assistantChatId, character_id, user_id || null, 'assistant', assistantText]
  );

  res.json({ reply: assistantText });
});

// return recent chat logs for a character (last 100)
app.get('/chat/logs/:character_id', async (req, res) => {
  const { character_id } = req.params;
  const { rows } = await pool.query('SELECT id, role, message, created_at FROM chat_logs WHERE character_id=$1 ORDER BY created_at ASC LIMIT 100', [character_id]);
  res.json(rows);
});

const PORT = process.env.PORT || 4000;
init().then(() => {
  app.listen(PORT, () => console.log('Server listening on', PORT));
}).catch(err => {
  console.error('DB init failed', err);
  process.exit(1);
});

// --- Helpers: moderation and multi-provider AI ---

async function moderateContent(text) {
  if (!text) return { flagged: false };

  // Prefer OpenAI moderation if key available
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ input: text }),
      });
      const data = await r.json();
      const flagged = data?.results?.[0]?.flagged || false;
      return { flagged, provider: 'openai', raw: data };
    } catch (e) {
      console.warn('OpenAI moderation failed', e);
    }
  }

  // Fallback: simple keyword blocklist
  const bad = ['fuck','shit','bitch','porn','sex','ฆ่า','ตาย','ควย'];
  const lower = text.toLowerCase();
  for (const w of bad) if (lower.includes(w)) return { flagged: true, provider: 'fallback', reason: `contains ${w}` };
  return { flagged: false, provider: 'fallback' };
}

async function generateAIReply(messages) {
  const provider = process.env.AI_PROVIDER || (process.env.GOOGLE_API_KEY ? 'gemini' : 'openai');
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model, messages }),
      });
      const data = await r.json();
      return data?.choices?.[0]?.message?.content || '';
    } catch (e) {
      console.warn('OpenAI chat error', e);
      return '(openai error)';
    }
  }

  if (provider === 'gemini' && process.env.GOOGLE_API_KEY) {
    try {
      // Build a single prompt string from messages (system + history + user)
      let promptText = '';
      for (const m of messages) {
        promptText += `[${m.role}]: ${m.content}\n`;
      }

      const model = process.env.GOOGLE_MODEL || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateText?key=${process.env.GOOGLE_API_KEY}`;
      const body = {
        prompt: { text: promptText },
        temperature: Number(process.env.GOOGLE_TEMPERATURE || 0.7),
        maxOutputTokens: Number(process.env.GOOGLE_MAXTOKENS || 512)
      };
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      // response.candidates[0].content is common shape
      return data?.candidates?.[0]?.content || data?.output?.[0]?.content || '';
    } catch (e) {
      console.warn('Gemini chat error', e);
      return '(gemini error)';
    }
  }

  return `(${provider} not configured)`;
}
