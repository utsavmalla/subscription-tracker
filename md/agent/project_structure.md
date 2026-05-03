# Project Structure

Subscription Tracker is organized as a small TypeScript npm workspace with separate app folders and a shared package for cross-app contracts.

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
        components/
          dashboard/
          layout/
          ui/
        data/
        hooks/
        lib/
        types/
    api/
      AGENTS.md
      src/
        modules/
          subscriptions/
          dashboard/
          imports/
          reminders/
        common/
          dto/
          filters/
          pipes/
          utils/
        prisma/
  packages/
    shared/
      src/
  md/
  design/
```

## Where To Put New Files

- New dashboard section component: `apps/web/src/components/dashboard/<Name>.tsx`
- New app shell or page layout wrapper: `apps/web/src/components/layout/<Name>.tsx`
- Reusable UI primitive used across screens: `apps/web/src/components/ui/<Name>.tsx`
- Frontend route entry: `apps/web/src/app/<route>/page.tsx`
- Frontend mock/static data: `apps/web/src/data/<feature>.ts`
- Frontend-only helper: `apps/web/src/lib/<name>.ts`
- Frontend-only type: `apps/web/src/types/<name>.ts`
- Backend feature module code: `apps/api/src/modules/<feature>/`
- Backend-only DTO: `apps/api/src/common/dto/`
- Prisma service or database integration: `apps/api/src/prisma/`
- Shared API response shape or domain type: `packages/shared/src/`
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

The backend is a NestJS app. Starter files can remain until feature modules are introduced.

- New feature code should live under `apps/api/src/modules/<feature>`.
- Shared backend utilities should live under `apps/api/src/common`.
- Prisma integration should live under `apps/api/src/prisma`.
- Do not place new feature controllers or services directly under `apps/api/src`.
- Promote DTOs and types needed by the frontend to `packages/shared`.

## Shared Package Conventions

Use `packages/shared` for code that defines the contract between apps:

- Domain types and enums
- API request and response shapes
- Shared validation or formatting helpers that are not tied to React or NestJS

Do not put frontend components, React hooks, NestJS services, or database-specific implementation details in `packages/shared`.

## Docs And Design Assets

- `md/` stores product specs, TODOs, architecture notes, and project documentation.
- `design/` stores static HTML/CSS drafts, wireframes, and visual references.
- Keep generated or exploratory design files out of app source unless they are being implemented.
