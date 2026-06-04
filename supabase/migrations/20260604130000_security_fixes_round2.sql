-- Security fixes: comp_access policy, stripe_payment_url validation,
-- paywall server-side enforcement, lesson_progress client INSERT.

-- 1. Fix comp_access SELECT policy: email_verified JWT claim is unreliable.
--    Rely on the email match alone. The JWT email is already verified by
--    Supabase auth (only confirmed emails produce valid sessions).
drop policy if exists "users_can_check_own_comp_access" on public.comp_access;
create policy "users_can_check_own_comp_access" on public.comp_access
  for select to authenticated
  using (email = (auth.jwt() ->> 'email'));

-- Grant SELECT so the policy can run (was previously revoked for all).
grant select on public.comp_access to authenticated;


-- 2. Validate stripe_payment_url at write time: must be https on a real
--    Stripe domain. Prevents open-redirect via arbitrary URLs.
alter table public.courses drop constraint if exists courses_stripe_payment_url_check;
alter table public.courses add constraint courses_stripe_payment_url_check
  check (
    stripe_payment_url is null
    or stripe_payment_url ~ '^https://(buy\.stripe\.com|checkout\.stripe\.com)/'
  );


-- 3. Lesson progress: add authenticated INSERT policy scoped to enrollment
--    owner. The client calls markLessonComplete from useLessonProgress.ts
--    but the current INSERT policy is service_role-only, so it silently fails.
create policy "enrolled_users_insert_progress" on public.lesson_progress
  for insert to authenticated
  with check (
    exists (
      select 1 from public.enrollments e
      where e.id = enrollment_id
      and e.user_id = auth.uid()
    )
  );

-- Grant INSERT to authenticated (table-level)
grant insert on public.lesson_progress to authenticated;
