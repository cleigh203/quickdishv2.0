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
    // Try to load from cache on init - but ONLY if it has image URLs!
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Use cache ONLY if it's fresh AND has image URLs
        if (Date.now() - timestamp < CACHE_DURATION && data?.length > 0 && data[0]?.image_url) {
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
    if (enabled && (allRecipes.length === 0 || !allRecipes[0]?.image_url)) {
      fetchAllRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const fetchAllRecipes = async () => {
    try {
      setIsLoading(true);
      
      // Use retry logic for network resilience
      const data = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('recipes')
          .select('recipe_id, name, description, cook_time, prep_time, difficulty, servings, ingredients, instructions, cuisine, image_url, tags, category, nutrition, total_time')
          .order('name')
          .abortSignal(AbortSignal.timeout(10000)); // 10 second timeout

        if (error) throw error;
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
        totalTime: dbRecipe.total_time,
        nutrition: dbRecipe.nutrition,
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
      setIsLoading(false);
    }
  };

  // isLoading should be true if we have no recipes OR if recipes don't have image URLs yet
  const isReallyLoading = isLoading || (allRecipes.length > 0 && !allRecipes[0]?.image_url);

  return { allRecipes, isLoading: isReallyLoading, refetch: fetchAllRecipes };
};

