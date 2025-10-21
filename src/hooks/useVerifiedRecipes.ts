import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { retryOperation, handleSupabaseError } from '@/utils/errorHandling';

export const useVerifiedRecipes = (enabled = true) => {
  const [verifiedRecipes, setVerifiedRecipes] = useState<Recipe[]>(() => {
    // Try to load from cache on init
    try {
      const cached = localStorage.getItem('verified_recipes_cache');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Use cache if less than 1 hour old
        if (Date.now() - timestamp < 3600000) {
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
    if (enabled && verifiedRecipes.length === 0) {
      fetchVerifiedRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  const fetchVerifiedRecipes = async () => {
    try {
      setIsLoading(true);
      
      // Use retry logic for network resilience - heavily reduced limit and timeout to prevent slowdowns
      const data = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('recipes')
          .select('recipe_id, name, description, cook_time, prep_time, difficulty, servings, ingredients, instructions, cuisine, image_url, tags, category')
          .eq('verified', true)
          .order('created_at', { ascending: false })
          .limit(20) // Reduced to 20 for faster loading
          .abortSignal(AbortSignal.timeout(5000)); // 5 second timeout

        if (error) throw error;
        return data;
      }, 1, 500); // Reduced retries and delay

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
        image: dbRecipe.image_url,
        imageUrl: dbRecipe.image_url,
        tags: dbRecipe.tags || [],
      }));

      setVerifiedRecipes(transformedRecipes);
      
      // Cache the results
      try {
        localStorage.setItem('verified_recipes_cache', JSON.stringify({
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
        console.debug('Verified recipes: network timeout, using cache/previous data');
      } else {
        console.debug('Error fetching verified recipes:', error);
      }
      // Keep existing state; do not clear the list on transient errors
    } finally {
      setIsLoading(false);
    }
  };

  return { verifiedRecipes, isLoading, refetch: fetchVerifiedRecipes };
};
