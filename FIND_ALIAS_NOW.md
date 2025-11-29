# Find the Correct Alias

The alias name doesn't match. Let's find what alias actually exists in your keystore.

## Step 1: List All Aliases

Run this command to see what's actually in your keystore:

```powershell
keytool -list -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks"
```

When prompted, enter your password: `QuickDish2025ReleaseKey!`

## Step 2: Check the Output

You'll see output like:

```
Keystore type: JKS
Keystore provider: SUN

Your keystore contains 1 entry

ALIAS_NAME, Jan 1, 2025, PrivateKeyEntry,
Certificate fingerprint (SHA-256): ...
```

**The name before the comma is your actual alias!**

## Step 3: Common Alias Names

When creating a keystore, Android Studio might have used:
- The alias you typed (but maybe with different capitalization)
- `key0` or `key1` (default names)
- `quickdish` (if you typed that)
- Something else

## Step 4: Once You Find It

After you see the alias name, run:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias "ACTUAL_ALIAS_NAME"
```

Replace `ACTUAL_ALIAS_NAME` with what you found.

## Alternative: Check in Android Studio

1. Go to **Build → Generate Signed Bundle / APK**
2. Select your keystore
3. Look at the **Key alias** dropdown - it will show what aliases exist

