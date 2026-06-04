-- Funnel fix: extend leads table for anonymous outline capture,
-- add anon INSERT policy, and remove founding strip support from nav.

-- 1. Extend leads table with niche and outline columns
alter table public.leads add column if not exists niche text;
alter table public.leads add column if not exists outline jsonb;

-- 2. Allow anonymous visitors to insert leads (email capture form)
create policy "Anon insert leads" on public.leads
  for insert to anon
  with check (true);

-- 3. Ensure authenticated users can also insert leads
create policy "Auth insert leads" on public.leads
  for insert to authenticated
  with check (true);

-- 4. Grant INSERT to anon (table-level, RLS handles the rest)
grant insert on public.leads to anon;
grant insert on public.leads to authenticated;
