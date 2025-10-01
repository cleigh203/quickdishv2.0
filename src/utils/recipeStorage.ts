import { Recipe } from "@/types/recipe";

// In-memory storage for fast access
let recipesCache: Recipe[] | null = null;
let favoritesCache: string[] | null = null;
let shoppingListCache: { recipeId: string; ingredients: any[] }[] | null = null;

// Lazy initialization functions - only load from localStorage when first accessed
const ensureRecipesLoaded = () => {
  if (recipesCache === null) {
    try {
      const stored = localStorage.getItem('recipes');
      recipesCache = stored ? JSON.parse(stored) : [];
    } catch {
      recipesCache = [];
    }
  }
  return recipesCache;
};

const ensureFavoritesLoaded = () => {
  if (favoritesCache === null) {
    try {
      const stored = localStorage.getItem('favorites');
      favoritesCache = stored ? JSON.parse(stored) : [];
    } catch {
      favoritesCache = [];
    }
  }
  return favoritesCache;
};

const ensureShoppingListLoaded = () => {
  if (shoppingListCache === null) {
    try {
      const stored = localStorage.getItem('shoppingList');
      shoppingListCache = stored ? JSON.parse(stored) : [];
    } catch {
      shoppingListCache = [];
    }
  }
  return shoppingListCache;
};

export const recipeStorage = {
  // Recipes
  setRecipes: (recipes: Recipe[]) => {
    recipesCache = recipes;
    localStorage.setItem('recipes', JSON.stringify(recipes));
  },
  
  getRecipes: (): Recipe[] => {
    return ensureRecipesLoaded();
  },
  
  getRecipeById: (id: string): Recipe | undefined => {
    const cache = ensureRecipesLoaded();
    return cache.find(r => r.id === id);
  },
  
  // Favorites
  addFavorite: (recipeId: string) => {
    const cache = ensureFavoritesLoaded();
    if (!cache.includes(recipeId)) {
      cache.push(recipeId);
      localStorage.setItem('favorites', JSON.stringify(cache));
    }
  },
  
  removeFavorite: (recipeId: string) => {
    const cache = ensureFavoritesLoaded();
    favoritesCache = cache.filter(id => id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(favoritesCache));
  },
  
  getFavorites: (): string[] => {
    return ensureFavoritesLoaded();
  },
  
  isFavorite: (recipeId: string): boolean => {
    const cache = ensureFavoritesLoaded();
    return cache.includes(recipeId);
  },
  
  // Shopping list
  addToShoppingList: (recipeId: string, ingredients: any[]) => {
    const cache = ensureShoppingListLoaded();
    const existing = cache.findIndex(item => item.recipeId === recipeId);
    if (existing >= 0) {
      cache[existing].ingredients = ingredients;
    } else {
      cache.push({ recipeId, ingredients });
    }
    localStorage.setItem('shoppingList', JSON.stringify(cache));
  },
  
  removeFromShoppingList: (recipeId: string) => {
    const cache = ensureShoppingListLoaded();
    shoppingListCache = cache.filter(item => item.recipeId !== recipeId);
    localStorage.setItem('shoppingList', JSON.stringify(shoppingListCache));
  },
  
  getShoppingList: () => {
    return ensureShoppingListLoaded();
  },
};
