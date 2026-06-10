import { C, F } from '../theme'

interface ProgressCardProps {
  unlocked: number
  total: number
  compact?: boolean
}

export function ProgressCard({ unlocked, total, compact = false }: ProgressCardProps) {
  const pct = Math.round((unlocked / total) * 100)

  if (compact) {
    return (
      <div className="progress-card-compact">
        <div className="progress-card-compact-label">
          <span className="progress-card-compact-eyebrow">Progress</span>
          <span className="progress-card-compact-count">
            {unlocked}<span className="progress-card-compact-total">/{total}</span> unlocked
          </span>
        </div>
        <div className="progress-card-compact-bar">
          <div className="progress-card-compact-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="progress-card-compact-pct">{pct}%</span>
      </div>
    )
  }

  return (
    <div style={{
      background: '#FEFAF2',
      borderRadius: 18,
      padding: '14px 18px 16px',
      boxShadow: '0 2px 16px rgba(93,64,55,0.15), 0 1px 4px rgba(0,0,0,0.08)',
      border: `1px solid ${C.neutralDark}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <p style={{
            margin: '0 0 5px', fontFamily: F.body, fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: C.secondaryDark,
          }}>
            Current Progress
          </p>
          <p style={{
            margin: 0, fontFamily: F.headline, fontSize: 23, fontWeight: 700,
            lineHeight: 1.18, color: C.textDark,
          }}>
            {unlocked}/{total} Locations<br />Unlocked
          </p>
        </div>

        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke={C.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke={C.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ height: 5, background: C.neutralDark, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: `linear-gradient(90deg, ${C.tertiary} 0%, ${C.secondary} 100%)`,
            borderRadius: 4, transition: 'width 0.5s ease',
          }} />
        </div>
      </div>
    </div>
  )
}
