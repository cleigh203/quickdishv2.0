-- Create recipes table for both curated and AI-generated recipes
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cuisine TEXT,
  difficulty TEXT,
  prep_time TEXT,
  cook_time TEXT,
  servings INTEGER,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  nutrition JSONB,
  tags TEXT[],
  image_url TEXT,
  
  -- AI Generation tracking
  source TEXT DEFAULT 'curated' CHECK (source IN ('curated', 'ai_generated', 'community')),
  ai_generated BOOLEAN DEFAULT false,
  needs_validation BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  kitchen_tested BOOLEAN DEFAULT false,
  validation_notes TEXT,
  
  -- Timestamps
  generated_at TIMESTAMP WITH TIME ZONE,
  validated_at TIMESTAMP WITH TIME ZONE,
  validated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster verified queries
CREATE INDEX idx_recipes_verified ON public.recipes(verified);
CREATE INDEX idx_recipes_source ON public.recipes(source);
CREATE INDEX idx_recipes_ai_generated ON public.recipes(ai_generated);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Policy: Regular users only see verified recipes
CREATE POLICY "Users can view verified recipes"
ON public.recipes
FOR SELECT
TO authenticated
USING (verified = true);

-- Policy: Allow anonymous users to view verified recipes too (for browsing)
CREATE POLICY "Anonymous users can view verified recipes"
ON public.recipes
FOR SELECT
TO anon
USING (verified = true);

-- Trigger to update updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();