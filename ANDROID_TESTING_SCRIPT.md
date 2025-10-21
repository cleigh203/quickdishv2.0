# 🧪 QuickDish - Android Testing Script

## 🚀 Run This Today on Your Android Device

### Build & Install
```bash
npm run build
npx cap sync android
npx cap open android
```

Then in Android Studio: Run → Run 'app' on your device

---

## ✅ CRITICAL TESTS (Must Pass)

### 1. App Launch & Navigation (5 min)
- [ ] App launches without crashing
- [ ] Bottom navigation works (tap each tab)
- [ ] Back button works on each screen
- [ ] App doesn't crash when minimized and reopened
- [ ] Swipe back gesture works (if enabled)

### 2. Recipe Browsing (5 min)
- [ ] Home page loads recipes
- [ ] Images load correctly
- [ ] Scroll is smooth (no lag)
- [ ] Tap on a recipe → detail page opens
- [ ] Recipe detail shows:
  - [ ] Image
  - [ ] Ingredients
  - [ ] Instructions
  - [ ] Start Cooking button

### 3. Cooking Mode (10 min)
- [ ] "Start Cooking" button works
- [ ] Shows step 1 correctly
- [ ] "Next" button works
- [ ] "Back" button works
- [ ] Progress bar updates
- [ ] Can exit cooking mode
- [ ] Timer button appears when step mentions time
- [ ] Timer countdown works
- [ ] Timer alert works when done
- [ ] Voice control button appears
- [ ] Can toggle voice on/off without crash

### 4. Search & Filter (3 min)
- [ ] Search bar works
- [ ] Can type in search
- [ ] Results update
- [ ] Filter by dietary tags works
- [ ] Clear filters works

### 5. User Features (5 min)
- [ ] Can favorite a recipe
- [ ] Favorites appear in Saved tab
- [ ] Profile page loads
- [ ] Can edit profile (if applicable)
- [ ] Settings work

---

## 📱 ANDROID-SPECIFIC TESTS (Must Pass)

### Status Bar & Navigation
- [ ] Status bar is visible (not hidden)
- [ ] Status bar color matches app theme
- [ ] Navigation bar doesn't overlap content
- [ ] Safe area insets work on all screens
- [ ] Notch/cutout doesn't hide content

### Keyboard
- [ ] Keyboard appears when tapping search
- [ ] Keyboard hides when done
- [ ] Content scrolls when keyboard is open
- [ ] No overlapping with keyboard

### Permissions
- [ ] Microphone permission prompt appears when enabling voice
- [ ] Can deny permission - app doesn't crash
- [ ] Can accept permission - voice works (or shows it tried)
- [ ] Permission explanation is clear

### Performance
- [ ] App feels responsive (< 1 sec per action)
- [ ] Scrolling is smooth
- [ ] Images load quickly
- [ ] No freezing or lag
- [ ] Back button is responsive

---

## ⚠️ KNOWN ISSUES TO VERIFY

### Voice Control
- [ ] Does it work at all?
- [ ] Does it crash the app?
- [ ] Can you turn it off?

**Decision:** 
- If it works: ✅ Keep it
- If it's buggy but doesn't crash: ⚠️ Mark as "Beta" feature
- If it crashes: ❌ Remove or hide for v1.0

---

## 🐛 BUG TESTING

### Try to Break It
- [ ] Rapid tap buttons (stress test)
- [ ] Rotate device while in cooking mode
- [ ] Switch to another app mid-recipe
- [ ] Turn off internet, then browse
- [ ] Search with special characters: @#$%
- [ ] Try very long recipe names
- [ ] Open 10+ recipes in a row

### Network Tests
- [ ] Works on WiFi
- [ ] Works on mobile data
- [ ] Handles offline gracefully (shows error)
- [ ] Reconnects when internet is back

---

## 📸 SCREENSHOT CHECKLIST

Take these screenshots for Play Store:

### Phone Screenshots (Required - at least 2)
1. [ ] **Home screen** - showing recipe grid
2. [ ] **Recipe detail** - showing ingredients & image
3. [ ] **Cooking mode** - showing step-by-step
4. [ ] **Search/filter** - showing search in action
5. [ ] **Favorites** - showing saved recipes

**How to take screenshots:**
- Power + Volume Down on most Android phones
- Screenshots should be:
  - Clear and sharp
  - Show real content (not lorem ipsum)
  - Light mode preferred (unless dark theme is main)
  - No notification bar clutter

---

## ✅ FINAL CHECKLIST BEFORE PLAY STORE

### Build Quality
- [ ] Release build works same as debug
- [ ] No console errors visible
- [ ] No test data visible
- [ ] All placeholder text replaced
- [ ] Version number is 1.0.0

### Content Check
- [ ] Recipes load correctly
- [ ] Images are appropriate
- [ ] No offensive content
- [ ] No placeholder text visible
- [ ] Proper grammar in app text

### Legal Requirements
- [ ] Privacy policy URL works: [ADD URL]
- [ ] Terms of service URL works: [ADD URL]
- [ ] Contact email is set: [ADD EMAIL]
- [ ] Developer name is correct

---

## 🚨 SHOW-STOPPER BUGS

**If you find ANY of these, must fix before submission:**

❌ **App crashes on launch**
❌ **Can't browse recipes**
❌ **Can't open recipe details**
❌ **Cooking mode completely broken**
❌ **Back button doesn't work**
❌ **Severe UI overlap on your device**

---

## 💡 NICE-TO-HAVE (Can ship without)

These can be fixed in v1.1:
- Voice control not working perfectly
- Minor UI alignment issues
- Small performance hiccups
- Missing some edge case handling
- Translations (if not ready)

---

## 📝 TEST RESULTS

### Your Device:
- **Model:** _________________
- **Android Version:** _________________
- **Screen Size:** _________________

### Test Summary:
- **Passed:** _____ / 30 tests
- **Failed:** _____ tests
- **Crashes:** _____ (list which features)
- **Critical Issues:** _________________
- **Minor Issues:** _________________

### Ready to Submit?
- [ ] ✅ YES - All critical tests pass
- [ ] ⚠️ ALMOST - Minor issues only
- [ ] ❌ NO - Critical bugs found

---

## 🔄 NEXT STEPS

### If Ready:
1. Build release AAB
2. Take screenshots
3. Write Play Store description
4. Submit for review

### If Not Ready:
1. List all bugs found
2. Prioritize (critical vs minor)
3. Fix critical bugs
4. Re-test
5. Repeat until ready

---

**Good luck testing! 🚀**

**Estimated testing time:** 30-45 minutes for thorough testing

