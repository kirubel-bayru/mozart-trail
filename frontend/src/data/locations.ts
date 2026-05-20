export interface OpeningHours {
  schedule: string    // e.g. "Mon–Sat 09:00–17:30, Sun 13:00–17:00"
  note?: string       // e.g. "Last entry 30 min before closing"
  admission?: string  // e.g. "€12 adults · €4 children" or "Free"
}

export interface MozartLocation {
  id: string
  name: string
  subtitle: string
  category: string
  lat: number
  lng: number
  unlocked: boolean
  description: string
  fullStory: string
  wikipediaTitle: string
  openingHours: OpeningHours
  year: string
  points: number
  order: number
}

export const LOCATIONS: MozartLocation[] = [
  {
    id: 'birthplace',
    name: "Mozart's Birthplace",
    subtitle: 'Hagenauer Haus',
    category: 'Historical Landmark',
    lat: 47.7998,
    lng: 13.0430,
    unlocked: false,
    description:
      'Born in 1756, this house was where Mozart\'s musical journey began. Discover the rooms where the child prodigy practiced his first notes and lived with his family for twenty-six years.',
    fullStory: `On the third floor of this yellow building at Getreidegasse 9, Wolfgang Amadeus Mozart entered the world on January 27, 1756. His father Leopold, a court musician and ambitious teacher, immediately recognized the extraordinary gift his son possessed. By age three, Wolfgang was picking out chords at the keyboard. By five, he was composing.\n\nThe family lived here until 1773, cramped into modest rooms that nevertheless rang with constant music. Leopold used the apartment as a teaching studio, and Wolfgang and his sister Nannerl practiced for hours each day. It was here that the young Mozart learned to read music before he could properly read words, and where he composed his first minuets, concerti, and symphonies.\n\nToday the house is the most visited museum in Salzburg. You can stand in the room where Mozart was born, see his childhood violin, his clavichord, a lock of his hair, and family portraits that capture the intensity of his early years. It is impossible to stand here and not feel the weight of what this small apartment gave to the world.`,
    wikipediaTitle: "Mozart's_Birthplace",
    openingHours: {
      schedule: 'Daily 09:00–17:30',
      note: 'Last entry 17:00',
      admission: '€12 adults · €3.50 children (under 6 free)',
    },
    year: '1756',
    points: 50,
    order: 1,
  },
  {
    id: 'cathedral',
    name: 'Salzburg Cathedral',
    subtitle: 'Salzburger Dom',
    category: 'Cathedral',
    lat: 47.7975,
    lng: 13.0469,
    unlocked: false,
    description:
      'Mozart was baptized here the day after his birth. He later served as court organist and composed fifteen masses within these walls — making this cathedral the sonic birthplace of his sacred music.',
    fullStory: `On January 28, 1756 — just one day after Wolfgang's birth — Leopold Mozart carried his newborn son through the doors of this cathedral to be baptized. The ceremony was performed at the 17th-century font that still stands here today, naming the child Johannes Chrysostomus Wolfgangus Theophilus Mozart.\n\nThe cathedral shaped Mozart's musical imagination profoundly. He served as court organist here from 1779 to 1781, playing the magnificent Baroque organ for Sunday masses and feast days. He composed fifteen masses, four litanies, and dozens of shorter sacred works specifically for this space, listening to how the soaring dome transformed his harmonies into something divine.\n\nThe dismissal that changed music history happened indirectly because of this building. When Mozart left Salzburg for Vienna in 1781, he refused to return to his position here — telling his father in letters that he could not bear to write music for a court he despised. He became the first great composer to strike out alone as a freelance artist, and the world of music was never the same.`,
    wikipediaTitle: 'Salzburg_Cathedral',
    openingHours: {
      schedule: 'Mon–Sat 08:00–17:00, Sun 13:00–17:00',
      note: 'May close during services',
      admission: 'Free · Museum €3',
    },
    year: '1756',
    points: 50,
    order: 2,
  },
  {
    id: 'residence',
    name: 'Mozart Residence',
    subtitle: 'Tanzmeisterhaus',
    category: 'Historical Residence',
    lat: 47.8024,
    lng: 13.0449,
    unlocked: false,
    description:
      'The family moved here in 1773, seeking more space. In these larger rooms, Mozart composed some of his most ambitious early works — including his violin concerti and the Haffner Serenade.',
    fullStory: `By 1773, the Mozart family had outgrown their birthplace apartment and moved to this larger building on the other side of the Salzach River. The move signaled Leopold's ambitions — more room meant more students, more rehearsals, and more space for Wolfgang's growing library of manuscript paper.\n\nIt was here that Mozart composed at a furious pace between tours. The violin concerti (1775), the Piano Concerto No. 9 "Jeunehomme" (1777), the Haffner Serenade, and dozens of symphonies poured from his pen in this apartment. He was working at a speed that suggested he knew he would not remain in Salzburg forever.\n\nAfter Wolfgang left for Vienna in 1781, Leopold continued to live here alone, surrounded by his son's manuscripts and instruments, maintaining a correspondence with Wolfgang that grew increasingly fraught with disappointment. Leopold died in this apartment in 1787, just two years before Wolfgang himself. Today it houses an extensive museum with original instruments, letters, and portraits — a more intimate portrait of the family than the birthplace museum provides.`,
    wikipediaTitle: 'Mozart_Residence',
    openingHours: {
      schedule: 'Daily 09:00–17:30',
      note: 'Last entry 17:00',
      admission: '€12 adults · €3.50 children',
    },
    year: '1773',
    points: 50,
    order: 3,
  },
  {
    id: 'mirabell',
    name: 'Mirabell Gardens',
    subtitle: 'Schloss Mirabell',
    category: 'Palace & Gardens',
    lat: 47.8044,
    lng: 13.0437,
    unlocked: false,
    description:
      'These baroque gardens were the backdrop to Mozart\'s earliest performances for the Salzburg court. The Marble Hall inside the palace remains one of the most beautiful concert spaces in Europe.',
    fullStory: `When the young Mozart performed for distinguished guests in Salzburg, the Marble Hall of Mirabell Palace was among the grandest stages available to him. Built originally in 1606 and redesigned in the Baroque style, the palace and its gardens represented the height of aristocratic elegance that Mozart both admired and resented.\n\nThe gardens you walk through today are largely unchanged from what Mozart knew — the same alignment of statues, hedgerows, and fountains, with the fortress rising dramatically on the hill behind. It was in spaces like this that Mozart learned to perform: charming, dazzling, and perfectly calibrated to delight the wealthy patrons who funded his father's ambitions.\n\nThe Marble Hall today hosts regular Mozart concerts — performed by candlelight, with musicians in 18th-century costume. There is something deeply affecting about hearing Mozart's chamber music in the room where he once performed it himself, looking out at the same garden, under the same Salzburg sky.`,
    wikipediaTitle: 'Mirabell_Palace',
    openingHours: {
      schedule: 'Gardens: Daily 06:00–dusk · Palace: Mon/Wed/Thu 08:00–16:00',
      note: 'Gardens free. Marble Hall bookings required for concerts.',
      admission: 'Gardens free · Palace tours €5',
    },
    year: '1762',
    points: 50,
    order: 4,
  },
  {
    id: 'residenz',
    name: 'Residenz Palace',
    subtitle: 'Erzbischöfliche Residenz',
    category: 'Archbishop\'s Palace',
    lat: 47.7996,
    lng: 13.0458,
    unlocked: false,
    description:
      "The Archbishop's official palace — where Mozart worked, suffered, and was ultimately dismissed with a famous kick. This confrontation set him free to become the world's first great freelance composer.",
    fullStory: `For most of his life in Salzburg, Mozart worked for whoever lived in this palace. The Archbishop of Salzburg was effectively his employer — a relationship that grew more suffocating with each passing year. Under Archbishop Colloredo, who took power in 1772, Mozart was treated as a household servant rather than an artist, expected to compose on demand and remain in Salzburg when he longed to travel.\n\nThe tension came to a breaking point in Vienna in 1781. Mozart had been summoned there as part of the Archbishop's retinue. Chafing against the restrictions, he repeatedly requested permission to give independent concerts — and was repeatedly denied. Finally he submitted his resignation. The confrontation that followed became one of music history's most famous incidents: Count Arco, the Archbishop's chamberlain, literally kicked Mozart out of the room.\n\n"The heart ennobles a man," Mozart wrote to his father afterward, "and though I am no count, yet I have probably more honour in me than many a count." He never returned to Salzburg except to visit his father. The kick that dismissed him was, inadvertently, the moment that liberated him.`,
    wikipediaTitle: 'Salzburg_Residenz',
    openingHours: {
      schedule: 'Daily 10:00–17:00',
      note: 'Closed on certain public holidays',
      admission: '€13 adults · €5 children',
    },
    year: '1772',
    points: 50,
    order: 5,
  },
  {
    id: 'st-peter',
    name: "St. Peter's Abbey",
    subtitle: 'Stift Sankt Peter',
    category: 'Monastery',
    lat: 47.7977,
    lng: 13.0452,
    unlocked: false,
    description:
      "One of the oldest monasteries in the German-speaking world. Mozart's Great Mass in C minor had its premiere in the abbey church in 1783, with Constanze singing the soprano part.",
    fullStory: `Founded around 696 AD, St. Peter's Abbey is one of the oldest continuously operating monasteries in the world. For Mozart, it was a place of music — he knew the abbey church well and composed sacred works that were performed within its ancient walls throughout his Salzburg years.\n\nThe premiere that matters most to music history happened here in October 1783. Mozart had promised his father that if he ever married — and in 1782 he married Constanze Weber, against Leopold's wishes — he would compose a great mass to give thanks. The result was the Mass in C Minor, one of the most ambitious choral works of the 18th century. Constanze herself sang the demanding soprano solos at the premiere, proving her voice to Salzburg society while Mozart conducted.\n\nThe abbey also contains one of the most atmospheric cemeteries in Austria, carved into the face of the Mönchsberg cliff. Mozart walked here with his father, contemplating the tombs of Salzburg's musical dynasties. The combination of ancient stone, candlelight, and the sound of the organ drifting from within would have felt deeply resonant to a composer already thinking about his own mortality.`,
    wikipediaTitle: "St._Peter's_Abbey,_Salzburg",
    openingHours: {
      schedule: 'Church: Daily 08:00–19:00 · Cemetery: Daily 06:30–19:00',
      admission: 'Church free · Catacombs €2',
    },
    year: '1783',
    points: 50,
    order: 6,
  },
  {
    id: 'kollegienkirche',
    name: 'Collegiate Church',
    subtitle: 'Kollegienkirche',
    category: 'University Church',
    lat: 47.7986,
    lng: 13.0436,
    unlocked: false,
    description:
      "Fischer von Erlach's Baroque masterpiece, built for Salzburg University. Mozart's masses resounded through this luminous white interior — and he studied the organ here, astonishing listeners with his improvisation.",
    fullStory: `Designed by Johann Bernhard Fischer von Erlach and completed in 1707, the Collegiate Church is considered one of the finest examples of Austrian Baroque architecture. Its dramatically curved white façade and luminous interior represented the Catholic Church's ambition to express faith through overwhelming beauty — a philosophy that resonated deeply with the young Mozart.\n\nMozart performed here regularly and studied its remarkable acoustics. The church's organ was considered one of the finest in Salzburg, and Mozart's improvisations on it became legendary in the city. Witnesses described him playing for hours, generating complex counterpoint spontaneously as if reading from an invisible score.\n\nSeveral of Mozart's masses were premiered in this church for the University's feast days. The combination of Fischer von Erlach's soaring architecture and Mozart's music created an experience that contemporaries described as transcendent. Standing in the church today, looking up at the white vaults and feeling the scale of the space, it is easy to understand why Mozart's sacred music still feels enormous — he wrote for rooms exactly like this one.`,
    wikipediaTitle: 'Collegiate_Church_(Salzburg)',
    openingHours: {
      schedule: 'Daily 09:00–19:00',
      note: 'May close during university events',
      admission: 'Free',
    },
    year: '1769',
    points: 50,
    order: 7,
  },
  {
    id: 'mozarteum',
    name: 'Mozarteum',
    subtitle: 'Universität Mozarteum',
    category: 'University & Foundation',
    lat: 47.8033,
    lng: 13.0413,
    unlocked: false,
    description:
      "The international Mozart foundation and music university, home to the world's largest Mozart archive — and to the Magic Flute cottage, where Mozart composed his final masterpiece.",
    fullStory: `Founded in 1841 as a music school and expanded into a full university of the arts, the Mozarteum has become the world's center for Mozart scholarship and performance. Its archives contain the largest collection of Mozart manuscripts, letters, and original instruments in existence — including the piano on which he composed many of his late works.\n\nThe most remarkable object on the grounds is the tiny wooden cottage in the garden: the Magic Flute House. Mozart worked on Die Zauberflöte in this cramped structure while simultaneously composing his Requiem and battling the illness that would kill him. The cottage was moved from Vienna to Salzburg after his death, preserved as a relic of his final creative burst.\n\nToday the Mozarteum hosts one of Europe's finest music academies, continuing the tradition that Mozart himself helped establish: that Salzburg is a city where music is not merely performed but lived. The annual Mozartwoche festival each January turns the city into a pilgrimage for the world's greatest musicians and most devoted listeners.`,
    wikipediaTitle: 'Mozarteum_University_Salzburg',
    openingHours: {
      schedule: 'Varies by concert/event schedule',
      note: 'Magic Flute Cottage: check Mozarteum website for visiting hours',
      admission: 'Concerts from €15 · Foundation tours €8',
    },
    year: '1841',
    points: 50,
    order: 8,
  },
  {
    id: 'st-sebastian',
    name: 'St. Sebastian Cemetery',
    subtitle: 'Sebastiansfriedhof',
    category: 'Historic Cemetery',
    lat: 47.8026,
    lng: 13.0466,
    unlocked: false,
    description:
      "A serene Renaissance cemetery where Leopold Mozart and Constanze's family are buried. Mozart visited often — these graves mark the human web behind the music.",
    fullStory: `Built in the Renaissance style and enclosed within elegant arcades, the cemetery of St. Sebastian Church holds the graves of several people central to Mozart's life. Leopold Mozart — his father, teacher, first critic, and greatest supporter — is buried here. So is Constanze Weber's mother, and other members of the extended family that surrounded Mozart in his Salzburg years.\n\nMozart walked through this cemetery throughout his childhood and youth. It was a contemplative space — a reminder, amid all the performance and pressure, of the fragility of life. His father had instilled in him a deep Catholic faith, and the cemetery visits were part of a regular reckoning with mortality that would eventually find its greatest expression in the Requiem.\n\nThe Gabriel Chapel at the cemetery's center, with its elaborate tiled dome, was commissioned by Archbishop Wolf Dietrich as a family mausoleum. It stands as one of the most beautiful small structures in Salzburg — intimate, perfectly proportioned, and suffused with the particular quiet that belongs to well-tended historic cemeteries. Mozart knew every stone here.`,
    wikipediaTitle: "St_Sebastian's_Church,_Salzburg",
    openingHours: {
      schedule: 'Church: Daily 09:00–18:00 · Cemetery: Daily 09:00–16:00',
      admission: 'Free',
    },
    year: '1787',
    points: 50,
    order: 9,
  },
  {
    id: 'fortress',
    name: 'Hohensalzburg Fortress',
    subtitle: 'Festung Hohensalzburg',
    category: 'Medieval Fortress',
    lat: 47.7950,
    lng: 13.0473,
    unlocked: false,
    description:
      "The imposing hilltop fortress that dominated Mozart's entire childhood skyline. The Archbishop who employed — and dismissed — Mozart used this as his seat of power. Mozart reportedly never visited.",
    fullStory: `Built in 1077 and expanded over six centuries, Hohensalzburg is one of the best-preserved medieval fortresses in Europe. It looms over Salzburg from its hilltop position with such dominance that it is impossible to stand anywhere in the old town without feeling its presence — which was precisely the point.\n\nThe fortress was the symbol of Archbishop's absolute power over the city and its inhabitants. For Mozart, it was the physical embodiment of the authority he chafed against his entire professional life. Legend holds that he never once visited the fortress, despite living in its shadow for seventeen years — a small rebellion against what it represented.\n\nFrom the fortress walls today you can see the entire geography of Mozart's life laid out below: the yellow house on Getreidegasse, the cathedral dome, the Salzach River, the gardens of Mirabell. It is the best single viewpoint from which to understand how compact and contained his Salzburg world was — and how desperately he must have longed for the wider world beyond the mountains.`,
    wikipediaTitle: 'Hohensalzburg_Fortress',
    openingHours: {
      schedule: 'Jan–Apr & Nov–Dec: 09:30–17:00 · May–Sep: 09:00–19:00 · Oct: 09:00–17:00',
      note: 'Funicular runs every 10 minutes',
      admission: '€15.20 adults · €8.70 children (includes funicular)',
    },
    year: '1772',
    points: 50,
    order: 10,
  },
  {
    id: 'nonnberg',
    name: 'Nonnberg Abbey',
    subtitle: 'Stift Nonnberg',
    category: 'Benedictine Abbey',
    lat: 47.7942,
    lng: 13.0473,
    unlocked: false,
    description:
      "Founded in 714 AD, one of the oldest convents in the world. The nuns here were among Mozart's earliest audiences — he performed for them as a five-year-old, astonishing the community with his gifts.",
    fullStory: `Founded by Saint Rupert around 714 AD, Nonnberg Abbey is the oldest continuously inhabited convent in the German-speaking world. Its fortified walls perch dramatically on the south side of the Mönchsberg just below the fortress, a feminine counterpart to the Archbishop's military power.\n\nThe young Mozart performed for the Nonnberg community as a child of five or six — one of his earliest documented public performances. The nuns, who had maintained a tradition of sacred music for over a thousand years, recognized immediately that this child was something unprecedented. Their response to his playing is recorded in the abbey's chronicles as one of "divine wonder."\n\nThe abbey church, with its late-Gothic frescoes and medieval atmosphere, gives a sense of the ancient Salzburg that existed long before Mozart — and that continues to exist, unchanged, long after. The nuns still sing the canonical hours here daily, their voices filling a space that has known continuous prayer since before the idea of "classical music" existed. Mozart's brief passage through this history is a reminder of how deep the roots of Salzburg's musical culture truly are.`,
    wikipediaTitle: 'Nonnberg_Abbey',
    openingHours: {
      schedule: 'Daily 07:00–19:00',
      note: 'Active convent — quiet and respectful visits only',
      admission: 'Free',
    },
    year: '1761',
    points: 50,
    order: 11,
  },
  {
    id: 'hellbrunn',
    name: 'Hellbrunn Palace',
    subtitle: 'Schloss Hellbrunn',
    category: 'Pleasure Palace',
    lat: 47.7637,
    lng: 13.0614,
    unlocked: false,
    description:
      "The Archbishop's summer palace, famous for its trick fountains that still delight visitors. Mozart performed here as a child prodigy, charming the court with memory and improvisation.",
    fullStory: `Built between 1613 and 1619 as a summer retreat for Archbishop Markus Sittikus, Hellbrunn was designed from the beginning as a place of pleasure and theatrical surprise. The famous trick fountains — water jets hidden in stone seats, in table tops, in the paths between hedgerows — were meant to amuse and startle guests. The Archbishop delighted in drenching his visitors while he sat comfortably on the one dry seat.\n\nThe young Mozart performed here on multiple occasions, brought by his father to dazzle the aristocratic guests who gathered at the Archbishop's summer court. These performances were crucial to the Mozart family's social advancement — every satisfied nobleman was a potential patron or letter of introduction. Wolfgang played, improvised, and demonstrated his freakish musical memory, and the assembled company responded with the rewarding wonder that Leopold had learned to monetize.\n\nThe palace grounds today are largely unchanged: the water gardens, the mechanical theatre (a 17th-century automaton with hundreds of figures), and the zoo that the Archbishops maintained for their amusement. Walking through them on a summer afternoon, with the fountains still surprising unwary tourists, it is easy to imagine the eight-year-old Mozart navigating the same paths, performing for the same kind of wealthy, easily delighted audience.`,
    wikipediaTitle: 'Hellbrunn_Palace',
    openingHours: {
      schedule: 'Apr–Oct: Daily 09:00–17:30 · Jul–Aug: until 21:00',
      note: 'Closed November–March',
      admission: '€15 adults · €7 children (includes trick fountains & zoo)',
    },
    year: '1769',
    points: 50,
    order: 12,
  },
]

export const TOTAL_LOCATIONS = LOCATIONS.length
export const UNLOCK_RADIUS_M = 50
