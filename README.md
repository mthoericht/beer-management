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

- Frontend: http://localhost:5174
- Backend API: http://localhost:5001/api

## Scripts

```bash
npm run dev              # Frontend + backend concurrently
npm run client           # Frontend only
npm run server           # Backend only
npm run build            # Production build (frontend)
npm run start-db         # Start MongoDB + backend
npm run stop-db          # Stop MongoDB + backend
npm run status           # Show DB/backend status
npm run stop-servers     # Kill all running servers
```

## Testing

Tests use **Vitest** (unit) and **Playwright** (API + E2E).

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (unit + API + integration) |
| `npm run test:unit` | Unit tests only (no server needed) |
| `npm run test:unit:watch` | Unit tests in watch mode |
| `npm run test:api` | API tests (requires backend on port 5001) |
| `npm run test:integration` | E2E tests (requires backend + frontend) |
| `npm run test:ui` | Playwright interactive UI |
| `npm run test:report` | Show last test report |

**Structure:**
- `tests/unit/` – Vitest: pure logic (BeerStatsHelper, beerSchemas validation)
- `tests/api/` – Playwright: REST API against running backend
- `tests/integration/` – Playwright: E2E UI flows

**Prerequisites:** API tests need `npm run start-db`; integration tests need `npm run start-db` and `npm run client`.

## API

| Method   | Endpoint           | Description       |
|----------|--------------------|--------------------|
| `GET`    | `/api/beers`       | List all beers     |
| `GET`    | `/api/beers/:id`   | Get one beer       |
| `POST`   | `/api/beers`       | Create a beer      |
| `PUT`    | `/api/beers/:id`   | Update a beer      |
| `DELETE` | `/api/beers/:id`   | Delete a beer      |
| `GET`    | `/api/health`      | Health check       |

## Project Structure

```
frontend/src/
├── components/
│   ├── ui/              # Reusable UI primitives (Button, Card, Dialog, etc.)
│   ├── BeerList.vue     # Beer card grid with actions
│   ├── BeerForm.vue     # Add/edit form
│   ├── BeerStats.vue    # Statistics dashboard
│   └── LoadingSpinner.vue
├── services/            # API layer (BeerManager)
├── styles/              # Design tokens (theme.css)
├── types/               # TypeScript interfaces
├── utils/               # Shared utilities (fieldClasses, beerStatsHelper)
└── App.vue

backend/src/
├── routes/              # Express route handlers
├── models/              # Mongoose schemas
└── server.ts
```

### Design System

The UI derives from a Figma preset (`Figma-preset/`). Theming uses CSS custom properties in `frontend/src/styles/theme.css`, mapped to Tailwind in `frontend/tailwind.config.js`. Shared form field styles live in `frontend/src/utils/fieldClasses.ts`.

## License

MIT
