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

## Checks

- Run `npm run lint:web` after frontend code changes.
- Run `npm run build:web` after structural, import, or route changes.
