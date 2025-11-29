package com.quickdishco.app;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import java.io.File;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // NUCLEAR CACHE CLEAR - DELETE EVERYTHING
        WebView.setWebContentsDebuggingEnabled(true);
        
        // Delete cache directory
        try {
            File cacheDir = getCacheDir();
            deleteDir(cacheDir);
            File appCacheDir = new File(getFilesDir().getParent(), "cache");
            deleteDir(appCacheDir);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // Clear webview cache
        if (bridge != null && bridge.getWebView() != null) {
            bridge.getWebView().clearCache(true);
            bridge.getWebView().clearHistory();
            bridge.getWebView().clearFormData();
        }
    }
    
    private boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            if (children != null) {
                for (String child : children) {
                    boolean success = deleteDir(new File(dir, child));
                    if (!success) {
                        return false;
                    }
                }
            }
            return dir.delete();
        } else if (dir != null && dir.isFile()) {
            return dir.delete();
        }
        return false;
    }
}
