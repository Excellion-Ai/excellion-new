-- Restore table-level grants on public.courses for authenticated + anon roles.
--
-- Problem: a prior migration revoked GRANTs on public.courses. PostgreSQL
-- checks GRANT privileges BEFORE RLS — so even with a valid JWT and a
-- matching RLS policy (user_id = auth.uid()), coaches got
-- "permission denied for table courses" on UPDATE/INSERT/DELETE.
--
-- Fix:
--   - authenticated: full CRUD; RLS policies already gate to owner-only.
--   - anon: SELECT only (for reading published courses via the
--     "Anyone can read published courses" policy).
--
-- RLS policies already in place on courses:
--   SELECT  "Users can read their own courses"     (user_id = auth.uid())
--   SELECT  "Anyone can read published courses"    (status='published' AND deleted_at IS NULL)
--   INSERT  "Users can insert their own courses"   (user_id = auth.uid())
--   UPDATE  "Users can update their own courses"   (user_id = auth.uid())
-- Students (with role='student') never satisfy user_id = auth.uid() on
-- someone else's course, so they remain read-only.

grant select, insert, update, delete on public.courses to authenticated;
grant select on public.courses to anon;
