/**
 * Web-specific analytics
 * Uses Vercel Analytics for web, not available in native
 */

import { isWeb } from '@/utils/platform';

/**
 * Track page view (web only)
 */
export const trackPageView = (path: string) => {
  if (!isWeb()) return;
  
  // Vercel Analytics
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('pageview', { path });
  }
};

/**
 * Track event (web only)
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!isWeb()) return;
  
  // Vercel Analytics
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', { name: eventName, ...properties });
  }
};

