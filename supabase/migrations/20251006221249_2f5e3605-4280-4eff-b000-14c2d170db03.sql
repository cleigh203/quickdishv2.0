-- Add index on meal_plans.user_id for fast user lookups
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON public.meal_plans(user_id);

-- Add index on meal_plans.scheduled_date for ordering
CREATE INDEX IF NOT EXISTS idx_meal_plans_scheduled_date ON public.meal_plans(scheduled_date);

-- Composite index for common meal plan queries (user_id + scheduled_date)
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_scheduled ON public.meal_plans(user_id, scheduled_date);