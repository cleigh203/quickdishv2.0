import { supabase } from '@/integrations/supabase/client'

export async function trackEvent(
  eventType: string,
  metadata?: Record<string, any>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    await supabase
      .from('analytics_events')
      .insert({
        user_id: user?.id || null,
        event_type: eventType,
        metadata: metadata || {},
        created_at: new Date().toISOString()
      })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    // Don't throw - analytics shouldn't break the app
  }
}

// Convenience functions for common events
export const trackRecipeView = (recipeId: string) =>
  trackEvent('recipe_view', { recipe_id: recipeId })

export const trackRecipeSave = (recipeId: string) =>
  trackEvent('recipe_save', { recipe_id: recipeId })

export const trackRecipeUnsave = (recipeId: string) =>
  trackEvent('recipe_unsave', { recipe_id: recipeId })

export const trackCookingModeStart = (recipeId: string) =>
  trackEvent('cooking_mode_start', { recipe_id: recipeId })

export const trackCookingModeComplete = (recipeId: string) =>
  trackEvent('cooking_mode_complete', { recipe_id: recipeId })

export const trackSearch = (query: string, resultCount: number) =>
  trackEvent('search', { query, result_count: resultCount })

export const trackAIGeneration = (ingredients: string[]) =>
  trackEvent('ai_generation', { ingredients })

export const trackChatOpened = () =>
  trackEvent('ai_chat_opened')

export const trackMessageSent = (messageLength: number) =>
  trackEvent('ai_chat_message_sent', { message_length: messageLength })

export const trackRecipeMentioned = (recipeId: string) =>
  trackEvent('ai_chat_recipe_mentioned', { recipe_id: recipeId })

export const trackRecipeClicked = (recipeId: string) =>
  trackEvent('ai_chat_recipe_clicked', { recipe_id: recipeId })

export const trackUpgradeShown = (location: string) =>
  trackEvent('ai_chat_upgrade_shown', { location })

export const trackUpgradeClicked = (location: string) =>
  trackEvent('ai_chat_upgrade_clicked', { location })

export const trackChatError = (error: string, context?: string) =>
  trackEvent('ai_chat_error', { error, context })



