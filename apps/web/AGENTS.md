<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Web Agent Guide

This app is the Next.js frontend for Subscription Tracker. Keep the frontend organized by file type under `apps/web/src`.

## Source Layout

```text
apps/web/src/
  app/                 Next App Router routes, layouts, metadata, global CSS
  components/          Reusable UI and screen sections
    dashboard/
    layout/
    ui/
  data/                Temporary mock/static frontend data
  hooks/               React hooks
  lib/                 Frontend and server-safe helpers, formatting, domain utilities
  types/               Frontend-only types
```

## Placement Rules

- `app/page.tsx` and nested route `page.tsx` files should stay thin and render screen components.
- Keep route layouts and global CSS in `app/`.
- Put dashboard screen composition and dashboard-only sections in `components/dashboard`.
- Put app shells, nav shells, and page layout wrappers in `components/layout`.
- Put reusable primitives such as badges, panels, buttons, and inputs in `components/ui`.
- Put temporary mock/static data in `src/data`, not inside component folders.
- Put frontend-only types in `src/types`. Put app-local domain helpers and contracts in `src/lib` until another package boundary exists.

## Supabase Auth and Data Access

- Use `src/server/auth/currentUser.ts` helpers for identity: `requireCurrentUser` in pages/actions and `requireCurrentApiUser` in route handlers.
- Do not read Supabase auth cookies directly in feature code. Keep Supabase client creation in `src/lib/supabase`.
- Do not reintroduce `SUBSCRIPTION_TRACKER_DEV_USER_ID`; request ownership comes from the verified Supabase session.
- Keep Prisma access server-only through `src/server`, and always scope subscription/reminder queries by `userId`.
- Guest mode uses Supabase anonymous users. Preserve the 10-subscription guest cap unless the product spec changes.
- Do not use `user_metadata` for authorization decisions. Use the Supabase user id and server-side checks instead.

## Checks

- Run `npm run lint:web` after frontend code changes.
- Run `npm run build:web` after structural, import, or route changes.
