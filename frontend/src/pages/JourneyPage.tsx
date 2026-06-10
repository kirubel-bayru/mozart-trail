import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { AppFooter } from '../components/AppFooter'
import { BottomNav } from '../components/BottomNav'
import { LOCATIONS, TOTAL_LOCATIONS } from '../data/locations'
import { useProgress } from '../context/ProgressContext'

function StatCard({ value, label, sub }: { value: string | number; label: string; sub?: string }) {
  return (
    <div className="journey-stat">
      <p className="journey-stat-value">{value}</p>
      <p className="journey-stat-label">{label}</p>
      {sub && <p className="journey-stat-sub">{sub}</p>}
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

  const rowClass = [
    'journey-stop',
    quizDone ? 'journey-stop--visited' : 'journey-stop--pending',
    allDone ? 'journey-stop--complete' : '',
    isNext ? 'journey-stop--next' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const badgeClass = [
    'journey-stop-badge',
    quizDone ? 'journey-stop-badge--visited' : '',
    isNext && !quizDone ? 'journey-stop-badge--next' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link to={`/location/${locationId}`} className="journey-stop-link">
      <div className={rowClass}>
        <div className={badgeClass}>{order}</div>
        <div className="journey-stop-body">
          <div className="journey-stop-header">
            <p className="journey-stop-name">{name}</p>
            {totalStopPoints > 0 && (
              <span className="journey-stop-points">+{totalStopPoints} pts</span>
            )}
          </div>
          <div className="journey-stop-tags">
            {quizDone ? (
              <span
                className={`journey-tag${
                  quizCorrect === quizTotal ? ' journey-tag--gold' : ' journey-tag--quiz'
                }`}
              >
                Quiz {quizCorrect}/{quizTotal}
                {quizCorrect === quizTotal ? ' ✓' : ''}
              </span>
            ) : isNext ? (
              <span className="journey-tag journey-tag--next">Next stop</span>
            ) : (
              <span className="journey-tag journey-tag--muted">Not visited</span>
            )}
            {musicListened && <span className="journey-tag journey-tag--music">Listened</span>}
            {cipherSolved && <span className="journey-tag journey-tag--music">Cipher</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function JourneyPage() {
  const {
    quizResults,
    musicProgress,
    totalQuizPoints: quizPoints,
    totalMusicPoints: musicPoints,
    cipherSolvedCount: ciphersSolved,
  } = useProgress()

  const quizResultMap = new Map(quizResults.map((r) => [r.locationId, r]))
  const musicMap = new Map(musicProgress.map((m) => [m.locationId, m]))

  const visitedCount = quizResults.length
  const totalPoints = quizPoints + musicPoints
  const pct = Math.round((visitedCount / TOTAL_LOCATIONS) * 100)

  const firstUnvisitedId = LOCATIONS.find((l) => !quizResultMap.has(l.id))?.id ?? null

  return (
    <div className="journey-page">
      <AppHeader />

      <div className="journey-scroll">
        <div className="journey-content">
          <p className="journey-eyebrow">Progress</p>
          <h1 className="journey-title">My Journey</h1>

          <div className="journey-summary">
            <div className="journey-summary-top">
              <div>
                <p className="journey-summary-label">Trail Progress</p>
                <p className="journey-summary-count">
                  {visitedCount}<span>/{TOTAL_LOCATIONS} stops</span>
                </p>
              </div>
              <p className="journey-summary-pct">{pct}%</p>
            </div>
            <div className="journey-progress-bar">
              <div className="journey-progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="journey-stats">
            <StatCard value={totalPoints} label="Total Points" sub={`quiz ${quizPoints} + music ${musicPoints}`} />
            <StatCard value={ciphersSolved} label="Ciphers" sub="solved" />
            <StatCard value={`${visitedCount}/${TOTAL_LOCATIONS}`} label="Visited" />
          </div>

          {visitedCount === 0 && (
            <div className="journey-empty">
              <span className="journey-empty-icon" aria-hidden>🗺️</span>
              <p className="journey-empty-title">Your journey starts here</p>
              <p className="journey-empty-text">
                Visit any Mozart location in Salzburg, read its story, and complete the quiz to record your progress.
              </p>
              <Link to="/hunt" className="journey-btn journey-btn--primary">
                Open Map
              </Link>
            </div>
          )}

          <div className="journey-stops">
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
            <div className="journey-complete">
              <span className="journey-complete-icon" aria-hidden>🏆</span>
              <p className="journey-complete-title">Trail Complete!</p>
              <p className="journey-complete-text">
                You've walked Mozart's Salzburg from beginning to end. Wunderschön!
              </p>
            </div>
          )}
        </div>

        <div className="journey-footer-wrap">
          <AppFooter />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
