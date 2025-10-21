# 📱 QuickDish - Android Play Store Submission Checklist

## ✅ Current App Configuration

**App Details:**
- **App ID:** `com.quickdishco.app`
- **App Name:** QuickDish
- **Version Code:** 1
- **Version Name:** 1.0
- **Target SDK:** Check in android/variables.gradle

---

## 🔧 1. BUILD & CONFIGURATION

### ✅ App Metadata
- [ ] App name is correct: "QuickDish"
- [ ] Package ID is unique: `com.quickdishco.app`
- [ ] Version code: 1 (increment for each release)
- [ ] Version name: 1.0

### ✅ Permissions (Currently Set)
- [x] `INTERNET` - For API calls ✅
- [x] `RECORD_AUDIO` - For voice commands ✅
- [x] `MODIFY_AUDIO_SETTINGS` - For TTS/voice ✅

### ⚠️ Check These
- [ ] All permissions are actually used in the app
- [ ] Privacy policy explains why each permission is needed
- [ ] No unnecessary permissions

---

## 🎨 2. BRANDING & ASSETS

### ✅ App Icons (Already configured)
- [x] hdpi (72x72)
- [x] mdpi (48x48)
- [x] xhdpi (96x96)
- [x] xxhdpi (144x144)
- [x] xxxhdpi (192x192)
- [x] Adaptive icon (foreground + background)
- [x] Round icon

### ✅ Splash Screens (Already configured)
- [x] Portrait splash (all densities)
- [x] Landscape splash (all densities)

### 📸 Play Store Assets (REQUIRED)
- [ ] **App Icon** (512x512 PNG)
- [ ] **Feature Graphic** (1024x500 PNG)
- [ ] **Screenshots** (at least 2, max 8):
  - [ ] Phone screenshots (min 320px, max 3840px)
  - [ ] Tablet screenshots (optional but recommended)
- [ ] **Promo Video** (optional - YouTube link)

---

## 🧪 3. FUNCTIONALITY TESTING

### Core Features
- [ ] App launches successfully
- [ ] No crashes on launch
- [ ] All navigation works (tabs, back button, drawer)
- [ ] Recipe browsing works
- [ ] Recipe search/filter works
- [ ] Recipe details display correctly
- [ ] Cooking mode launches and works
- [ ] Timers work correctly
- [ ] Voice control (if keeping it):
  - [ ] Permissions requested properly
  - [ ] Voice commands work
  - [ ] TTS works
  - [ ] Can be turned on/off

### Data & Network
- [ ] Supabase connection works
- [ ] Recipes load from database
- [ ] Images load correctly
- [ ] Handles no internet gracefully
- [ ] Loading states work
- [ ] Error states work

### Android-Specific
- [ ] **Back button** works correctly everywhere
- [ ] **Status bar** color/theme correct
- [ ] **Navigation bar** doesn't overlap content
- [ ] **Keyboard** shows/hides properly
- [ ] **Deep links** work (if applicable)
- [ ] **Share functionality** works (if applicable)
- [ ] **App backgrounding/resuming** works
- [ ] **Screen rotation** works (or is locked)

---

## 📱 4. DEVICE TESTING

### Test on Multiple Devices
- [ ] **Android 8.0** (Oreo - minSdk) - if possible
- [ ] **Android 10** (Q)
- [ ] **Android 12** (S)
- [ ] **Android 13** (T)
- [ ] **Android 14** (U) - current
- [ ] **Different screen sizes:**
  - [ ] Small phone (~5")
  - [ ] Large phone (~6.5")
  - [ ] Tablet (if supporting)

### Test Different Manufacturers
- [ ] Samsung
- [ ] Google Pixel
- [ ] OnePlus/Xiaomi/Other

---

## ⚡ 5. PERFORMANCE & OPTIMIZATION

### Performance Checks
- [ ] App loads in < 3 seconds
- [ ] Smooth scrolling (60fps)
- [ ] Images optimized (webp format when possible)
- [ ] No memory leaks (check Android Profiler)
- [ ] App size < 50MB (ideally < 20MB)

### Battery & Resources
- [ ] No excessive battery drain
- [ ] Stops services when app is closed
- [ ] Cleans up timers/intervals on unmount

---

## 📄 6. LEGAL & COMPLIANCE

### Required Documents
- [ ] **Privacy Policy** (URL required):
  - [ ] Explains data collection
  - [ ] Explains permissions usage
  - [ ] GDPR compliant (if EU users)
  - [ ] Hosted online (accessible URL)

- [ ] **Terms of Service** (recommended)
- [ ] **Content Rating Questionnaire** completed
- [ ] **Target Audience** defined (age group)

### Data Safety Section
- [ ] Declare all data collected
- [ ] Explain how data is used
- [ ] State if data is shared with third parties
- [ ] Encryption status (in transit/at rest)

---

## 🏗️ 7. BUILD PREPARATION

### Debug Build Test
```bash
cd android
./gradlew assembleDebug
```
- [ ] Debug APK builds successfully
- [ ] Test debug APK on real device

### Release Build
```bash
cd android
./gradlew assembleRelease
```
- [ ] Configure signing (keystore):
  - [ ] Create release keystore
  - [ ] Store keystore safely (NEVER lose this!)
  - [ ] Update android/app/build.gradle with signing config
- [ ] Release APK builds successfully
- [ ] Test release APK on real device

### App Bundle (Recommended for Play Store)
```bash
cd android
./gradlew bundleRelease
```
- [ ] AAB file generates successfully
- [ ] AAB is < 150MB

---

## 📝 8. PLAY STORE LISTING

### Store Listing Content
- [ ] **App Title** (max 30 chars): "QuickDish - Recipe App" or similar
- [ ] **Short Description** (max 80 chars)
- [ ] **Full Description** (max 4000 chars):
  - [ ] What the app does
  - [ ] Key features
  - [ ] Benefits
  - [ ] No prohibited content
- [ ] **Category**: Food & Drink
- [ ] **Tags/Keywords** for ASO (App Store Optimization)
- [ ] **Contact Email**
- [ ] **Website** (optional)

### Localization (Optional but Recommended)
- [ ] English (default)
- [ ] Spanish (if applicable)
- [ ] Other languages

---

## 🐛 9. QUALITY CHECKLIST

### No Crashes
- [ ] App doesn't crash anywhere
- [ ] Handles errors gracefully
- [ ] Shows user-friendly error messages

### UI/UX Polish
- [ ] All text is readable
- [ ] Buttons are tappable (min 48dp)
- [ ] No overlapping elements
- [ ] Consistent colors/theme
- [ ] Loading states everywhere
- [ ] Empty states (no recipes, no connection)

### Accessibility
- [ ] Text is readable (contrast ratio)
- [ ] Buttons have proper labels
- [ ] Form inputs have labels
- [ ] Works with TalkBack (screen reader)

---

## 🚀 10. FINAL CHECKS BEFORE SUBMISSION

### Pre-Submission
- [ ] Increment version code
- [ ] Update version name if needed
- [ ] Test final build on 3+ devices
- [ ] All screenshots taken
- [ ] Privacy policy is live
- [ ] Play Store listing written

### Submission Day
- [ ] Create Developer Account ($25 one-time fee)
- [ ] Upload AAB file
- [ ] Fill out all Play Store fields
- [ ] Submit for review
- [ ] Monitor for review feedback

---

## 📊 POST-SUBMISSION

### After Approval
- [ ] Test production build from Play Store
- [ ] Set up crash reporting (Firebase Crashlytics?)
- [ ] Set up analytics (Firebase Analytics?)
- [ ] Monitor reviews and ratings
- [ ] Plan for updates

---

## 🔍 CURRENT ISSUES TO FIX

Based on our recent work:

1. **Voice Control:**
   - ⚠️ Currently not working reliably on Android
   - **Decision needed:** Remove for v1.0 or keep but warn it's experimental?

2. **Status Bar:**
   - [ ] Check if status bar color matches app theme
   - [ ] Verify on light/dark mode

3. **Safe Areas:**
   - [ ] Check cooking mode top/bottom padding on different devices
   - [ ] Verify no content is hidden behind notches/nav bars

4. **Version in package.json:**
   - ⚠️ Currently "0.0.0" - should update to "1.0.0"

---

## 🛠️ QUICK FIXES NEEDED

### Update package.json version:
```json
"version": "1.0.0"
```

### Update android/app/build.gradle if needed:
```gradle
versionCode 1
versionName "1.0.0"
```

### Create keystore for release signing:
```bash
keytool -genkey -v -keystore quickdish-release.keystore -alias quickdish -keyalg RSA -keysize 2048 -validity 10000
```

---

## 📞 SUPPORT

If you encounter issues:
1. Check Android Logcat for errors
2. Test on different Android versions
3. Review Google Play Console feedback
4. Common rejection reasons:
   - Privacy policy missing/incomplete
   - Crashes on older Android versions
   - Missing screenshots
   - Misleading app description
   - Permissions not explained

---

## ✅ READY TO SUBMIT WHEN:

- [ ] All checkboxes in sections 1-7 are checked
- [ ] Tested on 3+ real Android devices
- [ ] Privacy policy is live and linked
- [ ] Play Store listing is complete
- [ ] Release AAB builds successfully
- [ ] No crashes or critical bugs

**Estimated time to complete:** 2-4 hours (first submission)

---

Good luck with your submission! 🚀

