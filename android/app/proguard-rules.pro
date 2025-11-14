# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Capacitor WebView Bridge
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep Capacitor Plugins
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }

# Keep plugin methods that are called from JavaScript
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod <methods>;
}

# Keep JSON classes used by Capacitor
-keepclassmembers class * extends com.getcapacitor.JSObject {
    *;
}

# AndroidX
-keep class androidx.core.app.CoreComponentFactory { *; }

# Preserve line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
