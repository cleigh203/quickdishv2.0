import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSubscription = () => {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isPremium: false, tier: 'free', userId: null };

      try {
        // Check subscription from profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_premium, subscription_tier')
          .eq('id', user.id)
          .single();

        // Gracefully handle missing columns
        const isPremium = profile?.is_premium || profile?.subscription_tier === 'premium' || false;
        
        return {
          isPremium,
          tier: isPremium ? 'premium' : 'free',
          userId: user.id
        };
      } catch (error) {
        console.error('Error checking subscription:', error);
        return { isPremium: false, tier: 'free', userId: user.id };
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });
};

export const useAIUsage = (usageType: 'recipe_generation' | 'chat' | 'nutrition') => {
  const { data: subscription } = useSubscription();
  
  return useQuery({
    queryKey: ['ai-usage', usageType, subscription?.userId],
    queryFn: async () => {
      if (!subscription?.userId) return { count: 0, canUse: false, limit: 0, isPremium: false };

      try {
        // For recipe generation, use the existing checkRateLimit approach
        if (usageType === 'recipe_generation') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('free_generations_used_today, last_generation_reset_date, subscription_tier, is_premium')
            .eq('id', subscription.userId)
            .single();

          const generationsUsed = profile?.free_generations_used_today ?? 0;
          const lastResetDate = profile?.last_generation_reset_date ?? new Date().toISOString().split('T')[0];
          const tier = profile?.subscription_tier ?? profile?.is_premium ? 'premium' : 'free';
          
          // Check if we need to reset the counter (new day)
          const today = new Date().toISOString().split('T')[0];
          const needsReset = lastResetDate !== today;
          const currentGenerations = needsReset ? 0 : generationsUsed;
          
          const limit = tier === 'premium' ? 5 : 1;
          const canUse = currentGenerations < limit;
          
          return {
            count: currentGenerations,
            limit,
            canUse,
            isPremium: subscription.isPremium
          };
        }

        // For chat, use ai_chat_usage table
        if (usageType === 'chat') {
          const limit = subscription.isPremium ? 999999 : 0;
          
          return {
            count: 0,
            limit,
            canUse: subscription.isPremium,
            isPremium: subscription.isPremium
          };
        }

        // For nutrition, always free (already unlocked for all users)
        return {
          count: 0,
          limit: 999999,
          canUse: true,
          isPremium: subscription.isPremium
        };
      } catch (error) {
        console.error('Error checking AI usage:', error);
        return {
          count: 0,
          limit: subscription.isPremium ? 999999 : 1,
          canUse: subscription.isPremium,
          isPremium: subscription.isPremium
        };
      }
    },
    enabled: !!subscription?.userId,
    retry: 2,
    staleTime: 2 * 60 * 1000 // Cache for 2 minutes
  });
};

export const useSavedRecipesCount = () => {
  const { data: subscription } = useSubscription();
  
  return useQuery({
    queryKey: ['saved-recipes-count', subscription?.userId],
    queryFn: async () => {
      if (!subscription?.userId) return { count: 0, limit: 50, isPremium: false };

      try {
        const { count, error } = await supabase
          .from('saved_recipes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', subscription.userId);

        if (error) {
          console.error('Error fetching saved recipes count:', error);
          return { count: 0, limit: 50, isPremium: subscription.isPremium };
        }

        const limit = subscription.isPremium ? 999999 : 50;
        const canSave = subscription.isPremium || (count || 0) < 50;
        
        return {
          count: count || 0,
          limit,
          canSave,
          isPremium: subscription.isPremium
        };
      } catch (error) {
        console.error('Error checking saved recipes count:', error);
        return {
          count: 0,
          limit: 50,
          canSave: true,
          isPremium: subscription.isPremium
        };
      }
    },
    enabled: !!subscription?.userId,
    retry: 2,
    staleTime: 2 * 60 * 1000 // Cache for 2 minutes
  });
};

