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
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/subscription_tracker?schema=public
```

`DATABASE_URL` is used by Prisma. The database schema and migrations will be defined in the next milestone.

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

## Prisma

Prisma files are located here:

```text
apps/api/prisma/schema.prisma
apps/api/prisma.config.ts
```

Useful Prisma commands, run from `apps/api`:

```bash
npx prisma format
npx prisma generate
npx prisma migrate dev
```

Migrations should be added after the subscription models are defined.

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

