# Premium Status Bug Analysis

## 🐛 **The Bug**

You're showing as premium in the UI even though you don't have a premium subscription in the database. This is caused by **localStorage caching**.

---

## 📍 **Where Premium Status is Checked**

### **1. AuthContext.tsx - Primary Check** (Lines 36-97)

```typescript
const checkSubscription = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsPremium(false);
      return;
    }

    // 🔓 DEV MODE OVERRIDE: Check environment variable first
    if (import.meta.env.VITE_DEV_PREMIUM_ENABLED === 'true') {
      console.log('🔓 DEV MODE: Premium features enabled via environment variable');
      setIsPremium(true);
      return;
    }

    // 🔓 TESTING BYPASS: Check database first
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_tier')  // ← Checks SUBSCRIPTION_TIER
        .eq('id', session.user.id)
        .single();

      if (profile) {
        const isPremiumUser = profile.subscription_tier === 'premium';
        if (isPremiumUser) {
          setIsPremium(true);
          console.log('👑 Premium enabled from database (subscription_tier)');
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching profile in AuthContext:', error);
    }

    // In dev mode, stop here
    if (import.meta.env.DEV) {
      setIsPremium(false);
      console.log('🧪 Dev mode: No premium in database');
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

**AuthContext checks:**
1. ✅ Environment variable `VITE_DEV_PREMIUM_ENABLED`
2. ✅ Database `profiles.subscription_tier`
3. ✅ Stripe Edge Function `check-subscription` (production only)

---

### **2. Profile.tsx - localStorage Check** ⚠️ **BUG HERE!**

**File**: `src/pages/Profile.tsx` (Lines 60-62)

```typescript
const [isPremium, setIsPremium] = useState(() => {
  return localStorage.getItem('premiumUser') === 'true';  // ← LOADS FROM LOCALSTORAGE FIRST!
});
```

**This is the bug!** Profile.tsx loads premium status from localStorage before checking the database.

---

### **3. Profile.tsx - Database Sync** (Lines 114-122)

```typescript
const fetchProfile = async () => {
  // ... fetch profile data
  setProfileData(combinedData);
  
  // Update premium status from database
  setIsPremium(profileData?.is_premium || false);  // ← CHECKS is_premium COLUMN
  
  // Get subscription end date if premium
  if (profileData?.is_premium) {
    const { data: subData } = await supabase.functions.invoke('check-subscription');
    if (subData?.subscription_end) {
      setSubscriptionEnd(subData.subscription_end);
    }
  }
};
```

**Profile.tsx checks:**
1. ⚠️ **localStorage first** (bug!)
2. ✅ Database `profiles.is_premium` column
3. ✅ Stripe subscription end date

---

### **4. Profile.tsx - Developer Toggle** (Lines 210-259)

```typescript
const togglePremium = async () => {
  if (!user) return;
  
  const newStatus = !isPremium;
  
  try {
    // Update database
    const { error } = await supabase
      .from('profiles')
      .update({ is_premium: newStatus })  // ← UPDATES is_premium COLUMN
      .eq('id', user.id);

    if (error) throw error;

    // Update local state
    setIsPremium(newStatus);
    localStorage.setItem('premiumUser', newStatus.toString());  // ← SAVES TO LOCALSTORAGE
    
    // ... toast messages
    
    // Refresh auth context to update isPremium throughout the app
    await checkSubscription();
    
    // Refresh profile to confirm
    fetchProfile();
  } catch (error: any) {
    console.error('Error toggling premium:', error);
  }
};
```

**The toggle:**
- ✅ Updates database `profiles.is_premium`
- ⚠️ **Also updates localStorage** (`premiumUser` key)
- ✅ Refreshes AuthContext

---

## 🔍 **The Root Cause**

You have **two different premium check systems**:

1. **AuthContext** - Checks:
   - `profiles.subscription_tier` column
   - Stripe Edge Function
   - Environment variable

2. **Profile page** - Checks:
   - **localStorage first** (bug!)
   - `profiles.is_premium` column
   - Stripe subscription

**The problem**: The Profile page loads from localStorage on mount, which can be stale or manually set.

---

## 🗂️ **Database Tables & Columns**

### **Check these tables:**

1. **`profiles` table**
   - `is_premium` (boolean) - Used by Profile page
   - `subscription_tier` (text) - Used by AuthContext

2. **`user_subscriptions` table** (if exists)
   - Stores Stripe subscription details
   - Updated by Stripe webhook

---

## 🔧 **How to Fix**

### **Fix 1: Remove localStorage Check from Profile.tsx**

**File**: `src/pages/Profile.tsx`

**Change this:**
```typescript
const [isPremium, setIsPremium] = useState(() => {
  return localStorage.getItem('premiumUser') === 'true';  // ❌ REMOVE THIS
});
```

**To this:**
```typescript
const [isPremium, setIsPremium] = useState(false);  // ✅ Default to false
```

---

### **Fix 2: Remove localStorage from togglePremium**

**File**: `src/pages/Profile.tsx` (Line 226)

**Remove this line:**
```typescript
localStorage.setItem('premiumUser', newStatus.toString());  // ❌ REMOVE THIS
```

---

### **Fix 3: Standardize on One Column**

You're checking TWO different columns:
- `profiles.is_premium` (Profile page)
- `profiles.subscription_tier` (AuthContext)

**Pick ONE and use it everywhere:**

**Option A**: Use `subscription_tier` everywhere
```typescript
// In AuthContext (already uses this)
.select('subscription_tier')
const isPremiumUser = profile.subscription_tier === 'premium';

// In Profile.tsx
const fetchProfile = async () => {
  const { data: profileData } = await supabase
    .from('profiles')
    .select('subscription_tier')  // ← Change from is_premium
    .eq('id', user.id)
    .single();
  
  setIsPremium(profileData?.subscription_tier === 'premium');
};
```

**Option B**: Use `is_premium` everywhere
```typescript
// In AuthContext (change this)
.select('is_premium')  // ← Change from subscription_tier
const isPremiumUser = profile.is_premium === true;

// In Profile.tsx (already uses this)
.select('is_premium')
setIsPremium(profileData?.is_premium || false);
```

**Recommendation**: Use `subscription_tier` because it's more flexible (can add more tiers later).

---

### **Fix 4: Clear localStorage**

**Run this in browser console:**
```javascript
// Remove the stale localStorage entry
localStorage.removeItem('premiumUser');

// Check what's there
console.log('Premium keys:', Object.keys(localStorage).filter(k => k.includes('premium')));
```

---

### **Fix 5: Update Stripe Webhook**

**File**: `supabase/functions/stripe-webhook/index.ts` (Lines 65-79)

**Current webhook only updates `user_subscriptions`**, not `profiles`:

```typescript
// Update user_subscriptions
await supabase
  .from('user_subscriptions')
  .upsert({...}, { onConflict: 'stripe_customer_id' });

// Optionally flip profiles.is_premium based on status
const isActive = status === 'active' || status === 'trialing' || status === 'past_due';
// ← BUT IT DOESN'T ACTUALLY UPDATE PROFILES!
```

**Add this after line 73:**
```typescript
// Update user_subscriptions
await supabase
  .from('user_subscriptions')
  .upsert({...}, { onConflict: 'stripe_customer_id' });

// Update profiles table
const { data: userIdData } = await supabase
  .from('user_subscriptions')
  .select('user_id')
  .eq('stripe_customer_id', customerId)
  .single();

if (userIdData?.user_id) {
  await supabase
    .from('profiles')
    .update({ 
      subscription_tier: isActive ? 'premium' : 'free',
      is_premium: isActive  // Keep for backward compatibility
    })
    .eq('id', userIdData.user_id);
}
```

---

## 🎯 **Quick Diagnosis**

**Run this in browser console to see what's causing premium status:**

```javascript
// Check localStorage
console.log('LocalStorage premiumUser:', localStorage.getItem('premiumUser'));

// Check AuthContext state
// (You'll need to access React DevTools for this)

// Check database
// Run in Supabase SQL editor:
SELECT id, is_premium, subscription_tier FROM profiles WHERE email = 'your@email.com';
```

---

## 📊 **Summary of Issues**

| Issue | Location | Status | Fix |
|-------|----------|--------|-----|
| localStorage check | Profile.tsx:60 | 🐛 **BUG** | Remove it |
| localStorage save | Profile.tsx:226 | 🐛 **BUG** | Remove it |
| Two different columns | AuthContext vs Profile | ⚠️ **INCONSISTENT** | Standardize |
| Webhook doesn't update profiles | stripe-webhook:65-79 | ⚠️ **MISSING** | Add profile update |
| Stale localStorage | Browser | 🐛 **BUG** | Clear it |

---

## ✅ **Recommended Fixes**

1. **Immediate**: Clear localStorage and refresh page
   ```javascript
   localStorage.removeItem('premiumUser');
   location.reload();
   ```

2. **Code Fix**: Remove localStorage from Profile.tsx (lines 60-62, 226)

3. **Standardize**: Pick one column (`subscription_tier` recommended)

4. **Webhook**: Make Stripe webhook update `profiles` table

5. **Test**: Verify premium status only comes from database

---

## 🔍 **Verification**

After fixes, run this to verify:

```sql
-- Check your profile
SELECT id, email, is_premium, subscription_tier 
FROM profiles 
WHERE email = 'your@email.com';

-- Should show:
-- is_premium: false (or null)
-- subscription_tier: 'free' (or null)
```

```javascript
// Run in console
localStorage.getItem('premiumUser');  // Should be null
```

```typescript
// Check AuthContext
console.log('isPremium:', isPremium);  // Should be false
```

If you're still seeing premium after these checks, there's another source setting it.

