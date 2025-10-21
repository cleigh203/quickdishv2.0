import { WebPlugin } from '@capacitor/core';
import { NativeWebViewPlugin } from './NativeWebView';

export class NativeWebViewWeb extends WebPlugin implements NativeWebViewPlugin {
  private webViewWindow: Window | null = null;

  async open(options: { url: string }): Promise<void> {
    // On web, open in a new window/tab
    this.webViewWindow = window.open(options.url, '_blank');
    return Promise.resolve();
  }

  async close(): Promise<void> {
    if (this.webViewWindow) {
      this.webViewWindow.close();
      this.webViewWindow = null;
    }
    return Promise.resolve();
  }

  async loadUrl(options: { url: string }): Promise<void> {
    if (this.webViewWindow && !this.webViewWindow.closed) {
      this.webViewWindow.location.href = options.url;
    }
    return Promise.resolve();
  }

  async goBack(): Promise<void> {
    if (this.webViewWindow && !this.webViewWindow.closed) {
      this.webViewWindow.history.back();
    }
    return Promise.resolve();
  }
}

