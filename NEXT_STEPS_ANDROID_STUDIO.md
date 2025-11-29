# Next Steps for Android App - Android Studio

## ✅ What's Done

- ✅ Keystore created with SHA-256 fingerprint
- ✅ `assetlinks.json` configured with fingerprint
- ✅ Account deletion implemented
- ✅ Permissions configured
- ✅ Deep linking configured
- ✅ Build optimization enabled

## 🔴 Critical - Do in Android Studio

### 1. Build Android App Bundle (AAB)

**This is required for Google Play submission!**

#### Steps:
1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle** (NOT APK - Google Play requires AAB)
3. Click **Next**
4. Select your keystore:
   - **Key store path:** `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`
   - **Password:** `QuickDish2025ReleaseKey!`
   - **Key alias:** `key0` (this is your actual alias!)
   - **Key password:** `QuickDish2025ReleaseKey!`
5. Click **Next**
6. Select **release** build variant
7. Click **Create**

#### Output Location:
The AAB file will be created at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

#### Check Size:
- Should be <150MB
- Right-click the file → Properties to check size

---

### 2. Test the App

#### Build and Install on Device:
1. Connect your Android device via USB
2. Enable **USB Debugging** on your device
3. In Android Studio: **Run → Run 'app'**
4. Test all features:
   - Login/signup
   - Recipe browsing
   - Voice search
   - Cooking mode
   - PDF export
   - Account deletion

#### Test Deep Linking:
1. Install the app on your device
2. Open browser on device
3. Navigate to: `https://quickdish.co/recipe/[any-recipe-id]`
4. App should open directly (after you deploy assetlinks.json)

---

### 3. Verify Build Configuration

Check these files are correct:

#### `android/app/build.gradle`:
- ✅ `applicationId "com.quickdishco.app"`
- ✅ `versionCode 1`
- ✅ `versionName "1.0"`
- ✅ `minifyEnabled true`
- ✅ `shrinkResources true`

#### `android/app/src/main/AndroidManifest.xml`:
- ✅ Package name: `com.quickdishco.app`
- ✅ Permissions declared
- ✅ Deep linking configured

---

## 🟡 Important - Before Google Play Submission

### 4. Prepare Store Listing Assets

You'll need these for Google Play Console:

- **App Icon:** 512x512 PNG (no transparency)
- **Feature Graphic:** 1024x500 PNG
- **Screenshots:** At least 2, max 8
  - Phone: 16:9 or 9:16 ratio
  - Min 320px, max 3840px
- **Short Description:** 50 characters max
- **Full Description:** Up to 4000 characters

### 5. Google Play Console Setup

**After building AAB**, you'll need to:

1. **Create Google Play Developer Account** (if not done)
   - One-time $25 fee
   - https://play.google.com/console

2. **Create App Listing:**
   - App name: QuickDish
   - Default language: English
   - App type: App
   - Free or Paid: Free

3. **Upload AAB:**
   - Go to **Production → Create new release**
   - Upload your `app-release.aab` file
   - Add release notes

4. **Complete Store Listing:**
   - Add screenshots
   - Add descriptions
   - Add app icon and graphics

5. **Complete Content Rating:**
   - Answer age rating questionnaire
   - Usually instant approval

6. **Add Privacy Policy & Terms:**
   - Privacy Policy URL: `https://quickdish.co/privacy`
   - Terms URL: `https://quickdish.co/terms`
   - (These need to be live on your website)

7. **Complete Data Safety:**
   - Declare data collection
   - Declare data sharing

---

## 📋 Quick Checklist

### In Android Studio (Do Now):
- [ ] Build Android App Bundle (AAB)
- [ ] Check AAB size (<150MB)
- [ ] Test app on Android device
- [ ] Test all major features
- [ ] Verify app works correctly

### Before Google Play Submission:
- [ ] Create Google Play Developer account ($25)
- [ ] Prepare store listing assets (screenshots, graphics)
- [ ] Deploy web app (for Privacy/Terms URLs and assetlinks.json)
- [ ] Verify Privacy Policy & Terms URLs are live
- [ ] Complete age rating questionnaire
- [ ] Upload AAB to Google Play Console
- [ ] Complete store listing
- [ ] Complete data safety section

---

## 🚀 Immediate Next Step

**Right now, build your AAB:**

1. **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Use keystore: `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`
4. Alias: `key0`
5. Password: `QuickDish2025ReleaseKey!`
6. Build **release** variant
7. Save the AAB file somewhere safe!

Once you have the AAB, you can upload it to Google Play Console when you're ready.

---

## 📝 Notes

- **Keystore Info to Remember:**
  - File: `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`
  - Alias: `key0`
  - Password: `QuickDish2025ReleaseKey!`
  - **SAVE THIS INFO** - you'll need it for every update!

- **Version Management:**
  - Current: `versionCode 1`, `versionName "1.0"`
  - For updates, increment both numbers

