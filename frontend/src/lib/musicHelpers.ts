import type { MusicProgress } from './progressApi'

export const LISTEN_BONUS_POINTS = 10
export const CIPHER_BONUS_POINTS = 15

export function buildListenProgress(
  existing: MusicProgress | undefined,
  locationId: string,
  listenedSec: number,
  targetSec: number,
): MusicProgress {
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

  return next
}

export function buildCipherProgress(
  existing: MusicProgress | undefined,
  locationId: string,
  correct: boolean,
): MusicProgress {
  const next: MusicProgress = {
    locationId,
    listenedSec: existing?.listenedSec ?? 0,
    listenComplete: existing?.listenComplete ?? false,
    cipherSolved: (existing?.cipherSolved ?? false) || correct,
    listenPoints: existing?.listenPoints ?? 0,
    cipherPoints:
      existing?.cipherPoints ??
      (correct && !existing?.cipherSolved ? CIPHER_BONUS_POINTS : 0),
    updatedAt: new Date().toISOString(),
  }

  if (existing?.cipherSolved) {
    next.cipherPoints = existing.cipherPoints
    next.cipherSolved = true
  } else if (correct) {
    next.cipherPoints = CIPHER_BONUS_POINTS
  }

  return next
}
