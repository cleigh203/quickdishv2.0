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

  const fetchMealPlans = async () => {
    if (!user) {
      setMealPlans([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      toast({
        title: "Error",
        description: "Failed to load meal plans",
        variant: "destructive",
      });
    } finally {
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
      const { error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          recipe_id: recipeId,
          scheduled_date: scheduledDate,
          meal_type: mealType,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Added to meal plan!",
      });
      return true;
    } catch (error) {
      console.error('Error adding meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to add to meal plan",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMealPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Meal removed from plan",
      });
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to remove meal",
        variant: "destructive",
      });
    }
  };

  return {
    mealPlans,
    loading,
    addMealPlan,
    deleteMealPlan,
    refreshMealPlans: fetchMealPlans,
  };
};
