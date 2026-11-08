import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bmc.radiotrackpro',
  appName: 'RadioTrack Pro',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      backgroundColor: '#0f172a',
      showSpinner: false
    },
    StatusBar: {
      backgroundColor: '#0f172a',
      style: 'DARK'
    }
  }
};

export default config;
