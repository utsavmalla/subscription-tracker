# Subscription Tracker Staging Environment

Date: 2026-06-03

## Target setup

- Git branch: `staging`.
- Vercel project: `subscription-tracker`.
- Vercel target: Preview deployment scoped to the `staging` branch.
- Vercel root directory: `apps/web`.
- Staging app URL: use the Vercel-generated branch preview URL for `staging`.
- Supabase: use a separate staging Supabase project, not the production project.
- Database runtime connection: staging Supabase Postgres transaction pooler through `DATABASE_URL`.
- Database migration/admin connection: staging Supabase session pooler or direct connection through `DIRECT_URL`.

## Required Vercel Preview variables

Add these to the `subscription-tracker` Vercel project as Preview variables scoped to the `staging` Git branch:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
SUPABASE_SERVICE_ROLE_KEY
REMINDER_REFRESH_SECRET
DATABASE_URL
DIRECT_URL
```

Use branch-scoped Preview variables so other preview branches do not accidentally receive staging credentials:

```powershell
npx vercel@latest env add NEXT_PUBLIC_SUPABASE_URL preview --git-branch=staging
npx vercel@latest env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY preview --git-branch=staging
npx vercel@latest env add NEXT_PUBLIC_SITE_URL preview --git-branch=staging
npx vercel@latest env add SUPABASE_SERVICE_ROLE_KEY preview --git-branch=staging
npx vercel@latest env add REMINDER_REFRESH_SECRET preview --git-branch=staging
npx vercel@latest env add DATABASE_URL preview --git-branch=staging
npx vercel@latest env add DIRECT_URL preview --git-branch=staging
```

Set `NEXT_PUBLIC_SITE_URL` after the first `staging` deployment creates the stable branch preview URL. Then redeploy the `staging` branch so magic-link redirects use the final staging URL.

## Supabase staging setup

1. Create a separate Supabase project for staging.
2. Copy the staging project values into the branch-scoped Vercel Preview variables above.
3. Apply the committed Prisma migrations to the staging database:

```powershell
npx prisma migrate deploy --schema apps/web/prisma/schema.prisma
```

Run the migration command with `DIRECT_URL` pointing at the staging database. Do not point staging at production `DATABASE_URL`, `DIRECT_URL`, or `SUPABASE_SERVICE_ROLE_KEY`.

## Supabase Auth settings

Configure the staging Supabase project Auth URLs after the first staging deployment:

```text
Site URL:
<staging-vercel-branch-url>

Redirect URLs:
<staging-vercel-branch-url>/auth/callback
http://localhost:3000/auth/callback
```

## Reminder refresh

Use a staging-only `REMINDER_REFRESH_SECRET`. If staging reminders should run automatically, deploy `supabase/functions/daily-reminder-refresh` to the staging Supabase project and set these Edge Function secrets:

```text
APP_REFRESH_URL=<staging-vercel-branch-url>/api/reminders/refresh
REMINDER_REFRESH_SECRET=<same-value-as-vercel-preview-staging>
```

Leave the scheduled cron disabled unless staging reminder automation is explicitly needed.

## Smoke tests

- Confirm the Vercel deployment target is Preview and the Git branch is `staging`.
- Confirm `/login` returns `200`.
- Request a magic link and confirm the callback stays on the staging URL.
- Confirm the authenticated dashboard loads against the staging database.
- Create, edit, mark done, and delete a test subscription.
- Confirm `/api/dashboard` returns `401 Unauthorized` without a session.
- If reminder refresh is enabled, call `/api/reminders/refresh` with the staging bearer secret and confirm it succeeds.
