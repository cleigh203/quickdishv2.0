import { supabase } from '@/integrations/supabase/client';

type AnalyticsEvent = 
  | 'ai_chat_opened'
  | 'ai_chat_message_sent'
  | 'ai_chat_recipe_mentioned'
  | 'ai_chat_recipe_clicked'
  | 'ai_chat_upgrade_shown'
  | 'ai_chat_upgrade_clicked'
  | 'ai_chat_error';

interface EventData {
  [key: string]: any;
}

const isDevelopment = import.meta.env.DEV;

export const trackEvent = async (
  eventName: AnalyticsEvent,
  eventData?: EventData,
  userId?: string
) => {
  // Log to console in development
  if (isDevelopment) {
    console.log('[Analytics]', eventName, eventData);
  }

  try {
    // Only attempt DB write if user is authenticated to avoid RLS errors
    if (userId) {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          user_id: userId,
          event_type: eventName,
          metadata: eventData || {},
        });
      if (error) {
        // Log but don't throw—analytics should never block UX
        console.error('Analytics tracking error:', error);
      }
    }
  } catch (err) {
    console.error('Failed to track event:', err);
  }
};

// Convenience functions
export const trackChatOpened = (userId?: string) => 
  trackEvent('ai_chat_opened', {}, userId);

export const trackMessageSent = (messageLength: number, userId?: string) =>
  trackEvent('ai_chat_message_sent', { messageLength }, userId);

export const trackRecipeMentioned = (recipeId: string, userId?: string) =>
  trackEvent('ai_chat_recipe_mentioned', { recipeId }, userId);

export const trackRecipeClicked = (recipeId: string, userId?: string) =>
  trackEvent('ai_chat_recipe_clicked', { recipeId }, userId);

export const trackUpgradeShown = (location: string, userId?: string) =>
  trackEvent('ai_chat_upgrade_shown', { location }, userId);

export const trackUpgradeClicked = (location: string, userId?: string) =>
  trackEvent('ai_chat_upgrade_clicked', { location }, userId);

export const trackChatError = (error: string, context?: string, userId?: string) =>
  trackEvent('ai_chat_error', { error, context }, userId);
