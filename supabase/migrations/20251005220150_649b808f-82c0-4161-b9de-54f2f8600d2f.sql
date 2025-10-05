-- Add category column to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Uncategorized';

-- Update existing copycat recipes to have the correct category
UPDATE recipes 
SET category = 'Restaurant Copycats'
WHERE ai_generated = true 
  AND (name ILIKE '%copycat%' OR tags @> ARRAY['copycat']::text[]);