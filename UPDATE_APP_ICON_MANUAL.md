# How to Update Android App Icon - Manual Method

Since Android Asset Studio is no longer maintained, here are working alternatives:

---

## Method 1: Use AppIcon.co (Online Tool - Recommended)

### Step 1: Prepare Your Logo
1. Create a **1024x1024px** PNG of your QuickDish logo
2. Transparent background preferred
3. Logo should be centered

### Step 2: Generate Icons
1. Go to: **https://www.appicon.co/**
2. Upload your 1024x1024 icon
3. Select **Android** platform
4. Choose background color: `#FF6B35`
5. Click **Generate**
6. Download the ZIP file

### Step 3: Extract and Replace
1. Extract the ZIP file
2. Find the `android` folder
3. Copy the `mipmap-*` folders from `android/app/src/main/res/`
4. Navigate to: `android/app/src/main/res/` in your project
5. **Delete** existing `mipmap-*` folders
6. **Paste** the new folders

---

## Method 2: Use Icon Kitchen (Google's New Tool)

### Step 1: Go to Icon Kitchen
1. Visit: **https://icon.kitchen/**
2. This is Google's replacement for Asset Studio

### Step 2: Generate Icons
1. Upload your 1024x1024 icon
2. Set background color to `#FF6B35`
3. Download the generated icons
4. Follow the same extraction steps as Method 1

---

## Method 3: Manual Creation (If You Have Image Editing Software)

### Step 1: Create Your Base Icon
1. Create a **1024x1024px** image with your QuickDish logo
2. Background color: `#FF6B35`
3. Save as PNG

### Step 2: Resize for Each Density
You need to create icons in these sizes:

| Folder | Foreground Size | Launcher Size | Round Size |
|--------|----------------|---------------|------------|
| `mipmap-mdpi` | 72x72 | 48x48 | 48x48 |
| `mipmap-hdpi` | 108x108 | 72x72 | 72x72 |
| `mipmap-xhdpi` | 144x144 | 96x96 | 96x96 |
| `mipmap-xxhdpi` | 192x192 | 144x144 | 144x144 |
| `mipmap-xxxhdpi` | 432x432 | 192x192 | 192x192 |

### Step 3: Use Online Resizer
1. Go to: **https://www.iloveimg.com/resize-image**
2. Upload your 1024x1024 icon
3. Resize to each required size
4. Download and save with correct names

### Step 4: Replace Files
For each `mipmap-*` folder in `android/app/src/main/res/`:
- Replace `ic_launcher.png` (launcher size)
- Replace `ic_launcher_foreground.png` (foreground size)
- Replace `ic_launcher_round.png` (round size)

---

## Method 4: Quick Background Color Change (Temporary Fix)

If you just want to change the background color for now:

### Edit Background Color Files:

**File 1:** `android/app/src/main/res/values/ic_launcher_background.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FF6B35</color>
</resources>
```

**File 2:** `android/app/src/main/res/drawable/ic_launcher_background.xml`
Change line 8:
```xml
<path
    android:fillColor="#FF6B35"
    android:pathData="M0,0h108v108h-108z" />
```

This will change the background color but keep the default icon shape.

---

## Method 5: Use Figma or Photoshop Template

### Step 1: Download Android Icon Template
1. Search for "Android Adaptive Icon Template" online
2. Download a template (usually 1024x1024 with safe zones marked)

### Step 2: Design Your Icon
1. Open template in Figma/Photoshop
2. Add your QuickDish logo in the safe zone (center 66%)
3. Set background to `#FF6B35`
4. Export as PNG

### Step 3: Use AppIcon.co or Icon Kitchen
Follow Method 1 or 2 above to generate all sizes.

---

## Recommended: Method 1 (AppIcon.co)

**Steps:**
1. Go to **https://www.appicon.co/**
2. Upload your 1024x1024 QuickDish logo
3. Select **Android**
4. Background: `#FF6B35`
5. Download ZIP
6. Extract and replace `mipmap-*` folders
7. Rebuild app

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
- **Uninstall** old app from device
- **Install** new build
- Check app icon in app drawer

---

## Troubleshooting

### Icon Not Updating?
1. Completely uninstall the app
2. Clean build: `.\gradlew clean`
3. Rebuild and reinstall

### Icon Looks Wrong?
- Make sure foreground icon has transparent background
- Keep logo in center 66% (safe zone)
- Use PNG format, not JPEG

### Still See Old Icon?
- Clear Android Studio cache: **File** → **Invalidate Caches**
- Delete `android/.gradle` folder
- Rebuild from scratch

