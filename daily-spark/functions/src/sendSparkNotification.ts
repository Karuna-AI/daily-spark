import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';

// This function runs every hour and sends notifications to users
// whose notification time matches the current UTC hour + their timezone offset.
// For simplicity in MVP: we store notification times in UTC in Firestore.
// The client should convert local time → UTC when saving.

export const sendSparkNotification = onSchedule(
  {
    schedule: '0 * * * *',   // Every hour on the hour
    timeZone: 'UTC',
    timeoutSeconds: 300,
    memory: '256MiB',
  },
  async () => {
    const db = admin.firestore();
    const messaging = admin.messaging();

    const currentHour = new Date().getUTCHours();
    const currentMinute = new Date().getUTCMinutes();
    // Match HH:00 format (top of hour)
    const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:00`;

    console.log(`[sendSparkNotification] Running for ${currentTimeStr} UTC`);

    // Find users with this notification time
    const usersSnap = await db
      .collection('users')
      .where('notifications.enabled', '==', true)
      .where('notifications.times', 'array-contains', currentTimeStr)
      .limit(500)
      .get();

    if (usersSnap.empty) {
      console.log('[sendSparkNotification] No users to notify at this time.');
      return;
    }

    console.log(`[sendSparkNotification] Sending to ${usersSnap.size} users`);

    // Pick a random recent spark for the preview (topic-agnostic for notification)
    const today = new Date().toISOString().split('T')[0];
    const previewSnap = await db
      .collection('sparks')
      .where('generatedDate', '==', today)
      .orderBy('wowFactor', 'desc')
      .limit(1)
      .get();

    const previewSpark = previewSnap.empty ? null : previewSnap.docs[0].data();
    const previewText = previewSpark
      ? `${previewSpark.emoji} ${(previewSpark.text as string).slice(0, 80)}…`
      : '✨ Your Daily Spark is ready!';

    const slotIndex = getSlotIndex(currentTimeStr);
    const notificationTitles = [
      '☀️ Morning Spark!',
      '🌤️ Afternoon Spark!',
      '🌙 Evening Spark!',
    ];
    const title = notificationTitles[slotIndex] ?? '⚡ Daily Spark!';

    const failedTokens: string[] = [];

    // Send in batches of 500 (FCM multicast limit)
    const tokens = usersSnap.docs
      .map((doc) => doc.data()?.notifications?.fcmToken as string | undefined)
      .filter((t): t is string => !!t);

    const chunkSize = 500;
    for (let i = 0; i < tokens.length; i += chunkSize) {
      const chunk = tokens.slice(i, i + chunkSize);
      try {
        const response = await messaging.sendEachForMulticast({
          tokens: chunk,
          notification: {
            title,
            body: previewText,
          },
          data: {
            type: 'daily_spark',
            slot: String(slotIndex + 1),
            deepLink: 'dailyspark://home',
          },
          apns: {
            payload: {
              aps: {
                sound: 'spark.wav',
                badge: 1,
                contentAvailable: true,
              },
            },
          },
          android: {
            priority: 'high',
            notification: {
              channelId: 'sparks',
              sound: 'spark',
              color: '#FFD700',
              icon: 'notification_icon',
            },
          },
        });

        const badTokens = chunk.filter((_, idx) => !response.responses[idx]?.success);
        failedTokens.push(...badTokens);

        console.log(
          `[sendSparkNotification] Chunk ${Math.floor(i / chunkSize) + 1}: ` +
          `${response.successCount} sent, ${response.failureCount} failed`
        );
      } catch (err) {
        console.error('[sendSparkNotification] Batch error:', err);
      }
    }

    // Clean up stale FCM tokens
    if (failedTokens.length > 0) {
      const cleanupBatch = db.batch();
      for (const token of failedTokens) {
        const staleUser = usersSnap.docs.find(
          (doc) => doc.data()?.notifications?.fcmToken === token
        );
        if (staleUser) {
          cleanupBatch.update(staleUser.ref, {
            'notifications.fcmToken': admin.firestore.FieldValue.delete(),
            'notifications.enabled': false,
          });
        }
      }
      await cleanupBatch.commit();
      console.log(`[sendSparkNotification] Cleaned up ${failedTokens.length} stale tokens`);
    }
  }
);

function getSlotIndex(timeStr: string): number {
  const hour = parseInt(timeStr.split(':')[0], 10);
  if (hour < 12) return 0;  // Morning
  if (hour < 17) return 1;  // Afternoon
  return 2;                  // Evening
}
