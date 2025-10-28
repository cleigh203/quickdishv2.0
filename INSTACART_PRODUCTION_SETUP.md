# Instacart Production Setup

## ✅ Changes Made

### 1. **Edge Functions Updated**

All three Instacart edge functions have been updated to use the production API endpoint:

- `supabase/functions/instacart-search/index.ts`
- `supabase/functions/instacart-add-to-cart/index.ts`
- `supabase/functions/instacart-create-list/index.ts`

**Changes:**
- Changed default `INSTACART_BASE_URL` from `https://connect.dev.instacart.tools` to `https://connect.instacart.com`
- Removed `tracking_params` from API requests (not needed for Impact.com affiliate tracking)
- Added Impact.com UTM parameters to all returned Instacart URLs for affiliate commission tracking:
  ```typescript
  ?utm_campaign=instacart-idp&utm_medium=affiliate&utm_source=instacart_idp&utm_term=partnertype-mediapartner&utm_content=campaignid-20313_partnerid-4352633
  ```

### 2. **Hook: `src/hooks/useInstacart.ts`**

No changes needed - the hook calls the edge functions which now include tracking.

## 🔑 Setting Environment Variables

### Option 1: Supabase Dashboard (Recommended for Production)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to: **Project Settings** → **Edge Functions** → **Secrets**
3. Set the following secrets:
   - `INSTACART_API_KEY` = `keys.9ZzHF2lM1Z8XZVea5_9lVeXtG_Mfws4yIEVTrfrtBpU`
   - `INSTACART_BASE_URL` = `https://connect.instacart.com` (optional, already set as default)

### Option 2: Supabase CLI (For Local Development)

```bash
# Set the API key
supabase secrets set INSTACART_API_KEY=keys.9ZzHF2lM1Z8XZVea5_9lVeXtG_Mfws4yIEVTrfrtBpU

# Optionally set the base URL (it's already the default)
supabase secrets set INSTACART_BASE_URL=https://connect.instacart.com
```

### Option 3: Supabase Config File

Add to `supabase/config.toml`:

```toml
[secrets]
INSTACART_API_KEY = "keys.9ZzHF2lM1Z8XZVea5_9lVeXtG_Mfws4yIEVTrfrtBpU"
INSTACART_BASE_URL = "https://connect.instacart.com"
```

## 📋 Summary

### Files Modified:
1. ✅ `supabase/functions/instacart-search/index.ts` - Removed tracking_params from API request
2. ✅ `supabase/functions/instacart-add-to-cart/index.ts` - Updated endpoint (no changes needed)
3. ✅ `supabase/functions/instacart-create-list/index.ts` - Removed tracking_params, added UTM params to returned URL

### Impact.com Affiliate Tracking:
- UTM parameters appended to all Instacart URLs: `?utm_campaign=instacart-idp&utm_medium=affiliate&utm_source=instacart_idp&utm_term=partnertype-mediapartner&utm_content=campaignid-20313_partnerid-4352633`
- These parameters are REQUIRED for Impact.com to track conversions and pay affiliate commissions
- Parameters are added automatically to the `products_link_url` returned to the client

### Next Steps:
1. Set `INSTACART_API_KEY` in your Supabase dashboard
2. Deploy edge functions: `supabase functions deploy instacart-create-list`
3. Test the integration

