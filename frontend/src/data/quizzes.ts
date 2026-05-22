export interface QuizQuestion {
  id: string
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
}

export interface LocationQuiz {
  locationId: string
  questions: QuizQuestion[]
}

export const QUIZZES: LocationQuiz[] = [
  {
    locationId: 'birthplace',
    questions: [
      {
        id: 'birthplace-1',
        question: 'In which year was Wolfgang Amadeus Mozart born in this house?',
        options: ['1756', '1770', '1791', '1685'],
        correctIndex: 0,
        explanation: 'Mozart was born on 27 January 1756 at Getreidegasse 9.',
      },
      {
        id: 'birthplace-2',
        question: 'How long did the Mozart family live in the birthplace apartment?',
        options: ['About 5 years', 'About 17 years', 'About 26 years', 'Their entire lives'],
        correctIndex: 2,
        explanation: 'The family remained here until they moved to the Tanzmeisterhaus in 1773.',
      },
      {
        id: 'birthplace-3',
        question: 'What was remarkable about Mozart’s early relationship with music in this home?',
        options: [
          'He learned to read music before he could read words',
          'He only began composing after age twelve',
          'He was forbidden to touch keyboard instruments',
          'He studied exclusively with visiting Italian masters',
        ],
        correctIndex: 0,
        explanation: 'Leopold’s teaching studio in the apartment nurtured his extraordinary early development.',
      },
    ],
  },
  {
    locationId: 'cathedral',
    questions: [
      {
        id: 'cathedral-1',
        question: 'When was Mozart baptized in Salzburg Cathedral?',
        options: [
          'The day after his birth',
          'On his first birthday',
          'When he turned five',
          'Only after he left for Vienna',
        ],
        correctIndex: 0,
        explanation: 'He was baptized on 28 January 1756, one day after his birth.',
      },
      {
        id: 'cathedral-2',
        question: 'Which role did Mozart hold at the cathedral from 1779 to 1781?',
        options: ['Court organist', 'Cathedral architect', 'Choir director for life', 'Archbishop’s secretary'],
        correctIndex: 0,
        explanation: 'He played the Baroque organ for masses and feast days during this period.',
      },
      {
        id: 'cathedral-3',
        question: 'What did Mozart’s refusal to return to Salzburg help him become?',
        options: [
          'One of the first major freelance composers',
          'A full-time cathedral stonemason',
          'Archbishop of Salzburg',
          'A silent monastery librarian',
        ],
        correctIndex: 0,
        explanation: 'Leaving court employment in 1781 freed him to build an independent career in Vienna.',
      },
    ],
  },
  {
    locationId: 'residence',
    questions: [
      {
        id: 'residence-1',
        question: 'When did the Mozart family move to the Tanzmeisterhaus (Mozart Residence)?',
        options: ['1756', '1773', '1781', '1841'],
        correctIndex: 1,
        explanation: 'They moved here in 1773 seeking more space on the other side of the Salzach.',
      },
      {
        id: 'residence-2',
        question: 'Which major work is associated with Mozart’s productive years in this residence?',
        options: [
          'The Requiem (completed here)',
          'Violin concerti and the Haffner Serenade',
          'Only his earliest childhood minuets',
          'The Magic Flute libretto alone',
        ],
        correctIndex: 1,
        explanation: 'He composed violin concerti, the “Jeunehomme” piano concerto, and the Haffner Serenade here.',
      },
      {
        id: 'residence-3',
        question: 'Who died in this apartment in 1787?',
        options: ['Constanze Weber', 'Leopold Mozart', 'Archbishop Colloredo', 'Nannerl Mozart'],
        correctIndex: 1,
        explanation: 'Leopold continued living here after Wolfgang left; he died in this apartment in 1787.',
      },
    ],
  },
  {
    locationId: 'mirabell',
    questions: [
      {
        id: 'mirabell-1',
        question: 'Which room at Mirabell was among the grandest stages for young Mozart’s court performances?',
        options: ['The Marble Hall', 'The fortress armoury', 'The city prison', 'The railway waiting room'],
        correctIndex: 0,
        explanation: 'The Marble Hall remains one of Europe’s most beautiful historic concert spaces.',
      },
      {
        id: 'mirabell-2',
        question: 'What architectural style defines Mirabell Palace and its gardens?',
        options: ['Baroque', 'Brutalist', 'Gothic Revival only', 'Art Deco'],
        correctIndex: 0,
        explanation: 'The palace was redesigned in the Baroque style after its origins in 1606.',
      },
      {
        id: 'mirabell-3',
        question: 'What can visitors still experience in the Marble Hall today?',
        options: [
          'Regular Mozart concerts in historic settings',
          'Only silent film screenings',
          'A permanent rock-music festival',
          'No music performances at all',
        ],
        correctIndex: 0,
        explanation: 'Candlelit concerts with period costume continue a tradition Mozart knew.',
      },
    ],
  },
  {
    locationId: 'residenz',
    questions: [
      {
        id: 'residenz-1',
        question: 'Who was Mozart’s employer when he worked under the Archbishop at the Residenz?',
        options: [
          'The Archbishop of Salzburg',
          'The Emperor of Austria only',
          'The mayor of Vienna',
          'A private merchant guild',
        ],
        correctIndex: 0,
        explanation: 'The Archbishop’s court controlled Mozart’s Salzburg employment for years.',
      },
      {
        id: 'residenz-2',
        question: 'In which year did tensions with Archbishop Colloredo intensify?',
        options: ['1756', '1772', '1841', '1920'],
        correctIndex: 1,
        explanation: 'Colloredo took power in 1772 and treated Mozart increasingly as a servant.',
      },
      {
        id: 'residenz-3',
        question: 'What famously happened when Mozart resigned in Vienna in 1781?',
        options: [
          'Count Arco kicked him out of the room',
          'He was promoted to Archbishop',
          'He was ordered to return to Mirabell forever',
          'He immediately retired from music',
        ],
        correctIndex: 0,
        explanation: 'The dismissal incident became one of music history’s most famous confrontations.',
      },
    ],
  },
  {
    locationId: 'st-peter',
    questions: [
      {
        id: 'st-peter-1',
        question: 'Approximately when was St. Peter’s Abbey founded?',
        options: ['Around 696 AD', 'In 1756 only', 'After Mozart’s death in 1791', 'In the 20th century'],
        correctIndex: 0,
        explanation: 'It is among the oldest continuously operating monasteries in the world.',
      },
      {
        id: 'st-peter-2',
        question: 'Which major work premiered at the abbey church in October 1783?',
        options: [
          'Mass in C Minor',
          'The Magic Flute',
          'Eine kleine Nachtmusik only',
          'The Salzburg football anthem',
        ],
        correctIndex: 0,
        explanation: 'Mozart composed this mass after marrying Constanze, against Leopold’s wishes.',
      },
      {
        id: 'st-peter-3',
        question: 'Who sang the demanding soprano solos at that premiere?',
        options: ['Constanze Mozart', 'Archbishop Colloredo', 'Leopold Mozart', 'A visiting Italian castrato only'],
        correctIndex: 0,
        explanation: 'Constanze performed the soprano part while Mozart conducted.',
      },
    ],
  },
  {
    locationId: 'kollegienkirche',
    questions: [
      {
        id: 'kollegienkirche-1',
        question: 'Who designed the Collegiate Church completed in 1707?',
        options: [
          'Johann Bernhard Fischer von Erlach',
          'Wolfgang Amadeus Mozart',
          'Archbishop Markus Sittikus only',
          'An unknown medieval mason with no records',
        ],
        correctIndex: 0,
        explanation: 'Fischer von Erlach created one of Austria’s finest Baroque church designs.',
      },
      {
        id: 'kollegienkirche-2',
        question: 'What did witnesses say about Mozart’s organ improvisations here?',
        options: [
          'He played for hours with complex spontaneous counterpoint',
          'He refused ever to touch the organ',
          'He only played one note repeatedly',
          'He performed exclusively on trumpet',
        ],
        correctIndex: 0,
        explanation: 'His improvisations on Salzburg’s fine organ became legendary.',
      },
      {
        id: 'kollegienkirche-3',
        question: 'For whose feast days were several Mozart masses premiered in this church?',
        options: [
          'Salzburg University',
          'The Hellbrunn zookeepers',
          'Vienna opera tourists only',
          'No institutional patron',
        ],
        correctIndex: 0,
        explanation: 'The university church hosted masses for University feast days.',
      },
    ],
  },
  {
    locationId: 'mozarteum',
    questions: [
      {
        id: 'mozarteum-1',
        question: 'When was the Mozarteum foundation established as a music school?',
        options: ['1841', '1756', '1077', '1781'],
        correctIndex: 0,
        explanation: 'Founded in 1841, it later grew into a major university of the arts.',
      },
      {
        id: 'mozarteum-2',
        question: 'What notable structure stands in the Mozarteum garden?',
        options: [
          'The Magic Flute House cottage',
          'Mozart’s birthplace apartment',
          'The Hellbrunn trick fountains',
          'Hohensalzburg’s main gate',
        ],
        correctIndex: 0,
        explanation: 'Mozart worked on Die Zauberflöte in this small wooden cottage.',
      },
      {
        id: 'mozarteum-3',
        question: 'What does the Mozarteum archive hold?',
        options: [
          'The world’s largest Mozart manuscript and instrument collection',
          'Only modern jazz recordings',
          'Salzburg city tax records exclusively',
          'No musical materials at all',
        ],
        correctIndex: 0,
        explanation: 'Its archives are a global center for Mozart scholarship.',
      },
    ],
  },
  {
    locationId: 'st-sebastian',
    questions: [
      {
        id: 'st-sebastian-1',
        question: 'Who among Mozart’s close family is buried in this cemetery?',
        options: [
          'Leopold Mozart',
          'Wolfgang Mozart (main grave here)',
          'Archbishop Colloredo',
          'No one connected to Mozart',
        ],
        correctIndex: 0,
        explanation: 'Leopold Mozart is buried here, along with members of Constanze’s family.',
      },
      {
        id: 'st-sebastian-2',
        question: 'What architectural feature marks the Gabriel Chapel at the cemetery center?',
        options: [
          'An elaborate tiled dome',
          'A glass skyscraper spire',
          'A modern steel suspension bridge',
          'An open-air swimming pool',
        ],
        correctIndex: 0,
        explanation: 'The chapel was commissioned as a family mausoleum by Archbishop Wolf Dietrich.',
      },
      {
        id: 'st-sebastian-3',
        question: 'What theme did cemetery visits reinforce for the young Mozart?',
        options: [
          'A regular reckoning with mortality',
          'Complete rejection of all music',
          'Exclusive study of fortress warfare',
          'Permanent residence in the abbey',
        ],
        correctIndex: 0,
        explanation: 'Leopold’s Catholic faith made these visits part of Mozart’s Salzburg upbringing.',
      },
    ],
  },
  {
    locationId: 'fortress',
    questions: [
      {
        id: 'fortress-1',
        question: 'When was Hohensalzburg Fortress first built?',
        options: ['1077', '1756', '1841', '2001'],
        correctIndex: 0,
        explanation: 'Construction began in 1077 and expanded over six centuries.',
      },
      {
        id: 'fortress-2',
        question: 'What did the fortress symbolize for Mozart professionally?',
        options: [
          'Archbishop’s absolute authority over the city',
          'His favourite holiday resort',
          'A neutral concert hall with no politics',
          'The home of his freelance Vienna office',
        ],
        correctIndex: 0,
        explanation: 'It embodied the power Mozart resisted throughout his Salzburg career.',
      },
      {
        id: 'fortress-3',
        question: 'What legend is told about Mozart and the fortress?',
        options: [
          'He never once visited it despite living in its shadow',
          'He was its chief military commander',
          'He built the funicular personally',
          'He was married on its highest tower',
        ],
        correctIndex: 0,
        explanation: 'Legend holds he avoided visiting as a small rebellion against what it represented.',
      },
    ],
  },
  {
    locationId: 'nonnberg',
    questions: [
      {
        id: 'nonnberg-1',
        question: 'Approximately when was Nonnberg Abbey founded?',
        options: ['Around 714 AD', '1781 only', 'After World War II', 'In Mozart’s last year only'],
        correctIndex: 0,
        explanation: 'Saint Rupert founded it around 714 AD — among the oldest convents in the region.',
      },
      {
        id: 'nonnberg-2',
        question: 'How old was Mozart when he performed for the Nonnberg community?',
        options: ['About five or six', 'About thirty-five', 'He never performed there', 'Only as an elderly man'],
        correctIndex: 0,
        explanation: 'This was among his earliest documented public performances.',
      },
      {
        id: 'nonnberg-3',
        question: 'How did the nuns’ chronicles describe their reaction to his playing?',
        options: [
          'As one of “divine wonder”',
          'As complete indifference',
          'As formal disapproval only',
          'As a military alarm',
        ],
        correctIndex: 0,
        explanation: 'The community recognized immediately that his gifts were unprecedented.',
      },
    ],
  },
  {
    locationId: 'hellbrunn',
    questions: [
      {
        id: 'hellbrunn-1',
        question: 'Hellbrunn Palace was built primarily as what kind of retreat?',
        options: [
          'A summer pleasure palace for the Archbishop',
          'A fortress against invasion',
          'Mozart’s permanent Vienna home',
          'A modern university campus only',
        ],
        correctIndex: 0,
        explanation: 'Markus Sittikus built it between 1613 and 1619 for summer amusement.',
      },
      {
        id: 'hellbrunn-2',
        question: 'What are the famous trick fountains designed to do?',
        options: [
          'Surprise and soak guests while the host stays dry',
          'Provide drinking water only to monks',
          'Power the cathedral organ',
          'Irrigate farmland exclusively',
        ],
        correctIndex: 0,
        explanation: 'Hidden jets in seats and paths delighted — and drenched — visitors.',
      },
      {
        id: 'hellbrunn-3',
        question: 'Why were young Mozart’s performances at Hellbrunn important for his family?',
        options: [
          'They helped win patrons and social advancement',
          'They ended his musical career',
          'They were secret and unrecorded',
          'They were forbidden by Salzburg law',
        ],
        correctIndex: 0,
        explanation: 'Leopold brought Wolfgang to dazzle aristocratic summer-court guests.',
      },
    ],
  },
]

const quizByLocationId = new Map(QUIZZES.map((q) => [q.locationId, q]))

export function getQuizForLocation(locationId: string): LocationQuiz | undefined {
  return quizByLocationId.get(locationId)
}
