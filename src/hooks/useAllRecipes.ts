import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { retryOperation } from '@/utils/errorHandling';

// Cache version - increment this to force all users to refresh
const CACHE_VERSION = 'v3';
const CACHE_KEY = `all_recipes_cache_${CACHE_VERSION}`;
const CACHE_DURATION = 60000; // 1 minute for testing (was 1 hour)

// Module-level shared cache so multiple hook instances reuse the same data/fetch
let sharedRecipes: Recipe[] | null = null;
let sharedTimestamp = 0;
let sharedPromise: Promise<Recipe[]> | null = null;

const loadInitialRecipes = (): Recipe[] => {
  const now = Date.now();

  if (sharedRecipes && now - sharedTimestamp < CACHE_DURATION) {
    return sharedRecipes;
  }

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (now - timestamp < CACHE_DURATION) {
        sharedRecipes = data;
        sharedTimestamp = timestamp;
        return data;
      }
    }
  } catch (e) {
    // Ignore cache errors
  }

  return [];
};

export const useAllRecipes = (enabled = true) => {
  const initialRecipesRef = useRef<Recipe[]>(loadInitialRecipes());
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(initialRecipesRef.current);
  const [isLoading, setIsLoading] = useState(initialRecipesRef.current.length === 0);

  const fetchAllRecipes = useCallback(async (force = false) => {
    try {
      const now = Date.now();
      if (!force && sharedRecipes && now - sharedTimestamp < CACHE_DURATION) {
        setAllRecipes(sharedRecipes);
        setIsLoading(false);
        return;
      }

      if (!force && sharedPromise) {
        const data = await sharedPromise;
        setAllRecipes(data);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const fetchPromise = retryOperation(async () => {
        const { data, error } = await supabase
          .from('recipes')
          .select('recipe_id, name, description, cook_time, prep_time, difficulty, servings, ingredients, instructions, cuisine, image_url, tags, category, nutrition, total_time, verified')
          .order('name')
          .abortSignal(AbortSignal.timeout(10000)); // 10 second timeout

        if (error) throw error;
        return data;
      }, 2, 1000);

      sharedPromise = fetchPromise;

      const data = await fetchPromise;

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
        category: dbRecipe.category || 'Other',
        image: dbRecipe.image_url,
        imageUrl: dbRecipe.image_url,
        tags: dbRecipe.tags || [],
        totalTime: dbRecipe.total_time,
        nutrition: dbRecipe.nutrition,
        isVerified: Boolean(dbRecipe.verified),
      }));

      sharedRecipes = transformedRecipes;
      sharedTimestamp = Date.now();
      sharedPromise = null;

      setAllRecipes(transformedRecipes);

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: transformedRecipes,
          timestamp: sharedTimestamp,
        }));
      } catch (e) {
        // Ignore cache errors (localStorage might be full)
      }
    } catch (error: any) {
      sharedPromise = null;
      const msg = String(error?.message || '');
      const code = String(error?.code || '');
      if (msg.includes('TimeoutError') || code === '23') {
        console.debug('All recipes: network timeout, using cache/previous data');
      } else {
        console.error('Error fetching all recipes:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const now = Date.now();
    if (allRecipes.length > 0) {
      setIsLoading(false);
      // Local state already populated
      return;
    }

    if (sharedRecipes && now - sharedTimestamp < CACHE_DURATION) {
      setAllRecipes(sharedRecipes);
      setIsLoading(false);
      return;
    }

    fetchAllRecipes();
  }, [enabled, fetchAllRecipes, allRecipes.length]);

  return { allRecipes, isLoading, refetch: (options?: { force?: boolean }) => fetchAllRecipes(options?.force) };
};

