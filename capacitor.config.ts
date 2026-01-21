import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eventmanage.app',
  appName: 'EVENTZ',
  webDir: 'build',

  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
