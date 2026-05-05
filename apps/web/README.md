# Subscription Tracker Web

Next.js App Router app for the Subscription Tracker frontend and backend layer.

## Role

This app owns the browser experience:

- Dashboard pages
- Subscription list and detail views
- Create and edit subscription forms
- CSV import and export screens
- Alert and reminder views
- Responsive desktop and mobile UI

It will also own the MVP backend layer through Server Actions, Route Handlers, and server-only Prisma services.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint

## Setup

Install dependencies from the repository root:

```bash
npm install
```

Create the web environment file:

```bash
copy apps\web\.env.example apps\web\.env
```

On macOS or Linux:

```bash
cp apps/web/.env.example apps/web/.env
```

## Environment Variables

```text
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_PROJECT_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Legacy Supabase anon keys are also supported through `NEXT_PUBLIC_SUPABASE_ANON_KEY` when needed. Server-only Supabase and database credentials belong in the root/local deployment environment, not in public browser variables.

Supabase Auth must have email magic links enabled. Guest mode requires Anonymous Sign-Ins, and guest upgrade requires manual identity linking in the Supabase Auth provider settings.

## Commands

From the repository root:

```bash
npm run dev:web
npm run build:web
npm run lint:web
```

Prisma commands should be run from the repository root so they use `prisma.config.ts`:

```bash
npm run prisma:validate
npm run prisma:migrate:deploy
```

From `apps/web`:

```bash
npm run dev
npm run build
npm run lint
```

## Local Development

Start the frontend:

```bash
npm run dev:web
```

Open:

```text
http://localhost:3000
```

## Deployment

Create the Vercel project with `apps/web` as the Root Directory. The local `vercel.json` sets the Next.js framework preset and app-level build/dev commands.

Production environment variables required by this app:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL
SUPABASE_SERVICE_ROLE_KEY
DATABASE_URL
DIRECT_URL
```

Use Supabase transaction pooling for runtime `DATABASE_URL`, and use the session pooler or direct connection for `DIRECT_URL` migrations. Add the production `/auth/callback` URL to Supabase Auth redirect URLs before smoke testing sign-in.

The scheduled refresh endpoint is not deployment-ready for cron yet; keep Supabase scheduled Edge Function setup in Milestone 11.

## Important Files

- `src/app/page.tsx`: Home page route
- `src/app/layout.tsx`: Root app layout
- `src/app/globals.css`: Global Tailwind styles
- `next.config.ts`: Next.js config
- `eslint.config.mjs`: ESLint config

## Implementation Notes

The UI should follow the product and layout docs in the root `md/` folder. The MVP should prioritize dashboard visibility, subscription management, search/filter/sort, and CSV workflows before decorative polish.
