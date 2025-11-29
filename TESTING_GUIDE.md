# QuickDish Android App Testing Guide

## Pre-Submission Testing Checklist

### 1. Account Deletion Testing

**Test Steps:**
1. Create a test account
2. Add data to all features:
   - Save at least 3 recipes
   - Create a meal plan
   - Add items to pantry
   - Create a shopping list
   - Generate a custom recipe (if applicable)
3. Go to Profile → Delete Account
4. Confirm deletion
5. **Verify ALL data is removed:**
   - Check Supabase dashboard:
     - `saved_recipes` table - no records for user
     - `meal_plans` table - no records for user
     - `pantry_items` table - no records for user
     - `shopping_lists` table - no records for user
     - `generated_recipes` table - no records for user
     - `user_subscriptions` table - no records for user
     - `profiles` table - no record for user

**Expected Result:** All user data completely removed from database.

---

### 2. Deep Linking Testing

**Test Steps:**
1. Install app on Android device
2. Open browser on the same device
3. Navigate to: `https://quickdish.co/recipe/[any-recipe-id]`
4. Click the link

**Expected Result:** 
- App opens directly (no disambiguation dialog)
- Recipe detail page loads correctly
- App shows the correct recipe

**If it doesn't work:**
- Verify `assetlinks.json` is deployed and accessible
- Check SHA-256 fingerprint matches
- Clear app data and reinstall
- Wait a few minutes (Android caches verification)

---

### 3. Voice Search Testing

**Test on Search/Discover Page:**
1. Open Discover page
2. Click voice search button
3. Say: "chicken recipes"
4. **Expected:** Search automatically triggers with voice input

**Test on "What's in your fridge":**
1. Go to Generate page
2. Click "What's in your fridge" voice button
3. Say ingredients: "chicken, tomatoes, onions"
4. **Expected:** Voice input is captured and search triggers

**Test in Cooking Mode:**
1. Open a recipe
2. Click "Start Cooking"
3. Click "Start Voice Control"
4. **Expected:** 
   - Instructions are read aloud immediately
   - Voice commands work (next, previous, repeat)
   - "VOICE CONTROL ACTIVE" indicator shows correctly

---

### 4. PDF Export Testing

**Test on Android Device:**
1. Open any recipe
2. Click "Save to PDF"
3. **Expected:**
   - Native share dialog opens
   - Can save to Downloads
   - Can share via other apps
   - PDF file is generated correctly

---

### 5. Offline Functionality Testing

**Test Steps:**
1. Open app and browse recipes (loads data)
2. Enable Airplane Mode
3. **Expected:**
   - Previously loaded recipes still visible
   - Can view saved recipes
   - Can view meal plans
   - Error message shows when trying to load new data

---

### 6. Performance Testing

**App Startup:**
- **Target:** <3 seconds from app icon tap to usable screen
- **Test:** Cold start (after device restart)
- **Test:** Warm start (app was recently used)

**Recipe Loading:**
- **Target:** <2 seconds to load recipe list
- **Test:** On WiFi
- **Test:** On 4G/LTE
- **Test:** On slow 3G (use network throttling in Chrome DevTools)

**Memory Usage:**
- Monitor in Android Studio Profiler
- **Target:** <200MB RAM usage
- Test with multiple recipes open
- Test with meal plan loaded

---

### 7. Device Compatibility Testing

**Test on these Android versions:**
- [ ] Android 7.0 (API 24) - Minimum supported
- [ ] Android 10 (API 29)
- [ ] Android 13 (API 33)
- [ ] Android 14 (API 34)

**Test on these devices:**
- [ ] Samsung Galaxy (any model)
- [ ] Google Pixel (any model)
- [ ] OnePlus (if available)
- [ ] Tablet (if targeting tablets)

**Test on different screen sizes:**
- [ ] Small phone (<5")
- [ ] Medium phone (5-6")
- [ ] Large phone (6"+)
- [ ] Tablet (if applicable)

---

### 8. Feature Testing

#### Core Features
- [ ] User registration and login
- [ ] Recipe browsing
- [ ] Recipe search (text)
- [ ] Recipe search (voice)
- [ ] Recipe filtering by category
- [ ] Saving recipes
- [ ] Viewing saved recipes
- [ ] Recipe ratings
- [ ] Meal planning
- [ ] Pantry management
- [ ] Shopping list
- [ ] Cooking mode
- [ ] Voice control in cooking mode
- [ ] PDF export
- [ ] Profile management
- [ ] Account deletion

#### Edge Cases
- [ ] Empty states (no saved recipes, empty pantry, etc.)
- [ ] Network errors (show appropriate messages)
- [ ] Invalid recipe IDs (404 handling)
- [ ] Very long recipe names/descriptions
- [ ] Special characters in search
- [ ] Rapid button clicking (prevent double actions)

---

### 9. UI/UX Testing

**Visual Checks:**
- [ ] No text cut off
- [ ] Buttons not hidden behind navigation
- [ ] Safe area insets respected (notch, bottom bar)
- [ ] Dark mode works correctly
- [ ] Images load properly
- [ ] Loading states show correctly
- [ ] Error messages are clear

**Navigation:**
- [ ] Bottom navigation works
- [ ] Back button works correctly
- [ ] Deep links navigate correctly
- [ ] No broken links

---

### 10. Security Testing

- [ ] API keys not exposed in APK (check with APK analyzer)
- [ ] User data properly secured
- [ ] Authentication tokens stored securely
- [ ] No sensitive data in logs
- [ ] HTTPS used for all API calls

---

## Testing Tools

### Android Studio
- **Profiler:** Monitor CPU, memory, network
- **Layout Inspector:** Debug UI issues
- **Logcat:** View app logs

### ADB (Android Debug Bridge)
```bash
# Install app
adb install app-release.apk

# View logs
adb logcat

# Clear app data
adb shell pm clear com.quickdishco.app

# Test deep links
adb shell am start -a android.intent.action.VIEW -d "https://quickdish.co/recipe/123" com.quickdishco.app
```

### Network Throttling
- Use Chrome DevTools → Network tab → Throttling
- Or use Android Studio → Network Profiler

---

## Bug Reporting Template

When you find issues, document:

1. **Device:** Model, Android version
2. **Steps to Reproduce:** Detailed steps
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happens
5. **Screenshots/Logs:** If applicable
6. **Frequency:** Always, sometimes, once

---

## Sign-off Checklist

Before submitting to Google Play:

- [ ] All critical features tested
- [ ] Account deletion verified
- [ ] Deep linking works
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Works on minimum Android version (7.0)
- [ ] UI looks good on all screen sizes
- [ ] Offline functionality works
- [ ] Error handling is graceful

