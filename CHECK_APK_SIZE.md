# How to Check APK/AAB Size

## Method 1: Android Studio (Easiest)

1. **Open Android Studio**
2. **Build → Build Bundle(s) / APK(s) → Build Bundle(s)**
   - This creates an AAB (Android App Bundle) file
3. **Or Build → Build Bundle(s) / APK(s) → Build APK(s)**
   - This creates an APK file
4. **Check the output:**
   - AAB: `android/app/build/outputs/bundle/release/app-release.aab`
   - APK: `android/app/build/outputs/apk/release/app-release.apk`
5. **Right-click the file → Properties** to see the size

**Target Size:** <150MB (Google Play requirement)

## Method 2: Command Line

### Build AAB (Recommended for Google Play)
```powershell
cd android
.\gradlew bundleRelease
```

### Build APK (For testing)
```powershell
cd android
.\gradlew assembleRelease
```

### Check File Size
```powershell
# For AAB
Get-Item android\app\build\outputs\bundle\release\app-release.aab | Select-Object Name, @{Name="Size (MB)";Expression={[math]::Round($_.Length/1MB, 2)}}

# For APK
Get-Item android\app\build\outputs\apk\release\app-release.apk | Select-Object Name, @{Name="Size (MB)";Expression={[math]::Round($_.Length/1MB, 2)}}
```

## Method 3: Analyze Bundle Size

Google Play Console will show you the download size for different devices after you upload the AAB. The AAB is optimized and split by device, so users only download what they need.

**Expected sizes:**
- **AAB (upload):** Usually 50-150MB
- **User download (APK):** Usually 20-80MB (varies by device)

## Reducing App Size

If your app is too large:

1. **Enable ProGuard/R8** (already enabled in build.gradle)
2. **Remove unused assets** from `public/` folder
3. **Optimize images** (compress PNGs, use WebP)
4. **Remove unused dependencies** from `package.json`
5. **Enable resource shrinking** (already enabled)
6. **Use Android App Bundle** (AAB) instead of APK

## Current Configuration

Your `build.gradle` already has:
- ✅ `minifyEnabled true` - Code minification
- ✅ `shrinkResources true` - Resource shrinking

These help reduce app size automatically.

