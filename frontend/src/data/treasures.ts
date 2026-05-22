import { LOCATIONS } from './locations'

export interface Treasure {
  locationId: string
  name: string
  emoji: string
  tagline: string
  description: string
}

export const TREASURES: Treasure[] = [
  {
    locationId: 'birthplace',
    name: 'Childhood Violin',
    emoji: '🎻',
    tagline: 'From the Hagenauer Haus',
    description: 'A miniature violin like the one young Wolfgang practiced on at Getreidegasse 9.',
  },
  {
    locationId: 'cathedral',
    name: 'Baptism Font Seal',
    emoji: '⛪',
    tagline: 'Salzburger Dom',
    description: 'A wax impression from the font where Mozart was baptized the day after his birth.',
  },
  {
    locationId: 'residence',
    name: 'Manuscript Leaf',
    emoji: '📜',
    tagline: 'Tanzmeisterhaus',
    description: 'A fragment of violin-concerto sketches composed in the family’s larger riverside home.',
  },
  {
    locationId: 'mirabell',
    name: 'Marble Hall Ticket',
    emoji: '🌿',
    tagline: 'Schloss Mirabell',
    description: 'An engraved invitation to a court performance in the palace’s gilded concert hall.',
  },
  {
    locationId: 'residenz',
    name: 'Archbishop’s Seal',
    emoji: '👢',
    tagline: 'Erzbischöfliche Residenz',
    description: 'The crest of Colloredo’s court — a reminder of the famous dismissal that set Mozart free.',
  },
  {
    locationId: 'st-peter',
    name: 'C Minor Mass Sketch',
    emoji: '🎼',
    tagline: 'Stift Sankt Peter',
    description: 'A vocal line from the Mass in C Minor, premiered here with Constanze singing soprano.',
  },
  {
    locationId: 'kollegienkirche',
    name: 'Organ Improvisation',
    emoji: '🎹',
    tagline: 'Kollegienkirche',
    description: 'Notes from a legendary spontaneous improvisation on Fischer von Erlach’s great organ.',
  },
  {
    locationId: 'mozarteum',
    name: 'Magic Flute Quill',
    emoji: '🪶',
    tagline: 'Universität Mozarteum',
    description: 'A writing quill from the cottage where Die Zauberflöte took shape in Mozart’s final year.',
  },
  {
    locationId: 'st-sebastian',
    name: 'Memorial Candle',
    emoji: '🕯️',
    tagline: 'Sebastiansfriedhof',
    description: 'A candle lit near Leopold Mozart’s grave in the abbey’s Renaissance cemetery.',
  },
  {
    locationId: 'fortress',
    name: 'Fortress Panorama',
    emoji: '🏰',
    tagline: 'Festung Hohensalzburg',
    description: 'A sketch of the skyline Mozart knew for seventeen years — legend says he never climbed up.',
  },
  {
    locationId: 'nonnberg',
    name: 'Abbey Chronicle',
    emoji: '📖',
    tagline: 'Stift Nonnberg',
    description: 'A copied passage describing the nuns’ wonder at a five-year-old’s performance.',
  },
  {
    locationId: 'hellbrunn',
    name: 'Trick Fountain Charm',
    emoji: '💧',
    tagline: 'Schloss Hellbrunn',
    description: 'A playful token from the Archbishop’s summer palace of hidden jets and court dazzle.',
  },
]

const treasureByLocationId = new Map(TREASURES.map((t) => [t.locationId, t]))

export function getTreasureForLocation(locationId: string): Treasure | undefined {
  return treasureByLocationId.get(locationId)
}

export function getTreasureEntries() {
  return LOCATIONS.map((loc) => ({
    location: loc,
    treasure: treasureByLocationId.get(loc.id)!,
  }))
}
