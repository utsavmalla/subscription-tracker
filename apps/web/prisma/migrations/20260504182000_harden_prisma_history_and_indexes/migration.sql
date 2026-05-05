create index reminder_events_subscription_owner_idx
  on public.reminder_events (subscription_id, user_id);

alter table if exists public._prisma_migrations enable row level security;
revoke all on table public._prisma_migrations from anon, authenticated;
