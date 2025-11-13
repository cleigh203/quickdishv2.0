import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { retryOperation } from '@/utils/errorHandling';

// Cache version - increment this to force all users to refresh
const CACHE_VERSION = 'v3';
const CACHE_KEY = `all_recipes_cache_${CACHE_VERSION}`;
const CACHE_DURATION = 60000; // 1 minute for testing (was 1 hour)

export const useAllRecipes = (enabled = true) => {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(() => {
    // Try to load from cache on init
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Use cache if less than CACHE_DURATION old
        if (Date.now() - timestamp < CACHE_DURATION) {
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
    console.log('🔍 useAllRecipes: useEffect running', { enabled, currentRecipeCount: allRecipes.length });
    if (enabled && allRecipes.length === 0) {
      console.log('🔍 useAllRecipes: Triggering fetch (enabled and no recipes)');
      fetchAllRecipes();
    } else {
      console.log('🔍 useAllRecipes: Skipping fetch', { enabled, hasRecipes: allRecipes.length > 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const fetchAllRecipes = async () => {
    try {
      console.log('🔍 useAllRecipes: Starting fetch...');
      setIsLoading(true);
      
      // Use retry logic for network resilience
      const data = await retryOperation(async () => {
        console.log('🔍 useAllRecipes: Querying Supabase...');
        const { data, error } = await supabase
          .from('recipes')
          .select('recipe_id, name, description, cook_time, prep_time, difficulty, servings, ingredients, instructions, cuisine, image_url, tags, category, nutrition')
          .order('name')
          .abortSignal(AbortSignal.timeout(10000)); // 10 second timeout

        if (error) {
          console.error('🔍 useAllRecipes: Supabase error:', error);
          throw error;
        }
        console.log('🔍 useAllRecipes: Fetched', data?.length || 0, 'recipes from DB');
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
        nutrition: dbRecipe.nutrition as any,
      }));

      console.log('🔍 useAllRecipes: Setting', transformedRecipes.length, 'recipes to state');
      setAllRecipes(transformedRecipes);
      
      // Cache the results
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: transformedRecipes,
          timestamp: Date.now()
        }));
        console.log('🔍 useAllRecipes: Cached recipes to localStorage');
      } catch (e) {
        console.error('🔍 useAllRecipes: Failed to cache:', e);
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
      setIsLoading(false);
    }
  };

  return { allRecipes, isLoading, refetch: fetchAllRecipes };
};

