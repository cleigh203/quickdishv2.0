-- Add pantry_items column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pantry_items TEXT[] DEFAULT '{}';

-- Add comment to document the column
COMMENT ON COLUMN public.profiles.pantry_items IS 'User pantry items stored as text array';