# Subscription Tracker

A web app for tracking recurring and one-time subscriptions, renewal dates, overdue items, expiration dates, and CSV-based spreadsheet migration.

The project is organized as a small TypeScript monorepo:

```text
subscription-tracker/
  apps/
    web/      Next.js frontend
    api/      NestJS backend API
  packages/
    shared/   Shared TypeScript types and utilities
  md/         Product specs, UI notes, and TODO checklist
  design/     Static design drafts and wireframes
```

## Current Status

Milestone 1 is complete:

- Git repository initialized
- Next.js frontend scaffolded in `apps/web`
- NestJS backend scaffolded in `apps/api`
- Prisma initialized for PostgreSQL
- Shared package placeholder added
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
copy apps\api\.env.example apps\api\.env
```

On macOS or Linux, use `cp` instead of `copy`.

## Common Commands

Run the frontend:

```bash
npm run dev:web
```

Run the API:

```bash
npm run dev:api
```

Build both apps:

```bash
npm run build
```

Lint both apps:

```bash
npm run lint
```

Run backend tests:

```bash
npm run test
```

## Local URLs

- Web app: `http://localhost:3000`
- API: `http://localhost:3001`

The API port is configured with `PORT=3001` in the env examples.

## Environment Variables

Root `.env.example`:

```text
NEXT_PUBLIC_API_URL=http://localhost:3001
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/subscription_tracker?schema=public
```

The same values are split into app-specific examples under `apps/web` and `apps/api`.

## Project Docs

- `md/project_structure.md`: Repository layout and file placement guide
- `md/spec_subscription_tracker_mvp.md`: Product and architecture specification
- `md/ui_layout_subscription_tracker.md`: UI layout plan
- `md/figma_draft_subscription_tracker.md`: Figma draft plan
- `md/todos_subscription_tracker.md`: Implementation checklist

## Notes

The app is not feature-complete yet. Current work is frontend-first: the dashboard shell and static subscription overview are in place while backend schema and API milestones are still upcoming.
