-- Add AI generation tracking fields to profiles table
-- These fields track AI recipe generation usage per day

-- Add ai_generations_used_today if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'ai_generations_used_today'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN ai_generations_used_today INTEGER DEFAULT 0 NOT NULL;
    RAISE NOTICE 'Added column ai_generations_used_today to profiles table';
  ELSE
    RAISE NOTICE 'Column ai_generations_used_today already exists';
  END IF;
END $$;

-- Add ai_generations_reset_date if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'ai_generations_reset_date'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN ai_generations_reset_date DATE DEFAULT CURRENT_DATE;
    RAISE NOTICE 'Added column ai_generations_reset_date to profiles table';
  ELSE
    RAISE NOTICE 'Column ai_generations_reset_date already exists';
  END IF;
END $$;

-- Migrate data from old fields if they exist
DO $$
BEGIN
  -- If free_generations_used_today exists, migrate its data
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'free_generations_used_today'
  ) THEN
    UPDATE public.profiles
    SET ai_generations_used_today = COALESCE(free_generations_used_today, 0)
    WHERE ai_generations_used_today = 0;
  END IF;

  -- If last_generation_reset_date exists, migrate its data
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'last_generation_reset_date'
  ) THEN
    UPDATE public.profiles
    SET ai_generations_reset_date = last_generation_reset_date::DATE
    WHERE ai_generations_reset_date IS NULL AND last_generation_reset_date IS NOT NULL;
  END IF;
END $$;

