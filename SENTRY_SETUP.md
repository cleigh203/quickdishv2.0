# Sentry Production Setup Guide

## Current Status

✅ Sentry is already configured in `src/main.tsx`  
✅ ErrorBoundary component with Sentry integration  
✅ User context tracking configured  
⚠️ **Action Required:** Add `VITE_SENTRY_DSN` to production environment variables

## Your Sentry DSN

Based on previous setup, your DSN is:
```
https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248
```

## Step 1: Verify Sentry Account

1. Go to https://sentry.io
2. Log in to your account
3. Select your project: **QuickDish**
4. Go to **Settings** → **Projects** → **QuickDish** → **Client Keys (DSN)**
5. Verify the DSN matches the one above

## Step 2: Add to Vercel Environment Variables

### Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Select your **QuickDish** project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add the following:
   - **Name:** `VITE_SENTRY_DSN`
   - **Value:** `https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248`
   - **Environment:** Select all (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your application:
   - Go to **Deployments**
   - Click the three dots (⋯) on the latest deployment
   - Click **Redeploy**

### Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Add environment variable
vercel env add VITE_SENTRY_DSN

# When prompted, enter:
# Value: https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248
# Environment: Production, Preview, Development (select all)

# Redeploy
vercel --prod
```

## Step 3: Verify Setup

### Test Error Reporting

1. **Deploy to production** (after adding env var)
2. **Trigger a test error** in production:
   - Open browser console on production site
   - Run: `throw new Error('Test Sentry error')`
3. **Check Sentry Dashboard:**
   - Go to https://sentry.io
   - Navigate to **Issues**
   - You should see the test error within 1-2 minutes

### Verify in Code

The Sentry initialization in `src/main.tsx` checks:
```typescript
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  // Sentry is initialized
}
```

**Expected behavior:**
- ✅ Production: Sentry initialized
- ✅ Development: Sentry NOT initialized (errors filtered out)
- ✅ Missing DSN: Sentry NOT initialized (graceful fallback)

## Step 4: Monitor Errors

### Sentry Dashboard Features

1. **Issues:** View all errors and exceptions
2. **Performance:** Monitor app performance
3. **Releases:** Track app versions
4. **Users:** See affected users
5. **Alerts:** Set up email/Slack notifications

### Set Up Alerts (Optional)

1. Go to **Alerts** in Sentry
2. Click **Create Alert Rule**
3. Configure:
   - **Trigger:** When an issue is created
   - **Conditions:** Any issue
   - **Actions:** Email notification
4. Save

## Current Configuration

### Error Filtering

Sentry is configured to ignore:
- Browser extension errors
- Network errors (expected failures)
- Development errors

### Performance Monitoring

- **Traces Sample Rate:** 10% of transactions
- **Session Replay:** 10% of sessions, 100% of error sessions

### Platform Detection

Sentry automatically tags errors with:
- `platform: 'native'` or `platform: 'web'`
- `native_platform: 'android'` or `'ios'` (if native)

## Troubleshooting

### Sentry Not Working?

1. **Check environment variable:**
   ```bash
   # In Vercel, verify VITE_SENTRY_DSN is set
   ```

2. **Check build logs:**
   - Look for Sentry initialization messages
   - Verify no errors during build

3. **Check browser console:**
   - Look for Sentry-related errors
   - Verify `import.meta.env.VITE_SENTRY_DSN` is defined

4. **Test in production:**
   - Sentry only works in production mode
   - Development errors are filtered out

### Common Issues

**Issue:** Errors not appearing in Sentry
- **Solution:** Verify DSN is correct and environment variable is set
- **Solution:** Check that you're testing in production mode

**Issue:** Too many errors
- **Solution:** Adjust `ignoreErrors` array in `main.tsx`
- **Solution:** Adjust sample rates (tracesSampleRate, replaysSessionSampleRate)

**Issue:** Missing user context
- **Solution:** Verify `AuthContext.tsx` is setting user context
- **Solution:** Check Sentry user context in dashboard

## Next Steps

After setting up Sentry:

1. ✅ Add `VITE_SENTRY_DSN` to Vercel
2. ✅ Redeploy to production
3. ✅ Test error reporting
4. ✅ Set up alerts (optional)
5. ✅ Monitor errors regularly

## Resources

- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/
- **React Integration:** https://docs.sentry.io/platforms/javascript/guides/react/
- **Capacitor Integration:** https://docs.sentry.io/platforms/javascript/guides/capacitor/
