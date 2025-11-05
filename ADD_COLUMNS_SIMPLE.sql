-- Simple SQL to add AI generation tracking columns
-- Run this in Supabase SQL Editor if the columns don't exist

-- Add ai_generations_used_today
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS ai_generations_used_today INTEGER DEFAULT 0 NOT NULL;

-- Add ai_generations_reset_date  
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS ai_generations_reset_date DATE DEFAULT CURRENT_DATE;


