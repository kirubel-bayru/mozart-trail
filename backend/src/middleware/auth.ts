import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: number
  email: string
}

export interface AuthRequest extends Request {
  user?: AuthPayload
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' })
    return
  }
  const token = header.slice(7)
  try {
    const secret = process.env.JWT_SECRET ?? 'mozart-trail-dev-secret'
    const payload = jwt.verify(token, secret) as AuthPayload
    req.user = payload
    next()
  } catch {
    res.status(401).json({ error: 'Token expired or invalid' })
  }
}

export function signToken(payload: AuthPayload): string {
  const secret = process.env.JWT_SECRET ?? 'mozart-trail-dev-secret'
  return jwt.sign(payload, secret, { expiresIn: '30d' })
}
