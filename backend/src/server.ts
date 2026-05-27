import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { pool } from './db'
import authRouter from './routes/auth'
import progressRouter from './routes/progress'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// ── DB migration ──────────────────────────────────────────────────────────────
async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id           SERIAL PRIMARY KEY,
      email        TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id                   SERIAL PRIMARY KEY,
      user_id              INTEGER REFERENCES users(id) ON DELETE CASCADE,
      location_id          TEXT NOT NULL,
      quiz_correct         INTEGER,
      quiz_total           INTEGER,
      quiz_points          INTEGER,
      quiz_completed_at    TIMESTAMPTZ,
      music_listened_sec   REAL    DEFAULT 0,
      music_listen_complete BOOLEAN DEFAULT FALSE,
      music_cipher_solved  BOOLEAN DEFAULT FALSE,
      music_listen_points  INTEGER DEFAULT 0,
      music_cipher_points  INTEGER DEFAULT 0,
      updated_at           TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, location_id)
    )
  `)
  console.log('Database migration complete')
}

migrate().catch((err) => console.error('Migration failed:', err))

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ message: 'Mozart Trail API', docs: ['/api/health', '/api/auth/*', '/api/progress'] })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend', timestamp: new Date().toISOString() })
})

app.get('/api/db', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as server_time')
    res.json({ status: 'ok', database: 'connected', serverTime: result.rows[0].server_time })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ status: 'error', database: 'disconnected', message })
  }
})

app.use('/api/auth', authRouter)
app.use('/api/progress', progressRouter)

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`)
})
