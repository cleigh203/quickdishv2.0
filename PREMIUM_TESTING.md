# Premium Features Testing Guide

## 🎯 Overview

The QuickDish app now has a complete premium subscription system with paywalls, testing modes, and a premium status dashboard.

## ✅ What's Already Implemented

### Paywalls (All Working)
1. **Chef Quinn AI Chat** - Premium required (unlimited)
2. **Nutritional Facts** - Premium required
3. **Recipe Save Limit** - 50 saves for free, unlimited for premium
4. **AI Recipe Generation** - 1/day free, 5/day premium
5. **Export as PDF** - Premium required

### Profile Page
- Premium status card showing current plan
- Usage statistics (AI recipes used, saved recipes)
- Upgrade button for free users
- Developer testing toggle (dev mode only)

### Testing Modes
Three ways to enable premium for testing:

## 🔓 Testing Methods

### Method 1: Environment Variable (Recommended for Production Safety)

Add to `.env.local`:
```bash
VITE_DEV_PREMIUM_ENABLED=true
```

This enables premium features globally across the app for testing.

### Method 2: Database Toggle (Profile Page)

In dev mode (`import.meta.env.DEV`), navigate to the Profile page and scroll to the bottom. You'll see a "Developer Tools" section with a toggle button.

Click "🔓 Dev Premium: ON" to enable premium features.

### Method 3: Direct Database Update (Supabase)

Run this SQL in Supabase SQL Editor:

```sql
-- Enable premium for your user
UPDATE profiles
SET 
  subscription_tier = 'premium',
  is_premium = true
WHERE id = 'YOUR-USER-ID-HERE';

-- Disable premium (go back to free)
UPDATE profiles
SET 
  subscription_tier = 'free',
  is_premium = false
WHERE id = 'YOUR-USER-ID-HERE';
```

## 🧪 Testing Checklist

### Free User Testing
- [ ] Click "Ask Chef Quinn" → Shows paywall ✅
- [ ] View nutritional facts → Shows blurred with lock ✅
- [ ] Try to save 51st recipe → Shows paywall ✅
- [ ] Generate 2 AI recipes → 2nd shows paywall (now 1/day limit for free) ✅
- [ ] Click "Export PDF" → Shows paywall ✅
- [ ] Profile shows "Free Plan" with upgrade button ✅

### Premium User Testing
- [ ] All premium features unlocked ✅
- [ ] Can use Chef Quinn unlimited ✅
- [ ] Can see nutritional facts ✅
- [ ] Can save unlimited recipes ✅
- [ ] Can generate 5 AI recipes daily ✅
- [ ] Can export PDF ✅
- [ ] Profile shows "Premium Member" with benefits ✅

## 📊 Premium Features Summary

### Free Tier
- 1 AI recipe generation per day
- 50 saved recipes maximum
- No Chef Quinn chat
- No nutritional facts
- No PDF export
- Ad-supported

### Premium Tier ($2.99/month)
- 5 AI recipe generations per day
- Unlimited saved recipes
- Unlimited Chef Quinn AI chat
- Nutritional facts for all recipes
- Export recipes as PDF
- Offline access
- Ad-free experience

## 🏗️ Architecture

### Subscription Checking Flow
1. Check `VITE_DEV_PREMIUM_ENABLED` env var (testing)
2. Check `profiles.subscription_tier === 'premium'` (database)
3. In dev mode, stop (no Stripe check)
4. In production, check Stripe via Edge Function

### AuthContext
- `isPremium` state managed globally
- `checkSubscription()` function checks all sources
- Updates on sign in/out

### Paywall Components
- `PremiumModal` - Generic paywall modal
- `PremiumBadge` - Visual indicator for premium features
- `useAuth` hook - Provides `isPremium` status
- `useSubscription` hook - Additional subscription utilities

### Profile Page
- Dynamic premium status card
- Usage statistics display
- Developer tools (dev mode only)
- Subscription management integration

## 🚀 Deployment Notes

- Environment variable `VITE_DEV_PREMIUM_ENABLED` is only checked in AuthContext
- Never set this to `true` in production
- Dev tools toggle only renders when `import.meta.env.DEV === true`
- Database toggle works in both dev and production

## 📝 Files Modified

- `src/contexts/AuthContext.tsx` - Added env var support for testing
- `src/pages/Profile.tsx` - Added premium status card and dev tools toggle
- `src/pages/RecipeDetail.tsx` - All paywalls implemented
- `src/components/AiGenerationPrompt.tsx` - AI generation paywall
- `src/components/PremiumModal.tsx` - Generic paywall modal
- `src/hooks/useSubscription.ts` - Subscription utilities

## 🎉 Success Criteria

All premium features are working with proper paywalls, testing modes are functional, and the Profile page clearly communicates subscription status and usage limits.

