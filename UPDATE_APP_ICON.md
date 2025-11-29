# How to Update the Android App Icon

## Current Status
The app is currently using the default Capacitor icon. You need to replace it with the QuickDish logo.

## Icon Requirements

### For Android Adaptive Icons (Android 8.0+):
You need **TWO** images:
1. **Foreground** - Your QuickDish logo (transparent background, centered)
2. **Background** - Solid color or pattern (will show behind the logo)

### Required Sizes:
- **Foreground**: 1024x1024px (will be scaled down)
- **Background**: 1024x1024px (will be scaled down)

### Icon Locations:
The icon files are in:
```
android/app/src/main/res/
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   ├── ic_launcher_foreground.png (108x108)
│   └── ic_launcher_round.png (72x72)
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   ├── ic_launcher_foreground.png (72x72)
│   └── ic_launcher_round.png (48x48)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   ├── ic_launcher_foreground.png (144x144)
│   └── ic_launcher_round.png (96x96)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   ├── ic_launcher_foreground.png (192x192)
│   └── ic_launcher_round.png (144x144)
└── mipmap-xxxhdpi/
    ├── ic_launcher.png (192x192)
    ├── ic_launcher_foreground.png (432x432)
    └── ic_launcher_round.png (192x192)
```

## Method 1: Use Android Asset Studio (Easiest)

### Step 1: Prepare Your Logo
1. Create a **1024x1024px** PNG of your QuickDish logo
2. Make sure it has a **transparent background**
3. The logo should be centered and take up about **80% of the canvas** (leave safe zone)

### Step 2: Use Android Asset Studio
1. Go to: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload your **foreground image** (QuickDish logo)
3. Choose a **background color** (e.g., orange #FF6B35 to match your brand)
4. Click **Generate**
5. Download the ZIP file

### Step 3: Extract and Replace
1. Extract the ZIP file
2. Copy the `res` folder contents
3. Replace the files in `android/app/src/main/res/`
4. Make sure to replace ALL mipmap folders

---

## Method 2: Manual Replacement (If You Have All Sizes)

### Step 1: Create Icon Sizes
You need to create icons in these sizes:

| Density | Foreground Size | Launcher Size | Round Size |
|---------|----------------|---------------|------------|
| mdpi   | 72x72         | 48x48         | 48x48      |
| hdpi   | 108x108       | 72x72         | 72x72      |
| xhdpi  | 144x144       | 96x96         | 96x96      |
| xxhdpi | 192x192       | 144x144       | 144x144    |
| xxxhdpi| 432x432       | 192x192       | 192x192    |

### Step 2: Use Image Editing Tool
Use Photoshop, GIMP, or online tools like:
- https://www.iloveimg.com/resize-image
- https://www.resizepixel.com/

### Step 3: Replace Files
Replace the PNG files in each mipmap folder with your QuickDish logo.

---

## Method 3: Use Android Asset Studio (RECOMMENDED - This Actually Works!)

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

### Step 4: Rebuild
```powershell
cd android
.\gradlew clean
```

Then rebuild in Android Studio.

**Note:** The `@capacitor/assets` tool doesn't support `--iconPath` parameter. Use Android Asset Studio instead - it's easier and more reliable!

---

## Method 4: Quick Fix - Update Background Color Only

If you just want to change the background color for now:

### Edit `android/app/src/main/res/values/ic_launcher_background.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FF6B35</color>
</resources>
```

### Edit `android/app/src/main/res/drawable/ic_launcher_background.xml`:
Change the fillColor to your brand color:
```xml
<path
    android:fillColor="#FF6B35"
    android:pathData="M0,0h108v108h-108z" />
```

---

## After Updating Icons

### 1. Clean Build
```powershell
cd android
.\gradlew clean
```

### 2. Rebuild App
In Android Studio:
- **Build** → **Clean Project**
- **Build** → **Rebuild Project**
- **Run** the app

### 3. Verify
- Check the app icon on your device
- The icon should appear in the app drawer
- The icon should appear when installing the APK/AAB

---

## Icon Design Tips

1. **Safe Zone**: Keep important content in the center 66% of the icon (Android will crop edges)
2. **No Text**: Avoid small text - it won't be readable at small sizes
3. **High Contrast**: Ensure your logo stands out against the background
4. **Simple Design**: Complex designs don't work well at small sizes
5. **Transparent Background**: For foreground, use PNG with transparency

---

## QuickDish Brand Colors

- **Primary Orange**: `#FF6B35`
- **Dark Orange**: `#FF4500`
- **Background**: White or light gradient

---

## Troubleshooting

### Icon Not Updating?
1. **Uninstall** the app completely
2. **Clean** the build: `.\gradlew clean`
3. **Rebuild** and reinstall

### Icon Looks Blurry?
- Make sure you're using the correct sizes for each density
- Use PNG format (not JPEG)
- Don't upscale small images

### Icon Not Showing?
- Check that files are in the correct `mipmap-*` folders
- Verify filenames match exactly: `ic_launcher.png`, `ic_launcher_foreground.png`, `ic_launcher_round.png`
- Rebuild the project

---

## Recommended: Use Method 3 (Capacitor Assets)

This is the easiest and most reliable method. It handles all the sizing automatically.

```bash
# Install globally
npm install -g @capacitor/assets

# Generate icons (replace with your actual icon path)
npx @capacitor/assets generate \
  --iconPath ./assets/quickdish-icon.png \
  --iconBackgroundColor "#FF6B35" \
  --iconBackgroundColorDark "#FF4500"
```

