# Subscription Tracker Deployment Notes

Date: 2026-05-06

## Target setup

- Web app host: Vercel.
- Web app project: `subscription-tracker`.
- Vercel root directory: `apps/web`.
- Production public URL: `https://subscription-tracker-nine-ashy.vercel.app`.
- Supabase project URL: `https://qylifipryowgdqryvbsj.supabase.co`.
- Database runtime connection: Supabase Postgres transaction pooler through `DATABASE_URL`.
- Database migration/admin connection: Supabase session/direct pooler through `DIRECT_URL`.

## Deployment steps completed

1. Logged in to the Vercel MCP server with `codex mcp login vercel`.
2. Verified the web app built locally with `npm run lint:web` and `npm run build:web`.
3. Created the Vercel project through the Vercel API and connected it to GitHub repo `utsavmalla/subscription-tracker`.
4. Configured the Vercel project with:
   - Framework: Next.js
   - Root directory: `apps/web`
   - Build command: `npm run build`
   - Dev command: `npm run dev`
5. Added production Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `DATABASE_URL`
   - `DIRECT_URL`
6. Triggered production deployments from Git/Vercel.
7. Updated `NEXT_PUBLIC_SITE_URL` to `https://subscription-tracker-nine-ashy.vercel.app`.
8. Redeployed production after env changes.

## Issues encountered and fixes

### 1. Vercel CLI not available on PATH

The standalone `vercel` command was not installed on PATH.

Fix:

- Used `npx vercel@latest`.
- Authenticated the CLI session when prompted.

### 2. Initial Git-connected project was not visible

The Vercel account initially showed no projects. After confirming the GitHub repo and scope, the project was created through the Vercel API and connected to GitHub.

Result:

- Project `subscription-tracker` was created under `utsav-mallas-projects`.
- GitHub repo link was established for `utsavmalla/subscription-tracker`.

### 3. Missing Linux native `lightningcss` binding

First Vercel builds failed with:

```text
Cannot find module '../lightningcss.linux-x64-gnu.node'
```

Fix:

- Regenerated package metadata.
- Added Linux native optional dependency coverage so Vercel's Linux build environment installs the native package.

### 4. Missing Tailwind Oxide Linux binding

After fixing `lightningcss`, Vercel failed with:

```text
Cannot find module '@tailwindcss/oxide-linux-x64-gnu'
Cannot find module './tailwindcss-oxide.linux-x64-gnu.node'
```

Fix:

- Added `@tailwindcss/oxide-linux-x64-gnu` as an optional dependency for `apps/web`.
- Rebuilt `package-lock.json`.
- Committed and pushed the dependency update.

### 5. Prisma Client not generated on Vercel

Vercel then failed with:

```text
Type error: Module '"@prisma/client"' has no exported member 'PrismaClient'.
```

Cause:

- Local builds passed because `node_modules/.prisma/client` already existed.
- Vercel clean installs did not have generated Prisma Client artifacts.

Fix:

- Added `apps/web` postinstall script:

```json
"postinstall": "prisma generate --schema=prisma/schema.prisma"
```

- Verified locally with:

```text
npm --prefix apps/web run postinstall
npm run lint:web
npm run build:web
```

- Committed and pushed:

```text
9aa1bad fix: generate prisma client on install
```

Result:

- Vercel production deployment became Ready.

### 6. Magic link redirected to localhost

Observed behavior:

- Supabase magic link redirected to localhost instead of the deployed app.

Cause:

- Vercel production `NEXT_PUBLIC_SITE_URL` was set to `https://subscription-tracker.vercel.app`, which was not the active public app URL.
- Supabase Auth URL configuration also needed the deployed callback URL.

Fix:

- Updated Vercel production `NEXT_PUBLIC_SITE_URL` to:

```text
https://subscription-tracker-nine-ashy.vercel.app
```

- Supabase Auth settings should use:

```text
Site URL:
https://subscription-tracker-nine-ashy.vercel.app

Redirect URLs:
https://subscription-tracker-nine-ashy.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### 7. Runtime Prisma database connection error

Observed error:

```text
PrismaClientKnownRequestError:
Invalid `prisma.subscription.findMany()` invocation:
Can't reach database server at base
```

Investigation:

- Local `.env.local` database values were wrapped in quotes.
- After trimming quotes, local URL shape looked correct:
  - `DATABASE_URL`: host `aws-1-ap-northeast-2.pooler.supabase.com`, port `6543`, `pgbouncer=true`
  - `DIRECT_URL`: host `aws-1-ap-northeast-2.pooler.supabase.com`, port `5432`
- Vercel stores encrypted env values, so the exact deployed database URL value could not be inspected directly.

Fix applied:

- Re-upserted Vercel production `DATABASE_URL` and `DIRECT_URL` from local `.env.local` after stripping surrounding quotes.
- Re-upserted `NEXT_PUBLIC_SITE_URL`.
- Redeployed production.

Verification:

- New deployment became Ready:

```text
https://subscription-tracker-frxbb0ncn-utsav-mallas-projects.vercel.app
Alias: https://subscription-tracker-nine-ashy.vercel.app
Deployment ID: dpl_91mXREaSiNnnLHJHVdMauVUp5E7C
```

- `/login` returned `200`.
- `/api/dashboard` returned `401 Unauthorized` without a session, which is expected.
- Authenticated Prisma path still needs to be verified after signing in.

## Current status

- Latest production alias: `https://subscription-tracker-nine-ashy.vercel.app`.
- Latest deployment status: Ready.
- Build is passing on Vercel.
- Public login route is reachable.
- Supabase Auth settings must include the production callback URL.
- Authenticated dashboard/subscription flows should be smoke tested after signing in.

## Remaining checks

1. Sign in with magic link from production.
2. Confirm the email callback stays on `https://subscription-tracker-nine-ashy.vercel.app`.
3. Open the dashboard after sign-in.
4. Confirm subscriptions load without the Prisma database connection error.
5. Create, edit, mark done, and delete a test subscription.

## Scheduled reminder refresh setup

The app now supports a production-safe scheduled refresh path:

- Vercel needs `REMINDER_REFRESH_SECRET` as a server-only environment variable.
- Supabase Edge Function secrets need:
  - `APP_REFRESH_URL=https://subscription-tracker-nine-ashy.vercel.app/api/reminders/refresh`
  - `REMINDER_REFRESH_SECRET` with the same value used by Vercel.
- Deploy `supabase/functions/daily-reminder-refresh`.
- Schedule the Edge Function with Supabase `pg_cron` and `pg_net`, preferably shortly after midnight UTC.
- Store the function URL and authorization key in Supabase Vault for the scheduled SQL.

Example schedule SQL:

```sql
select vault.create_secret(
  'https://qylifipryowgdqryvbsj.supabase.co/functions/v1/daily-reminder-refresh',
  'daily_reminder_refresh_url'
);

select vault.create_secret(
  'SUPABASE_ANON_OR_FUNCTION_AUTH_KEY',
  'daily_reminder_refresh_auth_key'
);

select cron.schedule(
  'daily-reminder-refresh',
  '5 0 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'daily_reminder_refresh_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        select decrypted_secret from vault.decrypted_secrets
        where name = 'daily_reminder_refresh_auth_key'
      )
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
```
