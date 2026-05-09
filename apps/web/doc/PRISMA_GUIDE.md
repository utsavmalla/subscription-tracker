# Prisma Guide For This Project

This guide explains what Prisma does in Subscription Tracker, why we use it, how it connects to Supabase Postgres, and how the current subscription implementation works.

## What Prisma Does

Prisma is the database layer for this app. It gives the project:

- A schema file that describes database tables, fields, relations, indexes, and enums.
- Migration files that apply schema changes to Supabase Postgres.
- A generated TypeScript client for reading and writing database records.
- Type-safe query helpers such as `findMany`, `findFirst`, `create`, `update`, `delete`, and `count`.

In simple terms: Prisma lets our server code talk to the database using TypeScript objects instead of handwritten SQL for every query.

## Why We Use Prisma

Subscription Tracker stores user-owned subscription records in Supabase Postgres. Prisma helps us keep that database work predictable.

We use Prisma to:

- Define the database structure in `apps/web/prisma/schema.prisma`.
- Keep schema changes in migration history under `apps/web/prisma/migrations`.
- Generate `@prisma/client`, which gives typed database models in TypeScript.
- Query subscriptions in server-only code.
- Scope reads and writes by the current Supabase user id.

Prisma does not handle login in this app. Supabase Auth handles login and gives us the current user. After that, Prisma stores and reads the subscription rows owned by that user.

## Main Prisma Files

| File | Purpose |
| --- | --- |
| `apps/web/prisma/schema.prisma` | Defines models, enums, indexes, table mappings, and relations |
| `apps/web/prisma/migrations` | Stores SQL migration history for Supabase Postgres |
| `prisma.config.ts` | Tells Prisma where the schema and migrations live, and loads env files |
| `apps/web/src/server/db/prisma.ts` | Creates the Prisma Client used by server code |
| `apps/web/src/server/subscriptions/service.ts` | Uses Prisma to query and mutate subscription records |

## How Prisma Connects To Supabase

Supabase provides the Postgres database. Prisma connects to that database with connection strings from environment variables.

```text
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

`DATABASE_URL` is used by the running app. In this project, `apps/web/src/server/db/prisma.ts` reads it and creates the Prisma Client:

```ts
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma.");
}

const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: [],
  });
```

`DIRECT_URL` is used by Prisma CLI commands through `prisma.config.ts`. That config loads `.env`, `apps/web/.env`, and `apps/web/.env.local`, then points Prisma at the app schema:

```ts
export default defineConfig({
  schema: "apps/web/prisma/schema.prisma",
  migrations: {
    path: "apps/web/prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
```

Use Supabase transaction pooling for `DATABASE_URL` in hosted/serverless runtime traffic. Use the Supabase session pooler or a direct connection for `DIRECT_URL` because migrations need a more direct database connection.

## Schema Example

The `Subscription` model is the main table for this app.

```prisma
model Subscription {
  id              String             @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId          String             @map("user_id") @db.Uuid
  serviceName     String             @map("service_name") @db.VarChar(160)
  usdAmount       Decimal?           @map("usd_amount") @db.Decimal(10, 2)
  renewalCycle    RenewalCycle       @map("renewal_cycle")
  nextRenewalDate DateTime?          @map("next_renewal_date") @db.Date
  expirationDate  DateTime?          @map("expiration_date") @db.Date
  status          SubscriptionStatus @default(Active)
  alertState      AlertState         @default(None) @map("alert_state")
  done            Boolean            @default(false)
  remarks         String?            @db.Text
  createdAt       DateTime           @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt       DateTime           @updatedAt @map("updated_at") @db.Timestamptz(6)

  @@unique([id, userId], map: "subscriptions_id_user_id_key")
  @@index([userId], map: "subscriptions_user_id_idx")
  @@map("subscriptions")
}
```

Important details:

- `@@map("subscriptions")` means the Prisma model is named `Subscription`, but the actual database table is `subscriptions`.
- `@map("user_id")` means the TypeScript field is `userId`, but the database column is `user_id`.
- `@@unique([id, userId])` lets the app safely update or delete one subscription only when the id and owner both match.
- Indexes on `userId`, `status`, and renewal dates make common dashboard and list queries faster.

## Real Flow From This Codebase

This is the current create-subscription flow.

1. User submits the subscription form.
2. `createSubscriptionAction` in `src/actions/subscriptions.ts` runs on the server.
3. The action calls `requireCurrentUser()` to get the Supabase user.
4. Guest users are checked against the 10-subscription limit.
5. The action calls `createSubscription(user.id, input)`.
6. `createSubscription` validates input, calculates status, and writes the row with Prisma.
7. Next.js revalidates dashboard and subscription pages.

The important Server Action code:

```ts
export async function createSubscriptionAction(
  input: SubscriptionMutationInput,
): Promise<ActionResult> {
  const user = await requireCurrentUser();
  const guestLimitResult = await enforceGuestCreateLimit(user.id, user.isAnonymous);
  if (guestLimitResult) {
    return guestLimitResult;
  }

  const result = await createSubscription(user.id, input);

  if (result.ok) {
    revalidateSubscriptionPaths(result.id);
  }

  return result;
}
```

The Prisma write happens in `src/server/subscriptions/service.ts`:

```ts
export async function createSubscription(
  userId: string,
  input: SubscriptionMutationInput,
): Promise<ActionResult> {
  const validation = validateSubscriptionInput(input);
  if (!validation.ok) {
    return validation;
  }

  const status = calculateSubscriptionStatus(validation.data);
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      ...validation.data,
      status: status.status,
      alertState: status.alertState,
    },
  });

  return {
    ok: true,
    message: "Subscription saved.",
    id: subscription.id,
  };
}
```

What this does:

- `validateSubscriptionInput(input)` converts and checks form values before they reach the database.
- `calculateSubscriptionStatus(validation.data)` calculates `Active`, `Upcoming`, `DueToday`, `Overdue`, `Expired`, or `Completed`.
- `prisma.subscription.create(...)` inserts a row into the `subscriptions` table.
- `userId` comes from Supabase Auth and becomes the database owner field.
- `subscription.id` is returned so the UI can revalidate and navigate around the saved record.

## User Ownership Pattern

Every subscription query must be scoped by `userId`.

Example list query:

```ts
const subscriptions = await prisma.subscription.findMany({
  where: buildWhere(userId, filters),
  orderBy: buildOrderBy(filters.sortField, filters.sortDirection),
});
```

Example update query:

```ts
await prisma.subscription.update({
  where: { id_userId: { id, userId } },
  data: {
    ...validation.data,
    status: status.status,
    alertState: status.alertState,
  },
});
```

The update uses `id_userId` because the schema defines `@@unique([id, userId])`. This prevents updating a row unless both the subscription id and the current user's id match.

## Command Reference

Run these commands from the repository root unless noted otherwise.

### `npm install`

Installs dependencies for the npm workspace.

The web app also has this `postinstall` script:

```json
"postinstall": "prisma generate --schema=prisma/schema.prisma"
```

That script generates Prisma Client inside the web workspace after dependencies are installed.

### `npm run prisma:validate`

Checks that the Prisma schema is valid.

Root script:

```json
"prisma:validate": "prisma validate"
```

Prisma uses `prisma.config.ts`, which points validation at:

```text
apps/web/prisma/schema.prisma
```

Use this after editing the Prisma schema or database-related env setup.

### `npm run prisma:migrate:deploy`

Applies committed migrations to the configured database.

Root script:

```json
"prisma:migrate:deploy": "prisma migrate deploy"
```

This should be used for applying existing migrations to staging or production. It is not for interactively designing new schema changes.

### `npm --prefix apps/web run postinstall`

Manually regenerates Prisma Client from inside the web app package.

Use this when generated Prisma types appear stale after schema or dependency changes.

### `npm run dev:web`

Starts the Next.js app:

```json
"dev:web": "npm --prefix apps/web run dev"
```

The running app uses Prisma through `DATABASE_URL` whenever server code reads or writes subscriptions.

### `npm run build:web`

Builds the Next.js app:

```json
"build:web": "npm --prefix apps/web run build"
```

This also verifies that server code using Prisma compiles correctly.

## When To Touch Prisma Files

Touch Prisma files when you need to:

- Add a new table.
- Add, remove, or rename a database column.
- Add a relation between models.
- Add an enum value.
- Add indexes or uniqueness rules.
- Change migration history for a database schema update.

Do not edit Prisma files for UI-only changes, route-only changes, or styling changes.

## Prisma And Supabase Responsibilities

| Concern | Tool |
| --- | --- |
| User login and sessions | Supabase Auth |
| Anonymous guest users | Supabase Auth |
| Database hosting | Supabase Postgres |
| Database schema definition | Prisma |
| Database migrations | Prisma |
| Typed server-side database queries | Prisma Client |
| Current user lookup before database access | Supabase SSR helpers |
| User-owned row filtering | Server code using Prisma `where: { userId }` |

The key rule is: Supabase tells us who the user is; Prisma reads and writes that user's data.
