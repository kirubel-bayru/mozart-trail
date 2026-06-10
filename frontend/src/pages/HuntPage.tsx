import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { MapView } from '../components/MapView'
import { ProgressCard } from '../components/ProgressCard'
import { AppHeader } from '../components/AppHeader'
import { AppFooter } from '../components/AppFooter'
import { BottomNav } from '../components/BottomNav'
import { LocationInfoCard } from '../components/LocationInfoCard'
import { LOCATIONS, UNLOCK_RADIUS_M } from '../data/locations'
import type { MozartLocation } from '../data/locations'
import { useProgress } from '../context/ProgressContext'
import { haversineDistance, formatDistance } from '../lib/geo'
import { fetchWalkingRoute, fetchFullTrailRoute, formatDuration } from '../lib/ors'
import type { RouteResult } from '../lib/ors'
import { C } from '../theme'

const SALZBURG_CENTER: [number, number] = [47.7998, 13.0462]

function LocateIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="white" />
      <circle cx="12" cy="12" r="7" stroke="white" strokeWidth="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function HuntPage() {
  const navigate = useNavigate()
  const { unlockedLocationIds, unlockLocation } = useProgress()
  const unlockedIds = useMemo(() => new Set(unlockedLocationIds), [unlockedLocationIds])
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const lastRoutePosRef = useRef<[number, number] | null>(null)
  const lastTrailPosRef = useRef<[number, number] | null>(null)
  const [isBrowseMode, setIsBrowseMode] = useState(false)
  const [selectedLoc, setSelectedLoc] = useState<MozartLocation | null>(null)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)
  const [trailRoute, setTrailRoute] = useState<RouteResult | null>(null)
  const [isLoadingTrail, setIsLoadingTrail] = useState(false)
  const [routeKey, setRouteKey] = useState(0)

  const locations = useMemo(
    () => LOCATIONS.map((l) => ({ ...l, unlocked: unlockedIds.has(l.id) })),
    [unlockedIds],
  )
  const unlockedCount = unlockedIds.size

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsBrowseMode(true)
      return
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => setIsBrowseMode(true),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!userPos) return
    const REFRESH_DIST_M = 30

    if (selectedLoc && route) {
      const origin = lastRoutePosRef.current ?? userPos
      if (haversineDistance(userPos[0], userPos[1], origin[0], origin[1]) > REFRESH_DIST_M) {
        lastRoutePosRef.current = userPos
        fetchWalkingRoute(userPos, [selectedLoc.lat, selectedLoc.lng]).then((result) => {
          if (result) { setRoute(result); setRouteKey((k) => k + 1) }
        })
      }
    }

    if (trailRoute) {
      const origin = lastTrailPosRef.current ?? userPos
      if (haversineDistance(userPos[0], userPos[1], origin[0], origin[1]) > REFRESH_DIST_M) {
        lastTrailPosRef.current = userPos
        fetchFullTrailRoute(
          [...LOCATIONS].sort((a, b) => a.order - b.order).map((l) => ({ lat: l.lat, lng: l.lng })),
          userPos,
        ).then((result) => {
          if (result) { setTrailRoute(result); setRouteKey((k) => k + 1) }
        })
      }
    }
  }, [userPos])

  useEffect(() => {
    if (!userPos || isBrowseMode) return

    LOCATIONS.forEach((loc) => {
      if (unlockedIds.has(loc.id)) return
      const dist = haversineDistance(userPos[0], userPos[1], loc.lat, loc.lng)
      if (dist <= UNLOCK_RADIUS_M) {
        void unlockLocation(loc.id)
        notifications.show({
          title: '📍 Location Unlocked!',
          message: `You discovered ${loc.name}! +${loc.points} points`,
          color: 'yellow',
          autoClose: 4000,
        })
      }
    })
  }, [userPos, isBrowseMode])

  const handleLocate = useCallback(() => {
    if (userPos) {
      setFlyTarget([...userPos])
    } else if (!navigator.geolocation) {
      notifications.show({ message: 'Geolocation not available on this device.', color: 'red' })
    } else {
      navigator.geolocation.getCurrentPosition((pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserPos(p)
        setFlyTarget(p)
      })
    }
  }, [userPos])

  const handleLocationClick = useCallback((loc: MozartLocation) => {
    setSelectedLoc({ ...loc, unlocked: unlockedIds.has(loc.id) })
    setRoute(null)
  }, [unlockedIds])

  const handleGetDirections = useCallback(async (loc: MozartLocation) => {
    setSelectedLoc(null)
    const fromPos = userPos ?? SALZBURG_CENTER
    setIsLoadingRoute(true)
    try {
      const result = await fetchWalkingRoute(fromPos, [loc.lat, loc.lng])
      if (result) {
        setRoute(result)
        setRouteKey((k) => k + 1)
        lastRoutePosRef.current = fromPos
      } else {
        notifications.show({
          message: 'Could not load route. Add an ORS_API_KEY to enable walking directions.',
          color: 'orange',
        })
      }
    } finally {
      setIsLoadingRoute(false)
    }
  }, [userPos])

  const handleToggleTrail = useCallback(async () => {
    if (trailRoute) {
      setTrailRoute(null)
      setRouteKey((k) => k + 1)
      return
    }
    setSelectedLoc(null)
    setIsLoadingTrail(true)
    const startPos = userPos ?? SALZBURG_CENTER
    try {
      const result = await fetchFullTrailRoute(
        [...LOCATIONS].sort((a, b) => a.order - b.order).map((l) => ({ lat: l.lat, lng: l.lng })),
        startPos,
      )
      if (result) {
        setTrailRoute(result)
        setRouteKey((k) => k + 1)
        lastTrailPosRef.current = startPos
      } else {
        notifications.show({ message: 'Could not load trail. Check your ORS API key.', color: 'orange' })
      }
    } finally {
      setIsLoadingTrail(false)
    }
  }, [trailRoute, userPos])

  return (
    <div className="hunt-page">
      <AppHeader />

      <div className="hunt-stage">
        <div className="hunt-content">
          <div className="hunt-intro">
            <div className="hunt-intro-header">
              <div>
                <p className="hunt-eyebrow">The Hunt</p>
                <h2 className="hunt-heading">Salzburg Trail Map</h2>
              </div>
              <button
                type="button"
                className="hunt-mode-btn"
                onClick={() => setIsBrowseMode((b) => !b)}
                style={{
                  background: isBrowseMode ? 'white' : C.secondary,
                  color: isBrowseMode ? C.primary : C.textDark,
                  borderColor: isBrowseMode ? C.neutralDark : C.secondary,
                }}
              >
                {isBrowseMode ? '👁 Browse' : '🎯 Hunt'}
              </button>
            </div>
          </div>

          <div className="hunt-map-frame">
            <div className="hunt-map-canvas">
              <MapView
                locations={locations}
                userPosition={userPos}
                flyTarget={flyTarget}
                routeData={route?.geojson ?? null}
                trailRouteData={trailRoute?.geojson ?? null}
                routeKey={routeKey}
                isBrowseMode={isBrowseMode}
                onLocationClick={handleLocationClick}
              />

              <div className="hunt-map-overlay hunt-map-overlay--top">
                <ProgressCard unlocked={unlockedCount} total={LOCATIONS.length} compact />
              </div>

              {trailRoute && (
                <div className="hunt-trail-banner">
                  <span>
                    🗺️ Full Trail · {formatDistance(trailRoute.distanceM)} · {formatDuration(trailRoute.durationSec)}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setTrailRoute(null); setRouteKey((k) => k + 1) }}
                    className="hunt-trail-dismiss"
                    aria-label="Clear trail"
                  >
                    ×
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleToggleTrail}
                disabled={isLoadingTrail}
                className="hunt-map-fab hunt-map-fab--trail"
                style={{
                  background: trailRoute ? C.secondary : 'white',
                  borderColor: trailRoute ? C.secondary : C.neutralDark,
                  color: trailRoute ? C.textDark : C.tertiary,
                }}
              >
                {isLoadingTrail ? '⏳ Planning…' : trailRoute ? '✕ Clear Trail' : '🗺️ Full Trail'}
              </button>

              <button
                type="button"
                onClick={handleLocate}
                className="hunt-map-fab hunt-map-fab--locate"
                aria-label="Center on my location"
              >
                <LocateIcon />
              </button>

              {selectedLoc && (
                <LocationInfoCard
                  location={selectedLoc}
                  straightLineM={haversineDistance(
                    (userPos ?? SALZBURG_CENTER)[0], (userPos ?? SALZBURG_CENTER)[1],
                    selectedLoc.lat, selectedLoc.lng,
                  )}
                  route={route}
                  isLoadingRoute={isLoadingRoute}
                  usingFallbackPos={!userPos}
                  onClose={() => {
                    setSelectedLoc(null)
                    setRoute(null)
                    lastRoutePosRef.current = null
                    setRouteKey((k) => k + 1)
                  }}
                  onShowRoute={() => handleGetDirections(selectedLoc)}
                  onShowTrail={handleToggleTrail}
                  onViewStory={() => navigate(`/location/${selectedLoc.id}`)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
      <BottomNav />
    </div>
  )
}
