import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Daily Spark',
  slug: 'daily-spark',
  version: '1.0.0',
  runtimeVersion: {
    policy: 'appVersion',
  },
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'dailyspark',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0D0D1A',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.dailyspark.app',
    buildNumber: '1',
    googleServicesFile: process.env.GOOGLE_SERVICES_PLIST ?? './GoogleService-Info.plist',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'Daily Spark uses your approximate location to personalize facts with local events and news.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'Daily Spark uses your approximate location to personalize facts with local events and news.',
      NSUserTrackingUsageDescription:
        'Daily Spark does not track you. This permission is only used by Firebase analytics.',
      UIBackgroundModes: ['fetch', 'remote-notification'],
    },
    entitlements: {
      'com.apple.developer.applesignin': ['Default'],
    },
    privacyManifests: {
      NSPrivacyAccessedAPITypes: [
        {
          NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
          NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
        },
      ],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#0D0D1A',
    },
    package: 'com.dailyspark.app',
    versionCode: 1,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
    permissions: [
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
      'POST_NOTIFICATIONS',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'single-page-app',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#0D0D1A',
        image: './assets/images/splash.png',
        imageWidth: 200,
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/notification-icon.png',
        color: '#FFD700',
        // Note: For iOS notification sound, convert spark.mp3 → spark.caf
        // using: ffmpeg -i assets/sounds/spark.mp3 assets/sounds/spark.caf
        // Then add: sounds: ['./assets/sounds/spark.caf']
        androidMode: 'default',
      },
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Daily Spark uses your approximate location to personalize sparks with local news.',
      },
    ],
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/messaging',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '307141f5-abf1-48b8-897a-1cb1ff1b7652',
    },
  },
});
