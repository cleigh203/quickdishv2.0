# Premium/Payments Production Setup

## Stripe
- Set env on Supabase Functions:
  - STRIPE_SECRET_KEY
  - STRIPE_API_VERSION (optional; otherwise use account default)
  - STRIPE_WEBHOOK_SECRET (for stripe-webhook function)
- Set env on Functions and/or Vercel:
  - SUPABASE_URL, SUPABASE_ANON_KEY (for create-checkout)
- Set env on Functions:
  - STRIPE_PRICE_ID (live price)
- Create a webhook endpoint in Stripe → Developers → Webhooks → Add endpoint
  - URL: https://<PROJECT>.functions.supabase.co/stripe-webhook
  - Events: customer.subscription.created/updated/deleted
  - Copy the signing secret into STRIPE_WEBHOOK_SECRET

## Instacart
- Set env on Supabase Functions:
  - INSTACART_API_KEY (live)
  - INSTACART_BASE_URL (prod base URL)
- Confirm partner approval and production access

## Supabase Auth and Storage
- Auth → Enable email confirmation; add production domain to Redirect URLs
- Storage → Create `avatars` bucket, set public read & user write policies

## Vercel
- Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Preview and Production
- Verify security headers in vercel.json

## Preflight
- Run: `node scripts/preflight-verify.mjs` with envs loaded to ensure all required variables exist
# 🔓 Admin Premium Testing Setup

## Quick Setup: Enable Premium for Testing

### Method 1: Supabase Dashboard (EASIEST)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **QuickDish** project
3. Click **Table Editor** (left sidebar)
4. Open the **profiles** table
5. Find your account row (by email)
6. Click the row to edit
7. Set **is_premium** = `true` ✅
8. Click **Save**
9. **Refresh your app** - premium features unlocked! 🎉

---

### Method 2: SQL Editor (ALTERNATIVE)

If you prefer SQL:

1. Go to **SQL Editor** in Supabase
2. Run this command (replace with your email):

```sql
UPDATE profiles 
SET is_premium = true 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);
```

3. Click **Run**
4. Refresh your app

---

### Method 3: Code Bypass (FOR PRODUCTION BUILDS)

If you're testing the **production Android build** (not dev mode), add this to `src/contexts/AuthContext.tsx`:

**Line 36-69**, replace the `checkSubscription` function with:

```typescript
const checkSubscription = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsPremium(false);
      return;
    }

    // 🔓 ADMIN BYPASS: Replace with your email for testing
    const ADMIN_EMAILS = ['your-email@example.com'];
    if (ADMIN_EMAILS.includes(session.user.email || '')) {
      console.log('👑 Admin mode: Premium unlocked');
      setIsPremium(true);
      return;
    }

    // In dev mode, read directly from database to support test premium
    if (import.meta.env.DEV) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', session.user.id)
        .single();
      
      setIsPremium(profile?.is_premium || false);
      console.log('🧪 Dev mode: Premium status from DB:', profile?.is_premium);
      return;
    }

    // Production: check via Stripe
    const { data, error } = await supabase.functions.invoke('check-subscription');
    
    if (!error && data?.subscribed) {
      setIsPremium(true);
    } else {
      setIsPremium(false);
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    setIsPremium(false);
  }
};
```

⚠️ **IMPORTANT**: Remove the admin bypass before final Play Store submission!

---

## ✅ What You Get Access To:

- **Ask Chef Quinn** - AI recipe assistant chat
- **Nutritional Facts** - Full nutrition breakdown for all recipes
- **Premium badge** - Shows 👑 next to your name
- **All future premium features**

---

## 🧪 Testing Checklist:

- [ ] Premium features visible (no paywall)
- [ ] Ask Chef Quinn opens chat dialog
- [ ] Nutritional Facts shows full nutrition data
- [ ] Premium badge shows in UI
- [ ] Test on both web and Android builds

---

## 🔄 To Revert (After Testing):

### If using Method 1 or 2:
Update database back to `is_premium = false`

### If using Method 3:
Remove the admin email bypass code before release

---

**Need help?** Let me know which method you want to use and I'll walk you through it!


