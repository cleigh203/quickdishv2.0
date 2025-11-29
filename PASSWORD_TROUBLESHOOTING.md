# Password Troubleshooting Guide

## Common Issues with Copy/Paste

### Issue 1: Extra Spaces or Characters
When copying/pasting, sometimes extra spaces or invisible characters get added.

**Solution:**
1. **Type the password manually** instead of pasting
2. Or try pasting into Notepad first, then copying from there
3. Make sure there are no spaces before or after the password

### Issue 2: Special Characters Not Pasting Correctly
Some special characters might not paste correctly in PowerShell.

**Solution:**
1. Type the password manually (character by character)
2. Or use the `-storepass` method with quotes

### Issue 3: Wrong Password Type
Remember: There are TWO passwords:
- **Keystore Password** - Password for the entire keystore file
- **Key Password** - Password for the specific key

**Solution:**
- Make sure you're using the **keystore password** (not the key password)
- If you used the same password for both, that's fine - but make sure it's the keystore password

### Issue 4: Hidden Characters in Password Manager
If you copied from a password manager, there might be hidden formatting.

**Solution:**
1. View the password in your password manager
2. Type it manually instead of copying
3. Or copy to Notepad first, then copy from Notepad

## Try These Solutions

### Solution 1: Type Manually (Recommended)
1. Open PowerShell
2. Run the command:
   ```powershell
   keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
   ```
3. When prompted for password, **type it manually** (don't paste)
4. Type slowly and carefully
5. Press Enter

### Solution 2: Use -storepass Flag
Try passing the password directly:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass "YOUR_PASSWORD"
```

**Important:** Replace `YOUR_PASSWORD` with your actual password, and make sure it's in quotes.

### Solution 3: Check Password in Notepad
1. Open Notepad
2. Paste your password there
3. Check for:
   - Extra spaces at the beginning or end
   - Line breaks
   - Special characters that look wrong
4. Copy from Notepad and try again

### Solution 4: Verify Password in Android Studio
1. Open Android Studio
2. Go to **Build → Generate Signed Bundle / APK**
3. Try to select your keystore
4. Enter the password there
5. If it works in Android Studio, the password is correct - the issue is with how it's being entered in PowerShell

## Common Mistakes

### Mistake 1: Using Key Password Instead of Keystore Password
- **Keystore Password** = Password for the `.jks` file
- **Key Password** = Password for the key inside the keystore
- Make sure you're using the **keystore password**

### Mistake 2: Extra Spaces
- Copy/paste might add spaces
- Check: `" password"` vs `"password"` vs `"password "`

### Mistake 3: Wrong Alias
- Make sure the alias matches what you used when creating the keystore
- Common: `quickdish-release-key`

### Mistake 4: Wrong Keystore File
- Double-check the file path is correct
- Make sure the file exists at that location

## Debug Steps

### Step 1: Verify Keystore File Exists
```powershell
Test-Path "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks"
```

Should return `True` if the file exists.

### Step 2: Try Different Methods

**Method A: Type manually**
```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
```
(Then type password when prompted)

**Method B: Pass password in command**
```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass "YOUR_PASSWORD"
```

**Method C: Use full path to keytool**
```powershell
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass "YOUR_PASSWORD"
```

## If Still Not Working

### Option 1: Recreate Keystore (Last Resort)
If you just created the keystore and haven't uploaded to Google Play yet, you could:
1. Delete the old keystore
2. Create a new one with a simpler password (no special characters)
3. Get the SHA-256 from the new keystore

**WARNING:** Only do this if you haven't uploaded to Google Play yet!

### Option 2: Check Android Studio
1. Open Android Studio
2. Try to use the keystore there
3. If it works, the password is correct - try typing it manually in PowerShell

### Option 3: Use Debug Keystore (For Testing Only)
If you just need to test, you can use the debug keystore:

```powershell
keytool -list -v -keystore $env:USERPROFILE\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Note:** This is only for testing. For production, you need your release keystore.

## Quick Checklist

- [ ] Password typed manually (not pasted)
- [ ] Using keystore password (not key password)
- [ ] No extra spaces before/after password
- [ ] Correct alias name
- [ ] Correct keystore file path
- [ ] Password works in Android Studio (verify)

