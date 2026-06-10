import { Link } from 'react-router-dom'
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

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function WalkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="4" r="2" fill="currentColor" />
      <path d="M9 22l1.5-6L8 13l2-5h4l2 5-2.5 3L15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

  const distanceLabel = route
    ? `${formatDistance(route.distanceM)} · ${formatDuration(route.durationSec)}`
    : straightLineM !== null
      ? `~${formatDistance(straightLineM)} away`
      : null

  return (
    <div className="location-popup" role="dialog" aria-label={location.name}>
      <div className="location-popup-accent" aria-hidden />

      <div className="location-popup-top">
        <div className="location-popup-badges">
          <span className="location-popup-stop">Stop {location.order}</span>
          {location.unlocked ? (
            <span className="location-popup-status location-popup-status--unlocked">Unlocked</span>
          ) : (
            <span className="location-popup-status">Locked</span>
          )}
        </div>
        <button type="button" onClick={onClose} className="location-popup-close" aria-label="Close">
          <CloseIcon />
        </button>
      </div>

      <div className="location-popup-body">
        <p className="location-popup-category">{location.category}</p>
        <Link to={`/location/${location.id}`} className="location-popup-title">
          {location.name}
        </Link>
        {location.subtitle && (
          <p className="location-popup-subtitle">{location.subtitle}</p>
        )}

        <div className="location-popup-meta">
          {distanceLabel && (
            <span className="location-popup-chip">
              <WalkIcon />
              {distanceLabel}
            </span>
          )}
          <span className="location-popup-chip">
            <ClockIcon />
            {todaySchedule}
          </span>
          <span className="location-popup-chip location-popup-chip--points">
            +{location.points} pts
          </span>
        </div>

        {location.openingHours.admission && (
          <p className="location-popup-admission">{location.openingHours.admission}</p>
        )}

        {isTooFar ? (
          <div className="location-popup-notice">
            <p>
              {formatDistance(straightLineM!)} away — plan the full trail instead.
            </p>
            <div className="location-popup-actions">
              <button type="button" onClick={onShowTrail} className="location-popup-btn location-popup-btn--gold">
                Show Full Trail
              </button>
              <button type="button" onClick={onViewStory} className="location-popup-btn location-popup-btn--primary">
                View Story
              </button>
            </div>
          </div>
        ) : (
          <div className="location-popup-actions-wrap">
            {usingFallbackPos && !route && (
              <p className="location-popup-hint">No GPS — route from city centre</p>
            )}
            <div className="location-popup-actions">
              <button
                type="button"
                onClick={onShowRoute}
                disabled={isLoadingRoute}
                className="location-popup-btn location-popup-btn--outline"
              >
                {isLoadingRoute ? 'Loading route…' : route ? 'Update Route' : 'Walking Route'}
              </button>
              <button type="button" onClick={onViewStory} className="location-popup-btn location-popup-btn--primary">
                View Story
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
