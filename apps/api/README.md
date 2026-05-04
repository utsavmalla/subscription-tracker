# Subscription Tracker API

NestJS backend API for the Subscription Tracker app.

## Role

This app owns server-side behavior:

- Subscription CRUD endpoints
- Dashboard summary endpoints
- Status and alert calculation
- CSV import and export
- Daily reminder/status refresh jobs
- PostgreSQL persistence through Prisma

## Tech Stack

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Jest
- ESLint

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create the API environment file:

```bash
copy apps\api\.env.example apps\api\.env
```

On macOS or Linux:

```bash
cp apps/api/.env.example apps/api/.env
```

## Environment Variables

```text
PORT=3001
DATABASE_URL=postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/subscription_tracker?sslmode=require
DIRECT_URL=postgresql://USER:PASSWORD@HOST.REGION.aws.neon.tech/subscription_tracker?sslmode=require
```

- `DATABASE_URL` is the runtime database URL. Use the Neon pooled connection string for app traffic.
- `DIRECT_URL` is the direct database URL. Use the Neon direct connection string for Prisma migrations and admin commands.

`apps/api/prisma.config.ts` uses `DIRECT_URL` first and falls back to `DATABASE_URL`. This keeps migration commands on the direct Neon connection while allowing the application runtime to use the pooled Neon connection.

## Commands

From the repository root:

```bash
npm run dev:api
npm run build:api
npm run lint:api
npm run test
```

From `apps/api`:

```bash
npm run start:dev
npm run build
npm run lint
npm run test
```

## Local Development

Start the API:

```bash
npm run dev:api
```

Default URL:

```text
http://localhost:3001
```

The generated starter currently returns `Hello World!` from the root controller. Subscription modules and API routes will be added in later milestones.

## Current Data Flow

Neon Postgres is configured and the initial Prisma migration has been applied. The database contains the subscription and reminder tables, but the API does not expose subscription CRUD routes yet.

The frontend currently still uses temporary mock data from `apps/web/src/data/subscriptions.ts`. End-to-end verification with real database records will start after the Milestone 9 backend endpoints are implemented and the frontend switches to API-backed data.

## Prisma

Prisma files are located here:

```text
apps/api/prisma/schema.prisma
apps/api/prisma.config.ts
```

Useful Prisma commands, run from `apps/api`:

```bash
npx prisma validate
npx prisma migrate deploy
npx prisma migrate status
npx prisma generate
```

The initial migration is already present under `prisma/migrations` and has been applied to the configured Neon database.

## Important Files

- `src/main.ts`: Nest app bootstrap
- `src/app.module.ts`: Root Nest module
- `src/app.controller.ts`: Starter controller
- `src/app.service.ts`: Starter service
- `prisma/schema.prisma`: Prisma schema
- `prisma.config.ts`: Prisma CLI config

## Planned Modules

- `subscriptions`
- `dashboard`
- `imports`
- `reminders`

These planned modules come from the MVP specification in `md/spec_subscription_tracker_mvp.md`.
