REVOKE SELECT (stripe_account_id, stripe_product_id, stripe_price_id, domain_verification_token)
  ON public.courses FROM anon, authenticated;

ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS stripe_payment_url_valid;
ALTER TABLE public.courses ADD CONSTRAINT stripe_payment_url_valid
  CHECK (
    stripe_payment_url IS NULL
    OR stripe_payment_url ~ '^https://(buy|checkout)\.stripe\.com/'
  ) NOT VALID;

CREATE OR REPLACE FUNCTION public.user_has_paid_access()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  em  text := auth.jwt() ->> 'email';
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = uid
      AND status = 'active'
      AND (current_period_end IS NULL OR current_period_end > now())
  ) THEN
    RETURN true;
  END IF;

  IF em IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.comp_access WHERE email = em
  ) THEN
    RETURN true;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = uid AND role = 'admin'
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$;

GRANT EXECUTE ON FUNCTION public.user_has_paid_access() TO authenticated;