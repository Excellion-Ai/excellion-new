
-- 1. Enable RLS on layout_templates and add read-only public access
ALTER TABLE public.layout_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_active_templates"
  ON public.layout_templates FOR SELECT
  TO public
  USING (is_active = true);

-- 2. Replace overly permissive profiles public read policy
DROP POLICY IF EXISTS "public_view_profiles" ON public.profiles;

CREATE POLICY "users_read_own_profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- 3. Fix handle_new_user function search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$function$;
