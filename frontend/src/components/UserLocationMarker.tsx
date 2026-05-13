import { Marker } from 'react-leaflet'
import L from 'leaflet'

const USER_ICON = L.divIcon({
  className: '',
  html: `
    <div class="user-location-marker">
      <div class="user-pulse-ring"></div>
      <div class="user-dot"></div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
})

interface UserLocationMarkerProps {
  position: [number, number]
}

export function UserLocationMarker({ position }: UserLocationMarkerProps) {
  return <Marker position={position} icon={USER_ICON} zIndexOffset={1000} interactive={false} />
}
