import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quickdishco.app',
  appName: 'QuickDish',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    BarcodeScanner: {
      "lensFacing": "back"
    },
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
