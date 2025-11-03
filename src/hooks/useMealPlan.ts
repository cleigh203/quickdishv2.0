import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface MealPlan {
  id: string;
  user_id: string;
  recipe_id: string;
  scheduled_date: string;
  meal_type: string;
  created_at: string;
}

export const useMealPlan = () => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchInProgressRef = useState(false)[0];

  const fetchMealPlans = async () => {
    // Prevent duplicate simultaneous requests
    if (fetchInProgressRef) return;
    if (!user) {
      setMealPlans([]);
      setLoading(false);
      return;
    }

    try {
      Object.assign(fetchInProgressRef, { current: true });
      
      // Add 8-second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 8000)
      );

      const fetchPromise = supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching meal plans:', error);
      // Don't show timeout errors - page loads fine with retries
      if (error.message !== 'Request timed out') {
        toast({
          title: "Error",
          description: "Failed to load meal plans",
          variant: "destructive",
        });
      }
    } finally {
      Object.assign(fetchInProgressRef, { current: false });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlans();

    if (user) {
      const channel = supabase
        .channel('meal_plans_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'meal_plans',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchMealPlans();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const addMealPlan = async (recipeId: string, scheduledDate: string, mealType: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use meal planning",
        variant: "destructive",
      });
      return false;
    }

    try {
      let dbRecipeId: string | null = null;
      
      // First, try to find in recipes table (for regular recipes)
      // meal_plans.recipe_id is TEXT, so we use recipe_id (not id UUID)
      const { data: dbRecipe, error: lookupError } = await supabase
        .from('recipes')
        .select('recipe_id')
        .eq('recipe_id', recipeId)
        .maybeSingle();

      if (lookupError) {
        console.error('Recipe lookup error:', lookupError);
      }

      if (dbRecipe?.recipe_id) {
        // For regular recipes, use recipe_id (TEXT) to match meal_plans schema
        dbRecipeId = dbRecipe.recipe_id;
        console.log('Found recipe in recipes table:', dbRecipeId);
      } else {
        // If not found in recipes, check generated_recipes table (for AI recipes)
        console.log('Recipe not found in recipes table, checking generated_recipes...', recipeId);
        const { data: generatedRecipe, error: generatedError } = await supabase
          .from('generated_recipes')
          .select('recipe_id, user_id')
          .eq('recipe_id', recipeId)
          .eq('user_id', user.id) // Ensure it belongs to the current user
          .maybeSingle();

        if (generatedError) {
          console.error('Generated recipe lookup error:', generatedError);
        }

        if (generatedRecipe?.recipe_id) {
          // For AI recipes, use the recipe_id directly (it's already a string ID)
          dbRecipeId = generatedRecipe.recipe_id;
          console.log('Found AI recipe in generated_recipes:', dbRecipeId);
        }
      }

      if (!dbRecipeId) {
        toast({
          title: 'Recipe not found',
          description: 'This recipe is not in the database. Please try generating it again or contact support.',
          variant: 'destructive',
        });
        return false;
      }

      // Add 8-second timeout for insert
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Insert timed out')), 8000)
      );

      const insertPromise = supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          // Use the recipe ID found (UUID from recipes table or string ID from generated_recipes)
          recipe_id: dbRecipeId,
          // Provide both fields to satisfy schemas that require `date`
          date: scheduledDate,
          scheduled_date: scheduledDate,
          meal_type: mealType,
        });

      const { error } = await Promise.race([insertPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error adding meal plan:', error);
        const msg = error?.message || 'Unknown error';
        
        // Provide more specific error messages
        if (msg.includes('foreign key') || msg.includes('violates foreign key constraint')) {
          toast({
            title: "Couldn't add to meal plan",
            description: "Recipe reference is invalid. Please try saving the recipe again first.",
            variant: "destructive",
          });
        } else if (msg.includes('unique') || msg.includes('duplicate')) {
          toast({
            title: "Already in meal plan",
            description: "This recipe is already scheduled for this meal.",
            variant: "destructive",
          });
        } else if (msg !== 'Insert timed out') {
          toast({
            title: "Couldn't add to meal plan",
            description: msg,
            variant: "destructive",
          });
        }
        return false;
      }

      toast({
        title: "Added to meal plan",
        description: `Scheduled for ${mealType}`,
      });
      return true;
    } catch (error: any) {
      console.error('Error adding meal plan:', error);
      // Don't show timeout errors
      if (error.message !== 'Insert timed out') {
        toast({
          title: "Couldn't add to meal plan",
          description: error.message || "Try again?",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
      // Optimistically update UI
      setMealPlans(prev => prev.filter(plan => plan.id !== id));

      // Add 8-second timeout for delete
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Delete timed out')), 8000)
      );

      const deletePromise = supabase
        .from('meal_plans')
        .delete()
        .eq('id', id);

      const { error } = await Promise.race([deletePromise, timeoutPromise]) as any;

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal removed from plan",
      });
    } catch (error: any) {
      console.error('Error deleting meal plan:', error);
      // Revert optimistic update on error
      fetchMealPlans();
      // Don't show timeout errors
      if (error.message !== 'Delete timed out') {
        toast({
          title: "Error",
          description: "Failed to remove meal",
          variant: "destructive",
        });
      }
    }
  };

  const clearAllMealPlans = async (keepPastMeals: boolean = false) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to clear meal plans",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Add 8-second timeout for bulk delete
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Clear timed out')), 8000)
      );

      let query = supabase
        .from('meal_plans')
        .delete()
        .eq('user_id', user.id);

      if (keepPastMeals) {
        const today = new Date().toISOString().split('T')[0];
        query = query.gte('scheduled_date', today);
      }

      const { error } = await Promise.race([query, timeoutPromise]) as any;

      if (error) throw error;

      // Update local state immediately
      if (keepPastMeals) {
        // Filter out past meals from current state
        const today = new Date().toISOString().split('T')[0];
        setMealPlans(prev => prev.filter(plan => plan.scheduled_date >= today));
      } else {
        // Clear all meal plans
        setMealPlans([]);
      }

      toast({
        title: "Success",
        description: keepPastMeals ? "Future meals cleared" : "Meal plan cleared",
      });
      return true;
    } catch (error: any) {
      console.error('Error clearing meal plans:', error);
      // Don't show timeout errors
      if (error.message !== 'Clear timed out') {
        toast({
          title: "Error",
          description: "Failed to clear meal plan",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  return {
    mealPlans,
    loading,
    addMealPlan,
    deleteMealPlan,
    clearAllMealPlans,
    refreshMealPlans: fetchMealPlans,
  };
};
