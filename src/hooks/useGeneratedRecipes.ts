import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';

// Store AI-generated recipes in memory for the session (not in DB)
const sessionRecipes: Recipe[] = [];

export const useGeneratedRecipes = () => {
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([...sessionRecipes]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Add a recipe to the session
  const addGeneratedRecipe = (recipe: Recipe) => {
    // Add to session storage
    sessionRecipes.unshift(recipe);
    // Update state
    setGeneratedRecipes([...sessionRecipes]);
  };

  useEffect(() => {
    if (user) {
      fetchGeneratedRecipes();
    } else {
      // Keep session-generated recipes for guests so Favorites can resolve them
      setGeneratedRecipes([...sessionRecipes]);
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

      console.log('📥 FETCHED data:', data);
      console.log('📥 FETCHED length:', data?.length);
      console.log('📥 FETCHED error:', error);
      console.log('📥 Is data an array?', Array.isArray(data));

      if (error) {
        console.error('🔄 Query error:', error);
        throw error;
      }

      console.log('🔄 5. Raw database records:', data?.length || 0);

      // Transform database records to Recipe type
      const recipes: Recipe[] = (data || []).map((record) => {
        const isCustomRecipe = record.recipe_id?.startsWith('custom-');
        return {
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
          isAiGenerated: !isCustomRecipe, // Custom recipes are NOT AI-generated
          generatedAt: record.created_at
        };
      });

      console.log('🔄 6. Transformed recipes:', recipes.length);
      console.log('🔄 7. Recipe IDs:', recipes.map(r => r.id));
      console.log('📥 Transformed recipes array:', recipes);
      console.log('📥 Is transformed recipes an array?', Array.isArray(recipes));

      setGeneratedRecipes(recipes);
      
      console.log('✅ State SHOULD be set now with', recipes.length, 'recipes');
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
    refetch: fetchGeneratedRecipes,
    addGeneratedRecipe
  };
};
