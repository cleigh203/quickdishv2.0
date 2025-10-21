import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
