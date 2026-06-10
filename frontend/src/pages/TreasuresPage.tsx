import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { AppFooter } from '../components/AppFooter'
import { BottomNav } from '../components/BottomNav'
import { getTreasureEntries } from '../data/treasures'
import { getAllQuizResults, getTotalPointsEarned } from '../lib/quizProgress'
import { getAllMusicProgress, getMusicCipherSolvedCount, getTotalMusicPoints } from '../lib/musicProgress'
import { TOTAL_LOCATIONS } from '../data/locations'

type Filter = 'all' | 'collected' | 'locked'

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function FilterTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`treasures-filter-btn${active ? ' treasures-filter-btn--active' : ''}`}
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
    <div className="treasures-page">
      <AppHeader />

      <div className="treasures-scroll">
        <div className="treasures-content">
          <p className="treasures-eyebrow">Your Collection</p>
          <h1 className="treasures-title">Treasures</h1>

          <div className="treasures-summary">
            <div className="treasures-summary-main">
              <div>
                <p className="treasures-summary-label">Collected</p>
                <p className="treasures-summary-count">
                  {collectedCount}<span>/{TOTAL_LOCATIONS}</span>
                </p>
                <p className="treasures-summary-points">{totalPoints} pts total</p>
              </div>
              <div className="treasures-summary-icon" aria-hidden>🏆</div>
            </div>
            <div className="treasures-summary-meta">
              <span className="treasures-meta-chip">{ciphersSolved} ciphers</span>
              <span className="treasures-meta-chip">{quizPoints} quiz pts</span>
              <span className="treasures-meta-chip">{musicPoints} music pts</span>
            </div>
            <div className="treasures-progress-bar">
              <div className="treasures-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="treasures-filters">
            <FilterTab label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterTab label="Collected" active={filter === 'collected'} onClick={() => setFilter('collected')} />
            <FilterTab label="Locked" active={filter === 'locked'} onClick={() => setFilter('locked')} />
          </div>

          {collectedCount === 0 && filter !== 'locked' && (
            <div className="treasures-empty">
              <span className="treasures-empty-icon" aria-hidden>🗝️</span>
              <p className="treasures-empty-title">No treasures yet</p>
              <p className="treasures-empty-text">
                Visit a location, read its story, and complete the quiz to collect digital artifacts.
              </p>
              <Link to="/hunt" className="treasures-btn treasures-btn--primary">
                Start the Hunt
              </Link>
            </div>
          )}

          <div className="treasures-grid">
            {entries.map(({ location, treasure, result, collected, music }) => {
              const expanded = expandedId === location.id
              return (
                <div
                  key={location.id}
                  className={`treasures-grid-item${expanded ? ' treasures-grid-item--expanded' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : location.id)}
                    className={`treasures-card${collected ? ' treasures-card--collected' : ' treasures-card--locked'}${
                      expanded ? ' treasures-card--expanded' : ''
                    }`}
                  >
                    <div className="treasures-card-top">
                      <span
                        className={`treasures-card-emoji${collected ? '' : ' treasures-card-emoji--locked'}`}
                        aria-hidden
                      >
                        {treasure.emoji}
                      </span>
                      <div className="treasures-card-badges">
                        {!collected && <span className="treasures-lock"><LockIcon /></span>}
                        {music?.cipherSolved && (
                          <span className="treasures-badge treasures-badge--music" title="Cipher solved">🎵</span>
                        )}
                        {collected && result?.correct === result?.total && (
                          <span className="treasures-badge treasures-badge--perfect">Perfect</span>
                        )}
                      </div>
                    </div>
                    <p className="treasures-card-stop">Stop {location.order}</p>
                    <p className="treasures-card-name">{treasure.name}</p>
                    {collected && result && (
                      <p className="treasures-card-points">
                        +{result.pointsEarned} quiz
                        {music && (music.listenPoints + music.cipherPoints) > 0
                          ? ` · +${music.listenPoints + music.cipherPoints} music`
                          : ''}
                      </p>
                    )}
                  </button>

                  {expanded && (
                    <div className="treasures-detail">
                      <p className="treasures-detail-meta">
                        {location.name} · {treasure.tagline}
                      </p>
                      <p className="treasures-detail-desc">{treasure.description}</p>

                      {collected && result ? (
                        <p className="treasures-detail-note">
                          Quiz: {result.correct}/{result.total} correct ·{' '}
                          {new Date(result.completedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      ) : (
                        <p className="treasures-detail-note treasures-detail-note--italic">
                          Complete the quiz at this stop to unlock this treasure.
                        </p>
                      )}

                      {music && (music.listenComplete || music.cipherSolved) && (
                        <p className="treasures-detail-note">
                          Music: {music.listenComplete ? 'listened' : ''}
                          {music.listenComplete && music.cipherSolved ? ' · ' : ''}
                          {music.cipherSolved ? 'cipher solved' : ''}
                        </p>
                      )}

                      <div className="treasures-detail-actions">
                        <Link to={`/location/${location.id}`} className="treasures-btn treasures-btn--ghost">
                          View Story
                        </Link>
                        <Link to={`/quiz/${location.id}`} className="treasures-btn treasures-btn--primary">
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
            <p className="treasures-filter-empty">
              No collected treasures yet. Complete a location quiz to add one.
            </p>
          )}
          {entries.length === 0 && filter === 'locked' && collectedCount === TOTAL_LOCATIONS && (
            <p className="treasures-filter-empty">
              You’ve collected every treasure. Magnificent!
            </p>
          )}
        </div>

        <div className="treasures-footer-wrap">
          <AppFooter />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
