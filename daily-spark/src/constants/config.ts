export const Config = {
  MAX_SPARKS_PER_DAY: parseInt(process.env.EXPO_PUBLIC_MAX_SPARKS_PER_DAY ?? '3', 10),
  DEDUP_WINDOW_DAYS: parseInt(process.env.EXPO_PUBLIC_DEDUP_WINDOW_DAYS ?? '90', 10),
  SWIPE_THRESHOLD_RATIO: 0.35, // fraction of screen width
  CARD_ROTATION_MAX_DEG: 20,
  SPARK_SOUND_FILE: require('../../assets/sounds/spark.mp3'),
  DEFAULT_NOTIFICATION_TIMES: ['08:00', '13:00', '19:00'],
  APP_SCHEME: 'dailyspark',
  APP_URL: 'https://dailyspark.app',
} as const;
