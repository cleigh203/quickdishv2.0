import React from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { Capacitor } from "@capacitor/core";
import App from "./App.tsx";
import "./index.css";

// Initialize Sentry for error tracking (only in production)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || "production",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    // Release tracking
    release: `quickdish@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    // Filter out noisy errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      'atomicFindClose',
      // Network errors that are expected
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
      // Supabase connection errors
      'Failed to fetch',
      'NetworkError when attempting to fetch resource',
    ],
    beforeSend(event, hint) {
      // Don't send errors in development
      if (import.meta.env.DEV) {
        return null;
      }
      
      // Add platform context
      if (Capacitor.isNativePlatform()) {
        event.tags = {
          ...event.tags,
          platform: 'native',
          native_platform: Capacitor.getPlatform(),
        };
      } else {
        event.tags = {
          ...event.tags,
          platform: 'web',
        };
      }
      
      return event;
    },
  });

  // Add Capacitor-specific error handling for native apps
  if (Capacitor.isNativePlatform()) {
    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      Sentry.captureException(event.reason, {
        tags: {
          error_type: 'unhandled_promise_rejection',
          platform: 'native',
        },
      });
    });
    
    // Capture native crashes if available
    if (Capacitor.isNativePlatform()) {
      // Dynamically import @capacitor/app only at runtime
      Promise.resolve().then(async () => {
        try {
          const { App } = await import('@capacitor/app');
          App.addListener('appStateChange', ({ isActive }) => {
            if (!isActive) {
              // App went to background - flush any pending events
              Sentry.flush(2000);
            }
          });
        } catch {
          // Capacitor App plugin not available - ignore
        }
      });
    }
  }
}

// Warn if Supabase env vars are missing at runtime (helps Vercel env setup)
(() => {
  const url = (import.meta as any).env?.VITE_SUPABASE_URL;
  const key = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error(
      "Supabase env vars missing: VITE_SUPABASE_URL and/or VITE_SUPABASE_PUBLISHABLE_KEY. Check Vercel project settings."
    );
  }
})();

// Configure status bar for native apps
(async () => {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { StatusBar, Style } = await import('@capacitor/status-bar');
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch (error) {
    console.log('Capacitor not available (web mode)');
  }
})();

// Enable lightweight analytics in production (dynamic import to avoid bundler/type issues)
if (import.meta.env.PROD) {
  import('@vercel/analytics').then(m => {
    try { m.inject(); } catch {}
  }).catch(() => {});
}

// Unregister all service workers and clear caches with version checking
const CACHE_VERSION = 'v1.0.0';
const cachedVersion = localStorage.getItem('cacheVersion');

if (cachedVersion !== CACHE_VERSION) {
  // Clear caches only when version changes
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        if (import.meta.env.DEV) {
          console.log('🗑️ Unregistering service worker:', registration.scope);
        }
        registration.unregister();
      });
    });
  }

  // Clear any existing service worker caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (import.meta.env.DEV) {
          console.log('🗑️ Deleting cache:', name);
        }
        caches.delete(name);
      });
    });
  }

  localStorage.setItem('cacheVersion', CACHE_VERSION);
}

// Enable browser scroll restoration - let browser handle it automatically
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'auto';
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
