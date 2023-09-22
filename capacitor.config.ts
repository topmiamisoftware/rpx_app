import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'SpotBie',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    url: 'http://10.0.0.222:8100',
    cleartext: true,
  },
};

export default config;
