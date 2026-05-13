import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MozartLocation } from '../data/locations'
import { UserLocationMarker } from './UserLocationMarker'
import { C } from '../theme'

L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/'

function createMarkerIcon(unlocked: boolean, isBrowseMode: boolean) {
  const size = unlocked ? 46 : 36
  const color = unlocked ? C.secondary : '#AAAAAA'
  const border = unlocked ? `3px solid ${C.neutral}` : `2px solid rgba(255,255,255,0.8)`
  const shadow = unlocked
    ? `0 4px 16px rgba(212,175,55,0.55), 0 2px 6px rgba(0,0,0,0.2)`
    : `0 2px 8px rgba(0,0,0,0.2)`

  const lockSvg = unlocked
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M8 11V7a4 4 0 017.9-.8" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="3" y="11" width="18" height="11" rx="2.5" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
      </svg>`
    : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
        <rect x="3" y="11" width="18" height="11" rx="2.5" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/>
      </svg>`

  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;background:${color};
      border-radius:50%;display:flex;align-items:center;justify-content:center;
      border:${border};box-shadow:${shadow};
      cursor:${!unlocked && !isBrowseMode ? 'default' : 'pointer'};
    ">${lockSvg}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    tooltipAnchor: [0, size / 2 + 6],
  })
}

function MapController({ locations, flyTarget }: { locations: MozartLocation[]; flyTarget: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]))
    map.fitBounds(bounds, { padding: [80, 60], maxZoom: 15 })
  }, [])

  useEffect(() => {
    if (!flyTarget) return
    map.flyTo(flyTarget, Math.max(map.getZoom(), 16), { duration: 1.2 })
  }, [flyTarget, map])

  return null
}

interface MapViewProps {
  locations: MozartLocation[]
  userPosition: [number, number] | null
  flyTarget: [number, number] | null
  routeData: object | null
  routeKey: number
  isBrowseMode: boolean
  onLocationClick: (loc: MozartLocation) => void
}

export function MapView({ locations, userPosition, flyTarget, routeData, routeKey, isBrowseMode, onLocationClick }: MapViewProps) {
  return (
    <MapContainer
      center={[47.7990, 13.0455]}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri"
        maxZoom={18}
      />

      {routeData && (
        <GeoJSON
          key={routeKey}
          data={routeData as any}
          style={{ color: C.primary, weight: 5, opacity: 0.8, dashArray: '10 7', lineCap: 'round' }}
        />
      )}

      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={createMarkerIcon(loc.unlocked, isBrowseMode)}
          eventHandlers={{ click: () => onLocationClick(loc) }}
        >
          <Tooltip
            permanent
            direction="bottom"
            offset={[0, 8]}
            className={loc.unlocked ? 'location-label location-label--unlocked' : 'location-label'}
          >
            {loc.name}
          </Tooltip>
        </Marker>
      ))}

      {userPosition && <UserLocationMarker position={userPosition} />}
      <MapController locations={locations} flyTarget={flyTarget} />
    </MapContainer>
  )
}
