import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';
import { useGeneratedRecipes } from '@/hooks/useGeneratedRecipes';
import { recipeStorage } from '@/utils/recipeStorage';

export const useAiRecipeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationsRemaining, setGenerationsRemaining] = useState<number | null>(null);
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  const { addGeneratedRecipe } = useGeneratedRecipes();

  const checkRateLimit = async (): Promise<{ allowed: boolean; remaining: number }> => {
    if (!user) {
      return { allowed: false, remaining: 0 };
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('ai_generations_today, last_generation_date, is_premium')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Check if we need to reset the counter (new day)
      const today = new Date().toISOString().split('T')[0];
      const lastGenDate = profile.last_generation_date;
      const needsReset = !lastGenDate || lastGenDate !== today;

      const currentGenerations = needsReset ? 0 : (profile.ai_generations_today || 0);
      const limit = profile.is_premium ? 5 : 2;
      const remaining = Math.max(0, limit - currentGenerations);

      setGenerationsRemaining(remaining);

      return {
        allowed: currentGenerations < limit,
        remaining
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return { allowed: false, remaining: 0 };
    }
  };

  const generateRecipe = async (searchTerm: string): Promise<Recipe | null> => {
    console.log('📡 1. generateRecipe called with:', searchTerm);
    console.log('📡 2. User ID:', user?.id);
    console.log('📡 3. Is Premium:', isPremium);
    
    if (!user) {
      console.log('📡 4. No user, returning null');
      toast({
        title: "Sign in required",
        description: "Please sign in to generate recipes with AI",
        variant: "destructive"
      });
      return null;
    }

    setIsGenerating(true);

    // Show initial loading toast
    const loadingToast = toast({
      title: "Creating your custom recipe...",
      description: "Generating recipe with AI",
      duration: Infinity
    });

    try {
      console.log('📡 5. Invoking edge function generate-recipe-ai...');
      const response = await supabase.functions.invoke('generate-recipe-ai', {
        body: { searchTerm, userId: user.id }
      });

      console.log('📡 6. Edge function response:', response);
      console.log('📡 6a. Response data:', response.data);
      console.log('📡 6b. Response error:', response.error);
      
      const { data, error } = response;

      // Dismiss loading toast
      loadingToast.dismiss();

      if (error) {
        console.log('📡 7. Error from edge function:', error);
        console.log('📡 7a. Error message:', error.message);
        console.log('📡 7b. Full error:', JSON.stringify(error, null, 2));
        
        if (error.message?.includes('Rate limit')) {
          toast({
            title: "Daily limit reached",
            description: isPremium 
              ? "You've used all 5 AI generations today. Try again tomorrow!"
              : "You've used your 2 free AI generations. Upgrade to Premium for 5/day!",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Generation failed",
            description: error.message || "Failed to generate recipe. Please try again.",
            variant: "destructive"
          });
        }
        return null;
      }

      if (data?.error) {
        console.log('📡 8. Error in response data:', data.error);
        toast({
          title: "Generation failed",
          description: data.error,
          variant: "destructive"
        });
        return null;
      }
      
      if (!data?.recipe) {
        console.log('📡 8a. No recipe in response data:', data);
        toast({
          title: "Generation failed",
          description: "No recipe returned from AI. Please try again.",
          variant: "destructive"
        });
        return null;
      }

      console.log('📡 9. Recipe generated successfully:', data.recipe);
      console.log('📡 10. Recipe ID:', data.recipe?.id);
      console.log('📡 11. Generations remaining:', data.generationsRemaining);
      
      setGenerationsRemaining(data.generationsRemaining);
      
      // Normalize AI recipe fields and add to session storage (not database)
      const aiRecipe: Recipe = {
        ...data.recipe,
        isAiGenerated: true,
        image: data.recipe.image_url || '',
        imageUrl: data.recipe.image_url || '',
      } as Recipe;
      addGeneratedRecipe(aiRecipe);
      try {
        const existing = recipeStorage.getRecipes();
        const withoutDup = existing.filter((r: any) => r.id !== aiRecipe.id);
        recipeStorage.setRecipes([aiRecipe, ...withoutDup]);
      } catch (e) {
        console.warn('Could not persist AI recipe locally', e);
      }
      
      toast({
        title: "Recipe created!",
        description: `${data.recipe.name} - Save it if you like it!`
      });

      return aiRecipe;
    } catch (error: any) {
      console.error('📡 12. Exception in generateRecipe:', error);
      loadingToast.dismiss();
      toast({
        title: "Generation failed",
        description: "Failed to generate recipe. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      console.log('📡 13. Setting isGenerating to false');
      setIsGenerating(false);
    }
  };

  return {
    generateRecipe,
    isGenerating,
    generationsRemaining,
    checkRateLimit
  };
};
