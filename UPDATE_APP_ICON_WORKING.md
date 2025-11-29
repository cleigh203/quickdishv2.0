# How to Update Android App Icon - Working Methods

## Method 1: Use cordova-res (Recommended - Works with Capacitor)

### Step 1: Install cordova-res
```powershell
npm install -g cordova-res
```

### Step 2: Prepare Your Icon
1. Create a **1024x1024px** PNG of your QuickDish logo
2. Save it as `icon.png` in your project root
3. Or save it in an `assets` folder

### Step 3: Generate Icons
```powershell
cd c:\Users\Christin\Documents\GitHub\quickdish
cordova-res android --skip-config --copy
```

This will automatically:
- Generate all required icon sizes
- Copy them to the correct Android directories
- Handle all the mipmap folders

### Step 4: Rebuild
```powershell
cd android
.\gradlew clean
```

Then rebuild in Android Studio.

---

## Method 2: Use AppIcon.co (Online Tool)

### Step 1: Go to AppIcon.co
1. Visit: **https://www.appicon.co/**
2. Click **Get Started**

### Step 2: Upload and Generate
1. Upload your 1024x1024 QuickDish logo
2. Select **Android** platform
3. Set background color: `#FF6B35`
4. Click **Generate**
5. Download the ZIP file

### Step 3: Extract and Replace
1. Extract the ZIP
2. Navigate to the `android` folder inside
3. Copy all `mipmap-*` folders from `android/app/src/main/res/`
4. Go to your project: `android/app/src/main/res/`
5. Delete existing `mipmap-*` folders
6. Paste the new folders

---

## Method 3: Use Icon Kitchen (Google's Tool)

### Step 1: Go to Icon Kitchen
1. Visit: **https://icon.kitchen/**
2. This is Google's replacement for Asset Studio

### Step 2: Generate Icons
1. Upload your 1024x1024 icon
2. Set background color to `#FF6B35`
3. Download the generated icons
4. Follow extraction steps from Method 2

---

## Method 4: Quick Background Color Change (Temporary)

If you just want to change the background color for now:

### Edit These Files:

**File 1:** `android/app/src/main/res/values/ic_launcher_background.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FF6B35</color>
</resources>
```

**File 2:** `android/app/src/main/res/drawable/ic_launcher_background.xml`
Find line 8 and change:
```xml
<path
    android:fillColor="#FF6B35"
    android:pathData="M0,0h108v108h-108z" />
```

This changes the background color but keeps the default icon shape.

---

## Recommended: Method 1 (cordova-res)

This is the **easiest** method that actually works:

1. **Install:** `npm install -g cordova-res`
2. **Place** your 1024x1024 `icon.png` in project root
3. **Run:** `cordova-res android --skip-config --copy`
4. **Rebuild** the app

That's it! It handles everything automatically.

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

### cordova-res Not Working?
- Make sure `icon.png` is in the project root
- Try: `cordova-res android --skip-config --copy --icon icon.png`
- Check that you're in the project root directory

### Still See Old Icon?
- Clear Android Studio cache: **File** → **Invalidate Caches**
- Delete `android/.gradle` folder
- Rebuild from scratch

