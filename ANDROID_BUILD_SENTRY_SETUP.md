# Sentry DSN Setup for Android Build (No Vercel Needed)

## ✅ For Android Studio Build Only

If you're building directly in Android Studio and **not using Vercel**, here's how to add Sentry DSN:

### Option 1: Local .env.production File (Recommended)

1. Create `.env.production` file in project root:
```env
VITE_SENTRY_DSN=https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
```

2. Build your app:
```bash
npm run build
```

3. The DSN will be included in the production build
4. Sync to Android:
```bash
npx cap sync android
```

### Option 2: Add to Build Script

Modify `package.json` to include DSN in build:
```json
"scripts": {
  "build": "VITE_SENTRY_DSN=https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248 vite build"
}
```

### Option 3: Hardcode for Production (Not Recommended)

Only if you can't use environment variables, you could temporarily hardcode in `src/main.tsx`:
```typescript
Sentry.init({
  dsn: "https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248",
  // ... rest of config
});
```

**⚠️ Note:** DSNs are safe to expose in client code, but using env vars is cleaner.

---

## 🌐 But You Still Need Web Hosting For:

### 1. Privacy Policy & Terms URLs (REQUIRED by Google Play)
- Must be accessible at: `https://quickdish.co/privacy`
- Must be accessible at: `https://quickdish.co/terms`
- Google Play will verify these URLs exist
- **You need to host these somewhere** (Vercel, Netlify, or any web host)

### 2. Android App Links Verification
- Must be accessible at: `https://quickdish.co/.well-known/assetlinks.json`
- Required for deep linking to work
- **You need to host this file**

### 3. Web Version (Optional)
- If you have a web version of your app, it needs hosting
- But not required for Android app submission

---

## 📋 Summary

**For Android App:**
- ✅ You can build locally in Android Studio
- ✅ Add Sentry DSN to `.env.production` file
- ✅ No Vercel needed for the Android build

**But You Still Need:**
- ⚠️ Web hosting for Privacy Policy URL (required by Google Play)
- ⚠️ Web hosting for Terms URL (required by Google Play)
- ⚠️ Web hosting for assetlinks.json (for deep linking)

**Options for Hosting:**
1. **Vercel** (if you have it set up) - easiest
2. **Netlify** - free alternative
3. **GitHub Pages** - free, simple
4. **Any web host** - just needs to serve static files

---

## 🎯 Quick Setup for Android Build

1. Create `.env.production` in project root:
```env
VITE_SENTRY_DSN=https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248
```

2. Build:
```bash
npm run build
```

3. Sync to Android:
```bash
npx cap sync android
```

4. Build in Android Studio

**Done!** Sentry will work in your Android app.


