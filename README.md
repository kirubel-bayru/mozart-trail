<<<<<<< HEAD
# Full-Stack Starter (React + Express + PostgreSQL)

Starter template for teams using:

- Frontend: React, TypeScript, React Query, React Router, Mantine UI
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL (`pg`)

## Project structure

```text
.
├── frontend/    # Rspack + React app
├── backend/     # Express API
└── package.json # root scripts to run both apps
```

## Quick start

1. Install dependencies:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

2. Configure environment variables:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

`frontend/.env` uses:

```bash
API_BASE_URL=http://localhost:4000
```

3. Run both apps:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Useful scripts

- `npm run dev` - start frontend and backend together
- `npm run dev:frontend` - start only frontend
- `npm run dev:backend` - start only backend
- `npm run build` - build frontend and backend

## API starter routes

- `GET /api/health` - service health info
- `GET /api/db` - database connection test (`SELECT NOW()`)
=======
## Mozart_Trail

>>>>>>> 8bc8c9b100968fa3e7e5050fef57bd061d8230f4
