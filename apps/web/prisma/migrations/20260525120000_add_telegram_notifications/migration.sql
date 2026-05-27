create table public.user_notification_settings (
  user_id uuid primary key,
  telegram_enabled boolean not null default false,
  telegram_chat_id varchar(64),
  telegram_username varchar(160),
  telegram_first_name varchar(160),
  telegram_last_name varchar(160),
  telegram_connected_at timestamptz(6),
  created_at timestamptz(6) not null default now(),
  updated_at timestamptz(6) not null default now()
);

create table public.telegram_pairing_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  token_hash varchar(64) not null,
  expires_at timestamptz(6) not null,
  consumed_at timestamptz(6),
  created_at timestamptz(6) not null default now(),
  constraint telegram_pairing_tokens_token_hash_key unique (token_hash)
);

create index user_notification_settings_telegram_chat_idx
  on public.user_notification_settings (telegram_chat_id)
  where telegram_chat_id is not null;

create index telegram_pairing_tokens_user_expiry_idx
  on public.telegram_pairing_tokens (user_id, expires_at);

create index telegram_pairing_tokens_hash_expiry_idx
  on public.telegram_pairing_tokens (token_hash, expires_at);

alter table public.user_notification_settings enable row level security;
alter table public.telegram_pairing_tokens enable row level security;

create policy "Users can read their own notification settings"
  on public.user_notification_settings
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own notification settings"
  on public.user_notification_settings
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own notification settings"
  on public.user_notification_settings
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own notification settings"
  on public.user_notification_settings
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own Telegram pairing tokens"
  on public.telegram_pairing_tokens
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own Telegram pairing tokens"
  on public.telegram_pairing_tokens
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own Telegram pairing tokens"
  on public.telegram_pairing_tokens
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own Telegram pairing tokens"
  on public.telegram_pairing_tokens
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.user_notification_settings to authenticated;
grant select, insert, update, delete on public.telegram_pairing_tokens to authenticated;
