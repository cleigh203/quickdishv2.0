import { GroceryStore } from '@/types/shopping';

/**
 * Opens a store using native capabilities for Android/iOS
 * Uses Capacitor Browser plugin for in-app browsing on native platforms
 * Falls back to window.open on web
 */
export async function openStoreWithDeepLink(
  store: GroceryStore,
  searchTerm: string,
  windowName: string = 'shopping-window'
): Promise<void> {
  const encodedTerm = encodeURIComponent(searchTerm);
  
  try {
    // Check if we're on native platform (Android/iOS)
    const { Capacitor } = await import('@capacitor/core');
    const isNative = Capacitor.isNativePlatform();
    
    if (isNative) {
      // === NATIVE ANDROID/IOS ===
      const { Browser } = await import('@capacitor/browser');
      
      // Build the URL to open
      const webUrl = `${store.url}${encodedTerm}`;
      
      // Open in in-app browser (overlay style)
      await Browser.open({ 
        url: webUrl,
        presentationStyle: 'popover', // Opens as overlay on top of app
        toolbarColor: '#10b981' // QuickDish green theme
      });
      
      console.log(`✅ Opened ${store.name} in in-app browser`);
      
    } else {
      // === WEB ===
      const webUrl = `${store.url}${encodedTerm}`;
      window.open(webUrl, windowName);
      console.log(`✅ Opened ${store.name} in new tab`);
    }
    
  } catch (error) {
    console.error('Error opening store:', error);
    
    // Fallback - try regular window.open
    const webUrl = `${store.url}${encodedTerm}`;
    window.open(webUrl, windowName);
  }
}

/**
 * Checks if user is on mobile device
 */
export function isMobileDevice(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/**
 * Checks if we're on native platform (Android/iOS)
 */
export async function isNativePlatform(): Promise<boolean> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/**
 * Close the in-app browser (native only)
 */
export async function closeBrowser(): Promise<void> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { Browser } = await import('@capacitor/browser');
      await Browser.close();
    }
  } catch (error) {
    console.log('Could not close browser:', error);
  }
}

