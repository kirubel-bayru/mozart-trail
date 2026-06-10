import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db'
import { signToken, requireAuth, type AuthRequest } from '../middleware/auth'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, displayName, password } = req.body as {
    email?: string
    displayName?: string
    password?: string
  }

  if (!email || !displayName || !password) {
    res.status(400).json({ error: 'email, displayName, and password are required' })
    return
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters' })
    return
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (email, display_name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, display_name',
      [email.toLowerCase().trim(), displayName.trim(), passwordHash],
    )
    const user = result.rows[0]
    const token = signToken({ userId: user.id, email: user.email })
    res.status(201).json({ token, user: { id: user.id, email: user.email, displayName: user.display_name } })
  } catch (err: unknown) {
    const code = (err as { code?: string }).code
    if (code === '23505') {
      res.status(409).json({ error: 'An account with this email already exists' })
      return
    }
    console.error('Register error:', err)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string }
  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' })
    return
  }

  try {
    const result = await pool.query(
      'SELECT id, email, display_name, password_hash FROM users WHERE email = $1',
      [email.toLowerCase().trim()],
    )
    const user = result.rows[0]
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const token = signToken({ userId: user.id, email: user.email })
    res.json({ token, user: { id: user.id, email: user.email, displayName: user.display_name } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, display_name, created_at FROM users WHERE id = $1',
      [req.user!.userId],
    )
    const user = result.rows[0]
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ id: user.id, email: user.email, displayName: user.display_name, createdAt: user.created_at })
  } catch (err) {
    console.error('Me error:', err)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export default router
