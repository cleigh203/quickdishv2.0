# How to Clear Cache on Android App

## Method 1: Through Android Settings (Easiest)

### Step 1: Open Android Settings
1. Open **Settings** on your Android device
2. Go to **Apps** (or **Application Manager**)
3. Find and tap **QuickDish**

### Step 2: Clear Cache
1. Tap **Storage** (or **Storage & cache**)
2. Tap **Clear Cache**
3. (Optional) Tap **Clear Data** if you want to completely reset the app
   - **Warning:** This will log you out and clear all local data

### Step 3: Restart App
1. Close the app completely (swipe it away from recent apps)
2. Reopen QuickDish

---

## Method 2: Uninstall and Reinstall (Most Thorough)

1. Long-press the QuickDish app icon
2. Tap **Uninstall**
3. Reinstall from Android Studio (Run button) or install the APK again

**Note:** This will log you out and clear all local data.

---

## Method 3: Through Android Studio (If App is Running)

### While App is Running:
1. In Android Studio, click the **Stop** button (red square)
2. Click **Run** again (green play button)
3. This will rebuild and reinstall the app

### Or Use ADB:
```powershell
# Clear app data (logs you out)
adb shell pm clear com.quickdishco.app

# Or just clear cache
adb shell pm clear --cache-only com.quickdishco.app
```

---

## Method 4: Force Stop and Clear (Recommended)

1. **Settings** → **Apps** → **QuickDish**
2. Tap **Force Stop**
3. Tap **Storage**
4. Tap **Clear Cache**
5. Reopen the app

---

## Quick Reference

**App Package Name:** `com.quickdishco.app`

**ADB Commands:**
```powershell
# Clear cache only
adb shell pm clear --cache-only com.quickdishco.app

# Clear all data (logs you out)
adb shell pm clear com.quickdishco.app

# Uninstall
adb uninstall com.quickdishco.app
```

---

## What Each Method Does

- **Clear Cache:** Removes temporary files, keeps your login and data
- **Clear Data:** Removes all app data, logs you out, resets everything
- **Uninstall/Reinstall:** Complete fresh start, logs you out
- **Rebuild in Android Studio:** Fresh install with latest code

---

## Recommended for Testing

**For seeing code changes:**
- **Method 3** (Rebuild in Android Studio) - Easiest and fastest
- Just click **Stop** then **Run** again

**For clearing cache only:**
- **Method 1** (Android Settings) - Quick and easy
- Settings → Apps → QuickDish → Storage → Clear Cache

