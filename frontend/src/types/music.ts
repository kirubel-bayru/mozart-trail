export type MusicSource = 'sample' | 'api'

export interface MusicTrack {
  id: string
  locationId: string
  title: string
  subtitle: string
  kNumber?: string
  audioUrl: string
  attribution: string
  source: MusicSource
  /** Seconds required to complete the listen challenge */
  listenTargetSec: number
}

export interface MusicCipherChallenge {
  locationId: string
  /** Scrambled letters — same multiset as `answer`, shuffled for display */
  scrambled: string
  /** Quote-style clue from this location’s story (highlights the emphasized word) */
  context: string
  /** Correct answer (uppercase) */
  answer: string
  /** Four anagrams of `answer` (same letters as `scrambled`, different order) */
  choices: [string, string, string, string]
  /** Extra nudge after a wrong guess */
  hint: string
}

export interface MusicTrackResponse {
  track: MusicTrack
  cipher: MusicCipherChallenge
}
