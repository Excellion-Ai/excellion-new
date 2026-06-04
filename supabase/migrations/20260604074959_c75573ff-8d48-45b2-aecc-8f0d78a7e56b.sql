
-- 1. Roles infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_roles_read_own" ON public.user_roles;
CREATE POLICY "user_roles_read_own" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- 2. Migrate existing admins
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM public.profiles WHERE role = 'admin'
ON CONFLICT DO NOTHING;

-- 3. Prevent self role escalation on profiles via trigger
CREATE OR REPLACE FUNCTION public.prevent_profile_role_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role'
     AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'role column cannot be modified by users';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS prevent_profile_role_change_trg ON public.profiles;
CREATE TRIGGER prevent_profile_role_change_trg
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_role_change();

-- 4. founding_coach_applications: use has_role
DROP POLICY IF EXISTS "Admin select" ON public.founding_coach_applications;
DROP POLICY IF EXISTS "Admin update" ON public.founding_coach_applications;

CREATE POLICY "Admin select" ON public.founding_coach_applications
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin update" ON public.founding_coach_applications
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Hide sensitive course columns from anonymous role
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

-- 6. comp_access: require verified email
DROP POLICY IF EXISTS "users_can_check_own_comp_access" ON public.comp_access;
CREATE POLICY "users_can_check_own_comp_access" ON public.comp_access
  FOR SELECT TO authenticated
  USING (
    email = (auth.jwt() ->> 'email')
    AND COALESCE((auth.jwt() ->> 'email_verified')::boolean, false) = true
  );

-- 7. Fix storage thumbnails UPDATE WITH CHECK to mirror USING
DROP POLICY IF EXISTS "users_update_own_thumbnails" ON storage.objects;
CREATE POLICY "users_update_own_thumbnails" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'course-thumbnails'
    AND (
      (storage.foldername(name))[1] = (auth.uid())::text
      OR EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.user_id = auth.uid()
          AND ((c.id)::text = (storage.foldername(objects.name))[2]
               OR (c.id)::text = (storage.foldername(objects.name))[1])
      )
    )
  )
  WITH CHECK (
    bucket_id = 'course-thumbnails'
    AND (
      (storage.foldername(name))[1] = (auth.uid())::text
      OR EXISTS (
        SELECT 1 FROM public.courses c
        WHERE c.user_id = auth.uid()
          AND ((c.id)::text = (storage.foldername(objects.name))[2]
               OR (c.id)::text = (storage.foldername(objects.name))[1])
      )
    )
  );
