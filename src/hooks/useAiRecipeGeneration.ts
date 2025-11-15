import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';
import { useGeneratedRecipes } from '@/hooks/useGeneratedRecipes';
import { recipeStorage } from '@/utils/recipeStorage';
import { useQueryClient } from '@tanstack/react-query';
import { getAiGenerationLimit } from '@/constants/limits';
import { v4 as uuidv4 } from 'uuid';

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
      
      // Generate proper UUID for database (id column is UUID type)
      const recipeUuid = uuidv4();
      
      // Normalize AI recipe fields and use the UUID
      const aiRecipe: Recipe = {
        ...data.recipe,
        id: recipeUuid, // Use proper UUID instead of custom format
        isAiGenerated: true,
        image: data.recipe.image_url || '',
        imageUrl: data.recipe.image_url || '',
      } as Recipe;
      
      // Automatically save to generated_recipes table
      try {
        const { error: saveError } = await supabase
          .from('generated_recipes')
          .insert({
            id: recipeUuid, // Use proper UUID
            recipe_id: recipeUuid, // Use proper UUID
            user_id: user.id,
            name: aiRecipe.name,
            description: aiRecipe.description || '',
            ingredients: aiRecipe.ingredients || [],
            instructions: aiRecipe.instructions || [],
            cook_time: aiRecipe.cookTime || '',
            prep_time: aiRecipe.prepTime || '',
            difficulty: aiRecipe.difficulty || '',
            servings: aiRecipe.servings || 1,
            cuisine: aiRecipe.cuisine || '',
            image_url: aiRecipe.imageUrl || aiRecipe.image || '',
            nutrition: aiRecipe.nutrition || null,
            tags: aiRecipe.tags || [],
          });

        if (saveError) {
          console.error('Error saving recipe to generated_recipes:', saveError);
          // Still continue - recipe is generated, just couldn't save to DB
        } else {
          console.log('✅ Recipe automatically saved to generated_recipes table');
          
          // Also add to saved_recipes so it appears in My Kitchen immediately
          try {
            const { error: savedError } = await supabase
              .from('saved_recipes')
              .insert({
                user_id: user.id,
                recipe_id: aiRecipe.id,
              });

            if (savedError) {
              // If it already exists, that's fine - just log it
              if (savedError.code !== '23505') { // Not a duplicate key error
                console.error('Error saving recipe to saved_recipes:', savedError);
              }
            } else {
              console.log('✅ Recipe also added to saved_recipes');
            }
          } catch (savedErr) {
            console.error('Exception saving recipe to saved_recipes:', savedErr);
            // Continue even if this fails
          }
        }
      } catch (saveErr) {
        console.error('Exception saving recipe to database:', saveErr);
        // Continue even if save fails
      }
      
      // Add to session storage and state
      addGeneratedRecipe(aiRecipe);
      try {
        const existing = recipeStorage.getRecipes();
        const withoutDup = existing.filter((r: any) => r.id !== aiRecipe.id);
        recipeStorage.setRecipes([aiRecipe, ...withoutDup]);
      } catch (e) {
        console.warn('Could not persist AI recipe locally', e);
      }
      
      // Invalidate queries to refresh My Kitchen
      queryClient.invalidateQueries({ queryKey: ['generated-recipes'] });
      queryClient.invalidateQueries({ queryKey: ['saved-recipes'] });
      
      toast({
        title: "✅ Recipe Created & Saved!",
        description: "Find it anytime in My Kitchen",
        duration: 4000
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
