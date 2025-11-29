# Google Play Store Submission - Quick Reference

## ✅ What's Been Completed

### Code & Configuration
- ✅ API keys secured (environment variables)
- ✅ Account deletion removes ALL user data (7 tables)
- ✅ Android permissions properly declared
- ✅ Deep linking configured in AndroidManifest.xml
- ✅ Crash reporting (Sentry) configured
- ✅ Privacy Policy page exists at `/privacy`
- ✅ Terms of Service page exists at `/terms`
- ✅ `assetlinks.json` template created
- ✅ Build optimization enabled (minify, shrink resources)

### Documentation Created
- ✅ `PRE_SUBMISSION_CHECKLIST.md` - Complete checklist
- ✅ `ANDROID_APP_LINKS_SETUP.md` - Deep linking setup
- ✅ `GET_SHA256_FINGERPRINT.md` - How to get fingerprint
- ✅ `CHECK_APK_SIZE.md` - How to check app size
- ✅ `TESTING_GUIDE.md` - Comprehensive testing guide
- ✅ `ACCOUNT_DELETION_VERIFICATION.md` - Deletion testing
- ✅ `SENTRY_SETUP.md` - Production error tracking

---

## 🔴 CRITICAL - Must Do Before Submission

### 1. Get SHA-256 Fingerprint & Deploy assetlinks.json
**File:** `public/.well-known/assetlinks.json`  
**Guide:** `GET_SHA256_FINGERPRINT.md` and `ANDROID_APP_LINKS_SETUP.md`

**Steps:**
1. Open Android Studio → Build → Generate Signed Bundle/APK
2. Copy SHA-256 fingerprint (remove colons, uppercase)
3. Update `assetlinks.json` with fingerprint
4. Deploy to production
5. Verify: `https://quickdish.co/.well-known/assetlinks.json` returns 200 OK

---

### 2. Deploy to Production & Verify URLs
**Guide:** `PRE_SUBMISSION_CHECKLIST.md` section 1

**Steps:**
1. Deploy app to Vercel (production)
2. Verify URLs accessible:
   - `https://quickdish.co/privacy`
   - `https://quickdish.co/terms`
3. Add URLs to Google Play Console:
   - Store presence → App content → Privacy Policy
   - Store presence → App content → Terms of Service

---

### 3. Add Sentry DSN to Vercel
**Guide:** `SENTRY_SETUP.md`

**Steps:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_SENTRY_DSN` = `https://67d8cdc812b1ea53a5b2111c990aca54@o4510382794473472.ingest.us.sentry.io/4510382816821248`
3. Redeploy to production
4. Test error reporting

---

### 4. Complete Google Play Console Setup
**Guide:** `PRE_SUBMISSION_CHECKLIST.md` section 4

**Required:**
- [ ] App name, description, short description
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (at least 2, max 8)
- [ ] Age rating questionnaire
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Data safety section

---

### 5. Build & Upload App Bundle
**Guide:** `CHECK_APK_SIZE.md`

**Steps:**
1. Android Studio → Build → Generate Signed Bundle / APK
2. Select **Android App Bundle (AAB)**
3. Use your release keystore
4. Check size (<150MB)
5. Upload to Google Play Console → Production → Create new release

---

## 🟡 IMPORTANT - Should Complete

### 6. Testing
**Guide:** `TESTING_GUIDE.md`

**Minimum Testing:**
- [ ] Account deletion (verify all data removed)
- [ ] Deep linking (click recipe link in browser)
- [ ] Voice search (all locations)
- [ ] PDF export
- [ ] Test on Android 7.0 (minimum version)
- [ ] Test on Android 13/14 (latest)

---

### 7. Content Rights Verification
- [ ] Verify you have rights to all recipe content
- [ ] Verify you have rights to all images
- [ ] Document any third-party content sources

---

## 📋 Submission Day Checklist

Before clicking "Submit for review":

- [ ] SHA-256 fingerprint added to assetlinks.json
- [ ] assetlinks.json deployed and accessible
- [ ] Privacy Policy & Terms URLs verified online
- [ ] URLs added to Google Play Console
- [ ] Sentry DSN added to Vercel
- [ ] App Bundle (AAB) built and uploaded
- [ ] Store listing complete (screenshots, graphics, descriptions)
- [ ] Age rating questionnaire completed
- [ ] Data safety section completed
- [ ] Tested on minimum Android version (7.0)
- [ ] Account deletion tested and verified
- [ ] No critical bugs found

---

## 📁 File Locations

### Configuration Files
- `android/app/src/main/AndroidManifest.xml` - Permissions, deep linking
- `android/app/build.gradle` - Build configuration
- `public/.well-known/assetlinks.json` - App Links verification
- `src/main.tsx` - Sentry configuration

### Documentation
- `PRE_SUBMISSION_CHECKLIST.md` - Complete checklist
- `GOOGLE_PLAY_AUDIT.md` - Full audit report
- `ANDROID_APP_LINKS_SETUP.md` - Deep linking guide
- `GET_SHA256_FINGERPRINT.md` - Fingerprint guide
- `CHECK_APK_SIZE.md` - Size checking guide
- `TESTING_GUIDE.md` - Testing procedures
- `ACCOUNT_DELETION_VERIFICATION.md` - Deletion testing
- `SENTRY_SETUP.md` - Error tracking setup

---

## 🚀 Quick Start Commands

### Build App Bundle
```powershell
cd android
.\gradlew bundleRelease
```

### Check Bundle Size
```powershell
Get-Item android\app\build\outputs\bundle\release\app-release.aab | Select-Object Name, @{Name="Size (MB)";Expression={[math]::Round($_.Length/1MB, 2)}}
```

### Get SHA-256 Fingerprint
```powershell
# Debug keystore
keytool -list -v -keystore $env:USERPROFILE\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android

# Release keystore (replace path and alias)
keytool -list -v -keystore "C:\path\to\keystore.jks" -alias your-alias
```

---

## 📞 Support

- **Google Play Console Help:** https://support.google.com/googleplay/android-developer
- **Android App Links:** https://developer.android.com/training/app-links
- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/

---

## Key Information

**Package Name:** `com.quickdishco.app`  
**Min SDK:** 24 (Android 7.0)  
**Target SDK:** 35 (Android 15)  
**Version Code:** 1  
**Version Name:** 1.0  
**Privacy Policy:** `https://quickdish.co/privacy`  
**Terms of Service:** `https://quickdish.co/terms`  
**App Links Domain:** `quickdish.co`, `www.quickdish.co`

---

**Last Updated:** January 2025  
**Status:** Ready for final steps before submission

