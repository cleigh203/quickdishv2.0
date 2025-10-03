-- Add AI generation tracking columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ai_generations_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_generation_date DATE;