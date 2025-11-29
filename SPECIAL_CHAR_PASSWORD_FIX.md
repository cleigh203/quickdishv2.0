# Fixing Special Character Password Issues

Your password has special characters: `QuickDish!Android@App#Release$Key%2025`

These can cause issues in PowerShell. Try these solutions:

## Solution 1: Escape Special Characters

In PowerShell, some characters need to be escaped with backticks. Try:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass "QuickDish!Android@App#Release`$Key%2025"
```

Notice the `$` is escaped as `` `$ `` (backtick before dollar sign).

## Solution 2: Use Single Quotes

Try using single quotes instead of double quotes:

```powershell
keytool -list -v -keystore 'C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks' -alias quickdish-release-key -storepass 'QuickDish!Android@App#Release$Key%2025'
```

## Solution 3: Escape All Special Characters

PowerShell special characters that might need escaping: `$`, `` ` ``, `"`, `'`

Try this:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass 'QuickDish!Android@App#Release$Key%2025'
```

## Solution 4: Use Here-String (Most Reliable)

```powershell
$password = @'
QuickDish!Android@App#Release$Key%2025
'@
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key -storepass $password
```

## Solution 5: Type Manually When Prompted

Instead of using `-storepass`, let it prompt you and type manually:

```powershell
keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
```

Then when it asks for password, type: `QuickDish!Android@App#Release$Key%2025`

## Solution 6: Use Android Studio Terminal

The easiest might be to use Android Studio's built-in terminal:

1. In Android Studio: **View → Tool Windows → Terminal**
2. Run:
   ```powershell
   keytool -list -v -keystore "C:\Users\Christin\AndroidKeystores\quickdish-release-key.jks" -alias quickdish-release-key
   ```
3. When prompted, type the password manually

## Solution 7: Check if Password Has Hidden Characters

1. Open Notepad
2. Type the password: `QuickDish!Android@App#Release$Key%2025`
3. Make sure there are no extra spaces
4. Copy it
5. Try using it in the command

## Recommended: Try Solutions in This Order

1. **Solution 5** - Type manually when prompted (most reliable)
2. **Solution 6** - Use Android Studio terminal
3. **Solution 2** - Use single quotes
4. **Solution 4** - Use here-string

