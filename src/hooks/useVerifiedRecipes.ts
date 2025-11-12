import { useMemo } from 'react';

import { useRecipes } from '@/contexts/RecipesContext';
import { Recipe } from '@/types/recipe';

export const useVerifiedRecipes = () => {
  const { recipes, isLoading, refetch } = useRecipes();

  const verifiedRecipes = useMemo<Recipe[]>(
    () => recipes.filter(recipe => recipe.isVerified),
    [recipes]
  );

  return {
    verifiedRecipes,
    isLoading,
    refetch,
  };
};
