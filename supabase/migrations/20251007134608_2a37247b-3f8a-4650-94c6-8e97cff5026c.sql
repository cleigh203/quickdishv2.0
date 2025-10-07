-- Add index on verified column to improve query performance
CREATE INDEX IF NOT EXISTS idx_recipes_verified ON recipes(verified) WHERE verified = true;

-- Add index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC) WHERE verified = true;