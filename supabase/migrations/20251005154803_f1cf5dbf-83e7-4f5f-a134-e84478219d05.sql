-- Drop the public viewing policy
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.recipe_ratings;

-- Create a restricted policy - users can only view their own ratings
CREATE POLICY "Users can view their own ratings"
ON public.recipe_ratings
FOR SELECT
USING (auth.uid() = user_id);

-- Create a public view for aggregated recipe ratings (no user_id exposure)
CREATE OR REPLACE VIEW public.recipe_rating_stats AS
SELECT 
  recipe_id,
  ROUND(AVG(rating)::numeric, 1) as average_rating,
  COUNT(*)::int as total_ratings
FROM public.recipe_ratings
GROUP BY recipe_id;

-- Grant public access to the aggregated view
GRANT SELECT ON public.recipe_rating_stats TO anon, authenticated;