# Fixing Web App 404 Error (Android Works Fine)

Since authentication works on Android but shows 404 on web, this is a **redirect URL configuration issue** in Supabase.

## Quick Fix

### Step 1: Get Your Vercel Domain

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your QuickDish project
3. Copy your production domain (e.g., `quickdish-xyz.vercel.app` or your custom domain)

### Step 2: Add Redirect URL to Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   ```
   https://your-vercel-domain.vercel.app/auth/callback
   ```
   (Replace `your-vercel-domain` with your actual Vercel domain)

5. Also add for preview deployments (optional but recommended):
   ```
   https://*.vercel.app/auth/callback
   ```

6. Click **Save**

### Step 3: Set Environment Variable (Optional but Recommended)

For more control, you can set a specific redirect URL in Vercel:

1. Go to Vercel Project Settings → **Environment Variables**
2. Add:
   - **Name**: `VITE_AUTH_REDIRECT_URL`
   - **Value**: `https://your-vercel-domain.vercel.app/auth/callback`
   - **Environment**: Production, Preview, Development

3. **Redeploy** your app

## Why Android Works But Web Doesn't

- **Android**: Uses deep links or doesn't require redirect URLs for password-based auth
- **Web**: Requires exact redirect URL to be whitelisted in Supabase for security

## Verification

After adding the redirect URL:

1. Wait a few seconds for Supabase to update
2. Try logging in on the web app again
3. Check browser console (F12) for any error messages
4. The redirect URL should match exactly (including `https://`)

## Common Issues

### Issue: Still getting 404 after adding URL
**Solution**: 
- Make sure the URL matches **exactly** (case-sensitive, include `https://`)
- Wait a few seconds for Supabase to sync
- Clear browser cache and try again
- Check if you're on a preview deployment (different domain)

### Issue: Multiple Vercel domains
**Solution**: Add all domains to Supabase redirect URLs:
- Production domain
- Preview domain pattern: `https://*.vercel.app/auth/callback`
- Custom domain (if you have one)

### Issue: Works locally but not on Vercel
**Solution**: 
- Local uses `http://localhost:8080/auth/callback` (already configured)
- Vercel needs its own domain added
- Add the Vercel domain to Supabase redirect URLs

## Debug Mode

The code now logs the redirect URL in development mode. Check browser console to see what URL is being used.

