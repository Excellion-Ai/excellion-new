DROP POLICY IF EXISTS "users_manage_own_projects" ON public.builder_projects;

CREATE POLICY "users_manage_own_projects"
ON public.builder_projects
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);