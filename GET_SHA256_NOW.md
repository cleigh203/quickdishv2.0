# Get SHA-256 Fingerprint Now

## Quick Method - Copy & Paste This Command

Open **PowerShell** and run this command (replace with your actual keystore path and alias):

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
```

**If your keystore is in a different location or has a different alias, update the path and alias in the command above.**

## What Happens

1. The command will ask for your **keystore password**
2. Enter the password you created when making the keystore
3. You'll see output with certificate information
4. Look for the line that says: `SHA256: XX:XX:XX:XX:...`

## Example Output

You'll see something like this:

```
Alias name: quickdish-release-key
Creation date: [date]
Entry type: PrivateKeyEntry
Certificate chain length: 1
Certificate[1]:
Owner: CN=Your Name, OU=Organization...
Issuer: CN=Your Name, OU=Organization...
...
Certificate fingerprints:
         SHA1: 12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78
         SHA256: A1:B2:C3:D4:E5:F6:A7:B8:C9:D0:E1:F2:A3:B4:C5:D6:E7:F8:A9:B0:C1:D2:E3:F4:A5:B6:C7:D8:E9:F0:A1:B2
```

**Copy the entire SHA256 line** (everything after "SHA256: ")

## After You Get It

1. Copy the SHA256 value (with colons)
2. Remove all colons (`:`)
3. Convert to uppercase (if needed)
4. Update `assetlinks.json` with the formatted fingerprint

## If Command Doesn't Work

If you get an error, try the full path to keytool:

```powershell
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
```

