# How to Get SHA-256 Fingerprint (If Dialog Doesn't Appear)

## Method 1: Command Line (Easiest)

### Step 1: Find Your Keystore Path
You just created the keystore at:
```
C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks
```

### Step 2: Run This Command in PowerShell

Open PowerShell and run:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
```

**Note:** Replace the path and alias if yours are different.

### Step 3: Enter Password
When prompted, enter your **keystore password**.

### Step 4: Find SHA-256
In the output, look for a line that says:
```
SHA256: A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2:A3:B4:C5:D6:E7:F8:A9:B0:C1:D2:E3:F4:A5:B6:C7:D8:E9:F0:A1:B2
```

**Copy the entire SHA256 value** (everything after "SHA256: " including the colons).

---

## Method 2: Android Studio - View Certificate

### Step 1: Open Android Studio
1. Open your project
2. Go to **Build → Generate Signed Bundle / APK**

### Step 2: Select Your Keystore
1. Select **Android App Bundle**
2. Click **Next**
3. Select your existing keystore: `C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks`
4. Enter your password
5. Select alias: `quickdish-release-key`
6. Enter key password
7. Click **Next**

### Step 3: Look for Certificate Info
Sometimes the certificate info appears:
- In the dialog after selecting the keystore
- In the build output
- In a separate "Certificate Information" window

### Step 4: Check Build Output
1. After clicking **Next**, look at the bottom of Android Studio
2. Check the **Build** tab
3. Look for any certificate or signature information

---

## Method 3: View Keystore Details Directly

### In Android Studio:
1. Go to **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle** → **Next**
3. Click the **...** button next to "Key store path"
4. Select your keystore file
5. Enter password
6. Sometimes a "Certificate" or "Details" button appears - click it

---

## Method 4: Use Command Line (Recommended - Most Reliable)

This is the most reliable method:

### Windows PowerShell:

```powershell
# Navigate to your project (optional, but helpful)
cd C:\Users\Christin\Documents\GitHub\quickdish

# Run keytool command
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
```

**What happens:**
1. It will ask for your keystore password
2. Enter the password you created
3. You'll see output with certificate information
4. Look for the `SHA256:` line

### Example Output:
```
Alias name: quickdish-release-key
Creation date: Jan 1, 2025
Entry type: PrivateKeyEntry
Certificate chain length: 1
Certificate[1]:
Owner: CN=Your Name, OU=Organization, O=Organization, L=City, ST=State, C=US
Issuer: CN=Your Name, OU=Organization, O=Organization, L=City, ST=State, C=US
Serial number: 1234567890abcdef
Valid from: Wed Jan 01 00:00:00 EST 2025 until: Thu Jan 01 00:00:00 EST 2050
Certificate fingerprints:
         SHA1: 12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78
         SHA256: A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2:A3:B4:C5:D6:E7:F8:A9:B0:C1:D2:E3:F4:A5:B6:C7:D8:E9:F0:A1:B2
Signature algorithm name: SHA256withRSA
Subject Public Key Algorithm: 2048-bit RSA key
```

**Copy the SHA256 line** (the long string after "SHA256: ")

---

## Method 5: If Keytool Not Found

If you get "keytool not found", you need to use the full path:

### Find Java/Keytool:
```powershell
# Usually located in:
# C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe
# OR
# C:\Program Files\Java\jdk-XX\bin\keytool.exe
```

### Use Full Path:
```powershell
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
```

---

## Quick Command (Copy & Paste)

Replace `YOUR_PASSWORD` with your actual keystore password:

```powershell
$password = "YOUR_PASSWORD"
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass $password
```

This avoids the password prompt.

---

## After Getting SHA-256

Once you have the SHA-256 fingerprint:

1. **Copy it** (with colons): `A1:B2:C3:D4:E5:F6:...`
2. **Remove all colons**: `A1B2C3D4E5F6...`
3. **Convert to uppercase** (if not already)
4. **Update assetlinks.json** with the formatted fingerprint

---

## Troubleshooting

### "keytool not found"
- Use full path to keytool (see Method 5)
- Or add Java/bin to your PATH

### "Keystore was tampered with, or password was incorrect"
- Double-check your password
- Make sure you're using the correct keystore file path

### "Alias does not exist"
- Check the alias name you used when creating the keystore
- Common aliases: `quickdish-release-key`, `quickdish-key`, `release-key`

### Still Can't Find It?
- The command line method (Method 1) is the most reliable
- It always shows the SHA-256 fingerprint
- Just make sure you have the correct keystore path and password

