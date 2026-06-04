-- Security hardening: address 6 WARN-level lints from Supabase advisor.

-- 1. Replace wide-open leads INSERT policies with constrained checks.
--    Drop "Auth insert leads" entirely (authenticated users never submit
--    the public lead-capture form; they use the builder directly).

drop policy if exists "Anon insert leads" on public.leads;
drop policy if exists "Auth insert leads" on public.leads;

create policy "Anon insert leads constrained" on public.leads
  for insert to anon
  with check (
    source = 'builder_preview'
    and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(email) <= 320
  );


-- 2. Revoke direct RPC execute on has_role and prevent_profile_role_change.
--    search_path is already pinned on both.
--
--    CRITICAL: has_role is used inside RLS policies on
--    founding_coach_applications. PostgreSQL evaluates RLS policy
--    expressions as the table owner (typically postgres), not as the
--    calling role, so REVOKE EXECUTE FROM public does NOT break RLS
--    evaluation. It only prevents direct /rest/v1/rpc/has_role calls.

revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated, public;
revoke execute on function public.prevent_profile_role_change() from anon, authenticated, public;


-- 3. Add owner-scoped UPDATE policy on course-resources storage bucket
--    so course owners can replace uploaded resource files.

create policy "creators_update_resources" on storage.objects
  for update
  using (
    bucket_id = 'course-resources'
    and auth.uid() is not null
    and exists (
      select 1 from public.courses c
      where c.user_id = auth.uid()
      and c.id::text = (storage.foldername(name))[1]
    )
  )
  with check (
    bucket_id = 'course-resources'
    and auth.uid() is not null
    and exists (
      select 1 from public.courses c
      where c.user_id = auth.uid()
      and c.id::text = (storage.foldername(name))[1]
    )
  );
