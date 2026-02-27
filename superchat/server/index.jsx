// ------------------
// ตรวจสอบข้อความว่าไม่เหมาะสมหรือไม่
// ------------------
async function moderateContent(text) {
  if (!text) return { flagged: false };

  // ถ้ามี OpenAI API Key จะใช้ระบบ moderation ของ OpenAI ก่อน
  if (process.env.OPENAI_API_KEY) {
    try {
      const r = await fetch('https://api.openai.com/v1/moderations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model: "omni-moderation-latest", input: text }),
      });

      if (!r.ok) {
        console.warn("OpenAI moderation HTTP error:", r.status);
        return { flagged: false };
      }

      const data = await r.json();
      const flagged = data?.results?.[0]?.flagged || false;

      return { flagged, provider: 'openai', raw: data };

    } catch (e) {
      console.warn('OpenAI moderation failed', e);
    }
  }

  // ถ้าไม่มี OpenAI key → ใช้ fallback keyword blocklist
  const bad = ['fuck','shit','bitch','porn','sex','ฆ่า','ตาย','ควย'];
  const lower = text.toLowerCase();

  for (const w of bad) {
    if (lower.includes(w)) {
      return {
        flagged: true,
        provider: 'fallback',
        reason: `contains ${w}`
      };
    }
  }

  return { flagged: false, provider: 'fallback' };
}
// ------------------
// เรียก AI ตอบกลับ (รองรับ OpenAI และ Gemini)
// ------------------
async function generateAIReply(messages) {

  // เลือก provider อัตโนมัติ
  const provider =
    process.env.AI_PROVIDER ||
    (process.env.GOOGLE_API_KEY ? 'gemini' : 'openai');

  // ==========================
  // 🔵 OpenAI
  // ==========================
  if (provider === 'openai' && process.env.OPENAI_API_KEY) {
    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages
        }),
      });

      if (!r.ok) {
        console.error("OpenAI HTTP error:", r.status);
        return '(openai http error)';
      }

      const data = await r.json();

      return data?.choices?.[0]?.message?.content || '(empty reply)';

    } catch (e) {
      console.warn('OpenAI chat error', e);
      return '(openai error)';
    }
  }

  // ==========================
  // 🟣 Gemini (แก้ endpoint ใหม่)
  // ==========================
  if (provider === 'gemini' && process.env.GOOGLE_API_KEY) {
    try {

      // แปลง messages เป็นรูปแบบ Gemini
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const model = process.env.GOOGLE_MODEL || 'gemini-1.5-flash';

      const url =
        `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`;

      const body = {
        contents,
        generationConfig: {
          temperature: Number(process.env.GOOGLE_TEMPERATURE || 0.7),
          maxOutputTokens: Number(process.env.GOOGLE_MAXTOKENS || 512)
        }
      };

      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        console.error("Gemini HTTP error:", r.status);
        const errText = await r.text();
        console.error(errText);
        return '(gemini http error)';
      }

      const data = await r.json();

      // โครงสร้าง response ใหม่ของ Gemini
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      return reply || '(empty reply)';

    } catch (e) {
      console.warn('Gemini chat error', e);
      return '(gemini error)';
    }
  }

  return `(${provider} not configured)`;
}
const rateLimit = require('express-rate-limit');

app.use('/chat', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));