# Install App on Your Phone - Quick Guide

## ✅ Your Phone is Detected!

Device ID: `AQKFZ5EAXCTGR8LZ`

## Easiest Method: Use Android Studio Run

### Step 1: In Android Studio

1. Make sure your phone is still connected
2. Look at the top toolbar in Android Studio
3. You should see a device selector (may show your device name or "AQKFZ5EAXCTGR8LZ")
4. Click the **Run** button (green play icon ▶️)
   - Or press: **Shift + F10**
   - Or: **Run → Run 'app'**

### Step 2: Select Your Device

If prompted to select a device:
- Choose your phone from the list
- Click **OK**

### Step 3: Wait for Build & Install

Android Studio will:
1. Build the app (may take 1-2 minutes)
2. Install it on your phone automatically
3. Launch the app

**That's it!** The app should now be on your phone.

---

## Alternative: Build APK and Install via ADB

If you prefer to build an APK first:

### Step 1: Build APK
1. **Build → Generate Signed Bundle / APK**
2. Select **APK** (not AAB)
3. Use same keystore info
4. Build **release** or **debug**

### Step 2: Install via ADB
```powershell
cd C:\Users\Christin\Documents\GitHub\quickdish\android
adb install app\build\outputs\apk\release\app-release.apk
```

---

## Recommended: Use Run Button

**The Run button is easiest** - it does everything automatically!

Just click the green play button in Android Studio and your app will be installed and launched on your phone.

