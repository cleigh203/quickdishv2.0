-- Add critical indexes for user_id columns to prevent full table scans with RLS
-- These indexes are essential for RLS policies that filter by user_id

-- Index for shopping_lists queries (used heavily on Shopping page)
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_id ON public.shopping_lists(user_id);

-- Index for meal_plans queries
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON public.meal_plans(user_id);

-- Index for saved_recipes queries
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON public.saved_recipes(user_id);

-- Index for generated_recipes queries
CREATE INDEX IF NOT EXISTS idx_generated_recipes_user_id ON public.generated_recipes(user_id);

-- Composite indexes for common query patterns
-- Shopping lists ordered by creation date (most recent first)
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_created ON public.shopping_lists(user_id, created_at DESC);

-- Meal plans filtered by user and date range
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_scheduled ON public.meal_plans(user_id, scheduled_date);

-- Recipe ratings for aggregation queries
CREATE INDEX IF NOT EXISTS idx_recipe_ratings_recipe_id ON public.recipe_ratings(recipe_id);

-- Analyze tables to update statistics
ANALYZE public.shopping_lists;
ANALYZE public.meal_plans;
ANALYZE public.saved_recipes;
ANALYZE public.generated_recipes;
ANALYZE public.recipe_ratings;