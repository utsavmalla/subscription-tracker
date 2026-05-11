# Agent Handbook

Use this file as the main navigation hub for future agents working on Subscription Tracker. Start with the root `AGENTS.md`, then this handbook, then the nearest app-specific `AGENTS.md`.

## Repository Shape

- `apps/web`: Next.js App Router frontend and backend layer.
- `md/agent`: Agent-facing operating docs and repo structure guidance.
- `md/plan`: Implementation checklists, deployment notes, and planning logs.
- `md/specs`: Product, architecture, UI, and design specifications.
- `design`: Static HTML/CSS drafts, wireframes, and design assets.

Detailed placement rules live in `md/agent/project_structure.md`.

## Agent Workflow

- Inspect existing files before editing.
- Prefer existing app patterns over new abstractions.
- Keep changes scoped to the requested behavior or docs update.
- Do not duplicate domain types across folders.
- Do not move files across apps or packages unless explicitly requested.
- Preserve unrelated user changes in the working tree.
- Run the narrowest meaningful check for the files changed.

## Implementation Rules

- Keep frontend-only view types in `apps/web/src/types`.
- Keep app-local contracts, DTOs, API shapes, enums, and domain helpers in `apps/web/src/lib`.
- Keep server-only implementation details in `apps/web/src/server`, `apps/web/src/actions`, or `apps/web/src/app/api`.
- Keep Prisma access server-only and always scope subscription/reminder data by `userId`.
- Use Supabase Auth session identity; do not restore fixed development owner ids.
- Preserve guest mode as Supabase anonymous users with the 10-subscription cap unless the product spec changes.

## Commands

- Frontend dev: `npm run dev:web`
- Frontend lint: `npm run lint:web`
- Frontend build: `npm run build:web`
- All lint: `npm run lint`
- All build: `npm run build`
- Prisma validate: `npm run prisma:validate`
- Prisma migration deploy: `npm run prisma:migrate:deploy`

## Documentation Map

- `md/agent/project_structure.md`: Repo structure, code boundaries, and file placement.
- `md/plan/todos_subscription_tracker.md`: Current implementation checklist.
- `md/plan/deployment_notes_subscription_tracker.md`: Deployment steps, Vercel/Supabase setup, issues, and remaining smoke tests.
- `md/specs/spec_subscription_tracker_mvp.md`: Product and architecture specification.
- `md/specs/ui_layout_subscription_tracker.md`: UI layout and screen behavior reference.
- `md/specs/figma_draft_subscription_tracker.md`: Figma/design draft reference.

## Deployment Notes

- Deploy `apps/web` as the Vercel project root.
- Required production env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, and `DIRECT_URL`.
- Use Supabase transaction pooling for runtime `DATABASE_URL`.
- Use Supabase session pooler or direct connection for migration/admin `DIRECT_URL`.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Configure Supabase Auth redirect URLs before smoke testing production sign-in.
- Wire production cron through the Supabase `daily-reminder-refresh` Edge Function and the `REMINDER_REFRESH_SECRET` bearer path.
