import { Recipe } from "@/types/recipe";

export const recipeStorage = {
  // Recipes
  setRecipes: (recipes: Recipe[]) => {
    try {
      localStorage.setItem('recipes', JSON.stringify(recipes));
    } catch (error) {
      console.error('Failed to save recipes:', error);
    }
  },
  
  getRecipes: (): Recipe[] => {
    try {
      const saved = localStorage.getItem('recipes');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load recipes:', error);
      return [];
    }
  },
  
  getRecipeById: (id: string): Recipe | undefined => {
    try {
      const saved = localStorage.getItem('recipes');
      const recipes: Recipe[] = saved ? JSON.parse(saved) : [];
      return recipes.find(r => r.id === id);
    } catch (error) {
      console.error('Failed to find recipe:', error);
      return undefined;
    }
  },
  
  // Favorites
  addFavorite: (recipeId: string) => {
    try {
      const saved = localStorage.getItem('favorites');
      const favorites: string[] = saved ? JSON.parse(saved) : [];
      if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  },
  
  removeFavorite: (recipeId: string) => {
    try {
      const saved = localStorage.getItem('favorites');
      const favorites: string[] = saved ? JSON.parse(saved) : [];
      const updated = favorites.filter(id => id !== recipeId);
      localStorage.setItem('favorites', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  },
  
  getFavorites: (): string[] => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return [];
    }
  },
  
  isFavorite: (recipeId: string): boolean => {
    try {
      const saved = localStorage.getItem('favorites');
      const favorites: string[] = saved ? JSON.parse(saved) : [];
      return favorites.includes(recipeId);
    } catch (error) {
      console.error('Failed to check favorite:', error);
      return false;
    }
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
