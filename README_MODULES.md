# Web vs Native Module Architecture

This project now has separate modules for web and native (Android/iOS) builds.

## Structure

```
src/
├── modules/
│   ├── web/          # Web-specific code (Vercel, browser APIs)
│   │   ├── analytics.ts
│   │   ├── storage.ts
│   │   └── index.ts
│   └── native/       # Native-specific code (Capacitor APIs)
│       ├── device.ts
│       ├── plugins.ts
│       └── index.ts
└── utils/
    └── platform.ts   # Platform detection utilities
```

## Build Configurations

### Web Build (Default)
- **Config**: `vite.config.web.ts`
- **Use case**: Vercel deployment, web browsers
- **Features**: Capacitor stubs, web-only optimizations
- **Command**: `npm run build` or `npm run dev`

### Native Build
- **Config**: `vite.config.native.ts`
- **Use case**: Android/iOS apps via Capacitor
- **Features**: Full Capacitor support, native plugins
- **Command**: `npm run build:native` or `npm run dev:native`

## Usage

### Platform Detection

```typescript
import { getPlatform, isWeb, isNative } from '@/utils/platform';

// Async check
const platform = await getPlatform(); // 'web' | 'android' | 'ios'

// Sync check (uses cache)
if (isWeb()) {
  // Web-only code
}

// Async native check
if (await isNative()) {
  // Native-only code
}
```

### Web Module Usage

```typescript
import { trackPageView, trackEvent } from '@/modules/web';
import { getLocalStorage, setLocalStorage } from '@/modules/web';

// Analytics (web only)
trackPageView('/recipes');
trackEvent('recipe_viewed', { recipeId: '123' });

// Storage (web only)
setLocalStorage('theme', 'dark');
const theme = getLocalStorage('theme');
```

### Native Module Usage

```typescript
import { getDeviceInfo, getBatteryInfo } from '@/modules/native';
import { openNativeBrowser, shareContent } from '@/modules/native';

// Device info (native only)
const deviceInfo = await getDeviceInfo();

// Native plugins (native only)
await openNativeBrowser('https://example.com');
await shareContent({ title: 'Recipe', url: 'https://...' });
```

## Build Scripts

```bash
# Web builds (for Vercel)
npm run dev              # Development (web)
npm run build            # Production (web)
npm run build:dev        # Development build (web)

# Native builds (for Android/iOS)
npm run dev:native       # Development (native)
npm run build:native     # Production (native)
npm run build:dev:native # Development build (native)

# Capacitor sync
npm run sync:android     # Sync to Android
npm run sync:ios         # Sync to iOS
```

## Migration Guide

### Moving Code to Web Module

If you have code that only works on web:

1. Move it to `src/modules/web/`
2. Add exports to `src/modules/web/index.ts`
3. Import using: `import { ... } from '@/modules/web'`

### Moving Code to Native Module

If you have code that only works on native:

1. Move it to `src/modules/native/`
2. Add exports to `src/modules/native/index.ts`
3. Import using: `import { ... } from '@/modules/native'`

### Conditional Imports

For code that needs different implementations:

```typescript
import { isWeb } from '@/utils/platform';

if (isWeb()) {
  // Web implementation
} else {
  // Native implementation
}
```

## Benefits

1. **Smaller Web Bundles**: Web builds don't include native-only code
2. **Clear Separation**: Easy to see what's web vs native
3. **Better Type Safety**: TypeScript knows what's available on each platform
4. **Easier Testing**: Test web and native code separately
5. **Cleaner Builds**: No Capacitor stubs needed in native builds

