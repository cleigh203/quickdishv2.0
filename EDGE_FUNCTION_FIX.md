# Edge Function Fix - generate-recipe-ai

## Problem
The `generate-recipe-ai` Edge Function was crashing silently when trying to update generation counters, preventing recipe generation from completing.

## Solution

### 1. Database Migration (Run First!)

**File:** `supabase/migrations/20250123_add_ai_generation_fields.sql`

**Run this SQL in Supabase SQL Editor:**
```sql
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
```

### 2. Edge Function Changes

**File:** `supabase/functions/generate-recipe-ai/index.ts`

**Key Changes:**
1. ✅ Counter update happens **AFTER** recipe generation and database save
2. ✅ Counter update is wrapped in `try/catch` - won't crash recipe generation
3. ✅ Recipe generation prioritized over tracking (recipe still returns if counter update fails)
4. ✅ Proper reset logic: checks if `ai_generations_reset_date` is today
5. ✅ If new day: resets counter to 1 and updates reset date
6. ✅ If same day: increments counter by 1
7. ✅ Fallback to old field names if new columns don't exist
8. ✅ Comprehensive logging for debugging

**Counter Update Flow:**
```
1. Generate recipe ✅
2. Save recipe to database ✅
3. Check if recipe was saved ✅
4. If saved, update counter:
   - Get today's date
   - Check if reset_date is today
   - If new day: reset to 1
   - If same day: increment by 1
   - Update both ai_generations_used_today and ai_generations_reset_date
5. If counter update fails: log error but continue ✅
6. Return recipe to user ✅
```

### 3. Deployment Steps

1. **Run Database Migration:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the migration SQL from step 1
   - Verify columns were added: `ai_generations_used_today` and `ai_generations_reset_date`

2. **Deploy Edge Function:**
   ```bash
   cd supabase
   supabase functions deploy generate-recipe-ai
   ```

3. **Verify:**
   - Test generating a recipe
   - Check Edge Function logs for counter update messages
   - Verify counter increments in database

### 4. Error Handling

The function now handles:
- ✅ Missing database columns (falls back to old field names)
- ✅ Counter update failures (logs error but continues)
- ✅ Database connection issues (logs error but continues)
- ✅ Invalid data (logs error but continues)

**Recipe generation will ALWAYS succeed even if counter update fails.**

### 5. Logging

The function logs:
- 🔄 Counter update attempts
- 📅 Date information (today, reset date, needs reset)
- ✅ Successful updates
- ⚠️ Warnings (non-critical failures)
- ❌ Critical errors (recipe save failures)

Check Edge Function logs in Supabase Dashboard to see the tracking flow.

## Testing

1. **Test Counter Update:**
   - Generate a recipe
   - Check logs for "✅ Successfully updated generation count"
   - Verify `ai_generations_used_today` increments in database

2. **Test Daily Reset:**
   - Generate a recipe
   - Wait until next day (or manually update `ai_generations_reset_date` to yesterday)
   - Generate another recipe
   - Verify counter resets to 1

3. **Test Error Handling:**
   - Temporarily drop the columns
   - Generate a recipe
   - Verify recipe still returns (counter update fails gracefully)

## Notes

- The function prioritizes recipe generation over tracking
- Counter update failures are logged but don't block recipe generation
- Old field names (`free_generations_used_today`, `last_generation_reset_date`) are supported as fallback
- Migration SQL is idempotent (safe to run multiple times)


