import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { getTreasureEntries } from '../data/treasures'
import { getAllQuizResults, getTotalPointsEarned } from '../lib/quizProgress'
import { getAllMusicProgress, getMusicCipherSolvedCount, getTotalMusicPoints } from '../lib/musicProgress'
import { TOTAL_LOCATIONS } from '../data/locations'
import { C, F } from '../theme'

type Filter = 'all' | 'collected' | 'locked'

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke={C.tertiaryLight} strokeWidth="2" />
      <path d="M8 11V8a4 4 0 118 0v3" stroke={C.tertiaryLight} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: '9px 0',
        border: 'none',
        borderRadius: 10,
        fontFamily: F.body,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        background: active ? C.primary : 'transparent',
        color: active ? 'white' : C.textMuted,
        transition: 'background 0.15s ease',
      }}
    >
      {label}
    </button>
  )
}

export function TreasuresPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const resultsByLocation = new Map(
    getAllQuizResults().map((r) => [r.locationId, r] as const),
  )
  const musicByLocation = new Map(
    getAllMusicProgress().map((m) => [m.locationId, m] as const),
  )

  const allEntries = getTreasureEntries().map(({ location, treasure }) => ({
    location,
    treasure,
    result: resultsByLocation.get(location.id),
    collected: resultsByLocation.has(location.id),
    music: musicByLocation.get(location.id),
  }))

  const entries =
    filter === 'collected'
      ? allEntries.filter((e) => e.collected)
      : filter === 'locked'
        ? allEntries.filter((e) => !e.collected)
        : allEntries

  const collectedCount = resultsByLocation.size
  const quizPoints = getTotalPointsEarned()
  const musicPoints = getTotalMusicPoints()
  const ciphersSolved = getMusicCipherSolvedCount()
  const totalPoints = quizPoints + musicPoints
  const pct = Math.round((collectedCount / TOTAL_LOCATIONS) * 100)

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
          Your Collection
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
          Treasures
        </h2>

        {/* Summary */}
        <div
          style={{
            background: '#FEFAF2',
            borderRadius: 18,
            padding: '16px 18px',
            marginBottom: 18,
            border: `1px solid ${C.neutralDark}`,
            boxShadow: '0 2px 14px rgba(93,64,55,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <p
                style={{
                  margin: '0 0 4px',
                  fontFamily: F.body,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: C.secondaryDark,
                }}
              >
                Collected
              </p>
              <p style={{ margin: 0, fontFamily: F.headline, fontSize: 26, fontWeight: 700, color: C.textDark, lineHeight: 1.2 }}>
                {collectedCount} / {TOTAL_LOCATIONS}
              </p>
              <p style={{ margin: '6px 0 0', fontFamily: F.body, fontSize: 13, color: C.textMuted }}>
                <span style={{ color: C.primary, fontWeight: 700 }}>{totalPoints}</span> pts total
              </p>
              <p style={{ margin: '4px 0 0', fontFamily: F.body, fontSize: 11, color: C.textMuted }}>
                🎵 {ciphersSolved} ciphers · quiz {quizPoints} + music {musicPoints}
              </p>
            </div>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${C.secondary} 0%, #E8C84A 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
              }}
            >
              🏆
            </div>
          </div>
          <div style={{ marginTop: 14, height: 5, background: C.neutralDark, borderRadius: 4, overflow: 'hidden' }}>
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

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: 4,
            background: 'white',
            borderRadius: 12,
            border: `1px solid ${C.neutralDark}`,
            marginBottom: 18,
          }}
        >
          <FilterTab label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterTab label="Collected" active={filter === 'collected'} onClick={() => setFilter('collected')} />
          <FilterTab label="Locked" active={filter === 'locked'} onClick={() => setFilter('locked')} />
        </div>

        {collectedCount === 0 && filter !== 'locked' && (
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
            <span style={{ fontSize: 40, display: 'block', marginBottom: 10 }}>🗝️</span>
            <p style={{ margin: '0 0 6px', fontFamily: F.headline, fontSize: 17, fontWeight: 700, color: C.textDark }}>
              No treasures yet
            </p>
            <p style={{ margin: '0 0 16px', fontFamily: F.body, fontSize: 13, lineHeight: 1.55, color: C.textMuted }}>
              Visit a location, read its story, and complete the quiz to collect digital artifacts.
            </p>
            <Link
              to="/"
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
              Start the Hunt
            </Link>
          </div>
        )}

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}
        >
          {entries.map(({ location, treasure, result, collected, music }) => {
            const expanded = expandedId === location.id
            return (
              <div
                key={location.id}
                style={{
                  gridColumn: expanded ? '1 / -1' : undefined,
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : location.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: collected ? '14px 14px 12px' : '14px 12px',
                    background: collected ? 'white' : 'rgba(255,255,255,0.55)',
                    border: collected
                      ? `2px solid ${expanded ? C.secondary : C.neutralDark}`
                      : `1px dashed ${C.neutralDark}`,
                    borderRadius: 16,
                    cursor: 'pointer',
                    opacity: collected ? 1 : 0.85,
                    boxShadow: collected ? '0 4px 14px rgba(139,0,0,0.08)' : 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span
                      style={{
                        fontSize: collected ? 32 : 28,
                        filter: collected ? 'none' : 'grayscale(1) opacity(0.45)',
                        lineHeight: 1,
                      }}
                    >
                      {treasure.emoji}
                    </span>
                    {!collected && <LockIcon />}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                      {music?.cipherSolved && (
                        <span style={{ fontSize: 14 }} title="Musical cipher solved">🎵</span>
                      )}
                      {collected && result?.correct === result?.total && (
                        <span
                          style={{
                            fontFamily: F.body,
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: C.secondaryDark,
                            background: 'rgba(212,175,55,0.15)',
                            padding: '3px 7px',
                            borderRadius: 6,
                          }}
                        >
                          Perfect
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    style={{
                      margin: '0 0 2px',
                      fontFamily: F.body,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: C.secondaryDark,
                    }}
                  >
                    Stop {location.order}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: F.headline,
                      fontSize: 14,
                      fontWeight: 700,
                      lineHeight: 1.25,
                      color: collected ? C.textDark : C.textMuted,
                    }}
                  >
                    {treasure.name}
                  </p>
                    {collected && result && (
                      <p style={{ margin: '6px 0 0', fontFamily: F.body, fontSize: 11, color: C.primary, fontWeight: 700 }}>
                        +{result.pointsEarned} quiz
                        {music && (music.listenPoints + music.cipherPoints) > 0
                          ? ` · +${music.listenPoints + music.cipherPoints} music`
                          : ''}
                      </p>
                    )}
                </button>

                {expanded && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: '14px 16px',
                      background: 'white',
                      borderRadius: 14,
                      border: `1px solid ${C.neutralDark}`,
                    }}
                  >
                    <p style={{ margin: '0 0 4px', fontFamily: F.body, fontSize: 11, fontWeight: 600, color: C.textMuted }}>
                      {location.name} · {treasure.tagline}
                    </p>
                    <p style={{ margin: '0 0 14px', fontFamily: F.body, fontSize: 13, lineHeight: 1.6, color: C.textDark }}>
                      {treasure.description}
                    </p>

                    {collected && result ? (
                      <p style={{ margin: '0 0 12px', fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
                        Quiz: {result.correct}/{result.total} correct ·{' '}
                        {new Date(result.completedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    ) : (
                      <p style={{ margin: '0 0 12px', fontFamily: F.body, fontSize: 12, color: C.textMuted, fontStyle: 'italic' }}>
                        Complete the quiz at this stop to unlock this treasure.
                      </p>
                    )}

                    {music && (music.listenComplete || music.cipherSolved) && (
                      <p style={{ margin: '0 0 12px', fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
                        🎵 Music: {music.listenComplete ? 'listened' : ''}
                        {music.listenComplete && music.cipherSolved ? ' · ' : ''}
                        {music.cipherSolved ? 'cipher solved' : ''}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <Link
                        to={`/location/${location.id}`}
                        style={{
                          flex: 1,
                          minWidth: 120,
                          textAlign: 'center',
                          padding: '10px 12px',
                          background: 'transparent',
                          border: `2px solid ${C.neutralDark}`,
                          borderRadius: 10,
                          fontFamily: F.body,
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.textMuted,
                          textDecoration: 'none',
                        }}
                      >
                        View Story
                      </Link>
                      <Link
                        to={`/quiz/${location.id}`}
                        style={{
                          flex: 1,
                          minWidth: 120,
                          textAlign: 'center',
                          padding: '10px 12px',
                          background: C.primary,
                          border: 'none',
                          borderRadius: 10,
                          fontFamily: F.body,
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'white',
                          textDecoration: 'none',
                        }}
                      >
                        {collected ? 'Retake Quiz' : 'Take Quiz'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {entries.length === 0 && filter === 'collected' && (
          <p style={{ textAlign: 'center', fontFamily: F.body, fontSize: 13, color: C.textMuted, marginTop: 24 }}>
            No collected treasures yet. Complete a location quiz to add one.
          </p>
        )}
        {entries.length === 0 && filter === 'locked' && collectedCount === TOTAL_LOCATIONS && (
          <p style={{ textAlign: 'center', fontFamily: F.body, fontSize: 13, color: C.textMuted, marginTop: 24 }}>
            You’ve collected every treasure. Magnificent!
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
