-- Add learning_goals column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN learning_goals text[] DEFAULT '{}';

COMMENT ON COLUMN public.profiles.learning_goals IS 'User learning interests: baking, grilling, meal prep, etc.';