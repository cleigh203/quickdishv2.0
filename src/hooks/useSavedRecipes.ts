import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { handleSupabaseError, retryOperation } from '@/utils/errorHandling';

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
      
      // Set up realtime subscription for saved_recipes
      const channel = supabase
        .channel('saved-recipes-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'saved_recipes',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Saved recipes changed:', payload);
            // Refetch when any change occurs
            fetchSavedRecipes();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
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
      
      // Add 5-second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 5000)
      );

      const fetchPromise = retryOperation(async () => {
        const result = await supabase
          .from('saved_recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false });
        
        if (result.error) throw result.error;
        return result;
      });

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) throw error;
      
      setSavedRecipes(data || []);
    } catch (err: any) {
      console.error('Error fetching saved recipes:', err);
      const errorInfo = handleSupabaseError(err);
      setError(err.message === 'Request timed out' ? 'Request timed out. Try again?' : errorInfo.description);
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
          toast({
            title: "Saved!",
            description: "Recipe added to favorites",
          });
          return { success: true };
        }
        return { success: false, message: 'Already saved' };
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
        toast({
          title: "Couldn't save recipe",
          description: "Try again?",
          variant: "destructive",
        });
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

      const { error } = await retryOperation(async () => {
        const result = await supabase
          .from('saved_recipes')
          .insert({
            user_id: user.id,
            recipe_id: recipeId,
          });
        
        if (result.error) throw result.error;
        return result;
      });

      if (error) throw error;

      // Refresh the list
      await fetchSavedRecipes();
      
      toast({
        title: "Saved!",
        description: "Recipe added to favorites",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to save recipe:', error);
      toast({
        title: "Couldn't save recipe",
        description: "Try again?",
        variant: "destructive",
      });
      return { success: false, message: 'Failed to save' };
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
      const { error } = await retryOperation(async () => {
        const result = await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
        
        if (result.error) throw result.error;
        return result;
      });

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
      const errorInfo = handleSupabaseError(err);
      toast({
        title: errorInfo.title,
        description: errorInfo.description,
        variant: "destructive",
      });
      return { success: false, message: errorInfo.description };
    }
  };

  const isSaved = (recipeId: string): boolean => {
    return savedRecipes.some(r => r.recipe_id === recipeId);
  };

  const updateRecipeNotes = async (recipeId: string, notes: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save notes",
        variant: "destructive",
      });
      return { success: false, message: 'Must be logged in' };
    }

    try {
      const { error } = await retryOperation(async () => {
        const result = await supabase
          .from('saved_recipes')
          .update({ notes })
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
        
        if (result.error) throw result.error;
        return result;
      });

      if (error) throw error;

      await fetchSavedRecipes();
      return { success: true };
    } catch (err: any) {
      console.error('Error updating notes:', err);
      const errorInfo = handleSupabaseError(err);
      return { success: false, message: errorInfo.description };
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
