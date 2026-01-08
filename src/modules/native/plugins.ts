/**
 * Native plugin utilities
 * Wrappers for Capacitor plugins that are only available in native builds
 */

import { getPlatform } from '@/utils/platform';

/**
 * Open native browser (native only)
 */
export const openNativeBrowser = async (url: string) => {
  const platform = await getPlatform();
  if (platform === 'web') {
    window.open(url, '_blank');
    return;
  }

  try {
    const { Browser } = await import('@capacitor/browser');
    await Browser.open({ url });
  } catch {
    // Fallback to web
    window.open(url, '_blank');
  }
};

/**
 * Share content (native only, falls back to Web Share API on web)
 */
export const shareContent = async (options: { title?: string; text?: string; url?: string }) => {
  const platform = await getPlatform();
  
  // Use Web Share API if available (modern browsers)
  if (platform === 'web' && navigator.share) {
    try {
      await navigator.share(options);
      return;
    } catch {
      // User cancelled or error
    }
  }

  // Native share
  if (platform !== 'web') {
    try {
      const { Share } = await import('@capacitor/share');
      await Share.share(options);
    } catch {
      // Fallback to copying URL
      if (options.url) {
        await navigator.clipboard.writeText(options.url);
      }
    }
  }
};

