import { registerPlugin } from '@capacitor/core';

export interface NativeWebViewPlugin {
  /**
   * Open a URL in a native WebView overlay
   */
  open(options: { url: string }): Promise<void>;
  
  /**
   * Close the native WebView
   */
  close(): Promise<void>;
  
  /**
   * Load a new URL in the existing WebView
   */
  loadUrl(options: { url: string }): Promise<void>;
  
  /**
   * Go back in WebView history
   */
  goBack(): Promise<void>;
}

const NativeWebView = registerPlugin<NativeWebViewPlugin>('NativeWebView', {
  web: () => import('./NativeWebViewWeb').then(m => new m.NativeWebViewWeb()),
});

export default NativeWebView;

