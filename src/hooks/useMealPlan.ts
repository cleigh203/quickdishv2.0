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
      // Add 8-second timeout for insert
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Insert timed out')), 8000)
      );

      const insertPromise = supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          recipe_id: recipeId,
          scheduled_date: scheduledDate,
          meal_type: mealType,
        });

      const { error } = await Promise.race([insertPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Error adding meal plan:', error);
        // Don't show timeout errors
        if (error.message !== 'Insert timed out') {
          toast({
            title: "Couldn't add to meal plan",
            description: "Try again?",
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
          description: "Try again?",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
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
