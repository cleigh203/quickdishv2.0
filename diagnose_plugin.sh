#!/bin/bash

# QuickDish NativeWebView Plugin Diagnostic Script
# Run this from your project root directory

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     NativeWebView Plugin Diagnostic Tool                  ║"
echo "╔════════════════════════════════════════════════════════════╗"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0

echo -e "${BLUE}[1/8] Checking project structure...${NC}"
if [ ! -d "android" ]; then
    echo -e "${RED}✗ android/ directory not found!${NC}"
    echo "Run: npx cap add android"
    exit 1
fi
echo -e "${GREEN}✓ android/ directory exists${NC}"
echo ""

echo -e "${BLUE}[2/8] Checking Java source files...${NC}"
PLUGIN_PATH="android/app/src/main/java/com/quickdishco/app/NativeWebViewPlugin.java"
MAINACTIVITY_PATH="android/app/src/main/java/com/quickdishco/app/MainActivity.java"

if [ -f "$PLUGIN_PATH" ]; then
    echo -e "${GREEN}✓ NativeWebViewPlugin.java exists${NC}"
else
    echo -e "${RED}✗ NativeWebViewPlugin.java NOT FOUND${NC}"
    echo "  Expected: $PLUGIN_PATH"
    ERRORS=$((ERRORS+1))
fi

if [ -f "$MAINACTIVITY_PATH" ]; then
    echo -e "${GREEN}✓ MainActivity.java exists${NC}"
else
    echo -e "${RED}✗ MainActivity.java NOT FOUND${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

echo -e "${BLUE}[3/8] Checking plugin annotations...${NC}"
if grep -q "@CapacitorPlugin(name = \"NativeWebView\")" "$PLUGIN_PATH" 2>/dev/null; then
    echo -e "${GREEN}✓ @CapacitorPlugin annotation found${NC}"
else
    echo -e "${RED}✗ @CapacitorPlugin annotation missing or incorrect${NC}"
    ERRORS=$((ERRORS+1))
fi

if grep -q "extends Plugin" "$PLUGIN_PATH" 2>/dev/null; then
    echo -e "${GREEN}✓ Class extends Plugin${NC}"
else
    echo -e "${RED}✗ Class doesn't extend Plugin${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

echo -e "${BLUE}[4/8] Checking MainActivity registration...${NC}"
if grep -q "registerPlugin(NativeWebViewPlugin.class)" "$MAINACTIVITY_PATH" 2>/dev/null; then
    echo -e "${GREEN}✓ registerPlugin() call found${NC}"
else
    echo -e "${RED}✗ registerPlugin() call missing${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

echo -e "${BLUE}[5/8] Checking package declarations...${NC}"
PLUGIN_PACKAGE=$(grep "^package " "$PLUGIN_PATH" 2>/dev/null)
MAIN_PACKAGE=$(grep "^package " "$MAINACTIVITY_PATH" 2>/dev/null)

if [ "$PLUGIN_PACKAGE" == "package com.quickdishco.app;" ]; then
    echo -e "${GREEN}✓ Plugin package correct: $PLUGIN_PACKAGE${NC}"
else
    echo -e "${RED}✗ Plugin package incorrect: $PLUGIN_PACKAGE${NC}"
    ERRORS=$((ERRORS+1))
fi

if [ "$MAIN_PACKAGE" == "package com.quickdishco.app;" ]; then
    echo -e "${GREEN}✓ MainActivity package correct: $MAIN_PACKAGE${NC}"
else
    echo -e "${RED}✗ MainActivity package incorrect: $MAIN_PACKAGE${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

echo -e "${BLUE}[6/8] Cleaning build...${NC}"
cd android
./gradlew clean > /dev/null 2>&1
echo -e "${GREEN}✓ Build cleaned${NC}"
cd ..
echo ""

echo -e "${BLUE}[7/8] Building debug APK...${NC}"
echo "This may take a minute..."
cd android
./gradlew assembleDebug 2>&1 | grep -E "BUILD|error|Error|ERROR|FAILED" || true

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    echo "Run './gradlew assembleDebug' manually to see errors"
    ERRORS=$((ERRORS+1))
    cd ..
    exit 1
fi
cd ..
echo ""

echo -e "${BLUE}[8/8] Checking if plugin is in APK...${NC}"
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"

if [ -f "$APK_PATH" ]; then
    echo "Searching APK for NativeWebViewPlugin..."

    if unzip -l "$APK_PATH" 2>/dev/null | grep -i "NativeWebViewPlugin"; then
        echo -e "${GREEN}✓✓✓ SUCCESS! NativeWebViewPlugin found in APK!${NC}"
    else
        echo -e "${RED}✗✗✗ CRITICAL: NativeWebViewPlugin NOT in APK!${NC}"
        echo ""
        echo "The class compiled but wasn't included. This is very unusual."
        echo "Possible causes:"
        echo "  - Build configuration issue"
        echo "  - R8/ProGuard stripping (unlikely with minifyEnabled false)"
        echo "  - Capacitor sync issue"
        ERRORS=$((ERRORS+1))
    fi

    echo ""
    echo "All .dex files in APK:"
    unzip -l "$APK_PATH" 2>/dev/null | grep "\.dex$"
else
    echo -e "${RED}✗ APK not found at $APK_PATH${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    DIAGNOSTIC SUMMARY                      ║"
echo "╚════════════════════════════════════════════════════════════╝"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}"
    echo "✓ All checks passed!"
    echo "The plugin should work. Next steps:"
    echo "  1. Install APK: adb install -r $APK_PATH"
    echo "  2. Watch logs: adb logcat | grep -E 'MainActivity|NativeWebView'"
    echo "  3. Call plugin from JS: NativeWebView.open({ url: 'https://google.com' })"
    echo -e "${NC}"
else
    echo -e "${RED}"
    echo "✗ Found $ERRORS error(s)"
    echo "Fix the errors above and run this script again."
    echo -e "${NC}"
fi

