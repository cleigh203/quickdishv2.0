# How to Get SHA-256 Fingerprint for Android App Links

## Quick Method (Android Studio)

1. **Open Android Studio**
2. **Open your project** (`android` folder)
3. **Build → Generate Signed Bundle / APK**
4. Select your keystore (or create one if you don't have one)
5. **The SHA-256 fingerprint will be shown** in the signature information dialog

## Command Line Method

### For Debug Keystore (Testing)
```powershell
# Windows PowerShell
keytool -list -v -keystore $env:USERPROFILE\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### For Release Keystore (Production)
```powershell
# Replace with your actual keystore path and alias
keytool -list -v -keystore "C:\path\to\your\keystore.jks" -alias your-key-alias
```

## What to Look For

In the output, find the line that says:
```
SHA256: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
```

**Copy this entire string** (with colons), then:
1. Remove all colons (`:`)
2. Convert to uppercase
3. Paste into `public/.well-known/assetlinks.json`

## Example

If you see:
```
SHA256: A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2:A3:B4:C5:D6:E7:F8:A9:B0:C1:D2:E3:F4:A5:B6:C7:D8:E9:F0:A1:B2
```

Use in assetlinks.json:
```json
"sha256_cert_fingerprints": [
  "A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2"
]
```

## Important Notes

- **Debug vs Release:** You may need different fingerprints for testing vs production
- **Multiple Keys:** If you have multiple signing keys, add all fingerprints to the array
- **No Colons:** The fingerprint in `assetlinks.json` must NOT have colons

