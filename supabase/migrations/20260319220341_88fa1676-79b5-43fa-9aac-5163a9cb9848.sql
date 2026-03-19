
-- Fix "RLS enabled no policy" for coupons table
CREATE POLICY "creators_manage_own_coupons"
  ON public.coupons FOR ALL
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

-- Fix "RLS enabled no policy" for stripe-connect table  
CREATE POLICY "authenticated_read_stripe_connect"
  ON public."stripe-connect" FOR SELECT
  TO authenticated
  USING (true);
