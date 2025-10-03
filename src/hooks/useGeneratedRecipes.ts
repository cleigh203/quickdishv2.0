import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';

export const useGeneratedRecipes = () => {
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGeneratedRecipes();
    } else {
      setGeneratedRecipes([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchGeneratedRecipes = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('generated_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database records to Recipe type
      const recipes: Recipe[] = (data || []).map((record) => ({
        id: record.recipe_id,
        name: record.name,
        description: record.description || '',
        cookTime: record.cook_time || '',
        prepTime: record.prep_time || '',
        difficulty: record.difficulty || 'Medium',
        servings: record.servings || 4,
        ingredients: record.ingredients as any[],
        instructions: record.instructions as string[],
        cuisine: record.cuisine || '',
        imageUrl: record.image_url || '',
        image: record.image_url || '',
        nutrition: record.nutrition as any,
        tags: record.tags || [],
        isAiGenerated: true,
        generatedAt: record.created_at
      }));

      setGeneratedRecipes(recipes);
    } catch (error) {
      console.error('Error fetching generated recipes:', error);
      setGeneratedRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generatedRecipes,
    isLoading,
    refetch: fetchGeneratedRecipes
  };
};
