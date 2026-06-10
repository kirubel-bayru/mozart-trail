import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { AppFooter } from '../components/AppFooter'
import { BottomNav } from '../components/BottomNav'
import { LOCATIONS, TOTAL_LOCATIONS } from '../data/locations'
import { getAllQuizResults, getTotalPointsEarned } from '../lib/quizProgress'
import { getAllMusicProgress, getMusicCipherSolvedCount, getTotalMusicPoints } from '../lib/musicProgress'
import { C, F } from '../theme'

function StatCard({ value, label, sub }: { value: string | number; label: string; sub?: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: 'white',
        borderRadius: 14,
        border: `1px solid ${C.neutralDark}`,
        padding: '14px 12px',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: 0, fontFamily: F.headline, fontSize: 26, fontWeight: 700, color: C.primary, lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ margin: '5px 0 0', fontFamily: F.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.textMuted }}>
        {label}
      </p>
      {sub && (
        <p style={{ margin: '3px 0 0', fontFamily: F.body, fontSize: 10, color: C.tertiaryLight }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function StopRow({
  order,
  name,
  locationId,
  quizDone,
  quizCorrect,
  quizTotal,
  quizPoints,
  musicListened,
  cipherSolved,
  musicPoints,
  isNext,
}: {
  order: number
  name: string
  locationId: string
  quizDone: boolean
  quizCorrect: number
  quizTotal: number
  quizPoints: number
  musicListened: boolean
  cipherSolved: boolean
  musicPoints: number
  isNext: boolean
}) {
  const totalStopPoints = quizPoints + musicPoints
  const allDone = quizDone && musicListened && cipherSolved

  return (
    <Link
      to={`/location/${locationId}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          padding: '14px 16px',
          background: quizDone ? 'white' : 'rgba(255,255,255,0.6)',
          borderRadius: 14,
          border: `1.5px solid ${allDone ? C.secondary : isNext ? C.primary : C.neutralDark}`,
          boxShadow: allDone
            ? '0 2px 10px rgba(212,175,55,0.15)'
            : isNext
              ? '0 2px 10px rgba(139,0,0,0.1)'
              : 'none',
          opacity: quizDone ? 1 : 0.75,
          transition: 'opacity 0.15s',
        }}
      >
        {/* Order badge */}
        <div
          style={{
            flexShrink: 0,
            width: 34,
            height: 34,
            borderRadius: 10,
            background: quizDone
              ? `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`
              : isNext
                ? `linear-gradient(135deg, ${C.secondary}, #E8C84A)`
                : C.neutralDark,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 800,
            fontFamily: F.body,
            color: quizDone ? 'white' : isNext ? C.textDark : C.textMuted,
          }}
        >
          {order}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <p
              style={{
                margin: 0,
                fontFamily: F.headline,
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1.25,
                color: quizDone ? C.textDark : C.textMuted,
              }}
            >
              {name}
            </p>
            {totalStopPoints > 0 && (
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: F.body,
                  fontSize: 11,
                  fontWeight: 800,
                  color: C.secondaryDark,
                }}
              >
                +{totalStopPoints} pts
              </span>
            )}
          </div>

          {/* Progress indicators */}
          <div style={{ display: 'flex', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
            {quizDone ? (
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  padding: '3px 7px',
                  borderRadius: 5,
                  background: quizCorrect === quizTotal ? 'rgba(212,175,55,0.18)' : 'rgba(139,0,0,0.08)',
                  color: quizCorrect === quizTotal ? C.secondaryDark : C.primary,
                }}
              >
                Quiz {quizCorrect}/{quizTotal}
                {quizCorrect === quizTotal ? ' ✓' : ''}
              </span>
            ) : isNext ? (
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  padding: '3px 7px',
                  borderRadius: 5,
                  background: `rgba(212,175,55,0.15)`,
                  color: C.secondaryDark,
                }}
              >
                Next stop
              </span>
            ) : (
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  padding: '3px 7px',
                  borderRadius: 5,
                  background: C.neutralDark,
                  color: C.textMuted,
                }}
              >
                Not visited
              </span>
            )}

            {musicListened && (
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  padding: '3px 7px',
                  borderRadius: 5,
                  background: 'rgba(93,64,55,0.1)',
                  color: C.tertiary,
                }}
              >
                🎵 Listened
              </span>
            )}

            {cipherSolved && (
              <span
                style={{
                  fontFamily: F.body,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  padding: '3px 7px',
                  borderRadius: 5,
                  background: 'rgba(93,64,55,0.1)',
                  color: C.tertiary,
                }}
              >
                🔓 Cipher
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function JourneyPage() {
  const quizResultMap = new Map(getAllQuizResults().map((r) => [r.locationId, r]))
  const musicMap = new Map(getAllMusicProgress().map((m) => [m.locationId, m]))

  const visitedCount = quizResultMap.size
  const quizPoints = getTotalPointsEarned()
  const musicPoints = getTotalMusicPoints()
  const totalPoints = quizPoints + musicPoints
  const ciphersSolved = getMusicCipherSolvedCount()
  const pct = Math.round((visitedCount / TOTAL_LOCATIONS) * 100)

  const firstUnvisitedId = LOCATIONS.find((l) => !quizResultMap.has(l.id))?.id ?? null

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: C.neutral, overflow: 'hidden' }}>
      <AppHeader />

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 28px' }}>
        <p
          style={{
            margin: '0 0 6px',
            fontFamily: F.body,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: C.secondary,
          }}
        >
          Progress
        </p>
        <h2
          style={{
            margin: '0 0 18px',
            fontFamily: F.headline,
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1.15,
            color: C.textDark,
          }}
        >
          My Journey
        </h2>

        {/* Progress bar */}
        <div
          style={{
            background: '#FEFAF2',
            borderRadius: 18,
            padding: '16px 18px 18px',
            marginBottom: 18,
            border: `1px solid ${C.neutralDark}`,
            boxShadow: '0 2px 14px rgba(93,64,55,0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <div>
              <p
                style={{
                  margin: '0 0 2px',
                  fontFamily: F.body,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.secondaryDark,
                }}
              >
                Trail Progress
              </p>
              <p style={{ margin: 0, fontFamily: F.headline, fontSize: 24, fontWeight: 700, color: C.textDark, lineHeight: 1 }}>
                {visitedCount} / {TOTAL_LOCATIONS} stops
              </p>
            </div>
            <p style={{ margin: 0, fontFamily: F.headline, fontSize: 22, fontWeight: 700, color: C.primary }}>
              {pct}%
            </p>
          </div>
          <div style={{ height: 6, background: C.neutralDark, borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${C.primary}, ${C.secondary})`,
                borderRadius: 4,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
          <StatCard value={totalPoints} label="Total Points" sub={`quiz ${quizPoints} + music ${musicPoints}`} />
          <StatCard value={ciphersSolved} label="Ciphers" sub="solved" />
          <StatCard value={`${visitedCount}/${TOTAL_LOCATIONS}`} label="Visited" />
        </div>

        {/* Empty state */}
        {visitedCount === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '28px 16px',
              marginBottom: 18,
              background: 'white',
              borderRadius: 16,
              border: `1px dashed ${C.neutralDark}`,
            }}
          >
            <span style={{ fontSize: 40, display: 'block', marginBottom: 10 }}>🗺️</span>
            <p style={{ margin: '0 0 6px', fontFamily: F.headline, fontSize: 17, fontWeight: 700, color: C.textDark }}>
              Your journey starts here
            </p>
            <p style={{ margin: '0 0 16px', fontFamily: F.body, fontSize: 13, lineHeight: 1.55, color: C.textMuted }}>
              Visit any Mozart location in Salzburg, read its story, and complete the quiz to record your progress.
            </p>
            <Link
              to="/hunt"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: C.primary,
                borderRadius: 12,
                fontFamily: F.body,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Open Map
            </Link>
          </div>
        )}

        {/* All 12 stops */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {LOCATIONS.map((loc) => {
            const result = quizResultMap.get(loc.id)
            const music = musicMap.get(loc.id)
            const musicPts = music ? music.listenPoints + music.cipherPoints : 0
            return (
              <StopRow
                key={loc.id}
                order={loc.order}
                name={loc.name}
                locationId={loc.id}
                quizDone={!!result}
                quizCorrect={result?.correct ?? 0}
                quizTotal={result?.total ?? 3}
                quizPoints={result?.pointsEarned ?? 0}
                musicListened={music?.listenComplete ?? false}
                cipherSolved={music?.cipherSolved ?? false}
                musicPoints={musicPts}
                isNext={loc.id === firstUnvisitedId}
              />
            )
          })}
        </div>

        {visitedCount === TOTAL_LOCATIONS && (
          <div
            style={{
              marginTop: 20,
              textAlign: 'center',
              padding: '24px 16px',
              background: `linear-gradient(135deg, rgba(212,175,55,0.12), rgba(139,0,0,0.06))`,
              borderRadius: 16,
              border: `1px solid rgba(212,175,55,0.3)`,
            }}
          >
            <span style={{ fontSize: 40, display: 'block', marginBottom: 10 }}>🏆</span>
            <p style={{ margin: '0 0 6px', fontFamily: F.headline, fontSize: 19, fontWeight: 700, color: C.textDark }}>
              Trail Complete!
            </p>
            <p style={{ margin: 0, fontFamily: F.body, fontSize: 13, lineHeight: 1.55, color: C.textMuted }}>
              You've walked Mozart's Salzburg from beginning to end. Wunderschön!
            </p>
          </div>
        )}

        <div className="app-footer-in-scroll">
          <AppFooter />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
