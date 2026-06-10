import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { MapView } from '../components/MapView'
import { ProgressCard } from '../components/ProgressCard'
import { AppHeader } from '../components/AppHeader'
import { BottomNav } from '../components/BottomNav'
import { LocationInfoCard } from '../components/LocationInfoCard'
import { LOCATIONS, UNLOCK_RADIUS_M } from '../data/locations'
import type { MozartLocation } from '../data/locations'
import { haversineDistance, formatDistance } from '../lib/geo'
import { fetchWalkingRoute, fetchFullTrailRoute, formatDuration } from '../lib/ors'
import type { RouteResult } from '../lib/ors'
import { C, F } from '../theme'

// Fallback start point when GPS is unavailable (Salzburg Residenzplatz)
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
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(() => new Set())

  // GPS state
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const lastRoutePosRef = useRef<[number, number] | null>(null)   // where route was last calculated
  const lastTrailPosRef = useRef<[number, number] | null>(null)   // where trail was last calculated

  // Mode: browse (desktop/no GPS) vs hunt (GPS active)
  const [isBrowseMode, setIsBrowseMode] = useState(false)

  // Selected location + drawer
  const [selectedLoc, setSelectedLoc] = useState<MozartLocation | null>(null)

  // Single-location ORS route
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)

  // Full trail ORS route
  const [trailRoute, setTrailRoute] = useState<RouteResult | null>(null)
  const [isLoadingTrail, setIsLoadingTrail] = useState(false)

  const [routeKey, setRouteKey] = useState(0)

  // Derived locations list with current unlock state
  const locations = useMemo(
    () => LOCATIONS.map((l) => ({ ...l, unlocked: unlockedIds.has(l.id) })),
    [unlockedIds],
  )
  const unlockedCount = unlockedIds.size

  // Start GPS watch
  useEffect(() => {
    if (!navigator.geolocation) {
      setIsBrowseMode(true)
      return
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude])
      },
      () => {
        setIsBrowseMode(true)
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
    )

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  // Live route update — silently refetch when user moves >30 m
  useEffect(() => {
    if (!userPos) return
    const REFRESH_DIST_M = 30

    // Single-location route
    if (selectedLoc && route) {
      const origin = lastRoutePosRef.current ?? userPos
      if (haversineDistance(userPos[0], userPos[1], origin[0], origin[1]) > REFRESH_DIST_M) {
        lastRoutePosRef.current = userPos
        fetchWalkingRoute(userPos, [selectedLoc.lat, selectedLoc.lng]).then((result) => {
          if (result) { setRoute(result); setRouteKey((k) => k + 1) }
        })
      }
    }

    // Full trail route
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

  // Geofencing — check proximity each time user moves
  useEffect(() => {
    if (!userPos || isBrowseMode) return

    LOCATIONS.forEach((loc) => {
      if (unlockedIds.has(loc.id)) return

      const dist = haversineDistance(userPos[0], userPos[1], loc.lat, loc.lng)
      if (dist <= UNLOCK_RADIUS_M) {
        setUnlockedIds((prev) => new Set([...prev, loc.id]))
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
    const isUnlocked = unlockedIds.has(loc.id)
    setSelectedLoc({ ...loc, unlocked: isUnlocked })
    setRoute(null)
  }, [unlockedIds])

  const handleGetDirections = useCallback(async (loc: MozartLocation) => {
    const fromPos = userPos ?? SALZBURG_CENTER
    setIsLoadingRoute(true)
    try {
      const result = await fetchWalkingRoute(fromPos, [loc.lat, loc.lng])
      if (result) {
        setRoute(result)
        setRouteKey((k) => k + 1)
        lastRoutePosRef.current = fromPos   // record where we calculated from
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
        lastTrailPosRef.current = startPos  // record where we calculated from
      }
      else notifications.show({ message: 'Could not load trail. Check your ORS API key.', color: 'orange' })
    } finally {
      setIsLoadingTrail(false)
    }
  }, [trailRoute, userPos])

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.neutral }}>
      <AppHeader />

      {/* Mode badge — sits just below header */}
      <div style={{ position: 'absolute', top: 68, right: 16, zIndex: 950 }}>
        <button
          onClick={() => setIsBrowseMode((b) => !b)}
          style={{
            background: isBrowseMode ? 'rgba(255,255,255,0.92)' : C.secondary,
            border: 'none',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            color: isBrowseMode ? C.primary : C.textDark,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {isBrowseMode ? '👁 Browse' : '🎯 Hunt'}
        </button>
      </div>

      {/* Map area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
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

        {/* Progress card overlay */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 900 }}>
          <ProgressCard unlocked={unlockedCount} total={LOCATIONS.length} />
        </div>

        {/* Trail info banner — shown when trail route is active */}
        {trailRoute && (
          <div style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 900,
            background: C.secondary,
            color: C.textDark,
            borderRadius: 20,
            padding: '6px 16px',
            fontFamily: F.body,
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            🗺️ Full Trail · {formatDistance(trailRoute.distanceM)} · {formatDuration(trailRoute.durationSec)}
            <button
              onClick={() => { setTrailRoute(null); setRouteKey(k => k + 1) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: C.textDark, padding: 0, lineHeight: 1 }}
            >×</button>
          </div>
        )}

        {/* Show Full Trail FAB — bottom left */}
        <button
          onClick={handleToggleTrail}
          disabled={isLoadingTrail}
          style={{
            position: 'absolute',
            bottom: 20,
            left: 16,
            zIndex: 900,
            padding: '0 16px',
            height: 44,
            borderRadius: 22,
            background: trailRoute ? C.secondary : 'white',
            border: `2px solid ${trailRoute ? C.secondary : C.neutralDark}`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: isLoadingTrail ? 'default' : 'pointer',
            fontFamily: F.body,
            fontSize: 12,
            fontWeight: 700,
            color: trailRoute ? C.textDark : C.tertiary,
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          {isLoadingTrail ? '⏳ Planning…' : trailRoute ? '✕ Clear Trail' : '🗺️ Full Trail'}
        </button>

        {/* Locate FAB — bottom right */}
        <button
          onClick={handleLocate}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 16,
            zIndex: 900,
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: C.primary,
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(139,0,0,0.45)',
          }}
        >
          <LocateIcon />
        </button>
      </div>

      {/* Location info card — shown above bottom nav when marker is tapped */}
      {selectedLoc && (
        <LocationInfoCard
          location={selectedLoc}
          straightLineM={haversineDistance(
            (userPos ?? SALZBURG_CENTER)[0], (userPos ?? SALZBURG_CENTER)[1],
            selectedLoc.lat, selectedLoc.lng
          )}
          route={route}
          isLoadingRoute={isLoadingRoute}
          usingFallbackPos={!userPos}
          onClose={() => { setSelectedLoc(null); setRoute(null); lastRoutePosRef.current = null; setRouteKey(k => k + 1) }}
          onShowRoute={() => handleGetDirections(selectedLoc)}
          onShowTrail={handleToggleTrail}
          onViewStory={() => navigate(`/location/${selectedLoc.id}`)}
        />
      )}

      <BottomNav />
    </div>
  )
}
