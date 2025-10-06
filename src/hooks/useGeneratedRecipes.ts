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
    console.log('🔄 1. fetchGeneratedRecipes called, user:', user?.id);
    if (!user) {
      console.log('🔄 2. No user, skipping fetch');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 3. Querying generated_recipes table...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 10s')), 10000)
      );
      
      const queryPromise = supabase
        .from('generated_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      console.log('🔄 4. Query result:', { data, error, dataLength: data?.length });

      if (error) {
        console.error('🔄 Query error:', error);
        throw error;
      }

      console.log('🔄 5. Raw database records:', data?.length || 0);

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

      console.log('🔄 6. Transformed recipes:', recipes.length);
      console.log('🔄 7. Recipe IDs:', recipes.map(r => r.id));

      setGeneratedRecipes(recipes);
    } catch (error: any) {
      console.error('🔄 8. Error fetching generated recipes:', error);
      console.error('🔄 Error details:', error.message, error.code);
      setGeneratedRecipes([]);
    } finally {
      console.log('🔄 9. Setting isLoading to false');
      setIsLoading(false);
    }
  };

  return {
    generatedRecipes,
    isLoading,
    refetch: fetchGeneratedRecipes
  };
};
