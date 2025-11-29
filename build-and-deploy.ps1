# Reliable Build and Deploy Script for QuickDish
# This script ensures a clean build every time by:
# 1. Clearing all caches
# 2. Verifying source file changes
# 3. Building with Vite
# 4. Syncing to Android
# 5. Building APK

param(
    [switch]$SkipBuild,
    [switch]$SkipSync,
    [switch]$SkipAPK
)

$ErrorActionPreference = "Stop"
$projectRoot = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "QuickDish Clean Build & Deploy Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clear all caches
Write-Host "[1/6] Clearing caches..." -ForegroundColor Yellow
if (Test-Path "$projectRoot\dist") {
    Remove-Item -Path "$projectRoot\dist" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Deleted dist folder" -ForegroundColor Green
}
if (Test-Path "$projectRoot\node_modules\.vite") {
    Remove-Item -Path "$projectRoot\node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Cleared Vite cache" -ForegroundColor Green
}
Start-Sleep -Seconds 1

# Step 2: Verify source file
Write-Host "[2/6] Verifying source file..." -ForegroundColor Yellow
$sourceFile = "$projectRoot\src\components\CookingMode.tsx"
if (-not (Test-Path $sourceFile)) {
    Write-Host "  ✗ ERROR: CookingMode.tsx not found!" -ForegroundColor Red
    exit 1
}
$fileContent = Get-Content $sourceFile -Raw
if ($fileContent -match "VERSION 1003") {
    Write-Host "  ✓ Source file has VERSION 1003" -ForegroundColor Green
} else {
    Write-Host "  ⚠ WARNING: Source file doesn't have VERSION 1003" -ForegroundColor Yellow
    Write-Host "    File may not have latest changes" -ForegroundColor Yellow
}

# Step 3: Build with Vite
if (-not $SkipBuild) {
    Write-Host "[3/6] Building with Vite..." -ForegroundColor Yellow
    Set-Location $projectRoot
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Build failed!" -ForegroundColor Red
        exit 1
    }
    
    # Verify build output
    $cookingModeFiles = Get-ChildItem "$projectRoot\dist\assets" -Filter "CookingMode-*.js" -ErrorAction SilentlyContinue
    if ($cookingModeFiles) {
        $latestFile = $cookingModeFiles | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        Write-Host "  ✓ Build complete: $($latestFile.Name)" -ForegroundColor Green
        
        # Check if file contains our version marker
        $buildContent = Get-Content $latestFile.FullName -Raw -ErrorAction SilentlyContinue
        if ($buildContent -match "VERSION 1003") {
            Write-Host "  ✓ Build contains VERSION 1003" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ WARNING: Build may not contain latest changes" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ⚠ WARNING: Could not find CookingMode bundle in dist" -ForegroundColor Yellow
    }
} else {
    Write-Host "[3/6] Skipping build (--SkipBuild)" -ForegroundColor Gray
}

# Step 4: Sync to Android
if (-not $SkipSync) {
    Write-Host "[4/6] Syncing to Android..." -ForegroundColor Yellow
    Set-Location $projectRoot
    npx cap sync android
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Sync failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ Sync complete" -ForegroundColor Green
} else {
    Write-Host "[4/6] Skipping sync (--SkipSync)" -ForegroundColor Gray
}

# Step 5: Build APK
if (-not $SkipAPK) {
    Write-Host "[5/6] Building APK..." -ForegroundColor Yellow
    Set-Location "$projectRoot\android"
    .\gradlew clean assembleDebug
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ APK build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ APK build complete" -ForegroundColor Green
} else {
    Write-Host "[5/6] Skipping APK build (--SkipAPK)" -ForegroundColor Gray
}

# Step 6: Summary
Write-Host "[6/6] Build Summary" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Uninstall old app: adb uninstall com.quickdish.app" -ForegroundColor White
Write-Host "  2. Install new APK: adb install android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host ""

Set-Location $projectRoot







