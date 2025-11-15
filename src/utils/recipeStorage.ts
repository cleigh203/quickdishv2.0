import { Recipe } from "@/types/recipe";

// COMMENTED OUT: No localStorage recipe storage - only database for logged-in users
export const recipeStorage = {
  // Recipes - DISABLED: Only database storage allowed
  setRecipes: (recipes: Recipe[]) => {
    // COMMENTED OUT: localStorage.setItem('recipes', JSON.stringify(recipes));
  },
  
  getRecipes: (): Recipe[] => {
    // COMMENTED OUT: localStorage.getItem('recipes')
    return [];
  },
  
  getRecipeById: (id: string): Recipe | undefined => {
    // COMMENTED OUT: localStorage.getItem('recipes')
    return undefined;
  },
  
  // Favorites - DEPRECATED: Use useSavedRecipes hook instead
  // DISABLED: No localStorage storage allowed
  addFavorite: (recipeId: string) => {
    // COMMENTED OUT: localStorage.setItem('favorites', ...)
  },
  
  removeFavorite: (recipeId: string) => {
    // COMMENTED OUT: localStorage.setItem('favorites', ...)
  },
  
  getFavorites: (): string[] => {
    // COMMENTED OUT: localStorage.getItem('favorites')
    return [];
  },
  
  isFavorite: (recipeId: string): boolean => {
    // COMMENTED OUT: localStorage.getItem('favorites')
    return false;
  },
  
  // Shopping list
  addToShoppingList: (recipeId: string, ingredients: any[]) => {
    try {
      const saved = localStorage.getItem('shoppingList');
      const shoppingList: { recipeId: string; ingredients: any[] }[] = saved ? JSON.parse(saved) : [];
      const existing = shoppingList.findIndex(item => item.recipeId === recipeId);
      if (existing >= 0) {
        shoppingList[existing].ingredients = ingredients;
      } else {
        shoppingList.push({ recipeId, ingredients });
      }
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    } catch (error) {
      console.error('Failed to add to shopping list:', error);
    }
  },
  
  removeFromShoppingList: (recipeId: string) => {
    try {
      const saved = localStorage.getItem('shoppingList');
      const shoppingList: { recipeId: string; ingredients: any[] }[] = saved ? JSON.parse(saved) : [];
      const updated = shoppingList.filter(item => item.recipeId !== recipeId);
      localStorage.setItem('shoppingList', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove from shopping list:', error);
    }
  },
  
  getShoppingList: () => {
    try {
      const saved = localStorage.getItem('shoppingList');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load shopping list:', error);
      return [];
    }
  },
};
