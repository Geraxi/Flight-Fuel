import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flightfuel.app',
  appName: 'FlightFuel',
  webDir: 'dist/public',
  server: {
    // For development, you can point to your server URL
    // For production, comment this out to use local bundle
    // url: 'http://localhost:5000',
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0a0e1a",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      iosSpinnerStyle: "small",
      spinnerColor: "#2ecc71",
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#0a0e1a",
    },
  },
};

export default config;
