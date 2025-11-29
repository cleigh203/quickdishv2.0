# Android Submission Guide - QuickDish

## 📋 Pre-Submission Checklist

Before building and submitting, ensure you've completed:

- [x] ✅ API keys secured (environment variables)
- [x] ✅ Account deletion implemented
- [x] ✅ Android permissions configured
- [x] ✅ Deep linking configured
- [x] ✅ Crash reporting (Sentry) set up
- [ ] ⚠️ Privacy Policy & Terms URLs deployed and accessible
- [ ] ⚠️ Android App Links verification file deployed
- [ ] ⚠️ Test account deletion flow
- [ ] ⚠️ Test deep linking on device

---

## 🔨 Step 1: Build the Android App Bundle (AAB)

### Option A: Using Android Studio (Recommended)

1. **Open Android Studio**
   ```bash
   # Navigate to your project
   cd c:\Users\Christin\Documents\GitHub\quickdish
   ```

2. **Open the Android project**
   - In Android Studio: `File > Open`
   - Navigate to: `c:\Users\Christin\Documents\GitHub\quickdish\android`
   - Click "OK"

3. **Wait for Gradle sync** (may take a few minutes on first open)

4. **Build the Release Bundle**
   - Go to: `Build > Generate Signed Bundle / APK`
   - Select: **Android App Bundle**
   - Click: **Next**

5. **Create or Select Keystore**
   - If you don't have a keystore, create one:
     - Click "Create new..."
     - Fill in:
       - **Key store path**: Choose a secure location (e.g., `C:\Users\Christin\quickdish-keystore.jks`)
       - **Password**: Create a strong password (SAVE THIS!)
       - **Key alias**: `quickdish-key`
       - **Key password**: (can be same as keystore password)
       - **Validity**: 25 years (recommended)
       - **Certificate info**: Fill in your details
   - If you have a keystore, select it and enter passwords

6. **Select Build Variant**
   - Choose: **release**
   - Click: **Finish**

7. **Wait for build** (5-10 minutes)
   - The AAB file will be created at:
     `android/app/release/app-release.aab`

### Option B: Using Command Line

```bash
# Navigate to project root
cd c:\Users\Christin\Documents\GitHub\quickdish

# Build the web app first
npm run build

# Sync with Capacitor
npx cap sync android

# Build the AAB (requires keystore)
cd android
./gradlew bundleRelease

# Or if you need to create a keystore first:
# Follow the Android Studio steps above to create keystore
```

---

## 🔐 Step 2: Prepare Your Keystore (If Not Done)

**IMPORTANT:** Save your keystore file and passwords in a secure location. You'll need this for all future updates!

**Recommended Storage:**
- Password manager (1Password, LastPass, Bitwarden)
- Encrypted backup (USB drive in safe location)
- Cloud storage (encrypted, e.g., Google Drive with encryption)

**Keystore Info to Save:**
- Keystore file path
- Keystore password
- Key alias
- Key password

---

## 📱 Step 3: Test the Release Build

Before submitting, test the release build:

1. **Install on Device**
   ```bash
   # Build APK for testing (easier than AAB)
   cd android
   ./gradlew assembleRelease
   
   # Install on connected device
   adb install app/build/outputs/apk/release/app-release.apk
   ```

2. **Test Critical Features**
   - [ ] App launches successfully
   - [ ] Sign up / Sign in works
   - [ ] Recipe browsing works
   - [ ] Recipe detail view works
   - [ ] Save/unsave recipes
   - [ ] Meal planning
   - [ ] Shopping list
   - [ ] Premium subscription flow
   - [ ] Account deletion
   - [ ] Deep linking (click recipe URL in browser)

---

## 🚀 Step 4: Create Google Play Console Account

1. **Sign up for Google Play Console**
   - Go to: https://play.google.com/console
   - Sign in with your Google account
   - Pay the **$25 one-time registration fee**

2. **Create New App**
   - Click: **Create app**
   - Fill in:
     - **App name**: QuickDish
     - **Default language**: English (United States)
     - **App or game**: App
     - **Free or paid**: Free
     - **Declarations**: Check all that apply
   - Click: **Create app**

---

## 📝 Step 5: Complete Store Listing

### App Details

1. **App name**: QuickDish
2. **Short description** (80 characters max):
   ```
   Discover, save, and cook amazing recipes. Meal planning made easy.
   ```

3. **Full description** (4000 characters max):
   ```
   QuickDish is your all-in-one recipe companion. Discover thousands of delicious recipes, save your favorites, plan your meals, and generate shopping lists.

   FEATURES:
   • Browse thousands of recipes
   • Save your favorite recipes
   • AI-powered recipe generation
   • Meal planning calendar
   • Smart shopping list generator
   • Pantry management
   • Voice-controlled cooking mode
   • Barcode scanning for ingredients
   • Export recipes to PDF
   • Premium features for power users

   Perfect for home cooks, meal planners, and food enthusiasts.
   ```

### Graphics

**Required:**
- [ ] **App icon** (512x512 PNG, no transparency)
- [ ] **Feature graphic** (1024x500 PNG)
- [ ] **Screenshots** (at least 2, up to 8):
  - Phone screenshots (16:9 or 9:16)
  - Minimum: 320px width
  - Maximum: 3840px width

**Recommended Screenshots:**
1. Home/Discover page
2. Recipe detail view
3. Meal planning calendar
4. Shopping list
5. Cooking mode
6. Profile/Saved recipes

### Privacy Policy & Terms

1. **Privacy Policy URL**: `https://quickdish.co/privacy`
2. **Terms of Service URL**: `https://quickdish.co/terms`

**⚠️ IMPORTANT:** These URLs MUST be accessible before submission!

---

## ⚙️ Step 6: Configure App Content

### Content Rating

1. Go to: **Policy > App content**
2. Complete the **Content rating questionnaire**
3. Answer questions:
   - **User-generated content?** Yes (if users can add custom recipes)
   - **In-app purchases?** Yes (Premium subscription)
   - **Age-appropriate content?** Yes (recipes are for everyone)
4. Submit for rating (usually instant)

### Data Safety

1. Go to: **Policy > Data safety**
2. Answer questions about data collection:
   - **Personal info**: Email, name (for account)
   - **Financial info**: Payment info (Stripe, for premium)
   - **App activity**: Recipes viewed, saved, favorited
   - **Device or other IDs**: User ID
3. Explain data usage and sharing

---

## 📦 Step 7: Upload Your App Bundle

1. **Go to Release Management**
   - Navigate to: **Production > Create new release**

2. **Upload AAB File**
   - Click: **Upload**
   - Select: `android/app/release/app-release.aab`
   - Wait for upload and processing (5-10 minutes)

3. **Release Name**
   - Enter: `1.0.0` (or your version number)
   - Add release notes:
     ```
     Initial release of QuickDish!
     
     Features:
     - Recipe browsing and discovery
     - Save and organize favorite recipes
     - AI-powered recipe generation
     - Meal planning calendar
     - Smart shopping lists
     - Pantry management
     - Voice-controlled cooking mode
     ```

4. **Review Release**
   - Check all warnings/errors
   - Fix any issues before proceeding

---

## ✅ Step 8: Complete Pre-Launch Checklist

Before submitting for review:

- [ ] App bundle uploaded successfully
- [ ] Store listing complete (name, description, graphics)
- [ ] Privacy Policy URL accessible
- [ ] Terms of Service URL accessible
- [ ] Content rating completed
- [ ] Data safety form completed
- [ ] Age rating obtained
- [ ] App tested on real device
- [ ] All permissions explained
- [ ] In-app purchases configured (if applicable)

---

## 🎯 Step 9: Submit for Review

1. **Go to Dashboard**
   - Review all sections for completeness

2. **Submit for Review**
   - Click: **Submit for review** or **Start rollout to production**
   - Review will take **1-3 days** typically

3. **Monitor Status**
   - Check: **Dashboard** for review status
   - You'll receive email notifications

---

## 🔄 Step 10: After Approval

Once approved:

1. **App goes live** automatically (if you selected automatic rollout)
2. **Monitor reviews** and ratings
3. **Respond to user feedback**
4. **Monitor crash reports** in Sentry
5. **Track analytics** in Google Play Console

---

## 🐛 Troubleshooting

### Build Errors

**Error: "Keystore file not found"**
- Solution: Create keystore using Android Studio (Step 1, Option A)

**Error: "Gradle sync failed"**
- Solution: 
  ```bash
  cd android
  ./gradlew clean
  ./gradlew build
  ```

**Error: "AAB too large"**
- Solution: Check app size, optimize images, enable ProGuard

### Submission Errors

**Error: "Privacy Policy URL not accessible"**
- Solution: Deploy app to production, verify URLs work

**Error: "Missing content rating"**
- Solution: Complete content rating questionnaire

**Error: "Permissions not explained"**
- Solution: Add permission explanations in Data Safety form

---

## 📞 Support Resources

- **Google Play Console Help**: https://support.google.com/googleplay/android-developer
- **Android Developer Docs**: https://developer.android.com
- **Capacitor Docs**: https://capacitorjs.com/docs

---

## ✅ Final Checklist Before Submission

- [ ] AAB file built successfully
- [ ] Keystore saved securely
- [ ] App tested on real device
- [ ] Store listing complete
- [ ] Screenshots uploaded
- [ ] Privacy Policy URL: `https://quickdish.co/privacy` ✅
- [ ] Terms URL: `https://quickdish.co/terms` ✅
- [ ] Content rating completed
- [ ] Data safety form completed
- [ ] All permissions explained
- [ ] Release notes written
- [ ] Ready to submit!

---

**Good luck with your submission! 🚀**


