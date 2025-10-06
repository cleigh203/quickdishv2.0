-- Add index on recipes.recipe_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_recipes_recipe_id ON public.recipes(recipe_id);

-- Add index on recipes.verified for filtering
CREATE INDEX IF NOT EXISTS idx_recipes_verified ON public.recipes(verified);

-- Composite index for common verified recipe queries
CREATE INDEX IF NOT EXISTS idx_recipes_verified_category ON public.recipes(verified, category) WHERE verified = true;