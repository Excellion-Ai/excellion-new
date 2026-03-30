-- Harden profile access to authenticated users only
DROP POLICY IF EXISTS "users_manage_own_profile" ON public.profiles;
CREATE POLICY "users_manage_own_profile"
ON public.profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Make billing tables explicitly server-write-only
CREATE POLICY "deny_insert_subscriptions"
ON public.subscriptions
FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "deny_update_subscriptions"
ON public.subscriptions
FOR UPDATE
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_delete_subscriptions"
ON public.subscriptions
FOR DELETE
TO public
USING (false);

CREATE POLICY "deny_insert_purchases"
ON public.purchases
FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "deny_update_purchases"
ON public.purchases
FOR UPDATE
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_delete_purchases"
ON public.purchases
FOR DELETE
TO public
USING (false);

CREATE POLICY "deny_insert_creator_payouts"
ON public.creator_payouts
FOR INSERT
TO public
WITH CHECK (false);

CREATE POLICY "deny_update_creator_payouts"
ON public.creator_payouts
FOR UPDATE
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_delete_creator_payouts"
ON public.creator_payouts
FOR DELETE
TO public
USING (false);

-- Keep audit and version history immutable from clients
CREATE POLICY "deny_update_audit_log"
ON public.audit_log
FOR UPDATE
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_delete_audit_log"
ON public.audit_log
FOR DELETE
TO public
USING (false);

CREATE POLICY "deny_update_course_versions"
ON public.course_versions
FOR UPDATE
TO public
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_delete_course_versions"
ON public.course_versions
FOR DELETE
TO public
USING (false);

-- Tighten private course resource downloads to owners or enrolled students
DROP POLICY IF EXISTS "users_view_resources" ON storage.objects;
CREATE POLICY "users_view_resources"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'course-resources'
  AND auth.uid() IS NOT NULL
  AND (
    EXISTS (
      SELECT 1
      FROM public.courses c
      WHERE c.user_id = auth.uid()
        AND c.id::text = (storage.foldername(name))[1]
    )
    OR EXISTS (
      SELECT 1
      FROM public.enrollments e
      WHERE e.user_id = auth.uid()
        AND e.course_id::text = (storage.foldername(name))[1]
    )
  )
);

-- Prevent public course reads from exposing internal Stripe identifiers
REVOKE SELECT (stripe_account_id, stripe_price_id, stripe_product_id)
ON public.courses
FROM anon, authenticated;