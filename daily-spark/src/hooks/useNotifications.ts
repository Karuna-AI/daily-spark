import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { saveFCMToken } from '../services/firebase/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(uid: string): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  // Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('sparks', {
      name: 'Daily Sparks',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFD700',
      sound: 'spark.wav',
    });
  }

  // Get Expo push token (used for testing; FCM token used in production)
  const tokenData = await Notifications.getExpoPushTokenAsync();
  const expoPushToken = tokenData.data;

  // Save to Firestore
  await saveFCMToken(uid, expoPushToken);
  return expoPushToken;
}

export function useNotificationDeepLink(onSparkNotification: (sparkId: string) => void) {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const sparkId = response.notification.request.content.data?.sparkId as string | undefined;
      if (sparkId) onSparkNotification(sparkId);
    });
    return () => subscription.remove();
  }, [onSparkNotification]);
}
