create extension if not exists pgcrypto with schema extensions;

create type public."RenewalCycle" as enum ('Monthly', 'Quarterly', 'Yearly', 'OneTime');
create type public."SubscriptionStatus" as enum ('Active', 'Upcoming', 'DueToday', 'Overdue', 'Expired', 'Completed');
create type public."AlertState" as enum ('None', 'Upcoming', 'DueToday', 'Overdue', 'Expired');
create type public."ReminderType" as enum ('Upcoming', 'DueToday', 'Overdue');
create type public."ReminderEventStatus" as enum ('Pending', 'Sent', 'Failed', 'Dismissed');

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  service_name varchar(160) not null,
  usd_amount decimal(10, 2),
  local_amount decimal(12, 2),
  currency_code varchar(3),
  date_paid date,
  renewal_cycle public."RenewalCycle" not null,
  next_renewal_date date,
  expiration_date date,
  status public."SubscriptionStatus" not null default 'Active',
  alert_state public."AlertState" not null default 'None',
  done boolean not null default false,
  remarks text,
  created_at timestamptz(6) not null default now(),
  updated_at timestamptz(6) not null default now(),
  constraint subscriptions_id_user_id_key unique (id, user_id),
  constraint subscriptions_usd_amount_non_negative check (usd_amount is null or usd_amount >= 0),
  constraint subscriptions_local_amount_non_negative check (local_amount is null or local_amount >= 0),
  constraint subscriptions_currency_code_length check (currency_code is null or char_length(currency_code) = 3)
);

create table public.reminder_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  subscription_id uuid not null,
  reminder_type public."ReminderType" not null,
  scheduled_for timestamptz(6) not null,
  sent_at timestamptz(6),
  status public."ReminderEventStatus" not null default 'Pending',
  created_at timestamptz(6) not null default now(),
  constraint reminder_events_subscription_owner_fkey
    foreign key (subscription_id, user_id)
    references public.subscriptions (id, user_id)
    on delete cascade
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_user_status_idx on public.subscriptions (user_id, status);
create index subscriptions_user_alert_state_idx on public.subscriptions (user_id, alert_state);
create index subscriptions_user_next_renewal_idx
  on public.subscriptions (user_id, next_renewal_date)
  where next_renewal_date is not null;
create index subscriptions_user_expiration_idx
  on public.subscriptions (user_id, expiration_date)
  where expiration_date is not null;

create index reminder_events_user_id_idx on public.reminder_events (user_id);
create index reminder_events_subscription_id_idx on public.reminder_events (subscription_id);
create index reminder_events_user_status_scheduled_idx
  on public.reminder_events (user_id, status, scheduled_for);

alter table public.subscriptions enable row level security;
alter table public.reminder_events enable row level security;

create policy "Users can read their own subscriptions"
  on public.subscriptions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own subscriptions"
  on public.subscriptions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own subscriptions"
  on public.subscriptions
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own subscriptions"
  on public.subscriptions
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own reminder events"
  on public.reminder_events
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own reminder events"
  on public.reminder_events
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own reminder events"
  on public.reminder_events
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own reminder events"
  on public.reminder_events
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant usage on type public."RenewalCycle" to authenticated;
grant usage on type public."SubscriptionStatus" to authenticated;
grant usage on type public."AlertState" to authenticated;
grant usage on type public."ReminderType" to authenticated;
grant usage on type public."ReminderEventStatus" to authenticated;
grant select, insert, update, delete on public.subscriptions to authenticated;
grant select, insert, update, delete on public.reminder_events to authenticated;
