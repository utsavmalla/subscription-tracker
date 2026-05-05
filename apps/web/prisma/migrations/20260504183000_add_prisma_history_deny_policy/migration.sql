create policy "No client access to Prisma migration history"
  on public._prisma_migrations
  for all
  to authenticated
  using (false)
  with check (false);
