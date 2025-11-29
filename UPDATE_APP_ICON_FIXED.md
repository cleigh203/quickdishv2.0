# How to Update the Android App Icon - CORRECTED

## ❌ The Previous Method Doesn't Work
The `@capacitor/assets` tool doesn't support `--iconPath` parameter. Use one of these methods instead:

---

## Method 1: Use Android Asset Studio (Easiest & Recommended)

### Step 1: Prepare Your Logo
1. Create a **1024x1024px** PNG of your QuickDish logo
2. Make sure it has a **transparent background**
3. The logo should be centered and take up about **80% of the canvas**

### Step 2: Use Android Asset Studio
1. Go to: **https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html**
2. Upload your **foreground image** (QuickDish logo)
3. Choose a **background color**: `#FF6B35` (your brand orange)
4. Click **Download** (ZIP file)

### Step 3: Extract and Replace
1. Extract the downloaded ZIP file
2. Open the `res` folder inside
3. Copy ALL the `mipmap-*` folders
4. Navigate to: `android/app/src/main/res/`
5. **Delete** the existing `mipmap-*` folders
6. **Paste** the new folders
7. Also copy the `drawable` and `values` folders if they exist

### Step 4: Rebuild
```powershell
cd android
.\gradlew clean
```

Then rebuild in Android Studio.

---

## Method 2: Manual Replacement (If You Have Icon Files)

### Step 1: Create Icon Sizes
You need icons in these sizes for each density:

| Density | Foreground | Launcher | Round |
|---------|-----------|----------|-------|
| mdpi   | 72x72     | 48x48    | 48x48 |
| hdpi   | 108x108   | 72x72    | 72x72 |
| xhdpi  | 144x144   | 96x96    | 96x96 |
| xxhdpi | 192x192   | 144x144  | 144x144 |
| xxxhdpi| 432x432   | 192x192  | 192x192 |

### Step 2: Replace Files
Replace these files in each `mipmap-*` folder:
- `ic_launcher.png`
- `ic_launcher_foreground.png`
- `ic_launcher_round.png`

Location: `android/app/src/main/res/mipmap-*/`

---

## Method 3: Use Capacitor Config (If Supported)

### Step 1: Add Icon Path to Config
Edit `capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quickdishco.app',
  appName: 'QuickDish',
  webDir: 'dist',
  android: {
    icon: 'assets/icon.png', // Path to your 1024x1024 icon
  },
  plugins: {
    // ... your plugins
  }
};

export default config;
```

### Step 2: Run Capacitor Sync
```powershell
npx cap sync android
```

**Note:** This may or may not work depending on your Capacitor version. Method 1 is more reliable.

---

## Method 4: Quick Background Color Change Only

If you just want to change the background color for now:

### Edit `android/app/src/main/res/values/ic_launcher_background.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FF6B35</color>
</resources>
```

### Edit `android/app/src/main/res/drawable/ic_launcher_background.xml`:
Change line 8:
```xml
<path
    android:fillColor="#FF6B35"
    android:pathData="M0,0h108v108h-108z" />
```

---

## Recommended: Method 1 (Android Asset Studio)

This is the **easiest and most reliable** method:

1. **Go to:** https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. **Upload** your 1024x1024 QuickDish logo (transparent background)
3. **Set background color** to `#FF6B35`
4. **Download** the ZIP
5. **Extract** and replace the `mipmap-*` folders
6. **Rebuild** the app

---

## After Updating Icons

### 1. Clean Build
```powershell
cd android
.\gradlew clean
```

### 2. Rebuild in Android Studio
- **Build** → **Clean Project**
- **Build** → **Rebuild Project**
- **Run** the app

### 3. Verify
- Uninstall the old app from your device
- Install the new build
- Check the app icon in the app drawer

---

## Troubleshooting

### Icon Not Updating?
1. **Completely uninstall** the app from your device
2. **Clean build**: `.\gradlew clean`
3. **Rebuild** and reinstall

### Icon Looks Blurry?
- Make sure you're using the correct sizes for each density
- Use PNG format (not JPEG)
- Don't upscale small images

### Still See Old Icon?
- Clear Android Studio cache: **File** → **Invalidate Caches** → **Invalidate and Restart**
- Delete `android/.gradle` folder
- Rebuild from scratch

