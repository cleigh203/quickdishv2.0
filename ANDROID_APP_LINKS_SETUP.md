# Android App Links Setup Guide

## Overview
Android App Links allow your app to open directly when users click links to `https://quickdish.co` or `https://www.quickdish.co` without showing a disambiguation dialog.

## Current Status
✅ Deep linking configured in `AndroidManifest.xml`  
✅ `assetlinks.json` template created at `public/.well-known/assetlinks.json`  
⚠️ **Action Required:** Add SHA-256 fingerprint and deploy to production

## Steps to Complete

### 1. Get Your App's SHA-256 Fingerprint

#### Option A: From Android Studio (Recommended)
1. Open your project in Android Studio
2. Go to **Build** → **Generate Signed Bundle / APK**
3. Select your keystore file
4. Enter your keystore password
5. The SHA-256 fingerprint will be displayed in the signature information

#### Option B: Using Keytool (Command Line)
```bash
# For debug keystore (testing)
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# For release keystore (production)
keytool -list -v -keystore /path/to/your/keystore.jks -alias your-key-alias
```

Look for the line that says:
```
SHA256: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
```

### 2. Update assetlinks.json

1. Open `public/.well-known/assetlinks.json`
2. Replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your actual SHA-256 fingerprint
3. Remove colons from the fingerprint (e.g., `A1:B2:C3` becomes `A1B2C3`)

**Example:**
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.quickdishco.app",
      "sha256_cert_fingerprints": [
        "A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2"
      ]
    }
  }
]
```

### 3. Deploy to Production

The `assetlinks.json` file must be accessible at:
- `https://quickdish.co/.well-known/assetlinks.json`
- `https://www.quickdish.co/.well-known/assetlinks.json`

**For Vercel:**
1. The file is already in `public/.well-known/assetlinks.json`
2. Deploy to production
3. Verify it's accessible: `curl https://quickdish.co/.well-known/assetlinks.json`

**Important:**
- The file must be served with `Content-Type: application/json`
- The file must be accessible over HTTPS
- Both `quickdish.co` and `www.quickdish.co` must serve the same file

### 4. Verify App Links

#### Using ADB (Android Debug Bridge)
```bash
adb shell pm verify-app-links --re-verify com.quickdishco.app
```

#### Manual Testing
1. Install your app on an Android device
2. Open a browser and navigate to: `https://quickdish.co/recipe/123`
3. The app should open directly (no disambiguation dialog)
4. If you see a dialog asking which app to use, App Links verification failed

### 5. Troubleshooting

**If App Links don't work:**
1. Verify `assetlinks.json` is accessible and returns 200 OK
2. Check that the SHA-256 fingerprint matches exactly (no colons, uppercase)
3. Ensure the package name matches: `com.quickdishco.app`
4. Wait a few minutes after deployment (Android caches verification)
5. Clear app data: Settings → Apps → QuickDish → Storage → Clear Data
6. Reinstall the app

**Common Issues:**
- ❌ Fingerprint has colons → Remove all colons
- ❌ Wrong package name → Must match `AndroidManifest.xml`
- ❌ File not accessible → Check HTTPS and Content-Type header
- ❌ Multiple fingerprints → Add all signing keys (debug + release)

## Notes

- **Debug vs Release:** You may need separate fingerprints for debug and release builds
- **Multiple Signing Keys:** If you use different keys for different build variants, add all fingerprints to the array
- **Verification Time:** Android may take a few minutes to verify App Links after deployment

## Current Configuration

- **Package Name:** `com.quickdishco.app`
- **Domains:** `quickdish.co`, `www.quickdishco.app`
- **Paths:** `/recipe/*` and general `/*`
- **File Location:** `public/.well-known/assetlinks.json`
