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

## Prerequisites

- Node `24.15.0`
- `pnpm` via Corepack
- Docker Desktop
- Context7 already installed and configured

If you use `mise`, this repo now pins Node in `.mise.toml`:

```bash
mise install
mise use -p node@24.15.0
```

Enable `pnpm` if needed:

```bash
corepack enable
corepack prepare pnpm@11.1.2 --activate
```

If you previously installed dependencies under a different Node version, reinstall them after switching so Vite and Tailwind native packages are rebuilt consistently.

## Install

1. Install dependencies:

```bash
CI=true pnpm install --no-frozen-lockfile
pnpm approve-builds --all
```

2. Copy environment variables if you want a clean local file:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
pnpm db:generate
```

## Run With Docker

This is the fastest way to start everything:

```bash
docker compose up --build
```

Services:

- Web: [http://localhost:8080](http://localhost:8080)
- API: [http://localhost:4000/api/health](http://localhost:4000/api/health)
- PostgreSQL: `localhost:5432`

## Run Locally

1. Start PostgreSQL. The easiest option is to run only the database from Compose:

```bash
docker compose up -d db
```

2. Apply the migration and seed demo data:

```bash
pnpm --filter @appointment/api exec prisma migrate deploy
pnpm db:seed
```

3. Start both apps:

```bash
pnpm dev
```

Or run them separately:

```bash
pnpm dev:api
pnpm dev:web
```

Local endpoints:

- Web: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:4000/api/health](http://localhost:4000/api/health)

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
