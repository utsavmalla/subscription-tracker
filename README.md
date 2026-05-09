# Subscription Tracker

Subscription Tracker is a full-stack web app for managing recurring and one-time subscriptions. It helps users track renewal dates, expired access, overdue payments, upcoming reminders, and subscription spending without relying on a spreadsheet.

The app is built as a TypeScript npm workspace. The active application lives in `apps/web`.

## What The App Does

- Tracks recurring and one-time subscriptions.
- Shows dashboard metrics for total, active, upcoming, overdue, and expired subscriptions.
- Supports create, edit, delete, list, search, filter, and sort workflows.
- Calculates subscription status from renewal and expiration dates.
- Supports Supabase email magic-link sign-in.
- Supports guest mode through Supabase anonymous users with a 10-subscription cap.
- Stores user-owned records in Supabase Postgres through Prisma.

CSV import/export and production scheduled reminders are planned milestones and are not fully complete yet.

## Repository Structure

```text
subscription-tracker/
  apps/
    web/                  Next.js App Router frontend and backend layer
      prisma/             Prisma schema and migrations
      src/
        actions/          Server Actions for form mutations
        app/              Routes, layouts, API route handlers
        components/       Dashboard, layout, subscription, and UI components
        data/             Temporary/static UI data
        lib/              App-local contracts and shared helpers
        server/           Server-only auth, Prisma, and feature services
  design/                 Static design drafts and wireframes
  md/
    agent/                Agent handbook and repository structure docs
    plan/                 Implementation and deployment planning notes
    specs/                Product, architecture, and UI specifications
```

## Tech Stack

- Next.js App Router 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7
- Supabase Auth
- Supabase Postgres
- npm workspaces
- Vercel deployment target

## Requirements

- Node.js 20 or newer
- npm
- Supabase project with Auth and Postgres enabled
- PostgreSQL connection strings from Supabase for Prisma runtime and migrations

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create local environment files:

```bash
copy .env.example .env
copy apps\web\.env.example apps\web\.env
```

On macOS or Linux:

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env
```

Update both environment files with your Supabase values.

## Environment Variables

Required values:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
DIRECT_URL
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` are browser-safe public values.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it with a `NEXT_PUBLIC_` prefix.
- `DATABASE_URL` is used by the running app. Use Supabase transaction pooling for serverless runtime traffic.
- `DIRECT_URL` is used by Prisma migrations and validation. Use the Supabase session pooler or a direct database connection.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is still supported for older Supabase projects that have not moved to publishable keys.

Prisma CLI commands load `.env`, `apps/web/.env`, and `apps/web/.env.local` when present.

## Supabase Auth Setup

Configure these settings in Supabase before testing auth flows:

- Enable email magic links.
- Enable Anonymous Sign-Ins for guest mode.
- Enable manual identity linking if guests should upgrade by adding an email.
- Add the local callback URL:

```text
http://localhost:3000/auth/callback
```

- Add the production callback URL before deployment:

```text
https://YOUR_DOMAIN/auth/callback
```

## Common Commands

Run the web app locally:

```bash
npm run dev:web
```

Build the web app:

```bash
npm run build:web
```

Lint the web app:

```bash
npm run lint:web
```

Run the default project check:

```bash
npm run test
```

Validate the Prisma schema:

```bash
npm run prisma:validate
```

Deploy Prisma migrations:

```bash
npm run prisma:migrate:deploy
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

Important local routes:

- `/` - dashboard
- `/login` - magic-link and guest login
- `/subscriptions` - subscription list
- `/subscriptions/new` - create subscription
- `/subscriptions/[id]` - subscription detail
- `/subscriptions/[id]/edit` - edit subscription

## Deployment

Deploy `apps/web` as the Vercel project root.

Use these Vercel settings:

```text
Framework Preset: Next.js
Root Directory: apps/web
Build Command: npm run build
Development Command: npm run dev
```

Set the production environment variables listed above in Vercel. Use the Supabase transaction pooler for `DATABASE_URL` and the session pooler or direct connection for `DIRECT_URL`.

Before the first production smoke test:

1. Configure the production Supabase Auth callback URL.
2. Run `npm run prisma:validate`.
3. Run `npm run prisma:migrate:deploy` with the production `DIRECT_URL`.

The `/api/reminders/refresh` endpoint is session-user protected and should not be connected to production cron until the scheduled-job milestone is complete.

## Documentation

- `apps/web/README.md` - web app quickstart
- `apps/web/doc/TECHNICAL_GUIDE.md` - technical guide for setup, stack, architecture, and flows
- `apps/web/doc/PRISMA_GUIDE.md` - focused guide to Prisma usage in this project
- `md/agent/README.md` - agent handbook and documentation map
- `md/agent/project_structure.md` - repository layout and file placement rules
- `md/plan/deployment_notes_subscription_tracker.md` - deployment notes and known issues
- `md/plan/todos_subscription_tracker.md` - implementation checklist
- `md/specs/spec_subscription_tracker_mvp.md` - product and architecture specification
- `md/specs/ui_layout_subscription_tracker.md` - UI layout reference
- `md/specs/figma_draft_subscription_tracker.md` - Figma/design draft reference

## Current Status

The app currently includes the dashboard, subscription management pages, Prisma-backed Supabase data access, Supabase Auth, email magic links, and capped guest mode.

Remaining planned work includes CSV workflows, alert UI polish, scheduled status refresh, and optional external notifications.
