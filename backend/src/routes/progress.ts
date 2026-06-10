import { Router } from 'express'
import { pool } from '../db'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

interface QuizResultRow {
  locationId: string
  correct: number
  total: number
  pointsEarned: number
  completedAt: string
}

interface UserTreasureRow {
  locationId: string
  collectedAt: string
}

interface MusicProgressRow {
  locationId: string
  listenedSec: number
  listenComplete: boolean
  cipherSolved: boolean
  listenPoints: number
  cipherPoints: number
  updatedAt: string
}

async function fetchUserProgress(userId: number) {
  const [quizRes, treasureRes, musicRes, unlockRes] = await Promise.all([
    pool.query(
      `SELECT location_id, correct, total, points_earned, completed_at
       FROM quiz_results WHERE user_id = $1 ORDER BY completed_at`,
      [userId],
    ),
    pool.query(
      `SELECT location_id, collected_at FROM user_treasures WHERE user_id = $1 ORDER BY collected_at`,
      [userId],
    ),
    pool.query(
      `SELECT location_id, listened_sec, listen_complete, cipher_solved,
              listen_points, cipher_points, updated_at
       FROM music_progress WHERE user_id = $1`,
      [userId],
    ),
    pool.query(
      `SELECT location_id FROM location_unlocks WHERE user_id = $1`,
      [userId],
    ),
  ])

  const quizResults: QuizResultRow[] = quizRes.rows.map((row) => ({
    locationId: row.location_id as string,
    correct: row.correct as number,
    total: row.total as number,
    pointsEarned: row.points_earned as number,
    completedAt: row.completed_at as string,
  }))

  const treasures: UserTreasureRow[] = treasureRes.rows.map((row) => ({
    locationId: row.location_id as string,
    collectedAt: row.collected_at as string,
  }))

  const musicProgress: MusicProgressRow[] = musicRes.rows.map((row) => ({
    locationId: row.location_id as string,
    listenedSec: Number(row.listened_sec),
    listenComplete: row.listen_complete as boolean,
    cipherSolved: row.cipher_solved as boolean,
    listenPoints: row.listen_points as number,
    cipherPoints: row.cipher_points as number,
    updatedAt: row.updated_at as string,
  }))

  const unlockedLocationIds = unlockRes.rows.map((row) => row.location_id as string)

  return { quizResults, treasures, musicProgress, unlockedLocationIds }
}

router.get('/', async (req: AuthRequest, res) => {
  try {
    const data = await fetchUserProgress(req.user!.userId)
    res.json(data)
  } catch (err) {
    console.error('Progress load error:', err)
    res.status(500).json({ error: 'Failed to load progress' })
  }
})

router.post('/quiz', async (req: AuthRequest, res) => {
  const { locationId, correct, total, pointsEarned, completedAt } = req.body as {
    locationId?: string
    correct?: number
    total?: number
    pointsEarned?: number
    completedAt?: string
  }

  if (!locationId || correct == null || total == null || pointsEarned == null) {
    res.status(400).json({ error: 'locationId, correct, total, and pointsEarned are required' })
    return
  }

  const userId = req.user!.userId
  const completed = completedAt ?? new Date().toISOString()

  try {
    await pool.query('BEGIN')

    await pool.query(
      `INSERT INTO quiz_results (user_id, location_id, correct, total, points_earned, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, location_id) DO UPDATE SET
         correct = EXCLUDED.correct,
         total = EXCLUDED.total,
         points_earned = GREATEST(EXCLUDED.points_earned, quiz_results.points_earned),
         completed_at = EXCLUDED.completed_at`,
      [userId, locationId, correct, total, pointsEarned, completed],
    )

    await pool.query(
      `INSERT INTO user_treasures (user_id, location_id, collected_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, location_id) DO UPDATE SET
         collected_at = EXCLUDED.collected_at`,
      [userId, locationId, completed],
    )

    await pool.query(
      `INSERT INTO location_unlocks (user_id, location_id, unlocked_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, location_id) DO NOTHING`,
      [userId, locationId, completed],
    )

    await pool.query('COMMIT')

    const data = await fetchUserProgress(userId)
    res.json({ ok: true, ...data })
  } catch (err) {
    await pool.query('ROLLBACK')
    console.error('Quiz save error:', err)
    res.status(500).json({ error: 'Failed to save quiz result' })
  }
})

router.post('/music', async (req: AuthRequest, res) => {
  const body = req.body as MusicProgressRow
  if (!body.locationId) {
    res.status(400).json({ error: 'locationId is required' })
    return
  }

  const userId = req.user!.userId

  try {
    await pool.query(
      `INSERT INTO music_progress (
        user_id, location_id, listened_sec, listen_complete, cipher_solved,
        listen_points, cipher_points, updated_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (user_id, location_id) DO UPDATE SET
        listened_sec = GREATEST(EXCLUDED.listened_sec, music_progress.listened_sec),
        listen_complete = (EXCLUDED.listen_complete OR music_progress.listen_complete),
        cipher_solved = (EXCLUDED.cipher_solved OR music_progress.cipher_solved),
        listen_points = GREATEST(EXCLUDED.listen_points, music_progress.listen_points),
        cipher_points = GREATEST(EXCLUDED.cipher_points, music_progress.cipher_points),
        updated_at = EXCLUDED.updated_at`,
      [
        userId,
        body.locationId,
        body.listenedSec ?? 0,
        body.listenComplete ?? false,
        body.cipherSolved ?? false,
        body.listenPoints ?? 0,
        body.cipherPoints ?? 0,
        body.updatedAt ?? new Date().toISOString(),
      ],
    )

    const data = await fetchUserProgress(userId)
    res.json({ ok: true, ...data })
  } catch (err) {
    console.error('Music save error:', err)
    res.status(500).json({ error: 'Failed to save music progress' })
  }
})

router.post('/unlock', async (req: AuthRequest, res) => {
  const { locationId } = req.body as { locationId?: string }
  if (!locationId) {
    res.status(400).json({ error: 'locationId is required' })
    return
  }

  const userId = req.user!.userId

  try {
    await pool.query(
      `INSERT INTO location_unlocks (user_id, location_id, unlocked_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, location_id) DO NOTHING`,
      [userId, locationId],
    )

    const data = await fetchUserProgress(userId)
    res.json({ ok: true, ...data })
  } catch (err) {
    console.error('Unlock save error:', err)
    res.status(500).json({ error: 'Failed to save unlock' })
  }
})

export default router
