# 🛍️ Shop Online Feature - Embedded Shopping Experience

## What This Feature Does

The "Shop Online" feature provides an **embedded shopping experience** where users:
1. Choose a grocery store (Walmart, Target, Kroger, etc.)
2. See the store website **embedded directly in QuickDish**
3. Shop for ingredients without leaving the app
4. Track progress at the bottom with "Got it" button
5. Automatically move to next ingredient
6. **No toggling between apps!**

## ✅ What's New - Embedded WebView

### 1. **Fully Embedded Store Website**
- Store website loads **inside QuickDish** using iframe
- Takes up full screen with controls at bottom
- No switching between apps or browsers
- Just like Instacart's shopping experience!

### 2. **Bottom Control Bar**
- Shows current item you're shopping for
- Tap to see full shopping list (slides up)
- "Got it" button advances to next item
- "Skip" if item not available
- Progress counter (3/10 items)

### 3. **Collapsible Shopping List**
- Tap bottom bar to see full list
- Check off completed items
- Jump to any item
- See progress at a glance
- Swipe down to dismiss

## 📱 How It Works

### User Flow:
1. User taps "Shop Online" on recipe
2. Selects store (Walmart, Target, etc.)
3. **Store website loads INSIDE QuickDish** 🎉
4. Bottom bar shows: "Looking for: 2 cups flour"
5. User searches and adds to cart in embedded store
6. User taps "Got it, Next" at bottom
7. Next item loads automatically in same view
8. Repeat - **never leave QuickDish!**

### Visual Layout:
```
┌─────────────────────────┐
│   [←] Walmart    [3/10] │ ← Header
├─────────────────────────┤
│                         │
│   [Walmart Website]     │ ← Embedded iframe
│   Fully interactive     │    (search, add to cart)
│                         │
│                         │
├─────────────────────────┤
│ Looking for (1/10)      │ ← Bottom control
│ 2 cups all-purpose flour│
│ [Skip] [Got it, Next ✓] │
└─────────────────────────┘
```

## 🏪 Supported Stores

Currently configured stores with search URLs:

| Store | URL | Status |
|-------|-----|--------|
| Walmart | walmart.com | ✅ Ready |
| Kroger | kroger.com | ✅ Ready |
| Albertsons | albertsons.com | ✅ Ready |
| Safeway | safeway.com | ✅ Ready |
| Target | target.com | ✅ Ready |
| Instacart | instacart.com | ✅ Ready |

## 🧪 Testing Steps

### On Android Device:
1. Build and install app
2. Go to any recipe
3. Tap menu (3 dots) → "Shop Online"
4. Select a store (try Walmart first)
5. Verify:
   - [ ] Store website loads INSIDE QuickDish
   - [ ] Can see Walmart search page
   - [ ] Can search and browse in embedded view
   - [ ] Bottom bar shows current ingredient
   - [ ] "Got it, Next" button visible
   - [ ] Tapping "Got it" loads next item
   - [ ] Progress counter updates (1/10, 2/10, etc.)
   - [ ] Can tap bottom bar to see full list
   - [ ] Shopping list slides up from bottom
   - [ ] Can jump to any item in list

### Expected Behavior:
- **First item**: Walmart loads with "flour" search inside QuickDish
- **User**: Adds flour to cart in embedded Walmart site
- **User**: Taps "Got it, Next" at bottom
- **Second item**: Walmart reloads with "sugar" search in same view
- **User**: No app switching, everything in QuickDish!
- Repeat for all items

## 🐛 Troubleshooting

### Store website doesn't load in iframe
**Possible Issue**: Some sites block being embedded in iframes (X-Frame-Options header)

**Solutions**:
1. Try different store (Walmart usually works)
2. If site blocks embedding, shows error message
3. May need proxy or native webview (future enhancement)

### Website loads but can't interact
**Issue**: Iframe sandbox restrictions

**Fix**: Already configured with proper sandbox permissions:
```javascript
sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
```

### Search doesn't auto-populate
- Some stores may not support URL search parameters
- User can manually search in embedded site
- Try different store

### Bottom bar doesn't show
- Check z-index conflicts
- Verify component is rendering
- Check browser console for errors

### Shopping list doesn't slide up
- Tap the bottom bar area
- Look for the chevron up icon
- Try tapping the ingredient text

## 📝 Configuration

### Add New Stores
Edit `src/types/shopping.ts`:

```typescript
{
  id: 'newstore',
  name: 'New Store Name',
  logo: 'https://logo-url.png',
  url: 'https://newstore.com/search?q=',
  deepLink: 'newstore://search?query=', // Optional
  available: true
}
```

### Customize Browser Theme
Edit in `src/utils/deepLinkUtils.ts`:

```typescript
await Browser.open({ 
  url: webUrl,
  presentationStyle: 'popover', // 'popover' | 'fullscreen'
  toolbarColor: '#10b981' // Change to any color
});
```

## ✅ Final Checklist

Before Android submission:
- [ ] Tested on real Android device
- [ ] Store websites load in iframe
- [ ] Can interact with embedded store site
- [ ] Bottom bar shows correctly
- [ ] "Got it, Next" button works
- [ ] Shopping list slides up/down
- [ ] Progress counter updates
- [ ] Can complete full shopping flow
- [ ] Try multiple stores (Walmart, Target, etc.)

## 🚀 Next Steps

### Ready to Test:
1. **Build**: `npm run build`
2. **Sync**: `npx cap sync android`
3. **Deploy**: Open in Android Studio and run
4. **Test**: Complete shopping flow
5. **Verify**: Try all stores

### Future Enhancements:
- [ ] Remember user's preferred store
- [ ] Auto-detect best store based on location
- [ ] Add more stores (Whole Foods, Trader Joe's, etc.)
- [ ] Deep link to actual apps (requires store API partnerships)
- [ ] Shopping cart totals
- [ ] Save shopping history

## 📚 Documentation Links

- **MDN iframe**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
- **iframe security**: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#security
- **Android WebView**: https://developer.android.com/guide/webapps/webview

---

## Quick Test Commands

```bash
# Build app
npm run build

# Sync to Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

Then test the Shop Online feature! 🎉

---

**Status**: ✅ Ready to test - no additional setup needed!
**Estimated testing time**: 10-15 minutes

