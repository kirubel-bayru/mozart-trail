import { getToken } from './authApi'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000'

export interface QuizResult {
  locationId: string
  correct: number
  total: number
  pointsEarned: number
  completedAt: string
}

export interface UserTreasure {
  locationId: string
  collectedAt: string
}

export interface MusicProgress {
  locationId: string
  listenedSec: number
  listenComplete: boolean
  cipherSolved: boolean
  listenPoints: number
  cipherPoints: number
  updatedAt: string
}

export interface UserProgressData {
  quizResults: QuizResult[]
  treasures: UserTreasure[]
  musicProgress: MusicProgress[]
  unlockedLocationIds: string[]
}

export const EMPTY_PROGRESS: UserProgressData = {
  quizResults: [],
  treasures: [],
  musicProgress: [],
  unlockedLocationIds: [],
}

async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getToken()
  if (!token) throw new Error('Not authenticated')

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  })
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    return data.error ?? `Request failed (${res.status})`
  } catch {
    return `Request failed (${res.status})`
  }
}

export async function fetchUserProgress(): Promise<UserProgressData> {
  const res = await authFetch('/api/progress')
  if (!res.ok) throw new Error(await parseError(res))
  const data = (await res.json()) as UserProgressData
  return {
    quizResults: data.quizResults ?? [],
    treasures: data.treasures ?? [],
    musicProgress: data.musicProgress ?? [],
    unlockedLocationIds: data.unlockedLocationIds ?? [],
  }
}

export async function saveQuizResultApi(result: QuizResult): Promise<UserProgressData> {
  const res = await authFetch('/api/progress/quiz', {
    method: 'POST',
    body: JSON.stringify(result),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = (await res.json()) as UserProgressData & { ok?: boolean }
  return {
    quizResults: data.quizResults ?? [],
    treasures: data.treasures ?? [],
    musicProgress: data.musicProgress ?? [],
    unlockedLocationIds: data.unlockedLocationIds ?? [],
  }
}

export async function saveMusicProgressApi(progress: MusicProgress): Promise<UserProgressData> {
  const res = await authFetch('/api/progress/music', {
    method: 'POST',
    body: JSON.stringify(progress),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = (await res.json()) as UserProgressData & { ok?: boolean }
  return {
    quizResults: data.quizResults ?? [],
    treasures: data.treasures ?? [],
    musicProgress: data.musicProgress ?? [],
    unlockedLocationIds: data.unlockedLocationIds ?? [],
  }
}

export async function unlockLocationApi(locationId: string): Promise<UserProgressData> {
  const res = await authFetch('/api/progress/unlock', {
    method: 'POST',
    body: JSON.stringify({ locationId }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = (await res.json()) as UserProgressData & { ok?: boolean }
  return {
    quizResults: data.quizResults ?? [],
    treasures: data.treasures ?? [],
    musicProgress: data.musicProgress ?? [],
    unlockedLocationIds: data.unlockedLocationIds ?? [],
  }
}
