# Fixing Supabase 404 NOT_FOUND Error

If you're getting a `404: NOT_FOUND` error when trying to log in on the web, follow these steps:

## 1. Check Supabase Dashboard Configuration

The redirect URL must be whitelisted in your Supabase project:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   - `https://your-vercel-domain.vercel.app/auth/callback`
   - `http://localhost:8080/auth/callback` (for local development)
   - Any other domains where your app is hosted

## 2. Verify Environment Variables

Make sure these are set in your Vercel project settings:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anon/public key

To check in Vercel:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Verify both variables are set correctly

## 3. Check Supabase Project Status

The error can occur if:
- Your Supabase project is paused (free tier projects pause after inactivity)
- Your Supabase project was deleted
- The project URL or key is incorrect

To check:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Verify your project is active
3. Copy the correct URL and anon key from **Settings** → **API**

## 4. Test the Configuration

After updating the redirect URLs:

1. **Redeploy your Vercel app** to pick up any environment variable changes
2. Try logging in again
3. Check the browser console for any additional error messages

## 5. Common Issues

### Issue: Redirect URL doesn't match
**Solution**: The redirect URL in your code must exactly match what's in Supabase dashboard (including protocol: `https://` vs `http://`)

### Issue: Environment variables not set in Vercel
**Solution**: Add them in Vercel project settings → Environment Variables → Add for Production, Preview, and Development

### Issue: Supabase project paused
**Solution**: Go to Supabase dashboard and resume your project

## 6. Debug Steps

If the issue persists:

1. Open browser DevTools → Console
2. Check for the exact error message
3. Verify the Supabase URL is correct:
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   ```
4. Check network tab to see what request is failing
5. Verify the callback route exists: `/auth/callback`

## Current Configuration

The app is configured to use:
- **Callback Route**: `/auth/callback`
- **Auth Flow**: PKCE (more secure)
- **Redirect URL**: Automatically set to `${window.location.origin}/auth/callback`

Make sure this exact URL pattern is whitelisted in your Supabase dashboard.

