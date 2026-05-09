# Subscription Tracker Web Technical Guide

This guide explains how the web app is set up, which technologies it uses, and how the main code paths fit together.

For a focused explanation of Prisma, the database client, and the migration commands used by this project, read [`PRISMA_GUIDE.md`](./PRISMA_GUIDE.md).

## Application Summary

Subscription Tracker helps users manage recurring and one-time subscriptions. The current app focuses on:

- Viewing dashboard metrics for total, active, upcoming, overdue, and expired subscriptions.
- Creating, editing, deleting, and viewing subscription records.
- Searching, filtering, and sorting subscription lists.
- Marking subscription alerts as done or reopening them.
- Signing in with Supabase email magic links.
- Trying the app as a Supabase anonymous guest user.
- Isolating all subscription data by Supabase `user_id`.

The app is currently a single deployable Next.js app. It includes both the frontend screens and the backend layer through Server Actions, Route Handlers, and server-only Prisma services.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Next.js App Router 16 | Routes, layouts, Server Components, Server Actions, and Route Handlers |
| React 19 | UI rendering and client components |
| TypeScript | Static typing across app code |
| Tailwind CSS 4 | Styling and responsive layout |
| Prisma 7 | Database schema, migrations, generated client, and typed queries |
| Supabase Auth | Magic-link login, anonymous guest users, and session identity |
| Supabase Postgres | Primary database |
| npm workspaces | Root scripts and app package management |
| Vercel | Intended hosting target for the Next.js app |

## Setup Process

Install dependencies from the repository root:

```bash
npm install
```

Create environment files:

```bash
copy .env.example .env
copy apps\web\.env.example apps\web\.env
```

On macOS or Linux:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env
```

Configure the values:

```text
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PROJECT_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

Use `DATABASE_URL` for runtime app traffic. Use Supabase transaction pooling for this value in serverless deployments.

Use `DIRECT_URL` for Prisma commands. Use the Supabase session pooler or a direct connection for migrations and validation.

Validate Prisma:

```bash
npm run prisma:validate
```

Apply migrations to the configured database:

```bash
npm run prisma:migrate:deploy
```

Start local development:

```bash
npm run dev:web
```

Open:

```text
http://localhost:3000
```

## Supabase Setup

Enable these Supabase Auth settings:

- Email magic links for permanent user sign-in.
- Anonymous Sign-Ins for guest mode.
- Manual identity linking if guest users should upgrade by adding an email.

Add redirect URLs:

```text
http://localhost:3000/auth/callback
https://YOUR_DOMAIN/auth/callback
```

The app uses Supabase sessions as the source of user identity. Feature code should not read auth cookies directly. Use the server helpers in `src/server/auth/currentUser.ts`.

## Database Model

The Prisma schema lives in `prisma/schema.prisma`.

Main models:

- `Subscription` is the primary user-owned record.
- `ReminderEvent` stores reminder records tied to subscriptions.

Important enums:

- `RenewalCycle`: `Monthly`, `Quarterly`, `Yearly`, `OneTime`
- `SubscriptionStatus`: `Active`, `Upcoming`, `DueToday`, `Overdue`, `Expired`, `Completed`
- `AlertState`: `None`, `Upcoming`, `DueToday`, `Overdue`, `Expired`

Ownership is enforced in service queries by filtering with `userId`. The `Subscription` model also has a unique compound key on `id` and `userId`, which allows safe user-scoped updates and deletes.

## Codebase Walkthrough

```text
src/
  actions/        Server Actions used by forms and buttons
  app/            App Router pages, layouts, and API route handlers
  components/     React UI components grouped by feature
  data/           Temporary/static frontend data
  lib/            App-local contracts, domain helpers, Supabase clients
  server/         Server-only auth, database, and feature services
```

Key areas:

- `src/app` contains route entry files. Page files should stay thin and delegate UI composition to components.
- `src/app/api` contains Route Handlers for HTTP-style boundaries.
- `src/actions` contains Server Actions for trusted form mutations.
- `src/components/dashboard` contains dashboard sections and summary panels.
- `src/components/subscriptions` contains list, table, cards, detail, filters, and form UI.
- `src/components/layout` contains the app shell and navigation.
- `src/lib/subscriptions` contains subscription types and status logic used across UI and server code.
- `src/lib/supabase` contains browser, server, proxy, and environment helpers for Supabase.
- `src/server/auth` resolves the current Supabase user for pages, actions, and route handlers.
- `src/server/db/prisma.ts` creates the Prisma client.
- `src/server/subscriptions` contains validation, formatting, and the subscription service layer.

## Main System Flows

### Auth Flow

1. User opens `/login`.
2. User requests an email magic link or starts a guest session.
3. Supabase completes auth and redirects to `/auth/callback`.
4. `src/app/auth/callback/route.ts` exchanges the callback code for a session.
5. Server pages, actions, and route handlers read the current user through `src/server/auth/currentUser.ts`.

Guest mode uses Supabase anonymous users. Guest records are still persisted and scoped by the anonymous Supabase user id.

### Dashboard Flow

1. User opens `/`.
2. `src/app/page.tsx` requires the current user.
3. The page asks `src/server/subscriptions/service.ts` for dashboard data.
4. The service queries Prisma with the current `userId`.
5. The dashboard renders metrics, upcoming renewals, overdue items, recent updates, and preview rows.

### Subscription List Flow

1. User opens `/subscriptions`.
2. The page reads search, filter, and sort options.
3. The subscription service builds a Prisma `where` clause scoped to `userId`.
4. Rows are formatted into UI-friendly `SubscriptionRow` objects.
5. Client components handle interactive filtering and table/card display.

### Create And Edit Flow

1. User opens `/subscriptions/new` or `/subscriptions/[id]/edit`.
2. The form submits to a Server Action in `src/actions/subscriptions.ts`.
3. The Server Action requires the current Supabase user.
4. The service validates input in `src/server/subscriptions/validation.ts`.
5. Status is calculated with `src/lib/subscriptions/status.ts`.
6. Prisma creates or updates the record with the current `userId`.
7. The action redirects or returns an action result for the UI.

### Delete And Mark-Done Flow

1. User triggers delete or mark-done from a subscription UI.
2. The Server Action requires the current user.
3. The service checks the record with `id` and `userId`.
4. Delete removes only the current user's matching record.
5. Mark done updates `done`, recalculates status, and updates `alertState`.

### Status Refresh Flow

1. `/api/reminders/refresh` requires a session user.
2. The route calls the subscription service for the current user.
3. Each subscription status is recalculated.
4. Changed records are updated in Prisma.

This endpoint is not ready for production cron yet because it is session-user protected. Scheduled production refresh is a planned milestone.

## API Boundaries

Current Route Handlers include:

- `GET /api/dashboard`
- `GET /api/subscriptions`
- `GET /api/subscriptions/[id]`
- `POST /api/reminders/refresh`

Server Actions are the current path for create, update, delete, and mark-done mutations in the app UI. Route Handlers are used for HTTP-style reads, status refresh, external calls, or future import/export boundaries.

## Status Logic

Status is calculated from renewal cycle, `done`, next renewal date, and expiration date.

Recurring subscriptions:

- Future renewal outside the attention window: `Active`
- Renewal within the attention window: `Upcoming`
- Renewal today: `DueToday`
- Past renewal with `done = false`: `Overdue`
- Past renewal with `done = true`: `Completed`

One-time subscriptions:

- Future expiration: `Active`
- Expiration today: `DueToday`
- Past expiration: `Expired`

The source of truth for this logic is `src/lib/subscriptions/status.ts`.

## Development Checks

Use the narrowest check that matches the change:

```bash
npm run lint:web
npm run build:web
npm run prisma:validate
```

Run `npm run build:web` after route, import, Prisma, or Next.js config changes. Run `npm run prisma:validate` after schema or migration-related changes.

## Deployment Notes

Deploy `apps/web` as the Vercel project root.

```text
Framework Preset: Next.js
Root Directory: apps/web
Build Command: npm run build
Development Command: npm run dev
```

Required production environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
DIRECT_URL
```

Before testing production sign-in, add the production callback URL in Supabase Auth.

## Current Limits And Planned Work

- CSV import/export is part of the product plan but is not complete.
- Production scheduled refresh is not wired yet.
- `/api/reminders/refresh` should remain protected until the scheduled-job milestone defines the production trigger.
- Alert UI polish and optional email or Slack reminders are later milestones.
- The app currently keeps app-local contracts in `apps/web`; shared packages should only be introduced when another app or package boundary actually needs them.
