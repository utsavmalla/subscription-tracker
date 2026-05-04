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

## Database Rules

- The project uses Neon Postgres with Prisma ORM.
- Use `DATABASE_URL` for runtime app traffic. It should be the Neon pooled connection string.
- Use `DIRECT_URL` for Prisma migration and admin commands. It should be the Neon direct connection string.
- `prisma.config.ts` already prefers `DIRECT_URL` and falls back to `DATABASE_URL`; do not move connection URLs into `schema.prisma`.
- The initial subscription/reminder migration has been applied to Neon. Add new migrations for future schema changes instead of editing applied migration history.
- The frontend still uses temporary mock data until Milestone 9 API routes are implemented.

## Checks

- Run `npm run lint:api` after API code changes.
- Run `npm run build:api` after structural or TypeScript changes.
- Run `npm run test` when changing controllers, services, modules, or behavior covered by backend tests.
- Run `npx prisma validate` and `npx prisma migrate status` from `apps/api` after Prisma schema or migration changes.
