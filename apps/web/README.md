# Subscription Tracker Web

`apps/web` is the deployable Next.js app for Subscription Tracker. It owns the browser UI and the app-local backend layer for auth, subscriptions, dashboard data, and reminder status refresh.

For the deeper architecture walkthrough, read [`doc/TECHNICAL_GUIDE.md`](./doc/TECHNICAL_GUIDE.md). For a focused explanation of Prisma in this app, read [`doc/PRISMA_GUIDE.md`](./doc/PRISMA_GUIDE.md).

## App Responsibilities

- Dashboard summary and attention panels.
- Subscription list, detail, create, edit, delete, and mark-done flows.
- Search, filter, and sort UI for subscriptions.
- Supabase Auth login, callback handling, and anonymous guest sessions.
- Server Actions for trusted form mutations.
- Route Handlers for dashboard, subscription, CSV import/export, and reminder HTTP boundaries.
- Prisma services for user-scoped Supabase Postgres access.

## Tech Stack

- Next.js App Router 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7
- Supabase Auth
- Supabase Postgres
- ESLint

## Setup

Run setup from the repository root.

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

Fill in the Supabase and database values in both files.

## Environment Variables

Required values:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
SUPABASE_SERVICE_ROLE_KEY
REMINDER_REFRESH_SECRET
DATABASE_URL
DIRECT_URL
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported for older Supabase projects.

Use `DATABASE_URL` for runtime app traffic, preferably through Supabase transaction pooling. Use `DIRECT_URL` for Prisma validation and migrations, preferably through the session pooler or a direct database connection. `REMINDER_REFRESH_SECRET` is server-only and must match the secret configured for the Supabase scheduled Edge Function.

## Supabase Setup

Before running auth flows:

- Enable email magic links.
- Enable Anonymous Sign-Ins for guest mode.
- Enable manual identity linking for guest upgrade.
- Add `http://localhost:3000/auth/callback` to local redirect URLs.
- Add `https://YOUR_DOMAIN/auth/callback` before production smoke testing.

## Commands

From the repository root:

```bash
npm run dev:web
npm run lint:web
npm run build:web
npm run prisma:validate
npm run prisma:migrate:deploy
```

From `apps/web`:

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Local Development

Start the app:

```bash
npm run dev:web
```

Open:

```text
http://localhost:3000
```

Main routes:

- `/` - dashboard
- `/login` - sign-in and guest entry
- `/auth/callback` - Supabase auth callback
- `/subscriptions` - subscription list
- `/subscriptions/new` - create subscription
- `/subscriptions/[id]` - subscription detail
- `/subscriptions/[id]/edit` - edit subscription
- `/import` - CSV import preview and export

## Important Files

- `src/app/page.tsx` - dashboard route entry
- `src/app/login/page.tsx` - login and guest entry UI
- `src/app/auth/callback/route.ts` - Supabase callback handler
- `src/actions/subscriptions.ts` - subscription form mutations
- `src/server/auth/currentUser.ts` - current-user helpers
- `src/server/subscriptions/csv.ts` - CSV import/export parsing and serialization
- `src/server/subscriptions/service.ts` - subscription query and mutation service
- `src/lib/subscriptions/status.ts` - status calculation logic
- `prisma/schema.prisma` - database schema

## Deployment

Deploy this folder as the Vercel project root:

```text
Root Directory: apps/web
Framework Preset: Next.js
Build Command: npm run build
Development Command: npm run dev
```

Set all required environment variables in Vercel. Keep `SUPABASE_SERVICE_ROLE_KEY` and `REMINDER_REFRESH_SECRET` server-only.

The `/api/reminders/refresh` endpoint supports two modes:

- Authenticated app sessions refresh only the current user's subscriptions.
- `Authorization: Bearer <REMINDER_REFRESH_SECRET>` refreshes all users for the scheduled job.

Deploy `supabase/functions/daily-reminder-refresh`, set `APP_REFRESH_URL=https://YOUR_DOMAIN/api/reminders/refresh` and `REMINDER_REFRESH_SECRET` as Supabase Edge Function secrets, then schedule it with Supabase `pg_cron` and `pg_net`. Store the function URL and authorization key in Supabase Vault for the scheduled SQL.
