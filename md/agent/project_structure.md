# Project Structure

Subscription Tracker is a small TypeScript npm workspace. The active deployable app lives in `apps/web`.

## Directory Tree

```text
subscription-tracker/
  AGENTS.md
  README.md
  package.json
  apps/
    web/
      AGENTS.md
      prisma/
      src/
        actions/
        app/
          api/
        components/
          dashboard/
          layout/
          ui/
        data/
        hooks/
        lib/
        server/
        types/
  md/
    agent/
    plan/
    specs/
  design/
```

## File Placement

- Dashboard section component: `apps/web/src/components/dashboard/<Name>.tsx`
- App shell or page layout wrapper: `apps/web/src/components/layout/<Name>.tsx`
- Reusable UI primitive: `apps/web/src/components/ui/<Name>.tsx`
- Frontend route entry: `apps/web/src/app/<route>/page.tsx`
- Next.js Route Handler: `apps/web/src/app/api/<route>/route.ts`
- Next.js Server Action: `apps/web/src/actions/<feature>.ts`
- Server-only Prisma query/service: `apps/web/src/server/<feature>.ts`
- Frontend mock/static data: `apps/web/src/data/<feature>.ts`
- Frontend helper: `apps/web/src/lib/<name>.ts`
- Frontend-only type: `apps/web/src/types/<name>.ts`
- App-local API response shape or domain type: `apps/web/src/lib/<feature>/`
- Product specs and planning notes: `md/specs` or `md/plan`
- Agent operating docs: `md/agent`
- Static design drafts and wireframes: `design`

## Code Boundaries

- Keep `app/` focused on routes, layouts, metadata, global CSS, and route handlers.
- Keep route `page.tsx` files thin and delegate screen composition to components.
- Keep Prisma access server-only and pointed at Supabase Postgres.
- Use Supabase Auth for user identity and data isolation.
- Keep DTOs, API shapes, enums, and domain helpers in `apps/web/src/lib` until a real cross-package boundary is needed.
- Do not put React components, hooks, Server Actions, or database-specific implementation details in domain helper modules.

