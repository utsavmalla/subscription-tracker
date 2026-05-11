# Subscription Tracker TODOs

This checklist is derived from:
- `md/specs/spec_subscription_tracker_mvp.md`
- `md/specs/ui_layout_subscription_tracker.md`
- `md/specs/figma_draft_subscription_tracker.md`
- Existing Figma design: https://www.figma.com/design/m5qI2GvjNYMeE1PSxEIMWp

## Stack transition note

- Target MVP stack: Next.js App Router + TypeScript, Next.js Server Actions/Route Handlers, Supabase Postgres/Auth, Prisma, Supabase scheduled Edge Functions, and later Resend/Slack alerts.
- The previous separate API app has been removed. Active implementation should happen under `apps/web` using Next.js backend capabilities.
- Existing Neon-related work is legacy previous setup and should not drive new MVP milestones.

## Milestone 1: Project foundation

- [x] Decide final repo structure for frontend, backend, shared types, and database files.
- [x] Scaffold the Next.js frontend app.
- [x] Add Tailwind CSS and base app shell styling.
- [x] Add Prisma ORM.
- [x] Create environment variable examples for local development.
- [x] Configure legacy Neon Postgres connection settings. Not the target database for new MVP work.
- [x] Remove previous separate API app from the workspace.
- [x] Add basic lint, format, and build scripts.
- [ ] Create Supabase project.
- [ ] Configure Supabase Postgres connection settings for Prisma.
- [ ] Configure Supabase Auth project settings in the Supabase dashboard.
- [x] Add Supabase environment variable templates for local development.

## Milestone 2: Design handoff and frontend reference

- [x] Use existing Figma design as the visual source of truth.
- [x] Use `md/specs/figma_draft_subscription_tracker.md` as the implementation reference.
- [x] Confirm core screen coverage: dashboard, subscriptions, add subscription, import/export, alerts, and mobile dashboard.
- [ ] Extract final frontend tokens for color, typography, spacing, radius, and shadow from the design.
- [ ] Map reusable UI elements from the design to frontend components.

## Milestone 3: Dashboard UI

- [x] Build desktop app shell with sidebar navigation.
- [x] Build mobile top header.
- [x] Create dashboard page.
- [x] Add summary metric cards for total, active, upcoming, overdue, and expired.
- [x] Add upcoming renewals panel.
- [x] Add overdue items panel.
- [x] Add monthly spend estimate widget.
- [x] Add recent updates widget.
- [x] Add compact subscriptions table preview.
- [x] Add responsive mobile card layout.

## Milestone 4: Subscription management UI

- [x] Create subscriptions list page.
- [x] Add search bar.
- [x] Add status filter.
- [x] Add renewal cycle filter.
- [x] Add done-state filter.
- [x] Add date range filter.
- [x] Add sortable data table for desktop.
- [x] Add stacked subscription cards for mobile.
- [x] Add row actions: view, edit, mark done, and delete.
- [x] Add confirm delete modal.
- [ ] Add toast messages for create, update, delete, import, and export.

## Milestone 5: Create, edit, and detail flows

- [x] Build shared create/edit subscription form.
- [x] Add basic details fields.
- [x] Add payment and date fields.
- [x] Add done checkbox.
- [x] Add computed status preview.
- [x] Add remarks textarea.
- [x] Emphasize expiration date for one-time subscriptions.
- [x] Emphasize next renewal date for recurring subscriptions.
- [x] Add `Save Subscription`, `Save and Add Another`, and `Cancel` actions.
- [x] Build subscription detail page or drawer.
- [x] Show full remarks and cancellation badges in detail view.

## Milestone 6: Alerts and reminders UI

- [x] Highlight upcoming, due today, overdue, and expired records in the UI.
- [x] Create alerts page.
- [x] Add alert tabs for upcoming, due today, overdue, expired, and completed.
- [x] Add quick actions from alert rows.
- [x] Support marking alert tasks as done.

## Milestone 7: Settings and polish

- [ ] Create lightweight settings page.
- [ ] Add default currency display setting placeholder.
- [ ] Add reminder window setting placeholder.
- [ ] Add future email reminder toggle placeholder.
- [ ] Add empty states for no subscriptions, no overdue items, and no search results.
- [ ] Add loading skeletons for dashboard and tables.
- [ ] Add API and form error states.
- [ ] Verify mobile responsiveness across core screens.

## Milestone 8: Data model and status logic

- [x] Define `Subscription` Prisma model.
- [x] Define subscription enums for renewal cycle, status, and alert state.
- [x] Add optional `ReminderEvent` Prisma model.
- [x] Create initial Prisma migration.
- [x] Apply initial Prisma migration to legacy Neon database. Not the target deployment database.
- [x] Apply Prisma migration to Supabase Postgres.
- [x] Add Supabase Auth user ownership fields and access constraints to the data model.
- [x] Add Supabase SSR auth client helpers for browser, server, and proxy session refresh.
- [x] Replace temporary development owner id with session-backed Supabase user resolution.
- [x] Add email magic-link login flow and `/auth/callback` route.
- [x] Add sign-out flow.
- [x] Add capped guest mode with Supabase anonymous users.
- [x] Enforce guest create limit at 10 subscriptions.
- [x] Implement status calculation for recurring subscriptions.
- [x] Implement status calculation for one-time subscriptions.
- [x] Recalculate status on create and update.
- [x] Add tests for status logic edge cases.
- [x] Ensure `Auto Renewal Cancel` remarks remain visible without changing computed status.

## Milestone 9: Next.js Backend Layer

- [x] Create `apps/web` backend folder structure for actions, route handlers, queries, and services.
- [x] Create subscription Server Actions for create, update, delete, and mark done.
- [x] Create subscription Route Handlers for HTTP-style list/detail access where needed.
- [x] Create dashboard summary query handler.
- [ ] Create CSV import/export Route Handlers.
- [x] Create reminder/status refresh function boundary for scheduled execution.
- [x] Implement list subscriptions handler/query.
- [x] Implement get subscription by id handler/query.
- [x] Implement create subscription action.
- [x] Implement update subscription action.
- [x] Implement delete subscription action.
- [x] Implement mark-done quick action.
- [x] Implement dashboard summary query.
- [x] Add validation for required fields, dates, and non-negative amounts.
- [x] Add sorting by renewal date, expiration date, amount, and updated date.
- [x] Add filters for status, renewal cycle, done state, date range, and service search.
- [x] Replace frontend mock subscription data with Next.js handlers/actions backed by Prisma.
- [x] Verify real subscription records load from Supabase Postgres through Prisma.

## Milestone 10: CSV import and export

- [ ] Implement `POST /subscriptions/import`.
- [ ] Implement `GET /subscriptions/export`.
- [ ] Map spreadsheet columns to subscription fields.
- [ ] Validate imported rows before saving.
- [ ] Show import errors without blocking valid rows where possible.
- [ ] Add import preview support for the frontend.
- [ ] Export all subscriptions to CSV.
- [ ] Export filtered subscriptions to CSV.

## Milestone 11: Reminders and scheduled jobs

- [x] Add Supabase scheduled Edge Function for daily status refresh.
- [x] Connect scheduled function to the protected Next.js reminder/status refresh boundary or shared refresh service.
- [x] Make reminder generation idempotent.
- [x] Keep MVP notifications in-app only.
- [ ] Add later Resend email reminder integration.
- [ ] Add later Slack webhook reminder integration.

## Milestone 12: Deployment

- [x] Select target hosting stack: Next.js app on Vercel or similar, Supabase for Postgres/Auth/scheduled functions.
- [x] Configure Next.js app deployment.
- [ ] Configure Supabase project for production.
- [x] Configure legacy managed PostgreSQL database. Not the target database for new MVP work.
- [x] Add legacy Neon database environment variable templates. Not the target environment for new MVP work.
- [ ] Add Supabase database and auth environment variables to hosting providers.
- [ ] Configure Supabase scheduled Edge Function deployment.
- [ ] Verify Prisma migrations run against Supabase Postgres.
- [ ] Smoke test the deployed MVP.

## MVP acceptance checklist

- [ ] User can create, read, update, and delete subscriptions.
- [ ] User can import spreadsheet data with minimal cleanup.
- [ ] User can export subscription data to CSV.
- [ ] Dashboard shows active, upcoming, overdue, and expired counts correctly.
- [ ] Status logic works for recurring subscriptions.
- [ ] Status logic works for one-time subscriptions.
- [ ] User can mark records done.
- [ ] User can search, filter, and sort subscriptions.
- [ ] App handles at least 100 subscriptions smoothly.
- [ ] User can identify overdue and upcoming subscriptions from the dashboard quickly.

## Future improvements

- [x] Add user authentication and personal data isolation.
- [x] Add capped guest mode with Supabase anonymous users.
- [ ] Add shared household or team subscriptions.
- [ ] Add email reminders.
- [ ] Add push notifications.
- [ ] Add calendar integration.
- [ ] Add automatic next-renewal-date calculation from payment updates.
- [ ] Add renewal and payment history log.
- [ ] Add multi-currency support and exchange-rate sync.
- [ ] Add categories and tags.
- [ ] Add monthly and yearly spend charts.
- [ ] Add duplicate subscription detection during import.
- [ ] Add mobile-friendly PWA support.
