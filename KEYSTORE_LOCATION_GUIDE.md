# Where to Store Your Android Keystore

## Recommended Location

**Best Practice:** Store your keystore **OUTSIDE** your project directory in a secure, backed-up location.

### Recommended Path Structure

```
C:\Users\Christin\AndroidKeystores\
  └── quickdish-release-key.jks
```

Or:

```
C:\Users\Christin\Documents\AndroidKeys\
  └── quickdish-release-key.jks
```

## Why NOT in the Project Directory?

❌ **Don't put it here:**
- `C:\Users\Christin\Documents\GitHub\quickdish\android\app\` (project directory)
- `C:\Users\Christin\Documents\GitHub\quickdish\` (anywhere in project)

**Reasons:**
1. **Security Risk:** If you commit to Git, the keystore could be exposed
2. **Version Control:** Keystores should NEVER be in Git
3. **Backup:** If you delete the project, you lose the keystore
4. **Multiple Projects:** You might have multiple apps - keep keys separate

## Recommended Setup

### Step 1: Create a Secure Folder

Create a dedicated folder for your Android keystores:

```powershell
# Create folder (run in PowerShell)
New-Item -ItemType Directory -Path "C:\Users\Christin\AndroidKeystores" -Force
```

Or manually:
1. Open File Explorer
2. Navigate to `C:\Users\Christin\`
3. Create a new folder called `AndroidKeystores`

### Step 2: Create Keystore in This Location

When creating the keystore in Android Studio:

1. Click **Build → Generate Signed Bundle / APK**
2. Select **Android App Bundle** → **Next**
3. Click **Create new...**
4. In the **Key store path** field, click the folder icon
5. Navigate to: `C:\Users\Christin\AndroidKeystores\`
6. Enter filename: `quickdish-release-key.jks`
7. Click **OK**
8. Fill in the rest of the form:
   - **Password:** (create a strong password - SAVE IT!)
   - **Key alias:** `quickdish-release-key`
   - **Key password:** (same or different - SAVE IT!)
   - **Validity:** 25 years
   - **Certificate info:** Your name, organization, etc.
9. Click **OK**

### Step 3: Back Up Your Keystore

**CRITICAL:** Back up your keystore file!

1. **Copy to external drive/USB:**
   - Copy `quickdish-release-key.jks` to a USB drive
   - Store in a safe place

2. **Cloud backup (encrypted):**
   - Upload to Google Drive, OneDrive, etc.
   - Use a password-protected ZIP file
   - Or use encrypted cloud storage

3. **Password manager:**
   - Store keystore password in password manager
   - Store key password in password manager
   - Document the keystore location

## Example Paths

### Good Locations ✅
```
C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks
C:\Users\Christin\Documents\AndroidKeys\quickdish-release-key.jks
D:\Backup\AndroidKeystores\quickdish-release-key.jks
```

### Bad Locations ❌
```
C:\Users\Christin\Documents\GitHub\quickdish\android\app\quickdish-release-key.jks
C:\Users\Christin\Documents\GitHub\quickdish\quickdish-release-key.jks
C:\Users\Christin\Documents\GitHub\quickdish\.git\quickdish-release-key.jks
```

## Security Best Practices

1. **Never commit to Git:**
   - Add to `.gitignore` (already should be there)
   - Never push keystore to GitHub/GitLab

2. **Strong passwords:**
   - Use a strong password (20+ characters)
   - Store password securely (password manager)

3. **Multiple backups:**
   - Local backup (external drive)
   - Cloud backup (encrypted)
   - Document location

4. **Access control:**
   - Don't share keystore file
   - Only you should have access

## What If You Lose the Keystore?

⚠️ **WARNING:** If you lose your keystore:
- You **CANNOT** update your app on Google Play
- You'll have to create a new app listing
- All existing users will need to uninstall and reinstall

**This is why backups are critical!**

## Quick Checklist

- [ ] Create folder: `C:\Users\Christin\AndroidKeystores\`
- [ ] Create keystore in this location
- [ ] Save keystore password securely
- [ ] Save key password securely
- [ ] Back up keystore file to external drive
- [ ] Back up keystore file to cloud (encrypted)
- [ ] Document keystore location
- [ ] Verify keystore is NOT in project directory
- [ ] Verify keystore is in `.gitignore`

## When Creating in Android Studio

**Key store path field:**
```
C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks
```

**Full path example:**
```
C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks
```

This keeps it:
- ✅ Secure (not in project)
- ✅ Easy to find
- ✅ Safe from accidental deletion
- ✅ Separate from code

