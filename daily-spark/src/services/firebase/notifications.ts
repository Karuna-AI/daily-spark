import { doc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export async function saveFCMToken(uid: string, fcmToken: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    'notifications.fcmToken': fcmToken,
    'notifications.enabled': true,
  });
}

export async function saveNotificationTimes(uid: string, times: string[]): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    'notifications.times': times,
  });
}

export async function disableNotifications(uid: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    'notifications.enabled': false,
  });
}
