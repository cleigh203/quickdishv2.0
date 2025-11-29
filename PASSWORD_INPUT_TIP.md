# Password Input in PowerShell - It's Hidden!

## Normal Behavior ✅

When you type your password in PowerShell, **you won't see any characters**. This is **normal and secure** - passwords are hidden to protect them from shoulder surfing.

## What to Do

1. **Type your password** (even though you can't see it)
2. **Press Enter** when done
3. The command will continue

**Don't worry** - your typing is working, it's just invisible!

## Alternative: Pass Password in Command

If you prefer to see what you're typing, you can pass the password directly in the command:

### Method 1: Using -storepass Flag

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass "YOUR_PASSWORD_HERE"
```

**Replace `YOUR_PASSWORD_HERE` with your actual keystore password.**

**Note:** This shows your password in the command history, so be careful if others have access to your computer.

### Method 2: Using PowerShell Variable (More Secure)

```powershell
$password = "YOUR_PASSWORD_HERE"
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass $password
```

This is slightly more secure as it doesn't show in command history as clearly.

## Recommended: Just Type It (Hidden)

**Best practice:** Just type your password even though it's hidden:
1. Type the password (you won't see anything)
2. Press Enter
3. If password is correct, you'll see the certificate info
4. If password is wrong, you'll get an error and can try again

## Troubleshooting

### "Keystore was tampered with, or password was incorrect"
- You might have typed the password wrong (since you can't see it)
- Try typing it again slowly
- Make sure Caps Lock is off
- Check for typos

### Still Having Issues?
- Try the `-storepass` method above to see if password works
- Double-check you're using the correct keystore file path
- Make sure the alias name is correct

