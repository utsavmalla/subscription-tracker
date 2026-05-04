# Project Structure

Subscription Tracker is organized as a small TypeScript npm workspace. The active app lives under `apps/web`; app-local domain contracts live in the web source tree until another package boundary is needed.

## Directory Tree

```text
subscription-tracker/
  AGENTS.md
  README.md
  package.json
  apps/
    web/
      AGENTS.md
      src/
        app/
          api/
        components/
          dashboard/
          layout/
          ui/
        actions/
        data/
        hooks/
        lib/
        server/
        types/
  md/
  design/
```

## Where To Put New Files

- New dashboard section component: `apps/web/src/components/dashboard/<Name>.tsx`
- New app shell or page layout wrapper: `apps/web/src/components/layout/<Name>.tsx`
- Reusable UI primitive used across screens: `apps/web/src/components/ui/<Name>.tsx`
- Frontend route entry: `apps/web/src/app/<route>/page.tsx`
- Next.js Route Handler: `apps/web/src/app/api/<route>/route.ts`
- Next.js Server Action: `apps/web/src/actions/<feature>.ts`
- Server-only Prisma query/service: `apps/web/src/server/<feature>.ts`
- Frontend mock/static data: `apps/web/src/data/<feature>.ts`
- Frontend-only helper: `apps/web/src/lib/<name>.ts`
- Frontend-only type: `apps/web/src/types/<name>.ts`
- App-local API response shape or domain type: `apps/web/src/lib/<feature>/`
- Product, planning, and implementation notes: `md/`
- Static design drafts and wireframes: `design/`

## Frontend Conventions

The frontend uses type-based top-level folders under `apps/web/src`.

- `app/` is for Next App Router routes, layouts, metadata, and global CSS only.
- Keep `app/page.tsx` and nested route `page.tsx` files thin. They should render screen components.
- Put dashboard screen composition and dashboard-only sections in `components/dashboard`.
- Put app shells, nav shells, and page layout wrappers in `components/layout`.
- Put reusable primitives such as badges, panels, buttons, and inputs in `components/ui`.
- Put temporary mock or static frontend data in `data/`.
- Put React hooks in `hooks/`.
- Put frontend helpers, formatters, and API client utilities in `lib/`.
- Put frontend-only TypeScript types in `types/`.

## Backend Conventions

The target MVP backend layer lives inside the Next.js app. Use App Router Route Handlers for HTTP-style endpoints, Server Actions for trusted form mutations, and server-only services/queries for Prisma access to Supabase Postgres.

- New backend feature code should live under `apps/web/src/actions`, `apps/web/src/app/api`, or `apps/web/src/server`, depending on the boundary.
- Keep Prisma access server-only and pointed at Supabase Postgres.
- Use Supabase Auth for user identity and data isolation.
- Use Supabase scheduled Edge Functions for daily status refresh and reminder generation.
- Keep DTOs and types needed by the frontend in `apps/web/src/lib` until a real cross-package boundary is needed.

## Domain Contract Conventions

Use `apps/web/src/lib` for code that defines app-local contracts and domain helpers:

- Domain types and enums
- API request and response shapes
- Shared validation or formatting helpers that are not tied to React or framework-specific server code

Do not put frontend components, React hooks, Next.js Server Actions, framework-specific server services, or database-specific implementation details in domain helper modules.

## Docs And Design Assets

- `md/` stores product specs, TODOs, architecture notes, and project documentation.
- `design/` stores static HTML/CSS drafts, wireframes, and visual references.
- Keep generated or exploratory design files out of app source unless they are being implemented.
