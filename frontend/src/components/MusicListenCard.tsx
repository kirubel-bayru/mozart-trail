import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchMusicForLocation } from '../lib/music'
import {
  CIPHER_BONUS_POINTS,
  LISTEN_BONUS_POINTS,
  getMusicProgress,
  solveMusicCipher,
  updateListenProgress,
} from '../lib/musicProgress'
import type { MusicCipherChallenge, MusicTrack } from '../types/music'
import { C, F } from '../theme'

interface MusicListenCardProps {
  locationId: string
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

/** Stable shuffle so choices are not always in the same order */
function shuffledChoices(choices: [string, string, string, string], seed: string) {
  const arr = [...choices]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) | 0
    const j = Math.abs(hash) % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function MusicListenCard({ locationId }: MusicListenCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const tickRef = useRef<number | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [track, setTrack] = useState<MusicTrack | null>(null)
  const [cipher, setCipher] = useState<MusicCipherChallenge | null>(null)

  const [playing, setPlaying] = useState(false)
  const [currentSec, setCurrentSec] = useState(0)
  const [durationSec, setDurationSec] = useState(0)
  const [progress, setProgress] = useState(() => getMusicProgress(locationId))

  const [selectedCipher, setSelectedCipher] = useState<string | null>(null)
  const [cipherFeedback, setCipherFeedback] = useState<'correct' | 'wrong' | null>(null)

  const listenTarget = track?.listenTargetSec ?? 20
  const listenPct = Math.min(100, (progress?.listenedSec ?? 0) / listenTarget * 100)
  const listenDone = progress?.listenComplete ?? false
  const cipherDone = progress?.cipherSolved ?? false

  const choiceOptions = useMemo(
    () => (cipher ? shuffledChoices(cipher.choices, locationId) : []),
    [cipher, locationId],
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchMusicForLocation(locationId).then((data) => {
      if (cancelled) return
      if (!data) {
        setError('No music available for this location.')
        setLoading(false)
        return
      }
      setTrack(data.track)
      setCipher(data.cipher)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [locationId])

  useEffect(() => {
    setProgress(getMusicProgress(locationId))
  }, [locationId, listenDone, cipherDone])

  const persistListen = useCallback(
    (sec: number) => {
      const next = updateListenProgress(locationId, sec, listenTarget)
      setProgress(next)
    },
    [locationId, listenTarget],
  )

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !playing) return

    tickRef.current = window.setInterval(() => {
      const t = audio.currentTime
      setCurrentSec(t)
      persistListen(t)
    }, 500)

    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current)
    }
  }, [playing, persistListen])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      persistListen(audio.currentTime)
      return
    }
    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setError('Could not play audio. Check your connection or try again.')
    }
  }

  const handleCipherPick = (choice: string) => {
    if (!cipher || cipherDone || !listenDone) return
    setSelectedCipher(choice)
    const ok = choice === cipher.answer
    setCipherFeedback(ok ? 'correct' : 'wrong')
    if (ok) {
      const next = solveMusicCipher(locationId, true)
      setProgress(next)
    }
  }

  if (loading) {
    return (
      <div style={{
        marginBottom: 24, padding: 16, background: 'white', borderRadius: 14,
        border: `1px solid ${C.neutralDark}`,
      }}>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 13, color: C.textMuted }}>Loading music…</p>
      </div>
    )
  }

  if (error || !track || !cipher) {
    return (
      <div style={{
        marginBottom: 24, padding: 16, background: 'white', borderRadius: 14,
        border: `1px solid ${C.neutralDark}`,
      }}>
        <p style={{ margin: '0 0 8px', fontFamily: F.body, fontSize: 13, fontWeight: 700, color: C.primary }}>
          Music unavailable
        </p>
        <p style={{ margin: 0, fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
          {error ?? 'Could not load this location’s track. Ensure the backend is running on port 4000 and refresh.'}
        </p>
      </div>
    )
  }

  return (
    <div style={{
      marginBottom: 24,
      padding: '16px 16px 18px',
      background: 'white',
      borderRadius: 16,
      border: `1px solid ${C.neutralDark}`,
      boxShadow: '0 4px 16px rgba(139,0,0,0.06)',
    }}>
      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="metadata"
        onLoadedMetadata={(e) => setDurationSec(e.currentTarget.duration)}
        onEnded={() => {
          setPlaying(false)
          persistListen(audioRef.current?.currentTime ?? listenTarget)
        }}
        onTimeUpdate={(e) => setCurrentSec(e.currentTarget.currentTime)}
        onError={() => setError('Audio failed to load. Sample link may be unavailable.')}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
        <div>
          <p style={{
            margin: '0 0 4px', fontFamily: F.body, fontSize: 10, fontWeight: 800,
            letterSpacing: '0.16em', textTransform: 'uppercase', color: C.secondary,
          }}>
            🎵 Musical Cipher
          </p>
          <p style={{ margin: 0, fontFamily: F.headline, fontSize: 17, fontWeight: 700, color: C.textDark }}>
            {track.title}
          </p>
          <p style={{ margin: '4px 0 0', fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
            {track.subtitle}{track.kNumber ? ` · ${track.kNumber}` : ''}
          </p>
        </div>
        {track.source === 'sample' && (
          <span style={{
            fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: C.textMuted, background: C.neutral,
            padding: '4px 8px', borderRadius: 6,
          }}>
            Sample
          </span>
        )}
      </div>

      {/* Listen challenge */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700, color: C.textMuted }}>
            Listen challenge · {listenTarget}s
          </span>
          <span style={{ fontFamily: F.body, fontSize: 11, color: listenDone ? C.secondaryDark : C.textMuted }}>
            {listenDone ? `+${LISTEN_BONUS_POINTS} pts ✓` : `${Math.floor(listenPct)}%`}
          </span>
        </div>
        <div style={{ height: 6, background: C.neutralDark, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${listenPct}%`,
            background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
            transition: 'width 0.2s ease',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <button
          type="button"
          onClick={togglePlay}
          style={{
            width: 48, height: 48, borderRadius: '50%', border: 'none',
            background: C.primary, color: 'white', fontSize: 18, cursor: 'pointer',
            boxShadow: '0 3px 12px rgba(139,0,0,0.35)', flexShrink: 0,
          }}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontFamily: F.body, fontSize: 12, color: C.textDark, fontWeight: 600 }}>
            {formatTime(currentSec)} / {durationSec > 0 ? formatTime(durationSec) : '—'}
          </p>
          <p style={{ margin: '2px 0 0', fontFamily: F.body, fontSize: 10, color: C.textMuted }}>
            {track.attribution}
          </p>
        </div>
      </div>

      {/* Cipher — unlocks after listen */}
      <div style={{
        padding: '14px 14px 12px',
        background: listenDone ? 'rgba(212,175,55,0.08)' : C.neutral,
        borderRadius: 12,
        border: `1px solid ${listenDone ? 'rgba(212,175,55,0.25)' : C.neutralDark}`,
      }}>
        <p style={{
          margin: '0 0 8px', fontFamily: F.body, fontSize: 10, fontWeight: 800,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: listenDone ? C.secondaryDark : C.textMuted,
        }}>
          {listenDone ? 'Decode the cipher' : 'Cipher locked'}
        </p>
        <p style={{
          margin: '0 0 6px', fontFamily: F.headline, fontSize: 22, fontWeight: 700,
          color: listenDone ? C.primary : C.textMuted, letterSpacing: '0.28em',
        }}>
          {cipher.scrambled}
        </p>
        <p style={{
          margin: '0 0 10px', fontFamily: F.body, fontSize: 13, fontStyle: 'italic',
          color: listenDone ? C.textMuted : C.tertiaryLight, lineHeight: 1.5,
        }}>
          {listenDone ? cipher.context : 'Unscramble the letters after you listen.'}
        </p>
        {!listenDone && (
          <p style={{ margin: 0, fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
            Listen for {listenTarget} seconds to unlock the cipher (+{CIPHER_BONUS_POINTS} pts).
          </p>
        )}
        {listenDone && !cipherDone && (
          <p style={{ margin: '0 0 10px', fontFamily: F.body, fontSize: 11, color: C.textMuted }}>
            Unscramble the letters, then pick the word the story emphasizes at this stop.
          </p>
        )}

        {listenDone && !cipherDone && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {choiceOptions.map((choice) => {
              const selected = selectedCipher === choice
              const showWrong = selected && cipherFeedback === 'wrong'
              const showRight = selected && cipherFeedback === 'correct'
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => handleCipherPick(choice)}
                  disabled={cipherFeedback === 'correct'}
                  style={{
                    padding: '10px 0',
                    border: `2px solid ${showRight ? C.secondary : showWrong ? C.primary : C.neutralDark}`,
                    borderRadius: 10,
                    background: showRight ? 'rgba(212,175,55,0.2)' : showWrong ? 'rgba(139,0,0,0.08)' : 'white',
                    fontFamily: F.body,
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    color: C.textDark,
                    cursor: cipherFeedback === 'correct' ? 'default' : 'pointer',
                  }}
                >
                  {choice}
                </button>
              )
            })}
          </div>
        )}

        {listenDone && cipherFeedback === 'wrong' && !cipherDone && (
          <p style={{ margin: '10px 0 0', fontFamily: F.body, fontSize: 12, color: C.primary }}>
            Not quite — {cipher.hint}
          </p>
        )}

        {cipherDone && (
          <p style={{ margin: 0, fontFamily: F.body, fontSize: 12, fontWeight: 700, color: C.secondaryDark }}>
            Cipher solved · +{CIPHER_BONUS_POINTS} pts
          </p>
        )}
      </div>
    </div>
  )
}
