import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { retryOperation, handleSupabaseError } from '@/utils/errorHandling';

export const useVerifiedRecipes = () => {
  const [verifiedRecipes, setVerifiedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVerifiedRecipes();
  }, []);

  const fetchVerifiedRecipes = async () => {
    try {
      setIsLoading(true);
      
      // Use retry logic for network resilience
      const data = await retryOperation(async () => {
        const { data, error } = await supabase
          .from('recipes')
          .select('recipe_id, name, description, cook_time, prep_time, difficulty, servings, ingredients, instructions, cuisine, image_url, nutrition, tags, ai_generated, generated_at, category')
          .eq('verified', true)
          .order('created_at', { ascending: false })
          .limit(500); // Limit to prevent timeout

        if (error) throw error;
        return data;
      }, 2, 1000);

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
        nutrition: dbRecipe.nutrition as any,
        tags: dbRecipe.tags || [],
        isAiGenerated: dbRecipe.ai_generated || false,
        generatedAt: dbRecipe.generated_at,
      }));

      setVerifiedRecipes(transformedRecipes);
    } catch (error) {
      console.error('Error fetching verified recipes:', error);
      // Don't show error toast - silently fall back to static recipes
      setVerifiedRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { verifiedRecipes, isLoading, refetch: fetchVerifiedRecipes };
};
