# Sentry DSN Setup Instructions

## Your Sentry DSN
```
https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248
```

## ✅ Already Installed
- ✅ `@sentry/react` - Already installed
- ✅ `@sentry/capacitor` - Already installed
- ✅ Sentry initialization code - Already in `src/main.tsx`
- ✅ ErrorBoundary - Already set up

## 🔧 Add DSN to Environment Variables

### For Vercel (Production):
1. Go to your Vercel project dashboard
2. Navigate to: **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `VITE_SENTRY_DSN`
   - **Value:** `https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248`
   - **Environment:** Production, Preview, Development (or just Production)
4. **Redeploy** your app for changes to take effect

### For Local Development (Optional):
1. Create or edit `.env` file in project root
2. Add:
   ```
   VITE_SENTRY_DSN=https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248
   ```
3. Note: Sentry only runs in production builds, so this won't affect dev mode

## ✅ Your Setup is Already Advanced

Your current Sentry setup includes:
- ✅ Error filtering (ignores noisy errors)
- ✅ User context tracking (automatically set when users sign in)
- ✅ Platform detection (tags errors as 'native' or 'web')
- ✅ Performance monitoring (10% sample rate)
- ✅ Session replay (10% normal, 100% on errors)
- ✅ Capacitor integration (works on Android)
- ✅ ErrorBoundary integration

**You don't need to change any code** - just add the DSN!

## 🧪 Test Sentry (After Adding DSN)

Once you've added the DSN and deployed to production, you can test with this button:

```tsx
// Add this to any page temporarily to test
function TestSentryButton() {
  return (
    <button
      onClick={() => {
        throw new Error('Test Sentry error tracking!');
      }}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Test Sentry Error
    </button>
  );
}
```

Or manually trigger an error in the browser console:
```javascript
throw new Error('Test Sentry');
```

## 📊 Verify It's Working

1. Deploy to production with DSN added
2. Trigger a test error
3. Go to Sentry dashboard: https://sentry.io
4. Check **Issues** tab - you should see the error within seconds

## 🎯 Next Steps

1. ✅ Add DSN to Vercel environment variables
2. ✅ Redeploy app
3. ✅ Test error tracking
4. ✅ Verify errors appear in Sentry dashboard
5. ✅ Remove test button (if added)

## ⚠️ Important Notes

- Sentry **only runs in production** (`import.meta.env.PROD`)
- Errors in development won't be sent to Sentry
- The DSN is safe to expose in client-side code (it's public)
- Your setup already filters out noisy errors automatically


