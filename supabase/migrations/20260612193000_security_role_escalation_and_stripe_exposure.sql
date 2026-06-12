-- =============================================================
-- CRITICAL 1: Prevent role escalation
-- =============================================================

-- 1a. user_roles: revoke all DML from anon and authenticated.
--     Only service_role should INSERT/UPDATE/DELETE roles.
--     SELECT stays (RLS policy user_roles_read_own scopes it to own rows).
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.user_roles FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.user_roles FROM authenticated;

-- 1b. profiles: revoke DML from anon.
--     Anon has no RLS policies on profiles, so these grants are dead weight
--     and a latent risk if someone adds a permissive anon policy later.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, TRIGGER, REFERENCES ON public.profiles FROM anon;

-- =============================================================
-- CRITICAL 2: Hide Stripe account IDs from non-owners
-- =============================================================

-- Step 1: Revoke table-level SELECT on courses from both roles.
--         (This removes access to ALL columns including stripe ones.)
REVOKE SELECT ON public.courses FROM anon;
REVOKE SELECT ON public.courses FROM authenticated;

-- Step 2: Grant column-level SELECT on every non-sensitive column.
--         Excludes: stripe_account_id, stripe_price_id, stripe_product_id.
--         Keeps: stripe_payment_url (buyers need the checkout link).
GRANT SELECT (
  id, user_id, slug, subdomain, title, description, tagline, hero_copy,
  curriculum, branding, status, published_at, original_prompt, created_at,
  updated_at, thumbnail_url, price_cents, currency, instructor_name,
  instructor_bio, total_students, is_featured, builder_project_id,
  page_sections, custom_domain, domain_verified, seo_title,
  seo_description, social_image_url, has_video_content, type, meta,
  layout_template, design_config, section_order, section_config,
  deleted_at, is_free, domain_verification_token, domain_verified_at,
  stripe_payment_url
) ON public.courses TO anon;

GRANT SELECT (
  id, user_id, slug, subdomain, title, description, tagline, hero_copy,
  curriculum, branding, status, published_at, original_prompt, created_at,
  updated_at, thumbnail_url, price_cents, currency, instructor_name,
  instructor_bio, total_students, is_featured, builder_project_id,
  page_sections, custom_domain, domain_verified, seo_title,
  seo_description, social_image_url, has_video_content, type, meta,
  layout_template, design_config, section_order, section_config,
  deleted_at, is_free, domain_verification_token, domain_verified_at,
  stripe_payment_url
) ON public.courses TO authenticated;

-- INSERT, UPDATE, DELETE grants on courses for authenticated remain unchanged.
-- service_role retains full access to all columns including stripe IDs.
