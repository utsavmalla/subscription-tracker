# Subscription Tracker Web

Next.js frontend for the Subscription Tracker app.

## Role

This app owns the browser experience:

- Dashboard pages
- Subscription list and detail views
- Create and edit subscription forms
- CSV import and export screens
- Alert and reminder views
- Responsive desktop and mobile UI

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
NEXT_PUBLIC_API_URL=http://localhost:3001
```

This value tells the frontend where to call the NestJS API.

## Commands

From the repository root:

```bash
npm run dev:web
npm run build:web
npm run lint:web
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

When API-backed screens are implemented, start the backend separately with:

```bash
npm run dev:api
```

## Important Files

- `src/app/page.tsx`: Home page route
- `src/app/layout.tsx`: Root app layout
- `src/app/globals.css`: Global Tailwind styles
- `next.config.ts`: Next.js config
- `eslint.config.mjs`: ESLint config

## Implementation Notes

The UI should follow the product and layout docs in the root `md/` folder. The MVP should prioritize dashboard visibility, subscription management, search/filter/sort, and CSV workflows before decorative polish.

