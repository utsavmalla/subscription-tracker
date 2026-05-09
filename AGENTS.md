# Agent Guide

This repo is a TypeScript npm workspace for the Subscription Tracker app.

Start every task here, then read:

1. `md/agent/README.md` for the full agent handbook and doc map.
2. The nearest app-specific `AGENTS.md` for the area you are touching.

## Repo Rules

- Inspect existing files before editing and follow local patterns.
- Keep changes scoped to the requested behavior or documentation update.
- Do not move files across apps or packages unless the task explicitly asks for it.
- Keep app-local contracts in `apps/web` until another app/package boundary exists.
- Run the most specific checks for the app or package you changed before finishing.

## Common Commands

- Frontend lint: `npm run lint:web`
- Frontend build: `npm run build:web`
- All lint: `npm run lint`
- All build: `npm run build`

