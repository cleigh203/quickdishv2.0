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
  const fetchInProgressRef = useState({ current: false })[0];
  const saveInProgressRef = useState<{ current: Set<string> }>({ current: new Set() })[0];
  const debounceTimerRef = useState<{ current: NodeJS.Timeout | null }>({ current: null })[0];
  const initialFetchDoneRef = useState({ current: false })[0];

  // Fetch saved recipes on mount and when user changes
  useEffect(() => {
    if (user) {
      // Only fetch on initial mount, not on every navigation
      if (!initialFetchDoneRef.current) {
        fetchSavedRecipes();
        initialFetchDoneRef.current = true;
      }
      
      // Set up realtime subscription with debouncing
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
            
            // Debounce refetch to prevent rapid-fire queries
            if (debounceTimerRef.current) {
              clearTimeout(debounceTimerRef.current);
            }
            
            debounceTimerRef.current = setTimeout(() => {
              // Only refetch if not already fetching and no save in progress
              if (!fetchInProgressRef.current && saveInProgressRef.current.size === 0) {
                fetchSavedRecipes();
              }
            }, 500); // 500ms debounce
          }
        )
        .subscribe();

      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        supabase.removeChannel(channel);
      };
    } else {
      // For guests, load from localStorage
      loadFromLocalStorage();
      setLoading(false);
      initialFetchDoneRef.current = true;
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
    if (!user || fetchInProgressRef.current) return;

    try {
      fetchInProgressRef.current = true;
      setLoading(true);
      setError(null);
      
      // Longer timeout - 10 seconds (only for genuine issues)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );

      const fetchPromise = retryOperation(async () => {
        const result = await supabase
          .from('saved_recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false });
        
        if (result.error) throw result.error;
        return result;
      }, 2, 1000); // Max 2 retries with 1s delay

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) throw error;
      
      setSavedRecipes(data || []);
      setError(null); // Clear any previous errors on success
    } catch (err: any) {
      console.error('Error fetching saved recipes:', err);
      
      // Don't show timeout errors to users - page loads fine with cached/retried data
      // Only log for debugging
      if (err.message !== 'Request timed out') {
        const errorInfo = handleSupabaseError(err);
        setError(errorInfo.description);
      }
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
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

    // Prevent duplicate save attempts
    if (saveInProgressRef.current.has(recipeId)) {
      return { success: false, message: 'Save in progress' };
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

      saveInProgressRef.current.add(recipeId);

      // Optimistically update local state immediately
      const newRecipe: SavedRecipe = {
        id: `temp-${recipeId}`,
        recipe_id: recipeId,
        notes: null,
        rating: null,
        times_cooked: 0,
        saved_at: new Date().toISOString(),
      };
      setSavedRecipes(prev => [newRecipe, ...prev]);

      toast({
        title: "Saved!",
        description: "Recipe added to favorites",
      });

      // Add 8-second timeout for insert
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Save timed out')), 8000)
      );

      const insertPromise = retryOperation(async () => {
        const result = await supabase
          .from('saved_recipes')
          .insert({
            user_id: user.id,
            recipe_id: recipeId,
          });
        
        if (result.error) throw result.error;
        return result;
      });

      await Promise.race([insertPromise, timeoutPromise]);

      // Realtime subscription will update with actual DB data
      
      return { success: true };
    } catch (error: any) {
      console.error('Failed to save recipe:', error);
      
      // Rollback optimistic update on error
      setSavedRecipes(prev => prev.filter(r => r.recipe_id !== recipeId));
      
      // Don't show timeout errors
      if (error.message !== 'Save timed out') {
        toast({
          title: "Couldn't save recipe",
          description: "Try again?",
          variant: "destructive",
        });
      }
      return { success: false, message: 'Failed to save' };
    } finally {
      saveInProgressRef.current.delete(recipeId);
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

    // Prevent duplicate unsave attempts
    if (saveInProgressRef.current.has(recipeId)) {
      return { success: false, message: 'Operation in progress' };
    }

    // Store previous state for rollback
    const previousRecipes = savedRecipes;

    try {
      saveInProgressRef.current.add(recipeId);

      // Optimistically remove from local state immediately
      setSavedRecipes(prev => prev.filter(r => r.recipe_id !== recipeId));

      toast({
        title: "Removed",
        description: "Recipe removed from favorites",
      });

      // Add 8-second timeout for delete
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Delete timed out')), 8000)
      );

      const deletePromise = retryOperation(async () => {
        const result = await supabase
          .from('saved_recipes')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId);
        
        if (result.error) throw result.error;
        return result;
      });

      await Promise.race([deletePromise, timeoutPromise]);

      // Realtime subscription will confirm the deletion
      
      return { success: true };
    } catch (err: any) {
      console.error('Error removing recipe:', err);
      
      // Rollback optimistic update on error
      setSavedRecipes(previousRecipes);
      
      const errorInfo = handleSupabaseError(err);
      // Don't show timeout errors
      if (err.message !== 'Delete timed out') {
        toast({
          title: errorInfo.title,
          description: errorInfo.description,
          variant: "destructive",
        });
      }
      return { success: false, message: errorInfo.description };
    } finally {
      saveInProgressRef.current.delete(recipeId);
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
