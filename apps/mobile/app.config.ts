import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Cycle Hacker',
  slug: 'cyclehacker',
  scheme: 'cyclehacker',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.cyclehacker.app',
  },
  android: {
    package: 'com.cyclehacker.app',
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
