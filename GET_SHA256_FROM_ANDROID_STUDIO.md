# Get SHA-256 Fingerprint from Android Studio

Since your password works in Android Studio, this is the easiest method!

## Method 1: During Bundle Generation

### Step 1: Generate Signed Bundle
1. Open Android Studio
2. Go to **Build → Generate Signed Bundle / APK**
3. Select **Android App Bundle**
4. Click **Next**

### Step 2: Select Your Keystore
1. Click the folder icon next to "Key store path"
2. Navigate to: `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`
3. Select the file
4. Enter your **keystore password**
5. Select alias: `quickdish-release-key`
6. Enter your **key password**
7. Click **Next**

### Step 3: Look for Certificate Info
After clicking Next, sometimes Android Studio shows certificate information:
- Check the dialog that appears
- Look for "Certificate" or "Details" button
- Check the build output at the bottom

### Step 4: Check Build Output
1. After clicking **Next**, look at the bottom of Android Studio
2. Click the **Build** tab (if not already open)
3. Look for any certificate or signature information
4. Sometimes the SHA-256 is shown there

---

## Method 2: Use Android Studio's Terminal

### Step 1: Open Terminal in Android Studio
1. In Android Studio, click **View → Tool Windows → Terminal**
2. Or click the **Terminal** tab at the bottom

### Step 2: Run the Command
In the Android Studio terminal, run:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
```

### Step 3: Enter Password
When prompted, type your password (it should work since Android Studio knows the path)

---

## Method 3: Use -storepass Flag (Easiest)

Since you know the password works, use this command in Android Studio's terminal:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass "YOUR_PASSWORD"
```

Replace `YOUR_PASSWORD` with your actual password (in quotes).

This avoids the password prompt entirely!

---

## Method 4: Check Gradle Signing Report

### Step 1: Enable Signing Report
1. In Android Studio, open `android/app/build.gradle`
2. Add this to the `android` block (temporarily):

```gradle
android {
    // ... existing code ...
    
    signingConfigs {
        release {
            // This will show signing info in build output
        }
    }
}
```

### Step 2: Build and Check Output
1. Build the project: **Build → Make Project**
2. Check the **Build** output tab
3. Look for signing information

---

## Recommended: Method 3 (Easiest)

Since your password works in Android Studio:

1. Open **Terminal** in Android Studio (View → Tool Windows → Terminal)
2. Run this command (replace with your actual password):

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass "YOUR_PASSWORD"
```

3. Look for the `SHA256:` line in the output
4. Copy the entire SHA256 value (with colons)

---

## After You Get SHA-256

Once you have the SHA-256 fingerprint:

1. **Copy it** (with colons): `A1:B2:C3:D4:E5:F6:...`
2. **Remove all colons**: `A1B2C3D4E5F6...`
3. **Convert to uppercase** (if not already)
4. **Update assetlinks.json** with the formatted fingerprint

Then let me know and I can help you update the file!

