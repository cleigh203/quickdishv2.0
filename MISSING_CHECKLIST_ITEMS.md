# Missing Checklist Items for Google Play Submission

## 🚨 CRITICAL (Must Do Before Submission)

### 1. Verify Privacy Policy & Terms URLs Online
- [ ] Deploy app to production
- [ ] Verify `https://quickdish.co/privacy` is accessible
- [ ] Verify `https://quickdish.co/terms` is accessible
- [ ] Add both URLs to Google Play Console
- [ ] Test URLs from different devices/networks

### 2. Create .env.example File
**Status:** ✅ CREATED
- [x] Create `.env.example` in project root ✅
- [x] Document all required environment variables ✅
- [x] Includes Supabase, Sentry, and version variables ✅
- [ ] Verify `.env` is in `.gitignore` (should already be)

### 3. Android App Links Verification
**Status:** ✅ TEMPLATE CREATED (Needs Fingerprint)
- [x] Create `/.well-known/assetlinks.json` template ✅
- [x] Template created in `public/.well-known/assetlinks.json` ✅
- [x] Setup guide created: `ANDROID_APP_LINKS_SETUP.md` ✅
- [ ] Get SHA-256 fingerprint from your keystore
- [ ] Update `assetlinks.json` with fingerprint
- [ ] Deploy to domain: `https://quickdish.co/.well-known/assetlinks.json`
- [ ] Test verification using: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://quickdish.co&relation=delegate_permission/common.handle_all_urls

### 4. Test Account Deletion Flow
- [ ] Create test account
- [ ] Add data: saved recipes, meal plans, pantry items, shopping lists, generated recipes
- [ ] Delete account via Profile settings
- [ ] Verify ALL data is removed from database
- [ ] Check all tables: `saved_recipes`, `meal_plans`, `generated_recipes`, `pantry_items`, `shopping_lists`, `user_subscriptions`, `profiles`

### 5. Test Deep Linking
- [ ] Build and install app on Android device
- [ ] Click recipe link in browser: `https://quickdish.co/recipe/{id}`
- [ ] Verify app opens to correct recipe
- [ ] Test from different browsers (Chrome, Firefox, Samsung Internet)
- [ ] Test with app not installed (should open in browser)

---

## ⚠️ HIGH PRIORITY (Strongly Recommended)

### 6. Set Up Crash Reporting
**Status:** ✅ COMPLETE (Needs DSN Configuration)
- [x] Choose service: Sentry ✅
- [x] Install SDK: `@sentry/react`, `@sentry/capacitor` ✅
- [x] Configure for Android ✅
- [x] Set up error boundaries in React ✅
- [x] User context tracking ✅
- [ ] **Action Required:** Create Sentry account at https://sentry.io
- [ ] **Action Required:** Add `VITE_SENTRY_DSN` to production environment
- [ ] Test error reporting in production
- **Why:** Critical for finding bugs users encounter in production

### 7. Test on Multiple Android Devices
- [ ] Android 7.0 (Nougat) - minimum supported
- [ ] Android 10 (Q)
- [ ] Android 13 (Tiramisu)
- [ ] Android 14 (Upside Down Cake)
- [ ] Different screen sizes (phone, tablet)
- [ ] Different manufacturers:
  - [ ] Samsung (most common)
  - [ ] Google Pixel
  - [ ] OnePlus
  - [ ] Xiaomi (if targeting international)

### 8. Test Network Conditions
- [ ] Slow 3G connection
- [ ] Intermittent WiFi
- [ ] Completely offline
- [ ] VPN enabled
- [ ] Test error messages when offline

### 9. Check App Size
- [ ] Build release APK/AAB
- [ ] Check file size (should be <150MB for better download rates)
- [ ] If too large:
  - [ ] Optimize images
  - [ ] Remove unused dependencies
  - [ ] Enable ProGuard/R8 code shrinking
  - [ ] Use Android App Bundle (AAB) instead of APK

### 10. Test Critical User Flows
- [ ] Sign up → Verify email → Login
- [ ] Search recipes → View detail → Save to favorites
- [ ] Add to meal plan → Generate shopping list
- [ ] Subscribe to premium → Verify features unlock
- [ ] Voice search → Results display
- [ ] Barcode scan → Add to pantry
- [ ] Export recipe to PDF
- [ ] Delete account

---

## 📋 MEDIUM PRIORITY (Should Do Soon)

### 11. Age Rating Questionnaire
- [ ] Complete Google Play Console age rating questionnaire
- [ ] Answer questions about:
  - User-generated content? (if users can add recipes)
  - In-app purchasing? (yes - premium subscription)
  - Age-appropriate content? (recipes are generally Everyone)
- [ ] Expected rating: **Everyone** or **Teen**

### 12. Content Rights Verification
- [ ] Verify you have rights to all recipe content
- [ ] Verify you have rights to all images
- [ ] Check for proper attribution if required
- [ ] Ensure no copyrighted material is used without permission
- [ ] Document sources of recipe content

### 13. Server-Side Account Deletion
**Status:** ⚠️ RECOMMENDED
- [ ] Create Supabase Edge Function to delete auth user
- [ ] Call from client-side account deletion
- [ ] Ensures complete cleanup (prevents orphaned auth records)
- [ ] Current: Client-side only (works but not complete)

### 14. Database Backups
- [ ] Set up automated Supabase backups
- [ ] Configure backup schedule (daily recommended)
- [ ] Test restore process
- [ ] Document backup retention policy
- [ ] Set up alerts for backup failures

### 15. Supabase Monitoring & Alerts
- [ ] Set up Supabase usage monitoring
- [ ] Configure alerts for:
  - Database size approaching limits
  - Bandwidth approaching limits
  - Storage approaching limits
  - High error rates
- [ ] Monitor daily active users
- [ ] Track API call volumes

### 16. Offline Functionality
**Status:** ⚠️ LIMITED
- [ ] Document what works offline:
  - [ ] View saved recipes (if cached)
  - [ ] View meal plans (if cached)
  - [ ] View shopping lists (if cached)
- [ ] Document what doesn't work offline:
  - [ ] Search new recipes
  - [ ] Generate AI recipes
  - [ ] Sync data
- [ ] Add "No connection" message when offline
- [ ] Consider caching recently viewed recipes

---

## 📊 LOW PRIORITY (Nice to Have)

### 17. A/B Testing Framework
- [ ] Set up A/B testing service (if planning feature tests)
- [ ] Plan for gradual feature rollouts
- [ ] Consider feature flags

### 18. Version Management Strategy
- [ ] Plan version numbering (1.0.0, 1.0.1, 1.1.0, 2.0.0)
- [ ] Document update strategy
- [ ] Plan for forced updates (if needed for critical bugs)
- [ ] Consider backward compatibility

### 19. Analytics Tracking
**Status:** ✅ PARTIALLY SET UP
- [x] Vercel Analytics (basic)
- [ ] Set up detailed event tracking:
  - [ ] Recipe views
  - [ ] Premium conversions
  - [ ] Feature usage
  - [ ] Error rates
- [ ] Set up conversion funnels

### 20. Performance Optimization
- [ ] Test app startup time (should be <3 seconds)
- [ ] Test recipe loading performance
- [ ] Optimize image loading
- [ ] Implement lazy loading where appropriate
- [ ] Test on low-end devices

### 21. Security Audit
- [ ] Review all API endpoints
- [ ] Check for SQL injection vulnerabilities
- [ ] Verify authentication is secure
- [ ] Check for XSS vulnerabilities
- [ ] Review third-party dependencies for vulnerabilities

---

## 📝 GOOGLE PLAY CONSOLE SETUP

### Store Listing
- [ ] App name: QuickDish
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Screenshots (at least 2, up to 8)
- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512)
- [ ] Promotional video (optional)

### Content Rating
- [ ] Complete age rating questionnaire
- [ ] Submit for rating

### Pricing & Distribution
- [ ] Set app as free or paid
- [ ] Select countries for distribution
- [ ] Set up in-app purchases (premium subscription)

### App Access
- [ ] Set up testing tracks (Internal, Closed, Open)
- [ ] Upload first build to Internal testing
- [ ] Test with internal testers

---

## ✅ SUMMARY

**Critical Items:** 5  
**High Priority:** 6  
**Medium Priority:** 6  
**Low Priority:** 5  

**Total Missing Items:** 22

**Estimated Time to Complete:**
- Critical: 2-3 hours
- High Priority: 4-6 hours
- Medium Priority: 6-8 hours
- Low Priority: 8-10 hours

**Minimum for Submission:** Complete all Critical items + High Priority items 6-10

---

## 🎯 RECOMMENDED ORDER

1. **Week 1: Critical Items**
   - Verify Privacy/Terms URLs
   - Create .env.example
   - Test account deletion
   - Test deep linking
   - Set up Android App Links verification

2. **Week 2: High Priority**
   - Set up crash reporting
   - Test on multiple devices
   - Test network conditions
   - Check app size
   - Test critical user flows

3. **Week 3: Medium Priority**
   - Complete age rating
   - Verify content rights
   - Set up server-side account deletion
   - Set up database backups
   - Set up monitoring

4. **Week 4: Polish & Submit**
   - Complete low priority items
   - Final testing
   - Submit to Google Play Console

