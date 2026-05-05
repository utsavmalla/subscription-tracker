# Subscription Tracker

A web app for tracking recurring and one-time subscriptions, renewal dates, overdue items, expiration dates, and CSV-based spreadsheet migration.

The project is organized as a small TypeScript monorepo:

```text
subscription-tracker/
  apps/
    web/      Next.js App Router frontend and backend layer
  md/         Product specs, UI notes, and TODO checklist
  design/     Static design drafts and wireframes
```

## Current Status

The app is now a Prisma-backed Next.js workspace connected to Supabase for database and auth:

- Next.js App Router frontend and backend layer lives in `apps/web`.
- Prisma schema, migrations, and server-only query services are in place for subscriptions and reminder events.
- Supabase Auth is wired through SSR session helpers, email magic links, and `/auth/callback`.
- User-owned records are scoped by the Supabase user id stored in `user_id`.
- Guest mode uses Supabase anonymous users with a 10-subscription cap.
- The previous temporary `SUBSCRIPTION_TRACKER_DEV_USER_ID` owner fallback is no longer part of the runtime setup.

The implementation plan lives in `md/todos_subscription_tracker.md`.

Future agents should start with `AGENTS.md`, then read the nearest app-specific guide before editing.

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL, needed once database models and migrations are added

This repo currently uses npm workspaces.

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create local environment files from the examples:

```bash
copy .env.example .env
copy apps\web\.env.example apps\web\.env
```

On macOS or Linux, use `cp` instead of `copy`.

Configure your Supabase project before running auth flows:

- Enable email magic links.
- Enable Anonymous Sign-Ins if guest mode should be available.
- Enable manual identity linking if guest users should be able to upgrade by adding an email.
- Add `http://localhost:3000/auth/callback` to allowed redirect URLs for local development.
- Add the production `https://YOUR_DOMAIN/auth/callback` redirect URL before deployment.

## Common Commands

Run the frontend:

```bash
npm run dev:web
```

Build the app:

```bash
npm run build
```

Lint the app:

```bash
npm run lint
```

Run checks:

```bash
npm run test
```

## Local URLs

- Web app: `http://localhost:3000`

## Environment Variables

Root `.env.example`:

```text
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PROJECT_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```

The same public values are mirrored in `apps/web/.env.example`. Legacy Supabase anon keys are also supported through `NEXT_PUBLIC_SUPABASE_ANON_KEY` when a project has not moved to publishable keys.

Supabase Auth must have email magic links enabled. To use guest mode, enable Anonymous Sign-Ins; to upgrade guests by email, enable manual identity linking in the Supabase Auth provider settings.

`DATABASE_URL` is used by the running app and should use Supabase transaction pooling for serverless deployments. `DIRECT_URL` is used by Prisma migrations and should use the session pooler or direct connection.

## Project Docs

- `md/agent/project_structure.md`: Repository layout and file placement guide
- `md/specs/spec_subscription_tracker_mvp.md`: Product and architecture specification
- `md/ui_layout_subscription_tracker.md`: UI layout plan
- `md/figma_draft_subscription_tracker.md`: Figma draft plan
- `md/plan/todos_subscription_tracker.md`: Implementation checklist

## Notes

The app is not feature-complete yet. Current work includes the dashboard and subscription management UI, Prisma-backed Supabase data access, and Supabase Auth with email magic links plus capped guest mode. CSV import/export, alerts UI polish, and scheduled status refresh remain pending milestones.
