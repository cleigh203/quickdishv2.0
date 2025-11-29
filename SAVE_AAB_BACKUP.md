# How to Save Your AAB Backup

## Recommended Backup Location

Create a dedicated folder for your app releases:

### Option 1: In Your Documents Folder (Recommended)

1. Open File Explorer
2. Navigate to: `C:\Users\Christin\Documents\`
3. Create a new folder: `QuickDish-Releases` (or `QuickDish\Releases`)
4. Copy your AAB file there

**Full path:**
```
C:\Users\Christin\Documents\QuickDish-Releases\
```

### Option 2: In Your Project Folder (Alternative)

1. Navigate to: `C:\Users\Christin\Documents\GitHub\quickdish\`
2. Create folder: `releases` (or `builds`)
3. Copy AAB there

**Full path:**
```
C:\Users\Christin\Documents\GitHub\quickdish\releases\
```

## File Naming Convention

Name your AAB file with version information:

**Recommended format:**
```
QuickDish-v1.0-release.aab
```

Or more detailed:
```
QuickDish-v1.0-build-2025-01-XX-release.aab
```

**Current file:**
- Original: `app-release.aab`
- Backup name: `QuickDish-v1.0-release.aab`

## Step-by-Step: Save Backup

### Method 1: Copy to New Location

1. **Find your AAB file:**
   - Location: `android/app/build/outputs/bundle/release/app-release.aab`
   - Or click "locate" in the Android Studio notification

2. **Create backup folder:**
   - Navigate to: `C:\Users\Christin\Documents\`
   - Right-click → New → Folder
   - Name it: `QuickDish-Releases`

3. **Copy the file:**
   - Right-click `app-release.aab`
   - Click **Copy**
   - Navigate to `C:\Users\Christin\Documents\QuickDish-Releases\`
   - Right-click → **Paste**
   - Rename to: `QuickDish-v1.0-release.aab`

### Method 2: Save As (Rename in Place)

1. Right-click `app-release.aab`
2. Click **Copy**
3. Navigate to backup location
4. Right-click → **Paste**
5. Right-click the copied file → **Rename**
6. Type: `QuickDish-v1.0-release.aab`

## Multiple Backups (Recommended)

Save in multiple locations for safety:

### Primary Backup:
```
C:\Users\Christin\Documents\QuickDish-Releases\QuickDish-v1.0-release.aab
```

### Secondary Backup (Cloud):
- Google Drive
- OneDrive
- Dropbox
- Or any cloud storage

### Tertiary Backup (External):
- USB drive
- External hard drive
- Network drive

## What to Save With It

Create a text file with release information:

**File:** `QuickDish-v1.0-release-info.txt`

```
QuickDish Release Information
============================
Version: 1.0
Version Code: 1
Build Date: [Today's Date]
File Size: 9.50 MB
AAB File: QuickDish-v1.0-release.aab

Keystore Information:
- File: C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks
- Alias: key0
- Password: QuickDish2025ReleaseKey!

Notes:
- First release
- Ready for Google Play submission
```

## Folder Structure Example

```
C:\Users\Christin\Documents\QuickDish-Releases\
├── QuickDish-v1.0-release.aab
├── QuickDish-v1.0-release-info.txt
└── (Future releases will go here)
```

## Important Notes

1. **Keep the original:** Don't delete the original in `android/app/build/outputs/bundle/release/`
   - Android Studio might need it
   - But do save a backup elsewhere

2. **Version naming:** Use clear version numbers
   - v1.0 = First release
   - v1.1 = First update
   - v2.0 = Major update

3. **Multiple backups:** Save in at least 2 places
   - Local folder (primary)
   - Cloud storage (secondary)

4. **Keep keystore info:** Save the keystore information with the AAB
   - You'll need it for future updates
   - Store securely (password manager)

## Quick Checklist

- [ ] Create backup folder: `C:\Users\Christin\Documents\QuickDish-Releases\`
- [ ] Copy AAB file to backup folder
- [ ] Rename to: `QuickDish-v1.0-release.aab`
- [ ] Create info file with release details
- [ ] Upload to cloud storage (optional but recommended)
- [ ] Verify file size is still 9.50 MB

## Why This Matters

- **Future updates:** You'll need to reference this version
- **Rollback:** If something goes wrong, you can rollback
- **Documentation:** Shows your release history
- **Safety:** Multiple backups prevent data loss

