
-- 1) Attach role-change prevention trigger on profiles
DROP TRIGGER IF EXISTS prevent_profile_role_change_trg ON public.profiles;
CREATE TRIGGER prevent_profile_role_change_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_change();

-- 2) Revoke sensitive Stripe columns on courses from anon (and authenticated non-service);
-- service_role retains full access for edge functions.
REVOKE SELECT (stripe_account_id, stripe_product_id, stripe_price_id, stripe_payment_url)
  ON public.courses FROM anon;
REVOKE SELECT (stripe_account_id, stripe_product_id, stripe_price_id, stripe_payment_url)
  ON public.courses FROM authenticated;

-- Re-grant non-sensitive column access broadly already exists via table-level GRANT;
-- ensure authenticated owners can still read their own rows fully via service paths.
-- For owner reads of these columns, edge functions use service role.

-- 3) Replace comp_access policy to use a security-definer lookup against auth.users by uid
CREATE OR REPLACE FUNCTION public.current_user_has_comp_access()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.comp_access ca
    JOIN auth.users u ON lower(u.email) = lower(ca.email)
    WHERE u.id = auth.uid()
  );
$$;

DROP POLICY IF EXISTS users_can_check_own_comp_access ON public.comp_access;
CREATE POLICY users_can_check_own_comp_access
ON public.comp_access
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = auth.uid()
      AND lower(u.email) = lower(comp_access.email)
  )
);
