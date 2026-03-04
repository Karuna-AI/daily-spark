import { Share } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Spark } from '../types/spark';
import { Config } from '../constants/config';
import { useStreakStore } from '../stores/streakStore';

/** Share spark as a plain-text message */
export async function shareSpark(spark: Spark): Promise<void> {
  const message =
    `✨ Daily Spark — ${spark.topicLabel}\n\n` +
    `${spark.emoji} ${spark.text}\n\n` +
    `Get amazing sparks every day 👉 ${Config.APP_URL}`;

  const result = await Share.share(
    {
      message,
      title: 'Daily Spark ⚡',
    },
    {
      dialogTitle: 'Share this Spark',
    }
  );

  // Record share for badge tracking (only if user actually shared)
  if (result.action === Share.sharedAction) {
    useStreakStore.getState().recordShare();
  }
}

/**
 * Share spark as a branded image card.
 * @param captureUri - URI returned by ViewShot.capture()
 * @param spark - The spark being shared (for caption)
 */
export async function shareSparkAsImage(
  captureUri: string,
  spark: Spark
): Promise<void> {
  const isAvailable = await Sharing.isAvailableAsync();

  if (!isAvailable) {
    // Fallback to text share on platforms where Sharing API isn't available (web)
    await shareSpark(spark);
    return;
  }

  await Sharing.shareAsync(captureUri, {
    mimeType: 'image/png',
    dialogTitle: 'Share this Spark ⚡',
    UTI: 'public.png', // iOS
  });

  // Record share for badge tracking
  useStreakStore.getState().recordShare();
}
