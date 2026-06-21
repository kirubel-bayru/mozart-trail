import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { pool } from './db'
import authRouter from './routes/auth'
import progressRouter from './routes/progress'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)

function parseCorsOrigins(): string[] {
  return (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

const corsOrigins = parseCorsOrigins()

app.use(cors({
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true)
      return
    }
    callback(new Error(`CORS blocked for origin: ${origin}`))
  },
}))
app.use(express.json())

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET must be set in production')
  process.exit(1)
}

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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id            SERIAL PRIMARY KEY,
      user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
      location_id   TEXT NOT NULL,
      correct       INTEGER NOT NULL,
      total         INTEGER NOT NULL,
      points_earned INTEGER NOT NULL,
      completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, location_id)
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_treasures (
      id           SERIAL PRIMARY KEY,
      user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
      location_id  TEXT NOT NULL,
      collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, location_id)
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS music_progress (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
      location_id     TEXT NOT NULL,
      listened_sec    REAL DEFAULT 0,
      listen_complete BOOLEAN DEFAULT FALSE,
      cipher_solved   BOOLEAN DEFAULT FALSE,
      listen_points   INTEGER DEFAULT 0,
      cipher_points   INTEGER DEFAULT 0,
      updated_at      TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, location_id)
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS location_unlocks (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
      location_id TEXT NOT NULL,
      unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, location_id)
    )
  `)

  await pool.query(`
    ALTER TABLE user_progress
    ADD COLUMN IF NOT EXISTS location_unlocked BOOLEAN DEFAULT FALSE
  `)

  await pool.query(`
    INSERT INTO quiz_results (user_id, location_id, correct, total, points_earned, completed_at)
    SELECT user_id, location_id, quiz_correct, quiz_total, quiz_points, quiz_completed_at
    FROM user_progress
    WHERE quiz_completed_at IS NOT NULL
    ON CONFLICT (user_id, location_id) DO NOTHING
  `)
  await pool.query(`
    INSERT INTO user_treasures (user_id, location_id, collected_at)
    SELECT user_id, location_id, quiz_completed_at
    FROM user_progress
    WHERE quiz_completed_at IS NOT NULL
    ON CONFLICT (user_id, location_id) DO NOTHING
  `)
  await pool.query(`
    INSERT INTO music_progress (
      user_id, location_id, listened_sec, listen_complete, cipher_solved,
      listen_points, cipher_points, updated_at
    )
    SELECT user_id, location_id, music_listened_sec, music_listen_complete, music_cipher_solved,
           music_listen_points, music_cipher_points, updated_at
    FROM user_progress
    WHERE music_listen_complete OR music_cipher_solved OR music_listened_sec > 0
    ON CONFLICT (user_id, location_id) DO NOTHING
  `)
  await pool.query(`
    INSERT INTO location_unlocks (user_id, location_id, unlocked_at)
    SELECT user_id, location_id, updated_at
    FROM user_progress
    WHERE location_unlocked = TRUE
    ON CONFLICT (user_id, location_id) DO NOTHING
  `)

  console.log('Database migration complete')
}

migrate().catch((err) => console.error('Migration failed:', err))

function isAllowedAudioUrl(raw: string): boolean {
  try {
    const u = new URL(raw)
    if (u.protocol !== 'https:') return false
    return (
      u.hostname === 'upload.wikimedia.org' ||
      u.hostname === 'archive.org' ||
      u.hostname.endsWith('.archive.org')
    )
  } catch {
    return false
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    message: 'Mozart Trail API',
    docs: ['/api/health', '/api/db', '/api/auth/*', '/api/progress', '/api/music/:locationId', '/api/audio/proxy'],
  })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'backend', timestamp: new Date().toISOString() })
})

/** Stream sample Mozart audio — avoids browser CORS/redirect issues with archive.org */
app.get('/api/audio/proxy', async (req, res) => {
  const rawUrl = typeof req.query.url === 'string' ? req.query.url : ''
  if (!rawUrl || !isAllowedAudioUrl(rawUrl)) {
    return res.status(400).json({ error: 'Invalid or disallowed audio URL' })
  }

  try {
    const upstream = await fetch(rawUrl, {
      redirect: 'follow',
      headers: { 'User-Agent': 'MozartsTrailApp/1.0 (educational)' },
    })
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream audio not found' })
    }

    const contentType = upstream.headers.get('content-type') || 'audio/mpeg'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.setHeader('Access-Control-Allow-Origin', corsOrigins[0] || '*')

    const buffer = await upstream.arrayBuffer()
    return res.send(Buffer.from(buffer))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(502).json({ error: 'Audio proxy failed', message })
  }
})

app.get('/api/music/:locationId', async (req, res) => {
  const base = process.env.MUSIC_API_URL?.replace(/\/$/, '')
  if (!base) {
    return res.status(501).json({
      error: 'MUSIC_API_URL not configured',
      message:
        'Set MUSIC_API_URL on the backend to your music provider. Frontend falls back to sample tracks.',
      locationId: req.params.locationId,
    })
  }

  try {
    const upstream = await fetch(
      `${base}/locations/${encodeURIComponent(req.params.locationId)}`,
      { headers: { Accept: 'application/json' } },
    )
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: 'Upstream music API error',
        status: upstream.status,
      })
    }
    const data = await upstream.json()
    return res.json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(502).json({ error: 'Music API unreachable', message })
  }
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

app.listen(port, '0.0.0.0', () => {
  console.log(`API server running on port ${port}`)
})
