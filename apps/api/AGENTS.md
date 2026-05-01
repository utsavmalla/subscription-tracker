# API Agent Guide

This app is the NestJS backend for Subscription Tracker. The current source may still include starter files; use the structure below for new backend work.

## Intended Source Layout

```text
apps/api/src/
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
```

## Placement Rules

- Feature code belongs in `src/modules/<feature>`, not directly under `src`.
- Put shared backend utilities, filters, pipes, and backend-only DTOs in `src/common`.
- Put Prisma service, database helpers, and Prisma module wiring in `src/prisma`.
- If the frontend needs a DTO, response shape, enum, or domain type, promote it to `packages/shared` instead of redefining it in both apps.
- Keep tests near the feature they cover when adding new modules. Keep broad e2e tests under `test/`.

## Checks

- Run `npm run lint:api` after API code changes.
- Run `npm run build:api` after structural or TypeScript changes.
- Run `npm run test` when changing controllers, services, modules, or behavior covered by backend tests.
