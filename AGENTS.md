# Agent Guide

This repo is a TypeScript npm workspace for the Subscription Tracker app. Start here before editing, then read the nearest app-specific `AGENTS.md` for the area you are touching.

## Repository Layout

```text
subscription-tracker/
  apps/
    web/              Next.js App Router frontend and backend layer
  md/                 Product specs, planning notes, and implementation docs
  design/             Static HTML/CSS drafts, wireframes, and design assets
```

## Workflow

- Inspect the existing files before editing and follow the local patterns.
- Keep changes scoped to the requested behavior or documentation update.
- Do not move files across apps or packages unless the task explicitly calls for it.
- Do not duplicate domain types. Keep app-local contracts in `apps/web` until another app/package boundary exists.
- Run the most specific checks for the app or package you changed before finishing.

## Commands

- Frontend lint: `npm run lint:web`
- Frontend build: `npm run build:web`
- All lint: `npm run lint`
- All build: `npm run build`

## Shared TypeScript Rules

- Prefer strict TypeScript and explicit exported contracts for cross-app boundaries.
- Keep frontend-only view types in `apps/web/src/types`.
- Keep Next.js server-only implementation details in `apps/web/src/server`, `apps/web/src/actions`, or `apps/web/src/app/api`.
- Keep DTOs, API response shapes, enums, and domain helpers in `apps/web` until a real cross-package boundary is needed.
