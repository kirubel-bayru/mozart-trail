import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { MapView } from '../components/MapView'
import { ProgressCard } from '../components/ProgressCard'
import { BottomNav } from '../components/BottomNav'
import { LocationDetailDrawer } from '../components/LocationDetailDrawer'
import { LOCATIONS, UNLOCK_RADIUS_M } from '../data/locations'
import type { MozartLocation } from '../data/locations'
import { haversineDistance } from '../lib/geo'
import { fetchWalkingRoute } from '../lib/ors'
import type { RouteResult } from '../lib/ors'
import { C, F } from '../theme'

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 12h18M3 6h18M3 18h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function ProfileIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

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

  // Mode: browse (desktop/no GPS) vs hunt (GPS active)
  const [isBrowseMode, setIsBrowseMode] = useState(false)

  // Selected location + drawer
  const [selectedLoc, setSelectedLoc] = useState<MozartLocation | null>(null)

  // ORS route
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [routeKey, setRouteKey] = useState(0)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)

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
    if (isUnlocked || isBrowseMode) {
      navigate(`/location/${loc.id}`)
    } else {
      notifications.show({
        title: '🔒 Locked',
        message: `Walk within 50m of ${loc.name} to unlock this location.`,
        color: 'gray',
        autoClose: 3000,
      })
    }
  }, [unlockedIds, isBrowseMode, navigate])

  const handleGetDirections = useCallback(async (loc: MozartLocation) => {
    if (!userPos) return
    setIsLoadingRoute(true)
    try {
      const result = await fetchWalkingRoute(userPos, [loc.lat, loc.lng])
      if (result) {
        setRoute(result)
        setRouteKey((k) => k + 1)
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

  const handleClearRoute = useCallback(() => {
    setRoute(null)
    setRouteKey((k) => k + 1)
  }, [])

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.neutral }}>
      {/* Header */}
      <header style={{
        height: 60,
        background: C.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        flexShrink: 0,
        zIndex: 10,
      }}>
        <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex' }}>
          <MenuIcon />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: 'white',
            fontFamily: F.headline,
            letterSpacing: '0.02em',
          }}>
            Mozart's Trail
          </h1>

          {/* Mode badge */}
          <button
            onClick={() => setIsBrowseMode((b) => !b)}
            title={isBrowseMode ? 'Switch to Hunt Mode (GPS)' : 'Switch to Browse Mode'}
            style={{
              background: isBrowseMode ? 'rgba(255,255,255,0.15)' : 'rgba(212,175,55,0.25)',
              border: `1px solid ${isBrowseMode ? 'rgba(255,255,255,0.3)' : 'rgba(212,175,55,0.5)'}`,
              borderRadius: 20,
              padding: '3px 9px',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              color: isBrowseMode ? 'rgba(255,255,255,0.85)' : C.secondary,
              whiteSpace: 'nowrap',
            }}
          >
            {isBrowseMode ? 'Browse' : 'Hunt'}
          </button>
        </div>

        <button style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', display: 'flex' }}>
          <ProfileIcon />
        </button>
      </header>

      {/* Map area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <MapView
          locations={locations}
          userPosition={userPos}
          flyTarget={flyTarget}
          routeData={route?.geojson ?? null}
          routeKey={routeKey}
          isBrowseMode={isBrowseMode}
          onLocationClick={handleLocationClick}
        />

        {/* Progress card overlay */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 900 }}>
          <ProgressCard unlocked={unlockedCount} total={LOCATIONS.length} />
        </div>

        {/* Locate FAB */}
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

      {/* Bottom nav */}
      <BottomNav />

      {/* Location detail drawer */}
      <LocationDetailDrawer
        location={selectedLoc}
        isBrowseMode={isBrowseMode}
        hasUserPosition={!!userPos}
        route={route}
        isLoadingRoute={isLoadingRoute}
        onClose={() => setSelectedLoc(null)}
        onGetDirections={handleGetDirections}
        onClearRoute={handleClearRoute}
      />
    </div>
  )
}
