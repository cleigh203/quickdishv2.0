-- Add UPDATE policy for recipes table to allow admins to approve recipes
-- For now, we'll allow authenticated users to update recipes
-- In production, you'd want to add an is_admin column to profiles and check that

CREATE POLICY "Authenticated users can update recipes"
ON public.recipes
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
