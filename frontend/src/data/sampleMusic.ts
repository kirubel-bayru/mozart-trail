import type { MusicCipherChallenge, MusicTrack } from '../types/music'
import { scrambleWord } from '../lib/cipherWords'

/** Answer = most emphasized 4-letter word from that location's story; choices = anagrams only. */
const LOCATION_CIPHER_DEFS: Omit<MusicCipherChallenge, 'scrambled'>[] = [
  {
    locationId: 'birthplace',
    context: '“Born in 1756” — where the musical journey began.',
    answer: 'BORN',
    choices: ['BURN', 'BONE', 'BORN', 'BARN'],
    hint: 'The opening line of this stop’s story.',
  },
  {
    locationId: 'cathedral',
    context: '“Fifteen masses” composed within these cathedral walls.',
    answer: 'MASS',
    choices: ['SAMS', 'MSAS', 'MASS', 'SMAS'],
    hint: 'Sacred music Mozart wrote for the Dom.',
  },
  {
    locationId: 'residence',
    context: 'Their family home after leaving Getreidegasse — “lived here” for years.',
    answer: 'HOME',
    choices: ['HEMO', 'EHOM', 'HOME', 'OHME'],
    hint: 'Leopold later died in this apartment.',
  },
  {
    locationId: 'mirabell',
    context: 'Performances in the palace “Marble Hall” and gardens.',
    answer: 'HALL',
    choices: ['LAHL', 'HLAL', 'HALL', 'LHLA'],
    hint: 'Named in the very first sentence of the story.',
  },
  {
    locationId: 'residenz',
    context: 'The famous kick “set him free” from the Archbishop’s service.',
    answer: 'FREE',
    choices: ['REEF', 'FERE', 'FREE', 'FEER'],
    hint: 'How the story describes his liberation.',
  },
  {
    locationId: 'st-peter',
    context: 'Constanze “sang” the soprano at the 1783 premiere.',
    answer: 'SANG',
    choices: ['NAGS', 'SNAG', 'SANG', 'GANS'],
    hint: 'What she did at the Great Mass in C minor.',
  },
  {
    locationId: 'kollegienkirche',
    context: 'He “played” the organ here for hours of improvisation.',
    answer: 'PLAY',
    choices: ['PALY', 'YLAP', 'PLAY', 'PYAL'],
    hint: 'Witnesses marvelled at his performances in this church.',
  },
  {
    locationId: 'mozarteum',
    context: 'His “last” creative burst — Magic Flute, Requiem, and the cottage.',
    answer: 'LAST',
    choices: ['SALT', 'SLAT', 'LAST', 'ALTS'],
    hint: 'The era of his final masterpieces preserved here.',
  },
  {
    locationId: 'st-sebastian',
    context: 'Leopold Mozart is “buried” in this cemetery.',
    answer: 'TOMB',
    choices: ['BOTM', 'OBTM', 'TOMB', 'MTOB'],
    hint: 'The human centre of this stop’s narrative.',
  },
  {
    locationId: 'fortress',
    context: 'The Archbishop’s seat — “absolute power” over the city below.',
    answer: 'ARCH',
    choices: ['CHAR', 'CHRA', 'ARCH', 'RACH'],
    hint: 'Who employed Mozart — and looms over every street.',
  },
  {
    locationId: 'nonnberg',
    context: 'Mozart performed for the “nuns” as a child of five or six.',
    answer: 'NUNS',
    choices: ['SUNN', 'UNNS', 'NUNS', 'SNNU'],
    hint: 'The chronicles record their “divine wonder.”',
  },
  {
    locationId: 'hellbrunn',
    context: 'Trick fountains “soak” and drench summer guests.',
    answer: 'SOAK',
    choices: ['OAKS', 'KOSA', 'SOAK', 'OKAS'],
    hint: 'What the Archbishop’s jets did to visitors.',
  },
]

/**
 * Public-domain Mozart samples from Wikimedia Commons (MP3 transcodes).
 * Replace with your music API later — see frontend/src/lib/music.ts
 */
const WIKI = 'https://upload.wikimedia.org/wikipedia/commons/transcoded'

/** Twelve verified MP3 transcodes — one unique recording per location */
const AUDIO = {
  pianoSonata421M1: `${WIKI}/5/57/02_Mozart_KV_421_1.ogg/02_Mozart_KV_421_1.ogg.mp3`,
  oboeQuartetAdagio: `${WIKI}/e/ee/Wolfgang_Amadeus_Mozart_-_Oboe_Quartet_-_2._Adagio.ogg/Wolfgang_Amadeus_Mozart_-_Oboe_Quartet_-_2._Adagio.ogg.mp3`,
  pianoSonata421M4: `${WIKI}/9/9c/06_Mozart_KV_421_4.ogg/06_Mozart_KV_421_4.ogg.mp3`,
  fluteQuartetRondeau: `${WIKI}/e/e0/Wolfgang_Amadeus_Mozart_-_Flute_Quartet_No._1_in_D_Major_-_3._Rondeau_-_Allegro.ogg/Wolfgang_Amadeus_Mozart_-_Flute_Quartet_No._1_in_D_Major_-_3._Rondeau_-_Allegro.ogg.mp3`,
  symphony40: `${WIKI}/1/16/Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg/Wolfgang_Amadeus_Mozart_-_Symphony_40_g-moll_-_4._Allegro_assai.ogg.mp3`,
  stringQuintetAdagio: `${WIKI}/8/86/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_3._Adagio_ma_non_troppo.ogg/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_3._Adagio_ma_non_troppo.ogg.mp3`,
  stringQuintetMenuetto: `${WIKI}/6/6a/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_2._Menuetto_-_Allegretto.ogg/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_2._Menuetto_-_Allegretto.ogg.mp3`,
  fluteQuartetAllegro: `${WIKI}/9/9c/Wolfgang_Amadeus_Mozart_-_Flute_Quartet_No._1_in_D_Major_-_1._Allegro.ogg/Wolfgang_Amadeus_Mozart_-_Flute_Quartet_No._1_in_D_Major_-_1._Allegro.ogg.mp3`,
  stringQuintetFinale: `${WIKI}/6/68/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_4._Adagio_-_Allegro.ogg.mp3`,
  stringQuintetAllegro: `${WIKI}/8/87/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_1._Allegro.ogg/Wolfgang_Amadeus_mozart_-_String_Quintet_No._4_K.516_-_1._Allegro.ogg.mp3`,
  fluteQuartetAdagio: `${WIKI}/2/2a/Wolfgang_Amadeus_Mozart_-_Flute_Quartet_No._1_in_D_Major_-_2._Adagio.ogg/Wolfgang_Amadeus_Mozart_-_Flute_Quartet_No._1_in_D_Major_-_2._Adagio.ogg.mp3`,
  oboeQuartetAllegro: `${WIKI}/a/a6/Wolfgang_Amadeus_Mozart_-_Oboe_Quartet_-_1._Allegro.ogg/Wolfgang_Amadeus_Mozart_-_Oboe_Quartet_-_1._Allegro.ogg.mp3`,
} as const

const ATTRIBUTION = 'Wikimedia Commons · public domain'

export const SAMPLE_TRACKS: MusicTrack[] = [
  {
    id: 'birthplace-k421',
    locationId: 'birthplace',
    title: 'Piano Sonata No. 12',
    subtitle: 'Allegro — early keyboard years at Getreidegasse',
    kNumber: 'K. 421',
    audioUrl: AUDIO.pianoSonata421M1,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'cathedral-oboe-adagio',
    locationId: 'cathedral',
    title: 'Oboe Quartet',
    subtitle: 'Adagio — sacred Salzburg sound',
    kNumber: 'K. 370',
    audioUrl: AUDIO.oboeQuartetAdagio,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'residence-k421-finale',
    locationId: 'residence',
    title: 'Piano Sonata No. 12',
    subtitle: 'Finale — composed in the Tanzmeisterhaus',
    kNumber: 'K. 421',
    audioUrl: AUDIO.pianoSonata421M4,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'mirabell-flute-rondeau',
    locationId: 'mirabell',
    title: 'Flute Quartet No. 1',
    subtitle: 'Rondeau — court music at Mirabell',
    kNumber: 'K. 285',
    audioUrl: AUDIO.fluteQuartetRondeau,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'residenz-symphony-40',
    locationId: 'residenz',
    title: 'Symphony No. 40',
    subtitle: 'Allegro assai — tension at the Archbishop’s court',
    kNumber: 'K. 550',
    audioUrl: AUDIO.symphony40,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'st-peter-quintet-adagio',
    locationId: 'st-peter',
    title: 'String Quintet No. 4',
    subtitle: 'Adagio — Mass in C minor era',
    kNumber: 'K. 516',
    audioUrl: AUDIO.stringQuintetAdagio,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'kollegienkirche-quintet-menuetto',
    locationId: 'kollegienkirche',
    title: 'String Quintet No. 4',
    subtitle: 'Menuetto — university church acoustics',
    kNumber: 'K. 516',
    audioUrl: AUDIO.stringQuintetMenuetto,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'mozarteum-flute-allegro',
    locationId: 'mozarteum',
    title: 'Flute Quartet No. 1',
    subtitle: 'Allegro — woodwind brilliance',
    kNumber: 'K. 285',
    audioUrl: AUDIO.fluteQuartetAllegro,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'st-sebastian-quintet-finale',
    locationId: 'st-sebastian',
    title: 'String Quintet No. 4',
    subtitle: 'Finale — contemplative cemetery walks',
    kNumber: 'K. 516',
    audioUrl: AUDIO.stringQuintetFinale,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'fortress-quintet-allegro',
    locationId: 'fortress',
    title: 'String Quintet No. 4',
    subtitle: 'Allegro — drama under the fortress skyline',
    kNumber: 'K. 516',
    audioUrl: AUDIO.stringQuintetAllegro,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'nonnberg-flute-adagio',
    locationId: 'nonnberg',
    title: 'Flute Quartet No. 1',
    subtitle: 'Adagio — early abbey performances',
    kNumber: 'K. 285',
    audioUrl: AUDIO.fluteQuartetAdagio,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
  {
    id: 'hellbrunn-oboe-allegro',
    locationId: 'hellbrunn',
    title: 'Oboe Quartet',
    subtitle: 'Allegro — summer court at Hellbrunn',
    kNumber: 'K. 370',
    audioUrl: AUDIO.oboeQuartetAllegro,
    attribution: ATTRIBUTION,
    source: 'sample',
    listenTargetSec: 20,
  },
]

export const SAMPLE_CIPHERS: MusicCipherChallenge[] = LOCATION_CIPHER_DEFS.map((def) => ({
  ...def,
  scrambled: scrambleWord(def.answer, def.locationId),
}))

const trackByLocation = new Map(SAMPLE_TRACKS.map((t) => [t.locationId, t]))
const cipherByLocation = new Map(SAMPLE_CIPHERS.map((c) => [c.locationId, c]))

export function getSampleTrack(locationId: string): MusicTrack | undefined {
  return trackByLocation.get(locationId)
}

export function getSampleCipher(locationId: string): MusicCipherChallenge | undefined {
  return cipherByLocation.get(locationId)
}

export function getSampleMusicResponse(locationId: string) {
  const track = getSampleTrack(locationId)
  const cipher = getSampleCipher(locationId)
  if (!track || !cipher) return null
  return { track, cipher }
}
