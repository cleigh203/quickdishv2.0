# How to Install App on Your Phone for Testing

## Important: AAB vs APK

**AAB files cannot be installed directly on phones!** They're only for Google Play.

For testing, you need an **APK file** instead.

---

## Option 1: Build APK for Testing (Easiest)

### Step 1: Build APK in Android Studio

1. In Android Studio: **Build → Generate Signed Bundle / APK**
2. This time, select **APK** (not Android App Bundle)
3. Click **Next**
4. Select your keystore:
   - **Key store path:** `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`
   - **Password:** `QuickDish2025ReleaseKey!`
   - **Key alias:** `key0`
   - **Key password:** `QuickDish2025ReleaseKey!`
5. Click **Next**
6. Select **release** (or **debug** for faster testing)
7. Click **Create**

### Step 2: Find APK File

The APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Step 3: Transfer to Phone

**Method A: USB Transfer**
1. Connect phone via USB
2. Copy `app-release.apk` to your phone's Downloads folder
3. On phone, open Files app
4. Navigate to Downloads
5. Tap the APK file
6. Allow installation from unknown sources if prompted
7. Install

**Method B: ADB Install (Recommended)**
1. Enable USB Debugging (see below)
2. Open PowerShell/Command Prompt
3. Navigate to your project: `cd C:\Users\Christin\Documents\GitHub\quickdish\android`
4. Run: `adb install app\build\outputs\apk\release\app-release.apk`

---

## Option 2: Enable USB Debugging & Use ADB

### Step 1: Enable USB Debugging on Phone

1. On your phone: **Settings → About Phone**
2. Tap **Build Number** 7 times (enables Developer Options)
3. Go back: **Settings → Developer Options**
4. Enable **USB Debugging**
5. Enable **Install via USB** (if available)

### Step 2: Connect Phone

1. Connect phone to computer via USB
2. On phone, you'll see "Allow USB debugging?" - tap **Allow**
3. Check "Always allow from this computer"
4. Tap **OK**

### Step 3: Verify Connection

Open PowerShell and run:
```powershell
adb devices
```

You should see your device listed:
```
List of devices attached
ABC123XYZ    device
```

If you see "unauthorized", check your phone and allow USB debugging.

### Step 4: Install APK via ADB

```powershell
cd C:\Users\Christin\Documents\GitHub\quickdish\android
adb install app\build\outputs\apk\release\app-release.apk
```

---

## Option 3: Use Android Studio Run (Easiest for Testing)

### Step 1: Enable USB Debugging
- Follow steps above

### Step 2: Run from Android Studio

1. Connect phone via USB
2. In Android Studio, click the **Run** button (green play icon)
3. Or: **Run → Run 'app'**
4. Select your device from the list
5. Click **OK**

Android Studio will:
- Build the app
- Install it on your phone
- Launch it automatically

**This is the easiest method for testing!**

---

## Troubleshooting: Phone Not Detected

### Issue: Phone Not Showing Up

**Solution 1: Check USB Connection**
- Try a different USB cable
- Try a different USB port
- Make sure cable supports data transfer (not just charging)

**Solution 2: Install USB Drivers**
- For Samsung: Install Samsung USB drivers
- For Google Pixel: Install Google USB drivers
- For other brands: Check manufacturer website

**Solution 3: Check ADB**
```powershell
adb kill-server
adb start-server
adb devices
```

**Solution 4: Enable Developer Options**
- Settings → About Phone → Tap Build Number 7 times
- Settings → Developer Options → Enable USB Debugging

**Solution 5: Check Phone Notification**
- When connected, check phone notifications
- Look for "USB for file transfer" or similar
- Change to "File Transfer" or "MTP" mode

---

## Quick Method: Build APK and Transfer

1. **Build APK:**
   - Android Studio → Build → Generate Signed Bundle / APK
   - Select **APK**
   - Use same keystore info
   - Build **release** or **debug**

2. **Transfer to Phone:**
   - Copy APK to phone (USB, email, cloud storage)
   - On phone: Open file manager
   - Tap APK file
   - Install

3. **Allow Installation:**
   - If prompted "Install from unknown sources" → Allow
   - Or: Settings → Security → Enable "Unknown Sources"

---

## Recommended: Use Android Studio Run

**Easiest method:**
1. Enable USB Debugging on phone
2. Connect phone via USB
3. In Android Studio: Click **Run** button
4. Select your device
5. Done! App installs and launches automatically

This builds, installs, and runs the app in one step!

---

## Notes

- **AAB files** = For Google Play only (can't install directly)
- **APK files** = For testing/installation
- **Debug APK** = Faster builds, easier testing
- **Release APK** = Same as what users will get (slower build)

For testing, use **debug APK** or **Run from Android Studio** - it's faster!

