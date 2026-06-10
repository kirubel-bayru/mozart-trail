import { Router } from 'express'
import { pool } from '../db'
import { requireAuth, type AuthRequest } from '../middleware/auth'

const router = Router()

router.use(requireAuth)

interface QuizResult {
  locationId: string
  correct: number
  total: number
  pointsEarned: number
  completedAt: string
}

interface MusicProgress {
  locationId: string
  listenedSec: number
  listenComplete: boolean
  cipherSolved: boolean
  listenPoints: number
  cipherPoints: number
  updatedAt: string
}

// GET /api/progress — load saved progress for logged-in user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1',
      [req.user!.userId],
    )

    const quizResults: QuizResult[] = []
    const musicProgress: MusicProgress[] = []

    for (const row of result.rows) {
      if (row.quiz_completed_at) {
        quizResults.push({
          locationId: row.location_id,
          correct: row.quiz_correct,
          total: row.quiz_total,
          pointsEarned: row.quiz_points,
          completedAt: row.quiz_completed_at,
        })
      }
      if (row.music_listen_complete || row.music_cipher_solved || row.music_listened_sec > 0) {
        musicProgress.push({
          locationId: row.location_id,
          listenedSec: row.music_listened_sec,
          listenComplete: row.music_listen_complete,
          cipherSolved: row.music_cipher_solved,
          listenPoints: row.music_listen_points,
          cipherPoints: row.music_cipher_points,
          updatedAt: row.updated_at,
        })
      }
    }

    res.json({ quizResults, musicProgress })
  } catch (err) {
    console.error('Progress load error:', err)
    res.status(500).json({ error: 'Failed to load progress' })
  }
})

// POST /api/progress/sync — upsert local progress to backend
router.post('/sync', async (req: AuthRequest, res) => {
  const { quizResults, musicProgress } = req.body as {
    quizResults?: QuizResult[]
    musicProgress?: MusicProgress[]
  }

  const userId = req.user!.userId

  try {
    const allLocationIds = new Set([
      ...(quizResults ?? []).map((r) => r.locationId),
      ...(musicProgress ?? []).map((m) => m.locationId),
    ])

    for (const locationId of allLocationIds) {
      const quiz = quizResults?.find((r) => r.locationId === locationId)
      const music = musicProgress?.find((m) => m.locationId === locationId)

      await pool.query(
        `INSERT INTO user_progress (
          user_id, location_id,
          quiz_correct, quiz_total, quiz_points, quiz_completed_at,
          music_listened_sec, music_listen_complete, music_cipher_solved,
          music_listen_points, music_cipher_points,
          updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())
        ON CONFLICT (user_id, location_id) DO UPDATE SET
          quiz_correct = COALESCE(EXCLUDED.quiz_correct, user_progress.quiz_correct),
          quiz_total = COALESCE(EXCLUDED.quiz_total, user_progress.quiz_total),
          quiz_points = COALESCE(EXCLUDED.quiz_points, user_progress.quiz_points),
          quiz_completed_at = COALESCE(EXCLUDED.quiz_completed_at, user_progress.quiz_completed_at),
          music_listened_sec = GREATEST(EXCLUDED.music_listened_sec, user_progress.music_listened_sec),
          music_listen_complete = (EXCLUDED.music_listen_complete OR user_progress.music_listen_complete),
          music_cipher_solved = (EXCLUDED.music_cipher_solved OR user_progress.music_cipher_solved),
          music_listen_points = GREATEST(EXCLUDED.music_listen_points, user_progress.music_listen_points),
          music_cipher_points = GREATEST(EXCLUDED.music_cipher_points, user_progress.music_cipher_points),
          updated_at = NOW()`,
        [
          userId,
          locationId,
          quiz?.correct ?? null,
          quiz?.total ?? null,
          quiz?.pointsEarned ?? null,
          quiz?.completedAt ?? null,
          music?.listenedSec ?? 0,
          music?.listenComplete ?? false,
          music?.cipherSolved ?? false,
          music?.listenPoints ?? 0,
          music?.cipherPoints ?? 0,
        ],
      )
    }

    // Return merged progress from DB
    const result = await pool.query('SELECT * FROM user_progress WHERE user_id = $1', [userId])
    const mergedQuiz: QuizResult[] = []
    const mergedMusic: MusicProgress[] = []

    for (const row of result.rows) {
      if (row.quiz_completed_at) {
        mergedQuiz.push({
          locationId: row.location_id,
          correct: row.quiz_correct,
          total: row.quiz_total,
          pointsEarned: row.quiz_points,
          completedAt: row.quiz_completed_at,
        })
      }
      if (row.music_listen_complete || row.music_cipher_solved || row.music_listened_sec > 0) {
        mergedMusic.push({
          locationId: row.location_id,
          listenedSec: row.music_listened_sec,
          listenComplete: row.music_listen_complete,
          cipherSolved: row.music_cipher_solved,
          listenPoints: row.music_listen_points,
          cipherPoints: row.music_cipher_points,
          updatedAt: row.updated_at,
        })
      }
    }

    res.json({ ok: true, quizResults: mergedQuiz, musicProgress: mergedMusic })
  } catch (err) {
    console.error('Progress sync error:', err)
    res.status(500).json({ error: 'Failed to sync progress' })
  }
})

export default router
