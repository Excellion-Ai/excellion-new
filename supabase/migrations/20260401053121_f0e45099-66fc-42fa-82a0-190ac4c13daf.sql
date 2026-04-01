-- Fix 1: Remove client INSERT access to audit_log (only triggers/service_role should write)
DROP POLICY IF EXISTS "users_insert_own_audit_log" ON public.audit_log;

-- Fix 2: Set search_path on generate_clean_slug function
CREATE OR REPLACE FUNCTION public.generate_clean_slug(title text, course_id uuid DEFAULT NULL::uuid)
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
DECLARE
  base_slug text;
  candidate text;
  counter int := 0;
BEGIN
  base_slug := lower(title);
  base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  base_slug := regexp_replace(base_slug, '^-|-$', '', 'g');
  base_slug := left(base_slug, 60);

  IF base_slug = '' THEN
    base_slug := 'course';
  END IF;

  candidate := base_slug;

  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM public.courses
      WHERE slug = candidate
        AND (course_id IS NULL OR id != course_id)
        AND deleted_at IS NULL
    ) THEN
      RETURN candidate;
    END IF;
    counter := counter + 1;
    candidate := base_slug || '-' || counter;
  END LOOP;
END;
$function$;