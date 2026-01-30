import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eventmanage.app',
  appName: 'EVENTZ',
  webDir: 'build',

  server: {
    url: 'https://event-manager-ui-two.vercel.app', // Points to live version
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;
