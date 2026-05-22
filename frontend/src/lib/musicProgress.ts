export const LISTEN_BONUS_POINTS = 10
export const CIPHER_BONUS_POINTS = 15

export interface MusicProgress {
  locationId: string
  listenedSec: number
  listenComplete: boolean
  cipherSolved: boolean
  listenPoints: number
  cipherPoints: number
  updatedAt: string
}

const STORAGE_KEY = 'mozart-music-progress'

function readAll(): MusicProgress[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as MusicProgress[]) : []
  } catch {
    return []
  }
}

function writeAll(items: MusicProgress[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getMusicProgress(locationId: string): MusicProgress | undefined {
  return readAll().find((p) => p.locationId === locationId)
}

export function getAllMusicProgress(): MusicProgress[] {
  return readAll()
}

export function getTotalMusicPoints(): number {
  return readAll().reduce((sum, p) => sum + p.listenPoints + p.cipherPoints, 0)
}

export function getMusicCipherSolvedCount(): number {
  return readAll().filter((p) => p.cipherSolved).length
}

export function updateListenProgress(locationId: string, listenedSec: number, targetSec: number) {
  const all = readAll()
  const existing = all.find((p) => p.locationId === locationId)
  const complete = listenedSec >= targetSec
  const wasComplete = existing?.listenComplete ?? false

  const next: MusicProgress = {
    locationId,
    listenedSec: Math.max(existing?.listenedSec ?? 0, listenedSec),
    listenComplete: (existing?.listenComplete ?? false) || complete,
    cipherSolved: existing?.cipherSolved ?? false,
    listenPoints:
      existing?.listenPoints ??
      (complete && !wasComplete ? LISTEN_BONUS_POINTS : 0),
    cipherPoints: existing?.cipherPoints ?? 0,
    updatedAt: new Date().toISOString(),
  }

  if (wasComplete) {
    next.listenPoints = existing!.listenPoints
  } else if (complete) {
    next.listenPoints = LISTEN_BONUS_POINTS
  }

  const rest = all.filter((p) => p.locationId !== locationId)
  writeAll([...rest, next])
  return next
}

export function solveMusicCipher(locationId: string, correct: boolean) {
  const all = readAll()
  const existing = all.find((p) => p.locationId === locationId)

  const next: MusicProgress = {
    locationId,
    listenedSec: existing?.listenedSec ?? 0,
    listenComplete: existing?.listenComplete ?? false,
    cipherSolved: (existing?.cipherSolved ?? false) || correct,
    listenPoints: existing?.listenPoints ?? 0,
    cipherPoints:
      existing?.cipherPoints ??
      (correct && !(existing?.cipherSolved) ? CIPHER_BONUS_POINTS : 0),
    updatedAt: new Date().toISOString(),
  }

  if (existing?.cipherSolved) {
    next.cipherPoints = existing.cipherPoints
    next.cipherSolved = true
  } else if (correct) {
    next.cipherPoints = CIPHER_BONUS_POINTS
  }

  const rest = all.filter((p) => p.locationId !== locationId)
  writeAll([...rest, next])
  return next
}
