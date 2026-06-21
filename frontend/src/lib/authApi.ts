import { API_BASE_URL } from './apiBaseUrl'

const SESSION_KEY = 'mozart-session'

export interface AuthUser {
  id: number
  email: string
  displayName: string
  createdAt?: string
}

export interface AuthSession {
  token: string
  user: AuthUser
}

interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    displayName: string
    createdAt?: string
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    return data.error ?? `Request failed (${res.status})`
  } catch {
    return `Request failed (${res.status})`
  }
}

function toSession(data: AuthResponse): AuthSession {
  return {
    token: data.token,
    user: {
      id: data.user.id,
      email: data.user.email,
      displayName: data.user.displayName,
      createdAt: data.user.createdAt,
    },
  }
}

export async function register(
  email: string,
  displayName: string,
  password: string,
): Promise<AuthSession> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, displayName, password }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return toSession((await res.json()) as AuthResponse)
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return toSession((await res.json()) as AuthResponse)
}

export async function fetchMe(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = (await res.json()) as AuthUser
  return {
    id: data.id,
    email: data.email,
    displayName: data.displayName,
    createdAt: data.createdAt,
  }
}

export function saveSession(session: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function loadSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed?.token || !parsed?.user?.id) return null
    return parsed
  } catch {
    return null
  }
}

export function getToken(): string | null {
  return loadSession()?.token ?? null
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
