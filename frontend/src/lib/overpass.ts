const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

export interface LiveHours {
  raw: string        // OSM opening_hours value
  source: string     // name of the OSM element
}

// Query Overpass for opening_hours tags within 100m of a coordinate
export async function fetchOpeningHours(lat: number, lng: number): Promise<LiveHours | null> {
  const query = `
    [out:json][timeout:10];
    (
      node(around:100,${lat},${lng})["opening_hours"];
      way(around:100,${lat},${lng})["opening_hours"];
    );
    out tags;
  `
  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    if (!res.ok) return null
    const data = await res.json()
    const el = data.elements?.[0]
    if (!el?.tags?.opening_hours) return null
    return {
      raw: el.tags.opening_hours,
      source: el.tags.name ?? 'OpenStreetMap',
    }
  } catch {
    return null
  }
}

// Format raw OSM opening_hours string into readable lines
// e.g. "Mo-Sa 09:00-17:30; Su 13:00-17:00" → ["Mon–Sat  09:00–17:30", "Sun  13:00–17:00"]
export function formatOsmHours(raw: string): string {
  return raw
    .replace(/Mo/g, 'Mon').replace(/Tu/g, 'Tue').replace(/We/g, 'Wed')
    .replace(/Th/g, 'Thu').replace(/Fr/g, 'Fri').replace(/Sa/g, 'Sat')
    .replace(/Su/g, 'Sun').replace(/PH/g, 'Public holidays')
    .replace(/-/g, '–').replace(/;/g, ' · ')
}
