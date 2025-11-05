import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';
import { useGeneratedRecipes } from '@/hooks/useGeneratedRecipes';
import { recipeStorage } from '@/utils/recipeStorage';
import { useQueryClient } from '@tanstack/react-query';
import { getAiGenerationLimit } from '@/constants/limits';

export const useAiRecipeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationsRemaining, setGenerationsRemaining] = useState<number | null>(null);
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  const { addGeneratedRecipe } = useGeneratedRecipes();
  const queryClient = useQueryClient();

  const checkRateLimit = async (): Promise<{ allowed: boolean; remaining: number }> => {
    if (!user) {
      return { allowed: false, remaining: 0 };
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('ai_generations_used_today, ai_generations_reset_date, subscription_tier, is_premium')
        .eq('id', user.id)
        .single();

      // Get current date
      const today = new Date().toISOString().split('T')[0];
      
      // Handle missing profile or columns gracefully
      let currentGenerations = 0;
      let tier = 'free';

      if (error) {
        console.error('Profile fetch error:', error);
        // Use defaults if profile doesn't exist or columns are missing
        console.log('Using default profile values for rate limiting');
      } else if (profile) {
        // Check if we need to reset the counter (new day)
        const resetDate = profile.ai_generations_reset_date || today;
        const needsReset = resetDate !== today;
        
        // Get current generations count (reset to 0 if new day)
        if (!needsReset) {
          currentGenerations = profile.ai_generations_used_today ?? 0;
        }
        
        // Determine tier (premium or free)
        tier = profile.subscription_tier === 'premium' || profile.is_premium ? 'premium' : 'free';
      }

              // CRITICAL: Calculate limit based on premium status
        // Use getAiGenerationLimit helper function
        const limit = getAiGenerationLimit(tier === 'premium');
      const remaining = Math.max(0, limit - currentGenerations);

      // Debug logging
      console.log('AI Limit Debug (useAiRecipeGeneration):', {
        tier,
        isPremium: tier === 'premium',
        user_is_premium: profile?.is_premium,
        subscription_tier: profile?.subscription_tier,
        limit,
        currentGenerations,
        remaining
      });

      setGenerationsRemaining(remaining);

      return {
        allowed: currentGenerations < limit,
        remaining
      };
    } catch (error) {
      console.error('Error checking rate limit:', error);
      // Fallback to defaults on any error
      setGenerationsRemaining(1); // Default free limit
      return { allowed: true, remaining: 1 };
    }
  };

  const generateRecipe = async (searchTerm: string): Promise<Recipe | null> => {
    console.log('📡 1. generateRecipe called with:', searchTerm);
    console.log('📡 2. User ID:', user?.id);
    
    // Fetch FRESH premium status from database - don't rely on cached context
    let freshPremiumStatus = false;
    if (user) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_premium, subscription_tier')
          .eq('id', user.id)
          .single();
        
        freshPremiumStatus = profile?.is_premium === true || profile?.subscription_tier === 'premium' || false;
        console.log('📡 3. Fresh Premium Status from DB:', {
          is_premium: profile?.is_premium,
          subscription_tier: profile?.subscription_tier,
          result: freshPremiumStatus,
          cached: isPremium
        });
      } catch (error) {
        console.error('Error fetching fresh premium status:', error);
        // Fallback to cached value
        freshPremiumStatus = isPremium;
      }
    }
    
    console.log('📡 4. Cached Is Premium:', isPremium);
    console.log('📡 5. Fresh Is Premium:', freshPremiumStatus);
    
    if (!user) {
      console.log('📡 6. No user, returning null');
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
            // CRITICAL: Use dynamic limit based on premium status
            const limit = getAiGenerationLimit(freshPremiumStatus);
          toast({
            title: "Daily limit reached",
            description: freshPremiumStatus 
              ? `You've used all ${limit} AI generations today. Try again tomorrow!`
              : `You've used your 1 free AI generation. Upgrade to Premium for 5/day!`,
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
      
      // Invalidate AI usage cache to refresh the counter
      queryClient.invalidateQueries({ queryKey: ['ai-usage', 'recipe_generation'] });
      
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
