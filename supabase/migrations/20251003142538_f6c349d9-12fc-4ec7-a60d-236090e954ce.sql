-- Add constraint to ensure notes can only be added to saved recipes
-- This is already enforced by the table structure (notes column exists in saved_recipes table)
-- Add check to ensure notes length is reasonable
ALTER TABLE public.saved_recipes 
  ADD CONSTRAINT notes_length_check 
  CHECK (notes IS NULL OR length(notes) <= 10000);

-- Add comment to document the purpose
COMMENT ON COLUMN public.saved_recipes.notes IS 'Personal notes about the recipe. Only available for saved recipes. Maximum 10000 characters.';