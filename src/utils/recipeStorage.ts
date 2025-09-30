import { Recipe } from "@/types/recipe";

// In-memory storage for fast access
let recipesCache: Recipe[] = [];
let favoritesCache: string[] = [];
let shoppingListCache: { recipeId: string; ingredients: any[] }[] = [];

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('recipes');
  if (stored) recipesCache = JSON.parse(stored);
  
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) favoritesCache = JSON.parse(storedFavorites);
  
  const storedShopping = localStorage.getItem('shoppingList');
  if (storedShopping) shoppingListCache = JSON.parse(storedShopping);
}

export const recipeStorage = {
  // Recipes
  setRecipes: (recipes: Recipe[]) => {
    recipesCache = recipes;
    localStorage.setItem('recipes', JSON.stringify(recipes));
  },
  
  getRecipes: (): Recipe[] => {
    return recipesCache;
  },
  
  getRecipeById: (id: string): Recipe | undefined => {
    return recipesCache.find(r => r.id === id);
  },
  
  // Favorites
  addFavorite: (recipeId: string) => {
    if (!favoritesCache.includes(recipeId)) {
      favoritesCache.push(recipeId);
      localStorage.setItem('favorites', JSON.stringify(favoritesCache));
    }
  },
  
  removeFavorite: (recipeId: string) => {
    favoritesCache = favoritesCache.filter(id => id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(favoritesCache));
  },
  
  getFavorites: (): string[] => {
    return favoritesCache;
  },
  
  isFavorite: (recipeId: string): boolean => {
    return favoritesCache.includes(recipeId);
  },
  
  // Shopping list
  addToShoppingList: (recipeId: string, ingredients: any[]) => {
    const existing = shoppingListCache.findIndex(item => item.recipeId === recipeId);
    if (existing >= 0) {
      shoppingListCache[existing].ingredients = ingredients;
    } else {
      shoppingListCache.push({ recipeId, ingredients });
    }
    localStorage.setItem('shoppingList', JSON.stringify(shoppingListCache));
  },
  
  removeFromShoppingList: (recipeId: string) => {
    shoppingListCache = shoppingListCache.filter(item => item.recipeId !== recipeId);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingListCache));
  },
  
  getShoppingList: () => {
    return shoppingListCache;
  },
};
