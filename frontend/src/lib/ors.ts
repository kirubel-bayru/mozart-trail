const ORS_KEY = process.env.ORS_API_KEY ?? ''
const ORS_URL = 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson'

export interface RouteResult {
  geojson: object
  distanceM: number
  durationSec: number
}

// ORS uses [lng, lat] order — opposite of Leaflet's [lat, lng]
export async function fetchWalkingRoute(
  from: [number, number],
  to: [number, number],
): Promise<RouteResult | null> {
  if (!ORS_KEY) {
    console.warn('ORS_API_KEY not set — walking directions disabled')
    return null
  }

  try {
    const res = await fetch(ORS_URL, {
      method: 'POST',
      headers: {
        Authorization: ORS_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [
          [from[1], from[0]],
          [to[1], to[0]],
        ],
      }),
    })

    if (!res.ok) return null

    const data = await res.json()
    const props = data?.features?.[0]?.properties?.summary ?? {}

    return {
      geojson: data,
      distanceM: props.distance ?? 0,
      durationSec: props.duration ?? 0,
    }
  } catch {
    return null
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h ${mins % 60}min`
}
