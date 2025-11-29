# Create New Keystore - Fresh Start

Since Android Studio is still referencing the old one, let's create a completely new keystore with a different name.

## Step 1: Create New Keystore with Different Name

We'll use a slightly different name to avoid conflicts:

**New keystore name:** `quickdish-release-v2.jks`  
**New alias:** `quickdish-v2`

## Step 2: Follow These Steps

### In Android Studio:

1. **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle**
3. Click **Next**
4. Click **Create new...**

### Fill in the form:

**Key store path:**
- Click folder icon
- Navigate to: `C:\Users\Christin\AndroidKeystores\`
- In filename field, type: `quickdish-release-v2.jks` (different name!)
- Click **OK**

**Password:**
- Type: `QuickDish2025ReleaseKey!`
- **SAVE THIS!**

**Key alias:**
- Type: `quickdish-v2` (different alias!)

**Key password:**
- Type: `QuickDish2025ReleaseKey!` (same as keystore password)

**Validity:**
- Leave default (25 years)

**Certificate information:**
- Fill in your details

5. Click **OK** to create

## Step 3: Get SHA-256

After creating, in Android Studio Terminal:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-v2.jks" -alias quickdish-v2
```

When prompted, enter: `QuickDish2025ReleaseKey!`

Look for: `SHA256: XX:XX:XX:...`

## Why Different Name?

Using `v2` ensures:
- No conflict with old keystore references
- Clear that it's a new keystore
- Easy to identify later

## After You Get SHA-256

Once you have the SHA-256 fingerprint, we'll update `assetlinks.json` and you're all set!

