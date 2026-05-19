# Appointment Booking System

Full-stack appointment booking system built as a `pnpm` workspace with:

- `apps/web`: React + Vite + TypeScript + Tailwind CSS
- `apps/api`: Fastify + TypeScript + Prisma ORM
- `packages/shared`: shared API contracts and validation schemas
- PostgreSQL for persistence
- Docker + Compose for local full-stack runs

## Features

- Branch discovery with map view and geocoded location search
- Real appointment availability loaded from the API
- Transactional booking flow that prevents double-booking
- Confirmation step with appointment summary and follow-up actions
- Shared request and response contracts between frontend and backend

## Workspace Layout

```text
.
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   └── src/
│   └── web/
│       └── src/
├── packages/
│   └── shared/
├── compose.yaml
├── Dockerfile
└── pnpm-workspace.yaml
```

## Quick Start

Choose one path:

- Use Docker if you want the fastest first run.
- Use local development if you want the best day-to-day editing workflow.

## Fastest First Run

This path only needs Docker Desktop.

1. Start the full stack:

```bash
docker compose up --build -d
```

2. Seed demo branches and slots:

```bash
docker compose exec -T api sh -lc 'cd /app/apps/api && ./node_modules/.bin/tsx prisma/seed.ts'
```

3. Open the app:

- Web: [http://localhost:8080](http://localhost:8080)
- API health: [http://localhost:4000/api/health](http://localhost:4000/api/health)

If the app shows no branches, run the seed command again. The demo data lives in the database volume used by Docker.

## Local Development

Use this path if you want to work on the code locally.

### Prerequisites

- Node `24.15.0`
- `pnpm` via Corepack
- Docker Desktop for PostgreSQL

Use any Node manager you like:

```bash
nvm install 24.15.0
nvm use 24.15.0
```

If you use `mise`, this repo also includes `.mise.toml`:

```bash
mise install
mise use -p node@24.15.0
```

Enable `pnpm`:

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
```

### Setup

1. Create a local environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
CI=true pnpm install --no-frozen-lockfile
```

3. Start only the database:

```bash
docker compose up -d db
```

4. Generate Prisma client, apply the migration, and seed demo data:

```bash
pnpm db:generate
pnpm db:deploy
pnpm db:seed
```

5. Start the API and web app:

```bash
pnpm dev
```

Open:

- Web: [http://localhost:5173](http://localhost:5173)
- API health: [http://localhost:4000/api/health](http://localhost:4000/api/health)

If you prefer to run the apps separately:

```bash
pnpm dev:api
pnpm dev:web
```

## API Endpoints

- `GET /api/health`
- `GET /api/branches?latitude=-26.2041&longitude=28.0473`
- `GET /api/branches/:branchId/availability?month=2026-05`
- `POST /api/bookings`
- `GET /api/bookings/:confirmationCode`

Example booking payload:

```json
{
  "slotId": "clx123slot",
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "0821234567",
  "purposeOfVisit": "account-support",
  "additionalNotes": "Needs wheelchair access"
}
```

## Testing

Run the workspace test suite:

```bash
pnpm test
```
