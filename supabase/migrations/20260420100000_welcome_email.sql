-- Welcome email infrastructure: email_log table + trigger to fire
-- the send-welcome-email Edge Function on new user signup.

-- Track sent emails to prevent duplicates and provide audit trail.
create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template text not null,
  sent_at timestamptz not null default now(),
  error text
);

create index if not exists idx_email_log_user_template
  on public.email_log (user_id, template);

alter table public.email_log enable row level security;

-- Server-only: Edge Functions use service_role. No client access.
revoke all on public.email_log from anon, authenticated;

-- Trigger function: fires the send-welcome-email Edge Function via
-- pg_net (Supabase's async HTTP extension). Runs AFTER INSERT on
-- profiles, which is created by the handle_new_user trigger when
-- auth.users gets a new row.
create or replace function public.trigger_welcome_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  edge_url text;
  anon_key text;
begin
  -- Only fire for genuinely new profiles (not updates).
  -- The handle_new_user trigger creates the profile row on signup.
  edge_url := rtrim(current_setting('app.settings.supabase_url', true), '/');
  anon_key := current_setting('app.settings.supabase_anon_key', true);

  -- Guard: if pg_net or settings aren't available, fail silently.
  if edge_url is null or edge_url = '' or anon_key is null or anon_key = '' then
    return new;
  end if;

  -- Fire-and-forget async HTTP call via pg_net.
  perform net.http_post(
    url := edge_url || '/functions/v1/send-welcome-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    ),
    body := jsonb_build_object('user_id', new.id)
  );

  return new;
exception when others then
  -- Never block signup if the email trigger fails.
  return new;
end;
$$;

-- Only fire once per new profile (INSERT), not on updates.
drop trigger if exists on_profile_created_send_welcome on public.profiles;
create trigger on_profile_created_send_welcome
  after insert on public.profiles
  for each row
  execute function public.trigger_welcome_email();
