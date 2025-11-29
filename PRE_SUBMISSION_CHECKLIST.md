# Google Play Store Pre-Submission Checklist

## ✅ Completed Items

- ✅ API keys secured (environment variables)
- ✅ Account deletion removes ALL user data
- ✅ Android permissions properly declared
- ✅ Deep linking configured in AndroidManifest.xml
- ✅ Crash reporting (Sentry) configured
- ✅ Privacy Policy page exists at `/privacy`
- ✅ Terms of Service page exists at `/terms`
- ✅ `assetlinks.json` template created

---

## 🔴 CRITICAL - Must Complete Before Submission

### 1. Privacy Policy & Terms URLs
**Status:** ⚠️ **ACTION REQUIRED**

- [ ] Deploy app to production (Vercel)
- [ ] Verify URLs are accessible:
  - [ ] `https://quickdish.co/privacy` returns 200 OK
  - [ ] `https://quickdish.co/terms` returns 200 OK
- [ ] Add these URLs to Google Play Console:
  - Go to **Store presence** → **App content**
  - Add Privacy Policy URL
  - Add Terms of Service URL

**How to verify:**
```bash
curl -I https://quickdish.co/privacy
curl -I https://quickdish.co/terms
```

---

### 2. Android App Links (assetlinks.json)
**Status:** ⚠️ **ACTION REQUIRED**

- [ ] Get SHA-256 fingerprint from your signing key (see `GET_SHA256_FINGERPRINT.md`)
- [ ] Update `public/.well-known/assetlinks.json` with your fingerprint
- [ ] Deploy to production
- [ ] Verify file is accessible:
  - [ ] `https://quickdish.co/.well-known/assetlinks.json` returns 200 OK
  - [ ] Content-Type header is `application/json`
- [ ] Test deep linking on Android device

**See:** `ANDROID_APP_LINKS_SETUP.md` for detailed instructions

---

### 3. Sentry Production Setup
**Status:** ⚠️ **ACTION REQUIRED**

- [ ] Create Sentry account at https://sentry.io (if not already done)
- [ ] Get your DSN from Sentry dashboard
- [ ] Add `VITE_SENTRY_DSN` to Vercel environment variables:
  - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
  - Add: `VITE_SENTRY_DSN` = `https://your-dsn@sentry.io/project-id`
- [ ] Redeploy to production
- [ ] Test error reporting (trigger a test error)

**Current DSN (from previous setup):**
```
https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248
```

---

### 4. Google Play Console Setup
**Status:** ⚠️ **ACTION REQUIRED**

#### App Information
- [ ] Complete **App name** (QuickDish)
- [ ] Complete **Short description** (50 chars max)
- [ ] Complete **Full description** (4000 chars max)
- [ ] Upload **App icon** (512x512 PNG, no transparency)
- [ ] Upload **Feature graphic** (1024x500 PNG)
- [ ] Upload **Screenshots** (at least 2, max 8)
  - Phone: 16:9 or 9:16, min 320px, max 3840px
  - Tablet: 16:9 or 9:16, min 320px, max 3840px

#### Content Rating
- [ ] Complete **Age rating questionnaire**
  - Go to **Store presence** → **Content rating**
  - Answer questions about your app content
  - Submit for rating (usually instant)

#### Privacy & Security
- [ ] Add **Privacy Policy URL** (from step 1)
- [ ] Add **Terms of Service URL** (from step 1)
- [ ] Complete **Data safety section**:
  - Declare data collection (user accounts, recipes, pantry items, etc.)
  - Declare data sharing (Supabase, Stripe, Instacart)
  - Declare security practices

#### App Access
- [ ] Set **App availability** (All countries or specific)
- [ ] Set **Pricing** (Free or Paid)
- [ ] Configure **In-app products** (if you have premium subscription)

---

## 🟡 IMPORTANT - Should Complete Before Submission

### 5. Testing Checklist
**Status:** ⚠️ **ACTION REQUIRED**

#### Device Testing
- [ ] Test on Android 7.0 (API 24) - minimum supported
- [ ] Test on Android 10 (API 29)
- [ ] Test on Android 13 (API 33)
- [ ] Test on Android 14 (API 34)
- [ ] Test on different screen sizes (phone, tablet)
- [ ] Test on different manufacturers (Samsung, Google Pixel, etc.)

#### Feature Testing
- [ ] Test account creation and login
- [ ] Test account deletion (verify ALL data is removed)
- [ ] Test recipe browsing and search
- [ ] Test saving recipes
- [ ] Test meal planning
- [ ] Test pantry management
- [ ] Test voice search
- [ ] Test cooking mode
- [ ] Test PDF export
- [ ] Test deep linking (click recipe link in browser)
- [ ] Test offline functionality
- [ ] Test with slow network (3G simulation)

#### Performance Testing
- [ ] Check APK/AAB size (should be <150MB)
- [ ] Test app startup time (<3 seconds)
- [ ] Test recipe loading performance
- [ ] Monitor memory usage
- [ ] Test battery usage

**How to check APK size:**
```bash
# In Android Studio
Build → Build Bundle(s) / APK(s) → Build APK(s)
# Check the size in android/app/build/outputs/apk/
```

---

### 6. Content Rights Verification
**Status:** ⚠️ **ACTION REQUIRED**

- [ ] Verify you have rights to all recipe content
- [ ] Verify you have rights to all images
- [ ] Document any third-party content sources
- [ ] Ensure proper attribution (if required)
- [ ] Check for any copyrighted material

**Note:** Google Play may reject apps with unlicensed content.

---

### 7. App Bundle Creation
**Status:** ⚠️ **ACTION REQUIRED**

- [ ] Create signed App Bundle (AAB) in Android Studio:
  - **Build** → **Generate Signed Bundle / APK**
  - Select **Android App Bundle**
  - Use your release keystore
- [ ] Verify bundle size (<150MB)
- [ ] Upload to Google Play Console:
  - Go to **Production** → **Create new release**
  - Upload your AAB file
  - Add release notes

**Important:** Google Play requires AAB format (not APK) for new apps.

---

## 🟢 RECOMMENDED - Nice to Have

### 8. Additional Setup

#### Store Listing Optimization
- [ ] Add **Promotional text** (80 chars, shown in search results)
- [ ] Add **Promotional video** (YouTube link)
- [ ] Add **What's new** section for first release
- [ ] Add **App category** (Food & Drink)
- [ ] Add **Tags** (cooking, recipes, meal planning)

#### Beta Testing
- [ ] Set up **Internal testing** track
- [ ] Set up **Closed testing** track (optional)
- [ ] Test with a small group before public release

#### Analytics & Monitoring
- [ ] Set up Google Play Console analytics
- [ ] Verify Sentry error tracking is working
- [ ] Set up Supabase monitoring/alerts
- [ ] Plan for database backups

---

## 📋 Submission Day Checklist

Before clicking "Submit for review":

- [ ] All critical items (1-4) completed
- [ ] All important items (5-7) completed
- [ ] App Bundle (AAB) uploaded
- [ ] Store listing complete
- [ ] Content rating approved
- [ ] Privacy Policy & Terms URLs verified
- [ ] Screenshots uploaded
- [ ] App icon and graphics uploaded
- [ ] Release notes written
- [ ] Tested on multiple devices
- [ ] No critical bugs found

---

## 🚀 After Submission

1. **Wait for review** (usually 1-3 days)
2. **Monitor Google Play Console** for any issues
3. **Respond to reviewer feedback** if needed
4. **Prepare for launch** (marketing, announcements)

---

## 📞 Support Resources

- **Google Play Console Help:** https://support.google.com/googleplay/android-developer
- **Android App Links:** https://developer.android.com/training/app-links
- **Content Rating:** https://support.google.com/googleplay/android-developer/answer/9888179
- **Data Safety:** https://support.google.com/googleplay/android-developer/answer/10787469

---

## Quick Reference

**Package Name:** `com.quickdishco.app`  
**Min SDK:** 24 (Android 7.0)  
**Target SDK:** 35 (Android 15)  
**Privacy Policy:** `https://quickdish.co/privacy`  
**Terms of Service:** `https://quickdish.co/terms`  
**App Links Domain:** `quickdish.co`, `www.quickdish.co`

---

**Last Updated:** January 2025

