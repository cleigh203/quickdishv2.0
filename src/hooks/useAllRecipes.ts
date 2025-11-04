import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { retryOperation } from '@/utils/errorHandling';

// Cache version - increment this to force all users to refresh
const CACHE_VERSION = 'v4'; // Incremented to force cache refresh
const CACHE_KEY = `all_recipes_cache_${CACHE_VERSION}`;
const CACHE_DURATION = 60000; // 1 minute for testing (was 1 hour)

export const useAllRecipes = (enabled = true) => {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(() => {
    // Try to load from cache on init - but ONLY if it has image URLs!
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Use cache ONLY if it's fresh AND has image URLs
        if (Date.now() - timestamp < CACHE_DURATION && data?.length > 0 && data[0]?.imageUrl) {
          return data;
        }
      }
    } catch (e) {
      // Ignore cache errors
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Always fetch fresh data on first load to ensure we have images
    if (enabled && (allRecipes.length === 0 || !allRecipes[0]?.imageUrl)) {
      fetchAllRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const fetchAllRecipes = async () => {
    console.log('🔍 useAllRecipes: Starting fetch, setting loading=true');
    try {
      setIsLoading(true);
      
      // Use retry logic for network resilience
              const data = await retryOperation(async () => {
          const { data, error } = await supabase
            .from('recipes')
            .select('recipe_id, name, description, cook_time, prep_time, difficulty, servings, ingredients, instructions, cuisine, image_url, tags, category, nutrition')
            .order('name')
            .limit(10000) // Explicit limit to ensure all recipes are fetched
            .abortSignal(AbortSignal.timeout(10000)); // 10 second timeout

          if (error) throw error;
        
        // 🔍 DEBUG: Log what we got from database
        console.log('🔍 Database Query Results:');
        console.log('Total recipes fetched:', data?.length);
        const quickAndEasy = data?.filter((r: any) => r.category === 'Quick and Easy') || [];
        console.log('Quick and Easy from DB:', quickAndEasy.length);
        console.log('Quick and Easy recipe names from DB:', quickAndEasy.map((r: any) => r.name).sort());
        console.log('Greek Chicken Wrap in DB results?', quickAndEasy.some((r: any) => r.name.includes('Greek Chicken')));
        
        return data;
      }, 2, 1000); // 2 retries with 1 second delay

      // Transform database recipes to match Recipe type
      const transformedRecipes: Recipe[] = (data || []).map((dbRecipe) => ({
        id: dbRecipe.recipe_id,
        name: dbRecipe.name,
        description: dbRecipe.description || '',
        cookTime: dbRecipe.cook_time || '30 mins',
        prepTime: dbRecipe.prep_time || '15 mins',
        difficulty: dbRecipe.difficulty || 'Medium',
        servings: dbRecipe.servings || 4,
        ingredients: (Array.isArray(dbRecipe.ingredients) ? dbRecipe.ingredients : []) as any[],
        instructions: (Array.isArray(dbRecipe.instructions) ? dbRecipe.instructions : []) as string[],
        cuisine: dbRecipe.cuisine || 'International',
        category: dbRecipe.category || 'Other', // 🔥 CRITICAL: Include category field!
        image: dbRecipe.image_url,
        imageUrl: dbRecipe.image_url,
        tags: dbRecipe.tags || [],
        nutrition: dbRecipe.nutrition as any, // Cast to any to handle Json type
      }));

      setAllRecipes(transformedRecipes);
      
      // Cache the results
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: transformedRecipes,
          timestamp: Date.now()
        }));
      } catch (e) {
        // Ignore cache errors (localStorage might be full)
      }
    } catch (error: any) {
      // Silence noisy network timeouts and keep whatever we already have (or cache)
      const msg = String(error?.message || '');
      const code = String(error?.code || '');
      if (msg.includes('TimeoutError') || code === '23') {
        console.debug('All recipes: network timeout, using cache/previous data');
      } else {
        console.error('Error fetching all recipes:', error);
      }
      // Keep existing state; do not clear the list on transient errors
    } finally {
      console.log('🔍 useAllRecipes: Fetch complete, setting loading=false');
      setIsLoading(false);
    }
  };

  // isLoading should be true if we have no recipes OR if recipes don't have image URLs yet
  const isReallyLoading = isLoading || (allRecipes.length > 0 && !allRecipes[0]?.imageUrl);

  // Debug logging
  console.log('🔍 useAllRecipes state:', {
    isLoading,
    hasRecipes: allRecipes.length > 0,
    firstRecipeHasImage: !!allRecipes[0]?.imageUrl,
    isReallyLoading
  });

  return { allRecipes, isLoading: isReallyLoading, refetch: fetchAllRecipes };
};

