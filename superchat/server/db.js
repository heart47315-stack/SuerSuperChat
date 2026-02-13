const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function init() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS characters (
        id VARCHAR PRIMARY KEY,
        creator_id VARCHAR,
        name VARCHAR,
        persona_description TEXT,
        system_prompt TEXT,
        status VARCHAR DEFAULT 'pending',
        image TEXT,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS chat_logs (
        id VARCHAR PRIMARY KEY,
        character_id VARCHAR REFERENCES characters(id),
        user_id VARCHAR,
        role VARCHAR,
        message TEXT,
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS moderation_logs (
        id VARCHAR PRIMARY KEY,
        character_id VARCHAR REFERENCES characters(id),
        chat_log_id VARCHAR,
        provider VARCHAR,
        reason TEXT,
        raw JSONB,
        created_at TIMESTAMP DEFAULT now()
      );
    `);
  } finally {
    client.release();
  }
}

module.exports = { pool, init };
