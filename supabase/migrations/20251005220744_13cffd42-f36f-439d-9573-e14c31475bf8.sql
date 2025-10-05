-- Allow authenticated users to view all recipes (including unverified ones)
-- This enables admins to see recipes that need validation
CREATE POLICY "Authenticated users can view all recipes"
ON recipes FOR SELECT
TO authenticated
USING (true);