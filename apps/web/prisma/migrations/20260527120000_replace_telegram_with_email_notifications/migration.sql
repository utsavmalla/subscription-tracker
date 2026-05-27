drop table if exists public.telegram_pairing_tokens;

drop index if exists public.user_notification_settings_telegram_chat_idx;

alter table public.user_notification_settings
  rename column telegram_enabled to email_enabled;

alter table public.user_notification_settings
  add column email_to varchar(320),
  add column email_verified_at timestamptz(6),
  drop column if exists telegram_chat_id,
  drop column if exists telegram_username,
  drop column if exists telegram_first_name,
  drop column if exists telegram_last_name,
  drop column if exists telegram_connected_at;

update public.user_notification_settings
set email_enabled = false
where email_to is null;

create index user_notification_settings_email_enabled_idx
  on public.user_notification_settings (email_enabled);
