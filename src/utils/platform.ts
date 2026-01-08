/**
 * Platform detection utilities
 * Determines if running on web, native Android, or native iOS
 */

export type Platform = 'web' | 'android' | 'ios' | 'unknown';

let platformCache: Platform | null = null;

/**
 * Detects the current platform
 */
export const getPlatform = async (): Promise<Platform> => {
  if (platformCache) {
    return platformCache;
  }

  // Check if running in browser (web)
  if (typeof window === 'undefined') {
    platformCache = 'unknown';
    return platformCache;
  }

  // Check for Capacitor (native)
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const platform = Capacitor.getPlatform();
      platformCache = platform === 'android' ? 'android' : platform === 'ios' ? 'ios' : 'unknown';
      return platformCache;
    }
  } catch {
    // Capacitor not available, must be web
  }

  // Default to web
  platformCache = 'web';
  return platformCache;
};

/**
 * Synchronous platform check (uses cached value or defaults to web)
 */
export const isWeb = (): boolean => {
  if (platformCache === null) {
    // If not cached yet, assume web for immediate checks
    // This will be updated on first async call
    return true;
  }
  return platformCache === 'web';
};

/**
 * Check if running on native platform
 */
export const isNative = async (): Promise<boolean> => {
  const platform = await getPlatform();
  return platform === 'android' || platform === 'ios';
};

/**
 * Check if running on Android
 */
export const isAndroid = async (): Promise<boolean> => {
  const platform = await getPlatform();
  return platform === 'android';
};

/**
 * Check if running on iOS
 */
export const isIOS = async (): Promise<boolean> => {
  const platform = await getPlatform();
  return platform === 'ios';
};

/**
 * Get platform at build time (for conditional imports)
 */
export const BUILD_PLATFORM: Platform = import.meta.env.VITE_PLATFORM === 'native' 
  ? 'native' 
  : 'web';

