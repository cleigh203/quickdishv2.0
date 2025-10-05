-- Drop the SECURITY DEFINER view (security risk)
DROP VIEW IF EXISTS public.recipe_rating_stats;

-- Create a SECURITY DEFINER function instead (more explicit and safer)
-- This function bypasses RLS to aggregate all ratings but only returns aggregated data
CREATE OR REPLACE FUNCTION public.get_recipe_rating_stats(recipe_id_param text)
RETURNS TABLE (
  recipe_id text,
  average_rating numeric,
  total_ratings int
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT 
    recipe_id,
    ROUND(AVG(rating)::numeric, 1) as average_rating,
    COUNT(*)::int as total_ratings
  FROM public.recipe_ratings
  WHERE recipe_id = recipe_id_param
  GROUP BY recipe_id;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.get_recipe_rating_stats(text) TO anon, authenticated;

-- Add a comment explaining why SECURITY DEFINER is needed
COMMENT ON FUNCTION public.get_recipe_rating_stats IS 
'SECURITY DEFINER function to aggregate recipe ratings across all users. This bypasses RLS on recipe_ratings table (which restricts users to their own ratings) to calculate aggregate statistics. Only returns aggregated data (average, count) without exposing individual user_id values.';