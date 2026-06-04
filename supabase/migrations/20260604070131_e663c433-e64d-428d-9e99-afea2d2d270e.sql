
-- 1. Revoke EXECUTE on SECURITY DEFINER trigger functions from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.audit_course_changes() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.snapshot_course_before_update() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_soft_delete_courses() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_rate_limits() FROM PUBLIC, anon, authenticated;

-- 2. Tighten always-true RLS policies
DROP POLICY IF EXISTS "Admin update" ON public.founding_coach_applications;
CREATE POLICY "Admin update" ON public.founding_coach_applications FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

DROP POLICY IF EXISTS "Public insert" ON public.founding_coach_applications;
CREATE POLICY "Public insert" ON public.founding_coach_applications FOR INSERT
  WITH CHECK (email IS NOT NULL AND length(email) BETWEEN 3 AND 320);

DROP POLICY IF EXISTS "service_role_all_stripe_connect" ON public."stripe-connect";
CREATE POLICY "service_role_all_stripe_connect" ON public."stripe-connect" FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access" ON public.email_log;
CREATE POLICY "Service role full access" ON public.email_log FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 3. Prevent students from self-issuing certificates
DROP POLICY IF EXISTS users_insert_own_certificates ON public.certificates;
CREATE POLICY certificates_service_insert ON public.certificates FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION public.enforce_certificate_completion()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.enrollments e
    WHERE e.id = NEW.enrollment_id
      AND e.user_id = NEW.user_id
      AND e.course_id = NEW.course_id
      AND COALESCE(e.progress_percent, 0) >= 100
      AND e.completed_at IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Cannot issue certificate: enrollment is not completed';
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.enforce_certificate_completion() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_enforce_certificate_completion ON public.certificates;
CREATE TRIGGER trg_enforce_certificate_completion
  BEFORE INSERT ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.enforce_certificate_completion();

-- 4. Prevent students from inflating progress_percent / completed_at directly
CREATE OR REPLACE FUNCTION public.prevent_enrollment_progress_tamper()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' THEN
    IF NEW.progress_percent IS DISTINCT FROM OLD.progress_percent
       OR NEW.completed_at IS DISTINCT FROM OLD.completed_at THEN
      RAISE EXCEPTION 'progress_percent and completed_at can only be updated server-side';
    END IF;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.prevent_enrollment_progress_tamper() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_prevent_enrollment_progress_tamper ON public.enrollments;
CREATE TRIGGER trg_prevent_enrollment_progress_tamper
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.prevent_enrollment_progress_tamper();
