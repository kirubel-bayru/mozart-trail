import { Link } from 'react-router-dom'
import { C, F } from '../theme'
import type { MozartLocation } from '../data/locations'
import { formatDistance } from '../lib/geo'
import { formatDuration, MAX_WALKABLE_M } from '../lib/ors'
import type { RouteResult } from '../lib/ors'

interface LocationInfoCardProps {
  location: MozartLocation
  straightLineM: number | null
  route: RouteResult | null
  isLoadingRoute: boolean
  usingFallbackPos: boolean
  onClose: () => void
  onShowRoute: () => void
  onShowTrail: () => void
  onViewStory: () => void
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={C.secondary} strokeWidth="2"/>
      <path d="M12 7v5l3 3" stroke={C.secondary} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function WalkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="4" r="2" fill={C.tertiaryLight}/>
      <path d="M9 22l1.5-6L8 13l2-5h4l2 5-2.5 3L15 22" stroke={C.tertiaryLight} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function LocationInfoCard({
  location,
  straightLineM,
  route,
  isLoadingRoute,
  usingFallbackPos,
  onClose,
  onShowRoute,
  onShowTrail,
  onViewStory,
}: LocationInfoCardProps) {
  const todaySchedule = location.openingHours.schedule.split('·')[0].trim()
  const isTooFar = straightLineM !== null && straightLineM > MAX_WALKABLE_M && !route

  return (
    <div style={{
      position: 'absolute',
      bottom: 16, left: 16, right: 16,
      zIndex: 900,
      background: 'white',
      borderRadius: 18,
      padding: '16px 18px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      border: `1px solid ${C.neutralDark}`,
    }}>
      {/* Close */}
      <button onClick={onClose} style={{
        position: 'absolute', top: 12, right: 14,
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 20, color: C.textMuted, lineHeight: 1,
      }}>×</button>

      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <p style={{ margin: '0 0 2px', fontFamily: F.body, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.secondaryDark }}>
          Stop {location.order} · {location.category}
        </p>
        <Link to={`/location/${location.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ margin: 0, fontFamily: F.headline, fontSize: 18, fontWeight: 700, color: C.primary, paddingRight: 24 }}>
            {location.name} ›
          </h3>
        </Link>
      </div>

      {/* Info row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        {straightLineM !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <WalkIcon />
            <span style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted }}>
              {route ? `${formatDistance(route.distanceM)} · ${formatDuration(route.durationSec)} walk` : `~${formatDistance(straightLineM)} away`}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <ClockIcon />
          <span style={{ fontFamily: F.body, fontSize: 12, color: C.textMuted }}>{todaySchedule}</span>
        </div>
      </div>

      {/* Admission */}
      {location.openingHours.admission && (
        <div style={{
          background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
          borderRadius: 8, padding: '6px 10px', marginBottom: 12,
          fontFamily: F.body, fontSize: 12, color: C.secondaryDark,
        }}>
          🎫 {location.openingHours.admission}
        </div>
      )}

      {/* Route section */}
      {isTooFar ? (
        <div style={{ marginBottom: 10, padding: '10px 12px', background: `rgba(93,64,55,0.07)`, border: `1px solid rgba(93,64,55,0.15)`, borderRadius: 10 }}>
          <p style={{ margin: '0 0 8px', fontFamily: F.body, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>
            📍 {formatDistance(straightLineM!)} away — plan the full trail instead:
          </p>
          <button onClick={onShowTrail} style={{
            width: '100%', padding: '9px 0', background: C.secondary,
            border: 'none', borderRadius: 9, fontFamily: F.body,
            fontSize: 12, fontWeight: 700, color: C.textDark, cursor: 'pointer',
          }}>
            🗺️ Show Full Mozart Trail
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: 10 }}>
          {usingFallbackPos && !route && (
            <p style={{ margin: '0 0 8px', fontFamily: F.body, fontSize: 11, color: C.textMuted, fontStyle: 'italic' }}>
              No GPS — route starts from Salzburg city centre
            </p>
          )}
          <button onClick={onShowRoute} disabled={isLoadingRoute} style={{
            width: '100%', padding: '10px 0',
            background: isLoadingRoute ? '#ccc' : route ? C.primaryDark : C.tertiary,
            border: 'none', borderRadius: 10, fontFamily: F.body,
            fontSize: 13, fontWeight: 700, color: 'white',
            cursor: isLoadingRoute ? 'default' : 'pointer',
          }}>
            {isLoadingRoute ? '⏳ Loading route…' : route ? '🗺️ Update Route' : '🧭 Show Walking Route'}
          </button>
        </div>
      )}

      {/* View Story — always visible */}
      <button onClick={onViewStory} style={{
        width: '100%', padding: '11px 0',
        background: C.primary, border: 'none', borderRadius: 10,
        fontFamily: F.body, fontSize: 13, fontWeight: 700, color: 'white',
        cursor: 'pointer', boxShadow: '0 3px 10px rgba(139,0,0,0.3)',
      }}>
        📖 View Story
      </button>
    </div>
  )
}
