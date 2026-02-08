# Beer Management

A beer tracking app built with Vue.js 3, TypeScript, Tailwind CSS, Express, and MongoDB.

## Features

- Add, edit, and delete beers (name, brewery, style, ABV, notes)
- 1–5 star ratings
- Mark as drank / to try
- Search, filter, and sort
- Statistics dashboard (top styles, breweries, highest rated)

## Tech Stack

| Layer    | Stack                                                  |
|----------|--------------------------------------------------------|
| Frontend | Vue 3 (Composition API), TypeScript, Vite, Tailwind 3  |
| Backend  | Node.js, Express, TypeScript                           |
| Database | MongoDB, Mongoose                                      |

## Prerequisites

- Node.js v18+
- MongoDB (local)

## Quick Start

```bash
npm run install-all          # Install all dependencies
cp backend/env.example backend/.env  # Configure MONGODB_URI + PORT
npm run dev                  # Start frontend + backend concurrently
```

**Environment** (`backend/.env`): `MONGODB_URI` (required, e.g. `mongodb://localhost:27017/beer-management`), `PORT` (optional, default 5001).

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- API Health: http://localhost:5001/api/health

## Scripts

```bash
npm run dev              # Frontend + backend concurrently
npm run client           # Frontend only
npm run server           # Backend only
npm run build            # Production build (frontend)
npm run start-db         # Start MongoDB + backend
npm run stop-db          # Stop MongoDB + backend
npm run restart-db       # Restart MongoDB + backend
npm run status           # Show DB/backend + API health status
npm run stop-servers     # Kill all running servers
```

## Testing

Tests use **Vitest** (unit) and **Playwright** (integration + E2E).

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (unit + integration + E2E) |
| `npm run test:unit` | Unit tests only (no server needed) |
| `npm run test:unit:watch` | Unit tests in watch mode |
| `npm run test:integration` | API integration tests (requires backend on port 5001) |
| `npm run test:e2e` | E2E browser tests (requires backend + frontend) |
| `npm run test:ui` | Playwright interactive UI |
| `npm run test:report` | Show last test report |

**Structure:**
- `tests/unit/` – Vitest: pure logic (BeerStatsHelper, beerSchemas, api, validationMiddleware)
- `tests/integration/` – Playwright: REST API against running backend
- `tests/e2e/` – Playwright: E2E UI flows

**Prerequisites:** Integration tests need `npm run start-db`; E2E tests need `npm run start-db` and `npm run client`.

## API

| Method   | Endpoint           | Description       |
|----------|--------------------|--------------------|
| `GET`    | `/api/beers`       | List all beers     |
| `GET`    | `/api/beers/stats` | Beer statistics (see below) |
| `GET`    | `/api/beers/:id`   | Get one beer       |
| `POST`   | `/api/beers`       | Create a beer      |
| `PUT`    | `/api/beers/:id`   | Update a beer      |
| `DELETE` | `/api/beers/:id`   | Delete a beer      |
| `GET`    | `/api/health`      | Health check       |

**Success response** format:

```json
{
  "success": true,
  "data": [],
  "message": "Beer created successfully"
}
```

`data` contains the beer(s) or stats; `message` is optional.

### Routing

Routes are defined in `backend/src/routes/beerRoutes.ts`, mounted at `/api/beers` in `server.ts`.

| Route | Method | Validation | Handler |
|-------|--------|------------|---------|
| `/` | GET | — | `getAllBeers` |
| `/stats` | GET | — | `getBeerStats` |
| `/:id` | GET | `beerIdParamsSchema` | `getBeerById` |
| `/` | POST | `beerInputSchema` | `createBeer` |
| `/:id` | PUT | `beerIdParamsSchema` + `beerUpdateSchema` | `updateBeer` |
| `/:id` | DELETE | `beerIdParamsSchema` | `deleteBeer` |

**Note:** `/stats` must be defined before `/:id` to avoid "stats" being matched as an ID.

**Stats response** (`GET /api/beers/stats`):

```json
{
  "success": true,
  "data": {
    "totalBeers": 10,
    "drankBeers": 5,
    "pendingBeers": 5,
    "ratedBeers": 8,
    "averageRating": 4.2,
    "topStyle": { "style": "IPA", "count": 4 },
    "topBrewery": { "brewery": "Test Brewery", "count": 3 }
  }
}
```

`topStyle` and `topBrewery` are omitted when no data exists.

### Schemas

Validation uses **Zod** (`backend/src/validators/beerSchemas.ts`). Middleware: `validateBody`, `validateParams`, `validateQuery`.

| Schema | Used for | Description |
|--------|----------|-------------|
| `beerInputSchema` | POST `/api/beers` | Full beer payload |
| `beerUpdateSchema` | PUT `/api/beers/:id` | Partial (all fields optional) |
| `beerIdParamsSchema` | GET/PUT/DELETE `/:id` | MongoDB ObjectId (24 hex chars) |

**Beer fields:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | ✓ | 1–100 chars, trimmed |
| brewery | string | ✓ | 1–100 chars, trimmed |
| style | string | ✓ | 1–100 chars, trimmed |
| abv | number | ✓ | 0–100 |
| rating | number | — | 1–5, nullable |
| notes | string | — | max 500 chars, default "" |
| drank | boolean | — | default false |

**Error response** on validation failure:

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "name: Name is required",
  "details": [{ "path": ["name"], "message": "Name is required" }]
}
```

**Example:**

```bash
curl -X POST http://localhost:5001/api/beers \
  -H "Content-Type: application/json" \
  -d '{"name":"IPA","brewery":"Test","style":"IPA","abv":6.5}'
```

## Project Structure

```
frontend/src/
├── components/
│   ├── beer/            # Beer feature components (BeerList, BeerForm, BeerStats, BeerCard, etc.)
│   ├── icons/           # SVG icons (BeerIcon, SearchIcon, StarIcon)
│   ├── layout/          # Layout components (AppHeader)
│   ├── ui/               # Reusable UI primitives (Button, Card, Dialog, Input, etc.)
│   └── LoadingSpinner.vue
├── services/             # API layer (BeerManager)
├── styles/               # Design tokens (theme.css)
├── types/                # TypeScript interfaces
├── utils/                # Shared utilities (api, fieldClasses, beerStatsHelper)
└── App.vue

backend/src/
├── controllers/          # Request handlers
├── middleware/           # Validation middleware
├── models/               # Mongoose schemas
├── routes/               # Express route handlers
├── types/                # TypeScript types
├── validators/           # Zod schemas
└── server.ts
```

### Design System

The UI derives from a Figma preset (`Figma-preset/`). Theming uses CSS custom properties in `frontend/src/styles/theme.css`, mapped to Tailwind in `frontend/tailwind.config.js`. Shared form field styles live in `frontend/src/utils/fieldClasses.ts`.

## License

MIT
