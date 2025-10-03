-- Create generated_recipes table for AI-created recipes
CREATE TABLE IF NOT EXISTS public.generated_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  prep_time TEXT,
  cook_time TEXT,
  servings INTEGER,
  difficulty TEXT,
  cuisine TEXT,
  image_url TEXT,
  nutrition JSONB,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.generated_recipes ENABLE ROW LEVEL SECURITY;

-- Users can view their own generated recipes
CREATE POLICY "Users can view their own generated recipes"
ON public.generated_recipes
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own generated recipes
CREATE POLICY "Users can insert their own generated recipes"
ON public.generated_recipes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own generated recipes
CREATE POLICY "Users can update their own generated recipes"
ON public.generated_recipes
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own generated recipes
CREATE POLICY "Users can delete their own generated recipes"
ON public.generated_recipes
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_generated_recipes_user_id ON public.generated_recipes(user_id);
CREATE INDEX idx_generated_recipes_recipe_id ON public.generated_recipes(recipe_id);