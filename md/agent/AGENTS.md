# Agent Guide

This repo is a TypeScript npm workspace for the Subscription Tracker app. Start here before editing, then read the nearest app-specific `AGENTS.md` for the area you are touching.

## Repository Layout

```text
subscription-tracker/
  apps/
    web/              Next.js frontend
    api/              NestJS backend API
  packages/
    shared/           Shared TypeScript contracts and utilities
  md/                 Product specs, planning notes, and implementation docs
  design/             Static HTML/CSS drafts, wireframes, and design assets
```

## Workflow

- Inspect the existing files before editing and follow the local patterns.
- Keep changes scoped to the requested behavior or documentation update.
- Do not move files across apps or packages unless the task explicitly calls for it.
- Do not duplicate domain types. If both frontend and backend need a contract, put it in `packages/shared`.
- Run the most specific checks for the app or package you changed before finishing.

## Commands

- Frontend lint: `npm run lint:web`
- Frontend build: `npm run build:web`
- API lint: `npm run lint:api`
- API build: `npm run build:api`
- All lint: `npm run lint`
- All build: `npm run build`

## Shared TypeScript Rules

- Prefer strict TypeScript and explicit exported contracts for cross-app boundaries.
- Keep frontend-only view types in `apps/web/src/types`.
- Keep backend-only DTOs and implementation types in `apps/api/src`.
- Promote shared DTOs, API response shapes, enums, and domain helpers to `packages/shared`.
