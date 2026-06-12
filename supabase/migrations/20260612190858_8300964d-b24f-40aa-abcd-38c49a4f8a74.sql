
DROP POLICY IF EXISTS "users_manage_own_profile" ON public.profiles;

CREATE POLICY "users_insert_own_profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "users_delete_own_profile" ON public.profiles
  FOR DELETE TO authenticated USING (id = auth.uid());

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (
  email, full_name, avatar_url, creator_subdomain,
  stripe_account_id, stripe_account_status, stripe_onboarding_complete,
  updated_at
) ON public.profiles TO authenticated;
GRANT INSERT, SELECT, DELETE ON public.profiles TO authenticated;

REVOKE SELECT ON public.courses FROM anon;
GRANT SELECT (
  id, user_id, slug, subdomain, title, description, tagline, hero_copy,
  curriculum, branding, status, published_at, created_at, updated_at,
  thumbnail_url, price_cents, currency, instructor_name, instructor_bio,
  total_students, is_featured, builder_project_id, page_sections,
  custom_domain, domain_verified, seo_title, seo_description,
  social_image_url, has_video_content, type, meta, layout_template,
  design_config, section_order, section_config, deleted_at, is_free,
  domain_verified_at
) ON public.courses TO anon;

DROP POLICY IF EXISTS "creators_modify_resources" ON public.lesson_resources;
DROP POLICY IF EXISTS "creators_update_resources" ON public.lesson_resources;
DROP POLICY IF EXISTS "creators_delete_resources" ON public.lesson_resources;
DROP POLICY IF EXISTS "view_lesson_resources" ON public.lesson_resources;

CREATE POLICY "creators_modify_resources" ON public.lesson_resources
  FOR INSERT TO authenticated
  WITH CHECK (course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()));

CREATE POLICY "creators_update_resources" ON public.lesson_resources
  FOR UPDATE TO authenticated
  USING (course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()));

CREATE POLICY "creators_delete_resources" ON public.lesson_resources
  FOR DELETE TO authenticated
  USING (course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid()));

CREATE POLICY "view_lesson_resources" ON public.lesson_resources
  FOR SELECT TO authenticated
  USING (
    course_id IN (SELECT id FROM public.courses WHERE user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.course_id = lesson_resources.course_id
        AND enrollments.user_id = auth.uid()
    )
  );
