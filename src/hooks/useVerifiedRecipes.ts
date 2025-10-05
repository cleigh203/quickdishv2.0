import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { toast } from '@/hooks/use-toast';

export const useVerifiedRecipes = () => {
  const [verifiedRecipes, setVerifiedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVerifiedRecipes();
  }, []);

  const fetchVerifiedRecipes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('verified', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

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
        imageUrl: dbRecipe.image_url,
        nutrition: dbRecipe.nutrition as any,
        tags: dbRecipe.tags || [],
        isAiGenerated: dbRecipe.ai_generated || false,
        generatedAt: dbRecipe.generated_at,
      }));

      setVerifiedRecipes(transformedRecipes);
    } catch (error) {
      console.error('Error fetching verified recipes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load verified recipes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { verifiedRecipes, isLoading, refetch: fetchVerifiedRecipes };
};
