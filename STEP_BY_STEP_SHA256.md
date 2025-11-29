# Step-by-Step: Get SHA-256 Fingerprint

## Method 1: Android Studio (Easiest)

### Step 1: Open Android Studio
1. Open Android Studio
2. Open your project (select the `android` folder in your QuickDish project)

### Step 2: Generate Signed Bundle
1. Click **Build** in the top menu
2. Click **Generate Signed Bundle / APK**
3. A dialog will appear

### Step 3: Select or Create Keystore

**If you already have a keystore:**
- Select **Android App Bundle**
- Click **Next**
- Choose your existing keystore file
- Enter your keystore password
- Select your key alias
- Enter your key password
- Click **Next**

**If you DON'T have a keystore (first time):**
- Select **Android App Bundle**
- Click **Next**
- Click **Create new...**
- Fill in the form:
  - **Key store path:** Choose a location (e.g., `C:\Users\Christin\quickdish-release-key.jks`)
  - **Password:** Create a strong password (SAVE THIS!)
  - **Key alias:** `quickdish-release-key` (or any name)
  - **Key password:** Same as keystore password (or different)
  - **Validity:** 25 years (default)
  - **Certificate information:** Fill in your details
- Click **OK**
- Click **Next**

### Step 4: Get the SHA-256 Fingerprint
1. After selecting/creating your keystore, you'll see a dialog with **signature information**
2. Look for the line that says:
   ```
   SHA256: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
   ```
3. **Copy the entire SHA256 line** (including the colons)

### Step 5: Format the Fingerprint
1. Remove all colons (`:`) from the fingerprint
2. Convert to uppercase
3. Example:
   - **Original:** `SHA256: A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2:A3:B4:C5:D6:E7:F8:A9:B0:C1:D2:E3:F4:A5:B6:C7:D8:E9:F0:A1:B2`
   - **Formatted:** `A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2`

### Step 6: Update assetlinks.json
1. Open `public/.well-known/assetlinks.json`
2. Replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your formatted fingerprint
3. Save the file

---

## Method 2: Command Line (If you have keystore path)

### For Debug Keystore (Testing Only)
```powershell
keytool -list -v -keystore $env:USERPROFILE\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### For Release Keystore (Production)
```powershell
# Replace with your actual keystore path and alias
keytool -list -v -keystore "C:\path\to\your\keystore.jks" -alias your-key-alias
```

Then look for the `SHA256:` line in the output.

---

## Important Notes

1. **You need a keystore for production** - If this is your first time, create one in Android Studio (Step 3 above)
2. **Save your keystore password** - You'll need it for every release!
3. **Save your keystore file** - Back it up! If you lose it, you can't update your app on Google Play
4. **Debug vs Release** - For Google Play, you need the **release** keystore fingerprint
5. **No colons in JSON** - The fingerprint in `assetlinks.json` must NOT have colons

---

## Quick Checklist

- [ ] Open Android Studio
- [ ] Build → Generate Signed Bundle / APK
- [ ] Create or select keystore
- [ ] Copy SHA-256 fingerprint from signature dialog
- [ ] Remove colons and convert to uppercase
- [ ] Update `assetlinks.json` with formatted fingerprint
- [ ] Save file

