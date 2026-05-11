delete from public.reminder_events
where id in (
  select id
  from (
    select
      id,
      row_number() over (
        partition by user_id, subscription_id, reminder_type, scheduled_for
        order by created_at, id
      ) as duplicate_position
    from public.reminder_events
  ) duplicates
  where duplicate_position > 1
);

alter table public.reminder_events
  add constraint reminder_events_unique_daily_subscription_type
  unique (user_id, subscription_id, reminder_type, scheduled_for);
