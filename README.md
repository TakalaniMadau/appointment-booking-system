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
- Simulated confirmation email via an outbox table
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
docker compose exec -T api node --import tsx apps/api/prisma/seed.ts
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

## Helpful Notes

- You do not need `mise` to run this project.
- Docker is the quickest way to get started after a fresh clone.
- The UI will look empty until the database has been seeded.
- If you switch Node versions after installing dependencies, reinstall them so native packages like Vite and Tailwind line up with your active Node version.

## Scripts

- `pnpm dev`: run API and web in parallel
- `pnpm build`: build all workspace packages
- `pnpm typecheck`: run TypeScript checks across the workspace
- `pnpm test`: run shared, API, and web tests
- `pnpm db:generate`: generate Prisma client
- `pnpm db:migrate`: create a local development migration
- `pnpm db:seed`: seed branches, business hours, closures, and slots
- `pnpm docker:up`: build and run the Compose stack
- `pnpm docker:down`: stop the Compose stack

## Database Model

Core tables:

- `Branch`
- `BranchBusinessHour`
- `BranchClosure`
- `AppointmentSlot`
- `Customer`
- `Booking`
- `EmailOutbox`

Important constraints:

- Unique slot per branch start time: `AppointmentSlot(branchId, startsAt)`
- Unique booking per slot: `Booking(slotId)`
- Customer email uniqueness for repeat booking updates

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

Current coverage includes:

- Shared contract validation
- API date-window utility coverage
- Frontend availability helper coverage

## Notes

- The frontend keeps the map-driven branch selection UX and now uses internal API data instead of the prototype-only external branch feed.
- Confirmation emails are simulated by writing to `EmailOutbox` and marking the message as sent after booking creation.
- All seeded branches currently use `Africa/Johannesburg`, which keeps time handling consistent for the South African branch set used in this project.
