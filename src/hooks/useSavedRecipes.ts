import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SavedRecipe {
  id: string;
  recipe_id: string;
  notes: string | null;
  rating: number | null;
  times_cooked: number;
  saved_at: string;
}

export const useSavedRecipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch saved recipes on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    } else {
      // For guests, load from localStorage
      loadFromLocalStorage();
      setLoading(false);
    }
  }, [user]);

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('favorites');
      const favoriteIds: string[] = saved ? JSON.parse(saved) : [];
      const recipes: SavedRecipe[] = favoriteIds.map(id => ({
        id: `local-${id}`,
        recipe_id: id,
        notes: null,
        rating: null,
        times_cooked: 0,
        saved_at: new Date().toISOString(),
      }));
      setSavedRecipes(recipes);
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      setSavedRecipes([]);
    }
  };

  const fetchSavedRecipes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      
      setSavedRecipes(data || []);
    } catch (err: any) {
      console.error('Error fetching saved recipes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async (recipeId: string) => {
    if (!user) {
      // Guest mode - use localStorage
      try {
        const saved = localStorage.getItem('favorites');
        const favorites: string[] = saved ? JSON.parse(saved) : [];
        if (!favorites.includes(recipeId)) {
          favorites.push(recipeId);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          loadFromLocalStorage();
          return { success: true };
        }
        return { success: false, message: 'Already saved' };
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
        return { success: false, message: 'Failed to save' };
      }
    }

    try {
      // Check if already saved
      const existing = savedRecipes.find(r => r.recipe_id === recipeId);
      if (existing) {
        toast({
          title: "Already saved",
          description: "This recipe is already in your favorites",
        });
        return { success: false, message: 'Already saved' };
      }

      const { error } = await supabase
        .from('saved_recipes')
        .insert({
          user_id: user.id,
          recipe_id: recipeId,
        });

      if (error) throw error;

      // Refresh the list
      await fetchSavedRecipes();
      
      toast({
        title: "Saved!",
        description: "Recipe added to your favorites",
      });

      return { success: true };
    } catch (err: any) {
      console.error('Error saving recipe:', err);
      toast({
        title: "Error",
        description: "Failed to save recipe",
        variant: "destructive",
      });
      return { success: false, message: err.message };
    }
  };

  const unsaveRecipe = async (recipeId: string) => {
    if (!user) {
      // Guest mode - use localStorage
      try {
        const saved = localStorage.getItem('favorites');
        const favorites: string[] = saved ? JSON.parse(saved) : [];
        const updated = favorites.filter(id => id !== recipeId);
        localStorage.setItem('favorites', JSON.stringify(updated));
        loadFromLocalStorage();
        return { success: true };
      } catch (error) {
        console.error('Failed to remove from localStorage:', error);
        return { success: false, message: 'Failed to remove' };
      }
    }

    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) throw error;

      // Refresh the list
      await fetchSavedRecipes();

      toast({
        title: "Removed",
        description: "Recipe removed from favorites",
      });

      return { success: true };
    } catch (err: any) {
      console.error('Error removing recipe:', err);
      toast({
        title: "Error",
        description: "Failed to remove recipe",
        variant: "destructive",
      });
      return { success: false, message: err.message };
    }
  };

  const isSaved = (recipeId: string): boolean => {
    return savedRecipes.some(r => r.recipe_id === recipeId);
  };

  const updateRecipeNotes = async (recipeId: string, notes: string) => {
    if (!user) return { success: false, message: 'Must be logged in' };

    try {
      const { error } = await supabase
        .from('saved_recipes')
        .update({ notes })
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) throw error;

      await fetchSavedRecipes();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating notes:', err);
      return { success: false, message: err.message };
    }
  };

  const updateRecipeRating = async (recipeId: string, rating: number) => {
    if (!user) return { success: false, message: 'Must be logged in' };

    try {
      const { error } = await supabase
        .from('saved_recipes')
        .update({ rating })
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) throw error;

      await fetchSavedRecipes();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating rating:', err);
      return { success: false, message: err.message };
    }
  };

  const incrementTimesCooked = async (recipeId: string) => {
    if (!user) return { success: false, message: 'Must be logged in' };

    try {
      const saved = savedRecipes.find(r => r.recipe_id === recipeId);
      if (!saved) return { success: false, message: 'Recipe not saved' };

      const { error } = await supabase
        .from('saved_recipes')
        .update({ times_cooked: (saved.times_cooked || 0) + 1 })
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);

      if (error) throw error;

      await fetchSavedRecipes();
      return { success: true };
    } catch (err: any) {
      console.error('Error incrementing times cooked:', err);
      return { success: false, message: err.message };
    }
  };

  return {
    savedRecipes,
    loading,
    error,
    saveRecipe,
    unsaveRecipe,
    isSaved,
    updateRecipeNotes,
    updateRecipeRating,
    incrementTimesCooked,
    refetch: fetchSavedRecipes,
  };
};
