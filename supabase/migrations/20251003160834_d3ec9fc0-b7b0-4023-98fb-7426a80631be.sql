-- Create ratings table
CREATE TABLE public.recipe_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security
ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view ratings"
ON public.recipe_ratings
FOR SELECT
USING (true);

CREATE POLICY "Users can create their own ratings"
ON public.recipe_ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
ON public.recipe_ratings
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings"
ON public.recipe_ratings
FOR DELETE
USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_recipe_ratings_updated_at
BEFORE UPDATE ON public.recipe_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();