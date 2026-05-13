# Mozart's Trail

A GPS-gated walking treasure hunt through Mozart's real locations in Salzburg. Walk to a site, unlock its story, answer a quiz, collect a digital item.

## What it does

1. **Map** — 12 real Mozart locations plotted on an interactive Salzburg map
2. **GPS unlock** — walk within 50 m of a location to unlock it (Browser Geolocation API)
3. **Story page** — rich historical narrative + hero image fetched from Wikipedia
4. **Address** — live reverse-geocoded from Nominatim (OpenStreetMap)
5. **Walking directions** — route from your position to any location via OpenRouteService
6. **Desktop browse mode** — click any marker to read stories without GPS
7. **Responsive navigation** — top nav on desktop, bottom tab bar on mobile

## Tech stack

| Layer    | Technology                                                       |
| -------- | ---------------------------------------------------------------- |
| Frontend | React 19, TypeScript, Rspack, Mantine UI v9                      |
| Routing  | React Router v7                                                  |
| Map      | Leaflet + react-leaflet, ESRI World Topo tiles                   |
| Fonts    | Noto Serif (headlines), Manrope (body)                           |
| Backend  | Node.js, Express, TypeScript                                     |
| Database | PostgreSQL (`pg` driver)                                         |
| APIs     | Browser Geolocation, Nominatim, Wikipedia REST, OpenRouteService |

## Project structure

```
wp26_mozart_trail/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppHeader.tsx        # Top nav (desktop) + back button
│   │   │   ├── BottomNav.tsx        # Tab bar (mobile only)
│   │   │   ├── MapView.tsx          # Leaflet map + markers + route layer
│   │   │   ├── ProgressCard.tsx     # X/12 locations card overlay
│   │   │   ├── UserLocationMarker.tsx # Pulsing blue GPS dot
│   │   │   └── LocationDetailDrawer.tsx # Directions drawer
│   │   ├── data/
│   │   │   └── locations.ts         # All 12 Mozart locations with stories
│   │   ├── lib/
│   │   │   ├── geo.ts               # Haversine distance + geofencing
│   │   │   └── ors.ts               # OpenRouteService directions client
│   │   ├── pages/
│   │   │   ├── HuntPage.tsx         # Main map screen
│   │   │   ├── LocationDetailPage.tsx # Story + quiz page
│   │   │   ├── TreasuresPage.tsx    # Collectibles (coming soon)
│   │   │   └── JourneyPage.tsx      # Progress log (coming soon)
│   │   └── theme.ts                 # Design tokens (colors + fonts)
│   └── .env.example
├── backend/
│   └── src/
│       ├── server.ts                # Express app
│       └── db.ts                   # PostgreSQL pool
└── package.json                     # Root dev scripts
```

## Quick start

### 1. Install dependencies

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Configure environment variables

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Edit `frontend/.env`:

```bash
API_BASE_URL=http://localhost:4000

# Optional — enables walking directions on the map
# Get a free key at https://openrouteservice.org/dev/#/signup
ORS_API_KEY=
```

Edit `backend/.env`:

```bash
PORT=4000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mozart
```

### 3. Run

```bash
npm run dev
```

- Frontend → http://localhost:5173
- Backend → http://localhost:4000

## Available scripts

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start frontend + backend together |
| `npm run dev:frontend` | Frontend only                     |
| `npm run dev:backend`  | Backend only                      |
| `npm run build`        | Build both for production         |

## Design system

| Token         | Value                |
| ------------- | -------------------- |
| Primary       | `#8B0000` (deep red) |
| Secondary     | `#D4AF37` (gold)     |
| Tertiary      | `#5D4037` (brown)    |
| Neutral       | `#F5F5DC` (beige)    |
| Headline font | Noto Serif           |
| Body font     | Manrope              |

## The 12 locations

| #   | Name                   | Category                |
| --- | ---------------------- | ----------------------- |
| 1   | Mozart's Birthplace    | Historical Landmark     |
| 2   | Salzburg Cathedral     | Cathedral               |
| 3   | Mozart Residence       | Historical Residence    |
| 4   | Mirabell Gardens       | Palace & Gardens        |
| 5   | Residenz Palace        | Archbishop's Palace     |
| 6   | St. Peter's Abbey      | Monastery               |
| 7   | Collegiate Church      | University Church       |
| 8   | Mozarteum              | University & Foundation |
| 9   | St. Sebastian Cemetery | Historic Cemetery       |
| 10  | Hohensalzburg Fortress | Medieval Fortress       |
| 11  | Nonnberg Abbey         | Benedictine Abbey       |
| 12  | Hellbrunn Palace       | Pleasure Palace         |

## API routes (backend)

| Method | Path          | Description              |
| ------ | ------------- | ------------------------ |
| GET    | `/api/health` | Service health check     |
| GET    | `/api/db`     | Database connection test |
