<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code, and heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Web Agent Guide

This app is the Next.js frontend and backend layer for Subscription Tracker. Read the root `AGENTS.md` and `md/agent/README.md` first, then use this file for web-specific rules.

## Source Placement

- Keep route files in `src/app`; route `page.tsx` files should stay thin and render screen components.
- Put dashboard composition in `src/components/dashboard`.
- Put app shells and layout wrappers in `src/components/layout`.
- Put reusable primitives in `src/components/ui`.
- Put temporary mock/static frontend data in `src/data`.
- Put React hooks in `src/hooks`.
- Put frontend helpers and app-local domain contracts in `src/lib`.
- Put frontend-only types in `src/types`.
- Put server-only auth, Prisma, and feature services in `src/server`, `src/actions`, or `src/app/api`.

## Supabase Auth and Data Access

- Use `src/server/auth/currentUser.ts` helpers for identity: `requireCurrentUser` in pages/actions and `requireCurrentApiUser` in route handlers.
- Do not read Supabase auth cookies directly in feature code. Keep Supabase client creation in `src/lib/supabase`.
- Do not reintroduce `SUBSCRIPTION_TRACKER_DEV_USER_ID`; request ownership comes from the verified Supabase session.
- Keep Prisma access server-only through `src/server`, and always scope subscription/reminder queries by `userId`.
- Guest mode uses Supabase anonymous users. Preserve the 10-subscription guest cap unless the product spec changes.
- Do not use `user_metadata` for authorization decisions. Use the Supabase user id and server-side checks instead.

## Checks

- Run `npm run lint:web` after frontend code changes.
- Run `npm run build:web` after structural, import, route, Prisma, or Next.js config changes.

