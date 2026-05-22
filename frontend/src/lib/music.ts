import { getSampleMusicResponse } from '../data/sampleMusic'
import type { MusicTrack, MusicTrackResponse } from '../types/music'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000'
const USE_MUSIC_API = process.env.USE_MUSIC_API === 'true'

/** Use direct URLs for Wikimedia; proxy others when your API provides them. */
export function getPlayableAudioUrl(originalUrl: string): string {
  if (!originalUrl.startsWith('http')) return originalUrl
  if (originalUrl.includes('upload.wikimedia.org')) return originalUrl
  return `${API_BASE_URL}/api/audio/proxy?url=${encodeURIComponent(originalUrl)}`
}

export async function fetchMusicForLocation(locationId: string): Promise<MusicTrackResponse | null> {
  if (USE_MUSIC_API) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/music/${encodeURIComponent(locationId)}`)
      if (res.ok) {
        const data = (await res.json()) as MusicTrackResponse
        if (data?.track?.audioUrl) {
          return {
            ...data,
            track: {
              ...data.track,
              audioUrl: getPlayableAudioUrl(data.track.audioUrl),
            },
          }
        }
      }
    } catch {
      // fall through to bundled sample tracks
    }
  }

  const sample = getSampleMusicResponse(locationId)
  if (!sample) return null

  return {
    ...sample,
    track: {
      ...sample.track,
      audioUrl: getPlayableAudioUrl(sample.track.audioUrl),
    },
  }
}
