-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view ratings" ON public.recipe_ratings;
DROP POLICY IF EXISTS "Users can view their own ratings" ON public.recipe_ratings;

-- Create a restricted policy - users can only view their own ratings
CREATE POLICY "Users can view their own ratings"
ON public.recipe_ratings
FOR SELECT
USING (auth.uid() = user_id);

-- Drop existing view if it exists
DROP VIEW IF EXISTS public.recipe_rating_stats;

-- Create a public view for aggregated recipe ratings (no user_id exposure)
CREATE VIEW public.recipe_rating_stats AS
SELECT 
  recipe_id,
  ROUND(AVG(rating)::numeric, 1) as average_rating,
  COUNT(*)::int as total_ratings
FROM public.recipe_ratings
GROUP BY recipe_id;

-- Grant public access to the aggregated view
GRANT SELECT ON public.recipe_rating_stats TO anon, authenticated;