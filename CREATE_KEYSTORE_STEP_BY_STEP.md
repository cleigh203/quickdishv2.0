# Create Keystore Step-by-Step Guide

Let's start fresh and create a new keystore properly.

## Step 1: Delete Old Keystore (If It Exists)

1. Open File Explorer
2. Navigate to: `C:\Users\Christin\AndroidKeystores\`
3. If `quickdish-release-key.jks` exists, delete it (or rename it to backup)
4. This ensures we start fresh

## Step 2: Open Android Studio

1. Open Android Studio
2. Open your project (the `android` folder)

## Step 3: Start Bundle Generation

1. Click **Build** in the top menu
2. Click **Generate Signed Bundle / APK**
3. A dialog will appear

## Step 4: Select Bundle Type

1. Select **Android App Bundle** (not APK)
2. Click **Next**

## Step 5: Create New Keystore

1. You'll see a dialog asking for keystore
2. Click **Create new...** button
3. A new dialog will open

## Step 6: Fill in Keystore Information

Fill in the form **exactly** as shown:

### Key store path:
1. Click the folder icon (📁) next to "Key store path"
2. Navigate to: `C:\Users\Christin\`
3. If `AndroidKeystores` folder doesn't exist, create it:
   - Right-click → New → Folder
   - Name it: `AndroidKeystores`
4. Open the `AndroidKeystores` folder
5. In the filename field at the bottom, type: `quickdish-release-key.jks`
6. Click **OK**

### Password:
- Type: `QuickDish2025ReleaseKey!` (simple, no special characters that cause issues)
- **SAVE THIS PASSWORD** - write it down or save in password manager!

### Key alias:
- Type: `quickdish-key` (simple, lowercase, no special characters)

### Key password:
- Type: `QuickDish2025ReleaseKey!` (same as keystore password - easier to remember)

### Validity:
- Leave as default (25 years) - that's fine

### Certificate information:
Fill in your details:
- **First and Last Name:** Your name
- **Organizational Unit:** (optional) e.g., "Development"
- **Organization:** (optional) e.g., "QuickDish"
- **City or Locality:** Your city
- **State or Province:** Your state
- **Country Code:** US (or your country code)

## Step 7: Create the Keystore

1. Review all the information
2. Click **OK**
3. The keystore will be created

## Step 8: Get SHA-256 Fingerprint

After clicking OK, you should see:
- The keystore path is filled in
- The alias is selected
- Sometimes a "Certificate" or signature info appears

**If you see certificate info:**
- Look for `SHA256: XX:XX:XX:...`
- Copy that entire line

**If you don't see it:**
- Click **Next** to continue (we'll get it via command line)
- You can cancel after this - we just needed to create the keystore

## Step 9: Get SHA-256 via Command Line

Now that the keystore is created, get the SHA-256:

### In Android Studio Terminal:

1. In Android Studio, click **View → Tool Windows → Terminal**
2. Run this command:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-key
```

3. When prompted for password, type: `QuickDish2025ReleaseKey!`
4. Look for the line: `SHA256: XX:XX:XX:...`
5. Copy the entire SHA256 value

## Step 10: Format and Update assetlinks.json

1. Take the SHA256 value (with colons)
2. Remove all colons (`:`)
3. Convert to uppercase (if needed)
4. Update `assetlinks.json`

---

## Quick Reference - What to Type

**Keystore Path:** `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`  
**Password:** `QuickDish2025ReleaseKey!`  
**Alias:** `quickdish-key`  
**Key Password:** `QuickDish2025ReleaseKey!`

**Save this information!**

