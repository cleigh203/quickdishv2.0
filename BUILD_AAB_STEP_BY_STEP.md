# Build Android App Bundle (AAB) - Step by Step

## Prerequisites

Make sure you have:
- ✅ Android Studio open
- ✅ Your project loaded (the `android` folder)
- ✅ Keystore file exists: `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`

## Step-by-Step Instructions

### Step 1: Open Build Menu

1. In Android Studio, look at the top menu bar
2. Click **Build**
3. In the dropdown menu, click **Generate Signed Bundle / APK**

### Step 2: Select Bundle Type

A dialog window will appear with two options:
- **Android App Bundle** ← Select this one
- **APK** (don't select this)

1. Click the radio button next to **Android App Bundle**
2. Click **Next** button at the bottom

### Step 3: Select Your Keystore

You'll see a form asking for keystore information:

#### Key store path:
1. Click the folder icon (📁) next to "Key store path"
2. Navigate to: `C:\Users\Christin\AndroidKeystores\`
3. Select the file: `quickdish-release-key.jks`
4. Click **OK**

#### Password:
1. Click in the "Password" field
2. Type: `QuickDish2025ReleaseKey!`
   - **Note:** You won't see the characters as you type (this is normal for security)

#### Key alias:
1. Click the dropdown arrow next to "Key alias"
2. Select: `key0`
   - If you don't see it in the dropdown, type: `key0`

#### Key password:
1. Click in the "Key password" field
2. Type: `QuickDish2025ReleaseKey!`
   - (Same as keystore password)

### Step 4: Verify Information

Before clicking Next, double-check:
- ✅ Key store path: `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`
- ✅ Password: `QuickDish2025ReleaseKey!`
- ✅ Key alias: `key0`
- ✅ Key password: `QuickDish2025ReleaseKey!`

### Step 5: Select Build Variant

1. Click **Next** button
2. You'll see "Build Variants" screen
3. Make sure **release** is selected (not debug)
4. Click **Create** button

### Step 6: Wait for Build

Android Studio will now:
1. Build your app
2. Sign it with your keystore
3. Create the AAB file

**This may take a few minutes.** You'll see progress in the bottom status bar.

### Step 7: Find Your AAB File

When the build completes, you'll see a notification:

**"Signed Bundle is ready"**

1. Click **locate** in the notification
2. Or navigate to:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```

### Step 8: Check File Size

1. Right-click the `app-release.aab` file
2. Click **Properties**
3. Check the file size
4. **Should be less than 150MB**

### Step 9: Save the AAB

**IMPORTANT:** Save this AAB file somewhere safe! You'll need it to upload to Google Play Console.

**Recommended location:**
- Create a folder: `C:\Users\Christin\Documents\QuickDish\Releases\`
- Copy the AAB file there
- Name it: `QuickDish-v1.0-release.aab` (or similar)

---

## Troubleshooting

### Error: "Keystore file not found"
- **Solution:** Make sure the path is correct: `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`
- Check that the file exists in File Explorer

### Error: "Password incorrect"
- **Solution:** Make sure you're typing: `QuickDish2025ReleaseKey!`
- Try typing it manually (don't copy/paste)
- Make sure Caps Lock is off

### Error: "Alias does not exist"
- **Solution:** Make sure you select `key0` from the dropdown
- Or type `key0` if it's not in the dropdown

### Build Fails
- **Solution:** Check the "Build" tab at the bottom for error messages
- Common issues:
  - Missing dependencies (run `npm install` in project root)
  - Gradle sync issues (File → Sync Project with Gradle Files)

### AAB File Too Large (>150MB)
- **Solution:** Check what's taking up space
- Images in `public/` folder
- Large dependencies
- Consider optimizing assets

---

## Quick Reference

**Keystore Info:**
- File: `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`
- Alias: `key0`
- Password: `QuickDish2025ReleaseKey!`

**AAB Location:**
- `android/app/build/outputs/bundle/release/app-release.aab`

**File Size:**
- Should be <150MB

---

## After Building

Once you have the AAB:

1. ✅ **Save it safely** (backup location)
2. ✅ **Check the size** (<150MB)
3. ✅ **Ready to upload** to Google Play Console

You'll upload this AAB file when you:
- Create your Google Play Developer account
- Go to Production → Create new release
- Upload the AAB file

---

## Next Steps

After building the AAB:
1. Test the app on a device (if you haven't already)
2. Create Google Play Developer account
3. Prepare store listing assets
4. Upload AAB to Google Play Console

