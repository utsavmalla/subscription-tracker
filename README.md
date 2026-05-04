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

Milestone 1 is complete:

- Git repository initialized
- Next.js frontend scaffolded in `apps/web`
- Prisma initialized for PostgreSQL
- App-local domain helper modules added under `apps/web`
- Root workspace scripts added
- Environment examples added

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
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
```

The same public values are mirrored in `apps/web/.env.example`.

## Project Docs

- `md/agent/project_structure.md`: Repository layout and file placement guide
- `md/specs/spec_subscription_tracker_mvp.md`: Product and architecture specification
- `md/ui_layout_subscription_tracker.md`: UI layout plan
- `md/figma_draft_subscription_tracker.md`: Figma draft plan
- `md/plan/todos_subscription_tracker.md`: Implementation checklist

## Notes

The app is not feature-complete yet. Current work is frontend-first: the dashboard shell and static subscription overview are in place while the Next.js backend layer, Supabase setup, and Prisma-backed data milestones are still upcoming.
