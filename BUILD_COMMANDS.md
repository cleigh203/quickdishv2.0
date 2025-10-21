# 🔨 QuickDish - Build & Deploy Commands

## 🏗️ Development Build

### Build and Test on Device
```bash
# 1. Build the web app
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Open in Android Studio
npx cap open android

# Then: Click Run ▶️ button in Android Studio
```

### Quick Rebuild (After Code Changes)
```bash
npm run build && npx cap sync android
```

---

## 📦 Release Build (Play Store)

### Step 1: Create Release Keystore (FIRST TIME ONLY)
```bash
# Navigate to android/app
cd android/app

# Generate keystore (SAVE THIS FILE SAFELY!)
keytool -genkey -v -keystore quickdish-release.keystore -alias quickdish -keyalg RSA -keysize 2048 -validity 10000

# Follow prompts:
# - Enter password (REMEMBER THIS!)
# - Enter your name, organization, etc.
# - Confirm with 'yes'

# IMPORTANT: Back up this keystore file!
# Store password in safe place (password manager)
```

### Step 2: Configure Signing (FIRST TIME ONLY)

Create `android/keystore.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=quickdish
storeFile=quickdish-release.keystore
```

**⚠️ Add to .gitignore:**
```bash
echo "android/keystore.properties" >> .gitignore
echo "android/app/quickdish-release.keystore" >> .gitignore
```

### Step 3: Update build.gradle (FIRST TIME ONLY)

Add to `android/app/build.gradle` (before `android {`):

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Update `signingConfigs` inside `android {`:

```gradle
android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 4: Build Release AAB

```bash
# 1. Build web app for production
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Navigate to android folder
cd android

# 4. Build release AAB
./gradlew bundleRelease

# AAB will be at: android/app/build/outputs/bundle/release/app-release.aab
```

### Alternative: Build APK (For Testing)
```bash
cd android
./gradlew assembleRelease

# APK at: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🧪 Testing Builds

### Test Debug APK
```bash
cd android
./gradlew assembleDebug

# Install on device
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Test Release APK
```bash
cd android
./gradlew assembleRelease

# Install on device
adb install app/build/outputs/apk/release/app-release.apk
```

### Test Release AAB (Locally)
```bash
# Install bundletool
# Download from: https://github.com/google/bundletool/releases

# Generate APKs from AAB
java -jar bundletool.jar build-apks --bundle=app/build/outputs/bundle/release/app-release.aab --output=quickdish.apks --mode=universal

# Install universal APK
unzip quickdish.apks
adb install universal.apk
```

---

## 🔄 Version Management

### Update Version for New Release

**1. Update package.json:**
```json
"version": "1.0.1"  // Increment
```

**2. Update android/app/build.gradle:**
```gradle
versionCode 2        // Always increment by 1
versionName "1.0.1"  // Match package.json
```

### Version Numbering
- **versionCode:** Integer, increment for each Play Store upload (1, 2, 3, 4...)
- **versionName:** String, user-visible (1.0, 1.1, 2.0, etc.)

---

## 📱 Device Commands

### Check Connected Devices
```bash
adb devices
```

### View Logs (Debug)
```bash
adb logcat | grep -i "chromium\|capacitor\|quickdish"
```

### Clear App Data
```bash
adb shell pm clear com.quickdishco.app
```

### Uninstall App
```bash
adb uninstall com.quickdishco.app
```

---

## 🚀 Play Store Deployment

### Internal Testing Track
```bash
# 1. Build release AAB (see above)
# 2. Upload to Play Console → Internal Testing
# 3. Add test users
# 4. Share test link
```

### Production Release
```bash
# 1. Build release AAB (see above)
# 2. Upload to Play Console → Production
# 3. Fill out store listing
# 4. Submit for review
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean build
cd android
./gradlew clean

# Rebuild
./gradlew bundleRelease
```

### Gradle Issues
```bash
# Update Gradle wrapper
cd android
./gradlew wrapper --gradle-version 8.0
```

### Capacitor Sync Issues
```bash
# Remove and re-add Android
npx cap remove android
npx cap add android
npx cap sync android
```

### Cache Issues
```bash
# Clear all caches
rm -rf node_modules
rm -rf android/app/build
rm -rf dist
npm install
npm run build
npx cap sync android
```

---

## 📋 Pre-Submission Checklist

Before building final release AAB:

- [ ] Version code incremented
- [ ] Version name updated
- [ ] All code changes committed
- [ ] `npm run build` succeeds
- [ ] No console errors
- [ ] Tested on real device
- [ ] Keystore is backed up safely
- [ ] Privacy policy is live

---

## 🔐 Security Reminders

**NEVER commit to git:**
- ❌ `quickdish-release.keystore`
- ❌ `keystore.properties`
- ❌ Any passwords or API keys

**ALWAYS backup:**
- ✅ Release keystore file
- ✅ Keystore passwords
- ✅ Key alias name

**If you lose the keystore:**
- 😱 You cannot update your app on Play Store
- 😱 You'll have to publish a new app with new package ID
- 😱 You'll lose all reviews and downloads

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Dev build | `npm run build && npx cap sync android` |
| Open Android Studio | `npx cap open android` |
| Release AAB | `cd android && ./gradlew bundleRelease` |
| Release APK | `cd android && ./gradlew assembleRelease` |
| View logs | `adb logcat` |
| Install APK | `adb install app-release.apk` |

---

**Happy building! 🎉**

