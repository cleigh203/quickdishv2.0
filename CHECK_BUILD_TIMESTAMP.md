# How to Check Build Timestamp in Android Studio

## Method 1: Build Output Window (Easiest)

1. **Build your app** (Run button or Build → Make Project)
2. Look at the **Build** tab at the bottom of Android Studio
3. You'll see timestamps like:
   ```
   BUILD SUCCESSFUL in 2m 15s
   ```
   Or check the individual task timestamps in the build log

---

## Method 2: APK/AAB File Properties

### For APK:
1. Navigate to: `android/app/build/outputs/apk/`
2. Right-click the APK file → **Properties**
3. Check **Date Modified** - this is your build timestamp

### For AAB:
1. Navigate to: `android/app/build/outputs/bundle/`
2. Right-click the AAB file → **Properties**
3. Check **Date Modified** - this is your build timestamp

---

## Method 3: Event Log

1. **View** → **Tool Windows** → **Event Log** (or press `Alt+6`)
2. Look for recent build events with timestamps
3. You'll see entries like:
   ```
   [timestamp] Build completed successfully
   ```

---

## Method 4: Gradle Build Output

1. Open **Build** tab at the bottom
2. Look for the build start time at the top of the output:
   ```
   > Task :app:assembleDebug
   BUILD SUCCESSFUL in 1m 30s
   ```
3. The time shown is when the build completed

---

## Method 5: Check App Version in Device

### On Your Phone:
1. **Settings** → **Apps** → **QuickDish**
2. Tap **App details** or scroll down
3. Check **Last updated** timestamp

### Via ADB:
```powershell
adb shell dumpsys package com.quickdishco.app | findstr "lastUpdateTime"
```

---

## Method 6: Build Variant Info

1. **Build** → **Analyze APK** (if you have an APK)
2. Or check the **Build Variants** tool window
3. Look at the **Build** column for timestamps

---

## Quick Verification Steps

### To Ensure You're Running Latest Build:

1. **Note the current time** (e.g., 2:30 PM)

2. **Build the app:**
   - Click **Stop** (red square) if running
   - Click **Run** (green play button)

3. **Check Build Output:**
   - Look at bottom **Build** tab
   - Should show "BUILD SUCCESSFUL" with recent timestamp

4. **Verify on Device:**
   ```powershell
   adb shell dumpsys package com.quickdishco.app | findstr "lastUpdateTime"
   ```
   - Should show current date/time

---

## Troubleshooting: If Build Seems Old

### Force a Clean Build:
1. **Build** → **Clean Project**
2. Wait for it to complete
3. **Build** → **Rebuild Project**
4. Then **Run**

### Or via Terminal:
```powershell
cd c:\Users\Christin\Documents\GitHub\quickdish\android
.\gradlew clean
.\gradlew assembleDebug
```

---

## Pro Tip: Add Build Timestamp to App

You can add a build timestamp to your app's debug info:

1. In `android/app/build.gradle`, add:
   ```gradle
   android {
       defaultConfig {
           buildConfigField "String", "BUILD_TIME", "\"${new Date().toString()}\""
       }
   }
   ```

2. Then access it in your app code to display when it was built.

---

## Quick Check Command

Run this to see when the app was last installed:
```powershell
adb shell dumpsys package com.quickdishco.app | findstr /C:"lastUpdateTime" /C:"firstInstallTime"
```

