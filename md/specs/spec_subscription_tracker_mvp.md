# SPEC-1-Subscription Tracker Web App

## Background

Many people track subscriptions in spreadsheets, but spreadsheets are weak at proactive reminders, consistent status rules, filtering, and CRUD workflows. This app converts a row-based spreadsheet into a simple web application where each row becomes one subscription record. The goal is a practical React web app with a basic backend that helps users track recurring and one-time subscriptions, know what is due, and avoid missed renewals or accidental charges.

## Requirements

### Must have
- Import or manually create subscription records using these fields:
  - Service Name
  - USD
  - Amount
  - Date Paid
  - Renewal Cycle
  - Next Renewal Date
  - Expiration Date
  - Status/Alert
  - Done?
  - Remarks
- Show a dashboard with upcoming renewals, overdue items, expired items, and active items.
- Support full CRUD for subscriptions.
- Apply consistent status logic automatically instead of relying only on manual spreadsheet labels.
- Allow marking reminders/tasks as done.
- Support simple search, filter, and sort.
- Store remarks such as “Auto Renewal Cancel”.

### Should have
- Spreadsheet/CSV import and export.
- Simple reminder flow for upcoming renewals and overdue subscriptions.
- Basic summary totals by month and by status.
- Support both recurring subscriptions and one-time subscriptions.
- User accounts with personal data isolation.
- Guest mode with limited anonymous access before account upgrade.

### Could have
- Email reminders.
- Multi-currency support beyond USD and NPR display.
- Calendar view.
- Renewal history/audit trail.

### Won’t have in MVP
- Complex accounting features.
- Bank integrations.
- Team collaboration.
- Advanced budgeting and forecasting.
- Native mobile apps.

## Method

### App overview

A small web app with:
- Next.js App Router frontend for dashboard, forms, and tables.
- Next.js backend layer using Server Actions and Route Handlers for subscription data and reminder processing.
- Supabase Postgres for storing subscriptions and optional reminder events.
- Supabase scheduled Edge Function that recalculates statuses and generates reminders.

This should be easy to build as a small full-stack Next.js app backed by Supabase and Prisma.

### Stack transition note

The previous separate API app has been removed from the target repo structure. Future implementation should happen under `apps/web` using Next.js App Router backend capabilities, Prisma, and Supabase.

### Target users

- Individuals managing personal entertainment, software, cloud, and utility subscriptions.
- Freelancers or students who need simple renewal tracking.
- Small users migrating from spreadsheets who want alerts and better visibility.

### User problems this app solves

- Forgetting upcoming renewals.
- Missing expiration dates for one-time subscriptions.
- Difficulty seeing which services are overdue or active.
- Manual spreadsheet formulas causing inconsistent status labels.
- No simple dashboard for monthly subscription obligations.
- No easy CRUD workflow for updating subscription records.

### Core use cases

1. User imports spreadsheet rows into the app.
2. User creates a new subscription manually.
3. User edits payment dates, renewal cycle, or remarks.
4. User views dashboard summary of active, overdue, expired, and upcoming renewals.
5. User filters subscriptions by status, cycle, or date range.
6. User marks an alert/task as done.
7. User receives a reminder before the next renewal date.
8. User exports current subscription data back to CSV.

### High-level architecture

```plantuml
@startuml
actor User
participant "Next.js Web App" as FE
participant "Next.js Server Actions / Route Handlers" as API
database "Supabase Postgres" as DB
participant "Supabase Scheduled Edge Function" as CRON
participant "Resend / Slack Notifier (later)" as NOTIFY

User -> FE: View dashboard / manage subscriptions
FE -> API: Form actions / HTTP requests
API -> DB: Read/write subscriptions
CRON -> API: Trigger status refresh boundary
API -> DB: Recalculate statuses / reminders with Prisma
API -> NOTIFY: Send reminder (later)
@enduml
```

### Recommended MVP architecture

- Frontend and backend shell: Next.js App Router with TypeScript
- Backend layer: Next.js Server Actions for form mutations and Route Handlers for HTTP-style endpoints
- Database: Supabase Postgres
- ORM: Prisma ORM
- Scheduler: Supabase scheduled Edge Functions for daily status refresh and reminder generation
- Auth: Supabase Auth for MVP user accounts and data isolation

### Preferred tech stack

The stack should prioritize open-source tools or platforms with a meaningful free tier.

#### Frontend
- **Next.js (React)** for the web app UI.
  - Good fit for dashboard pages, forms, search/filter UI, and deployment simplicity.
  - Easy hosting on Vercel Hobby.
- **Next.js App Router backend capabilities** for co-locating UI, form mutations, and HTTP-style endpoints in one deployable app.
- **UI**: Tailwind CSS for fast MVP styling.
- **Tables/forms**: TanStack Table for data table features and React Hook Form + Zod for form handling and validation.

#### Backend
- **Next.js Server Actions** for trusted form mutations such as create, update, delete, and mark done.
- **Next.js Route Handlers** for HTTP-style boundaries such as CSV import/export, dashboard summary reads, and scheduled refresh triggers.
- **Validation**: Zod at action and route-handler boundaries.
- **Stack note**: the previous separate API app has been removed; new backend milestone work belongs in `apps/web`.

#### Database
- **Supabase Postgres** as the primary database.
- **Supabase Auth** for authentication and personal data isolation.
  - MVP permanent accounts use email magic links.
  - Guest mode uses Supabase anonymous users.
  - Both permanent and anonymous users are isolated through `user_id`.
- **Prisma ORM** for schema, migrations, and type-safe database access.
  - Prisma ORM is open-source and works well with Next.js and Supabase Postgres.

#### File import/export
- **CSV import/export** first for spreadsheet compatibility.
- For Excel support later, add a lightweight parsing library only if needed.

#### Notifications
- **MVP**: in-app alerts only.
- **Later**: email reminders with Resend and Slack webhook alerts.

#### Auth and guest access
- Supabase Auth is the identity provider for all persisted user data.
- Permanent users sign in with email magic links.
- Guest users are Supabase anonymous users, not unauthenticated public visitors.
- Guest users can create up to 10 subscriptions and can view/edit/delete their own records.
- CSV import/export is available only to permanent users until the guest policy changes.
- Guest upgrade links an email identity to the anonymous user so existing records remain under the same `user_id`.
- Server-side code must derive ownership from the verified Supabase session; no fixed development owner id is used.

### Open-source / free-tier-first tool choices

Preferred defaults:
- Next.js: open-source
- Prisma ORM: open-source
- Supabase Postgres: hosted Postgres with a practical free tier
- Supabase Auth: managed auth with a practical free tier
- Supabase Edge Functions: scheduled reminder/status work
- Tailwind CSS: open-source
- TanStack Table: open-source
- React Hook Form: open-source
- Zod: open-source
- Resend and Slack webhooks: later notification integrations

For hosted services, prefer free-tier platforms first and keep the app portable so it can move later.

### Hosting recommendations

#### Best low-cost MVP hosting setup
- **Next.js app**: Vercel Hobby or a similar Next.js-friendly host
- **Database and auth**: Supabase Postgres and Supabase Auth
- **Scheduled work**: Supabase scheduled Edge Functions

#### Recommended default deployment
1. **Next.js app on Vercel Hobby or similar**
   - Good fit for Next.js deployment and preview deployments.
   - Free tier is strong for personal projects and MVPs.
2. **Supabase for Postgres and Auth**
   - Keeps database, authentication, and operational setup simple for the MVP.
   - Works with Prisma when `DATABASE_URL` and direct migration connection settings are configured correctly.
3. **Supabase scheduled Edge Functions**
   - Run daily status refresh and reminder generation close to the Supabase project.

#### Alternative single-platform leaning
- If the app is kept very small, some scheduled tasks can be triggered with Vercel Cron calling protected Next.js Route Handlers.
- Vercel cron jobs are available on all plans, but Hobby has a minimum interval of once per day with hourly precision, which is enough for this subscription tracker MVP.

#### Hosting notes for this app
- Daily status refresh is enough for MVP, so free-tier cron is acceptable.
- Keep reminder generation idempotent so cron reruns do not create duplicate alerts.
- Keep file import processing small and asynchronous if the data set grows.
- Store secrets in hosting platform environment variables.
- Use separate environments for local, staging, and production if possible.
- Store Supabase service-role credentials only in trusted server-side environments.

### Main entities

#### 1. Subscription
Primary business record.

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| service_name | string | Yes | Example: Netflix |
| usd_amount | decimal(10,2) | No | Original USD amount |
| local_amount | decimal(12,2) | No | Example: NPR amount |
| currency_code | string | No | Default can be NPR for local amount |
| date_paid | date | No | Last paid date |
| renewal_cycle | enum | Yes | Monthly, Quarterly, Yearly, OneTime |
| next_renewal_date | date | No | Used for recurring subscriptions |
| expiration_date | date | No | Used for one-time subscriptions or access end |
| status | enum | Yes | Computed, optionally override-disabled |
| alert_state | enum | Yes | None, Upcoming, DueToday, Overdue, Expired |
| done | boolean | Yes | Default false; user action completed |
| remarks | text | No | Free text |
| created_at | timestamp | Yes | Audit |
| updated_at | timestamp | Yes | Audit |

#### 2. ReminderEvent (optional but useful)
Tracks reminders generated/sent.

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| subscription_id | UUID | Yes | FK to subscription |
| reminder_type | enum | Yes | Upcoming, DueToday, Overdue |
| scheduled_for | timestamp | Yes | When reminder should trigger |
| sent_at | timestamp | No | When reminder was sent |
| status | enum | Yes | Pending, Sent, Failed, Dismissed |
| created_at | timestamp | Yes | Audit |

### Field definitions based on spreadsheet

- **Service Name**: Name of the service or subscription.
- **USD**: Price in USD, optional if local amount is the primary tracked value.
- **Amount**: Local charged amount, such as NPR.
- **Date Paid**: Last payment date.
- **Renewal Cycle**: Frequency of renewal. Suggested enum values:
  - Monthly
  - Quarterly
  - Yearly
  - OneTime
- **Next Renewal Date**: Next billing date for recurring subscriptions.
- **Expiration Date**: End-of-access date for one-time or prepaid subscriptions.
- **Status/Alert**: System-generated status label shown to the user.
- **Done?**: Whether the user has handled the current alert/task.
- **Remarks**: Notes like cancellation status or provider comments.

### Status logic

Status should be derived by the Next.js backend layer daily and also recalculated on create/update.

#### Proposed status values
- Active
- Upcoming
- DueToday
- Overdue
- Expired
- Completed

#### Rules
1. If `done = true`, status can display as `Completed` for the current reminder cycle, but the subscription itself still remains active in the long term if it is recurring.
2. For `renewal_cycle = OneTime`:
   - If `expiration_date` is in the future, status = `Active`.
   - If `expiration_date` is today, status = `DueToday` or `ExpiresToday` internally, but MVP can map to `DueToday`.
   - If `expiration_date` is in the past, status = `Expired`.
3. For recurring subscriptions:
   - If `next_renewal_date` is more than 7 days away, status = `Active`.
   - If `next_renewal_date` is within the next 7 days, status = `Upcoming`.
   - If `next_renewal_date` is today, status = `DueToday`.
   - If `next_renewal_date` is in the past and `done = false`, status = `Overdue`.
4. If remarks indicate “Auto Renewal Cancel”, this does not change status by itself, but should be visible as a badge/note.

#### Pseudocode

```text
if renewal_cycle == OneTime:
  if expiration_date is null:
    status = Active
  else if expiration_date < today:
    status = Expired
  else if expiration_date == today:
    status = DueToday
  else:
    status = Active
else:
  if next_renewal_date is null:
    status = Active
  else if next_renewal_date < today and done == false:
    status = Overdue
  else if next_renewal_date == today:
    status = DueToday
  else if next_renewal_date <= today + 7 days:
    status = Upcoming
  else:
    status = Active
```

### Dashboard requirements

The dashboard should answer: what needs attention, what is upcoming, and what am I spending?

#### Dashboard widgets
- Summary cards:
  - Total subscriptions
  - Active
  - Upcoming
  - Overdue
  - Expired
- Upcoming renewals list (next 7 or 30 days)
- Overdue items list
- Recent additions/updates
- Monthly spend estimate
- Table view with quick filters

#### Filters
- Status
- Renewal cycle
- Done state
- Date range
- Search by service name

#### Sorting
- Next renewal date ascending
- Expiration date ascending
- Amount descending
- Recently updated

### CRUD features

#### Create
- Add new subscription manually.
- Validate required fields based on cycle type.
- Auto-calculate initial status.

#### Read
- List all subscriptions.
- View subscription detail.
- Search, sort, and filter.

#### Update
- Edit any field.
- Recompute status after save.
- Optionally provide quick action buttons:
  - Mark done
  - Snooze alert (future improvement)
  - Update payment date

#### Delete
- Soft delete preferred for audit safety, but hard delete is acceptable for MVP.

### Reminders and alerts flow

#### Basic reminder flow
1. Scheduler runs once daily.
2. Backend finds records where:
   - recurring subscription renews within 7 days,
   - recurring subscription is due today,
   - recurring subscription is overdue,
   - one-time subscription expires today or has expired.
3. Backend updates `status` and `alert_state`.
4. App dashboard highlights these records.
5. Later: backend sends Resend email or Slack webhook notifications for qualifying alerts.
6. User marks alert/task as done.
7. For recurring subscriptions, after user records a payment, the user updates `date_paid` and `next_renewal_date`.

#### Flow diagram

```plantuml
@startuml
start
:Daily scheduler runs;
:Load subscriptions;
if (OneTime?) then (yes)
  if (Expiration < today) then (yes)
    :Set Expired;
  elseif (Expiration == today) then (yes)
    :Set DueToday;
  else (no)
    :Set Active;
  endif
else (no)
  if (Renewal < today and done=false) then (yes)
    :Set Overdue;
  elseif (Renewal == today) then (yes)
    :Set DueToday;
  elseif (Renewal <= today+7) then (yes)
    :Set Upcoming;
  else (no)
    :Set Active;
  endif
endif
:Save status;
stop
@enduml
```

## Implementation

### Suggested MVP build steps

1. Create the frontend app with Next.js and Tailwind CSS.
2. Create the Next.js backend layer under `apps/web`:
   - subscription Server Actions for create, update, delete, and mark done
   - Route Handlers for list/detail reads where HTTP access is useful
   - dashboard summary query handler
   - CSV import/export handlers
   - protected reminder/status refresh boundary
3. Create a Supabase project and configure Supabase Auth.
   - Enable email magic links.
   - Enable Anonymous Sign-Ins for guest mode.
   - Enable manual identity linking for guest upgrade.
   - Add local and production `/auth/callback` URLs to allowed redirect URLs.
4. Define Prisma schema for subscriptions, user ownership, and optional reminder events.
5. Connect Prisma to Supabase Postgres and apply initial migrations.
6. Build backend boundaries:
   - list subscriptions
   - get subscription by id
   - create subscription
   - update subscription
   - delete subscription
   - mark done
   - import subscriptions
   - export subscriptions
   - dashboard summary
7. Implement status calculation service shared by actions, handlers, and scheduled refresh.
8. Add Supabase scheduled Edge Function for daily status refresh and reminder generation.
9. Build frontend pages:
   - Dashboard
   - Subscription list
   - Create/edit form
   - Import/export page
10. Add table filters and search.
11. Add quick actions for mark done and edit.
12. Deploy the Next.js app and Supabase project on free-tier-friendly hosting.
13. Add optional Resend email and Slack webhook reminder support later.

### API payload example

```json
{
  "serviceName": "Netflix",
  "usdAmount": 7.99,
  "localAmount": 1150.56,
  "datePaid": "2025-12-27",
  "renewalCycle": "Monthly",
  "nextRenewalDate": "2026-01-27",
  "expirationDate": null,
  "done": false,
  "remarks": ""
}
```

### Validation rules

- `serviceName` required.
- `renewalCycle` required.
- For recurring cycles, `nextRenewalDate` should normally be present.
- For `OneTime`, `expirationDate` is recommended.
- Amount fields must be non-negative.
- `datePaid`, `nextRenewalDate`, and `expirationDate` must be valid dates.

## Milestones

### Milestone 1: Data foundation
- Database schema created
- Next.js backend actions/handlers working
- Status calculation service working

### Milestone 2: Frontend MVP
- Dashboard page
- Subscription table with filters
- Create/edit/delete workflows

### Milestone 3: Spreadsheet workflow
- CSV import
- CSV export
- Basic validation and error handling

### Milestone 4: Alerts
- Supabase scheduled status refresh
- In-app alert highlighting
- Optional Resend email or Slack webhook reminders

## Gathering Results

Success can be measured by:
- User can import spreadsheet data with minimal cleanup.
- User can identify overdue and upcoming subscriptions from the dashboard in under 10 seconds.
- Status values remain consistent after edits and daily recalculation.
- User can complete create/edit/update flows without using the spreadsheet anymore.
- No missed renewals caused by lack of visibility.

### MVP acceptance checklist
- Can manage at least 100+ subscriptions smoothly.
- Dashboard loads active/upcoming/overdue/expired counts correctly.
- Status logic works for recurring and one-time subscriptions.
- CSV import maps spreadsheet columns correctly.
- User can mark records done and update renewal information.

## MVP scope

The MVP should include:
- Multi-user web app with personal data isolation
- Limited guest mode backed by Supabase anonymous users
- Next.js App Router frontend and backend layer
- Supabase Postgres database
- Supabase Auth
- Prisma ORM and migrations
- Subscription CRUD
- Dashboard with status summaries
- CSV import/export
- Automatic status logic
- Daily in-app reminders/alerts
- Free-tier-friendly deployment setup

## Future improvements

- Shared household/team subscriptions
- Email and push notifications
- Calendar integration
- Automatic next renewal date calculation from payment updates
- Renewal/payment history log
- Currency conversion and exchange rate sync
- Subscription categories and tags
- Charts for monthly/yearly spend trends
- Auto-detect duplicate subscriptions during import
- Mobile-friendly PWA support

## Need Professional Help in Developing Your Architecture?

Please contact me at [sammuti.com](https://sammuti.com) :)
