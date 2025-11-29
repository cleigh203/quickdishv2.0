# Find the Correct Alias

The alias name doesn't match. Let's find what alias you actually used.

## Step 1: List All Aliases in Keystore

Run this command to see all aliases in your keystore:

```powershell
keytool -list -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks"
```

When prompted, enter your password: `QuickDish!Android@App#Release$Key%2025`

This will show you all aliases in the keystore.

## Step 2: Common Alias Names

When creating a keystore, Android Studio sometimes uses:
- The alias you specified
- `androiddebugkey` (if it was a debug keystore)
- `key0` or `key1` (default names)
- The first part of your keystore filename

## Step 3: Once You Find the Alias

After running the command above, you'll see output like:

```
Keystore type: JKS
Keystore provider: SUN

Your keystore contains 1 entry

quickdish-release-key, [date], PrivateKeyEntry,
Certificate fingerprint (SHA-256): ...
```

The name before the comma is your alias!

## Step 4: Use the Correct Alias

Then run the full command with the correct alias:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias "ACTUAL_ALIAS_NAME"
```

Replace `ACTUAL_ALIAS_NAME` with what you found in Step 1.

