import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './config';
import { UserProfile } from '../../types/user';
import { Config } from '../../constants/config';

export async function createOrUpdateUser(firebaseUser: User): Promise<void> {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // New user — create document
    const newUser: Partial<UserProfile> = {
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? 'Spark Fan',
      photoURL: firebaseUser.photoURL ?? undefined,
      provider: detectProvider(firebaseUser),
      selectedTopics: [],
      onboardingComplete: false,
      seenSparkIds: [],
      seenSparkDates: [],
      notifications: {
        times: Config.DEFAULT_NOTIFICATION_TIMES,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        enabled: false,
      },
      location: { enabled: false },
    };
    await setDoc(userRef, { ...newUser, createdAt: serverTimestamp() });
  } else {
    // Returning user — update last seen info only
    await setDoc(
      userRef,
      { displayName: firebaseUser.displayName, photoURL: firebaseUser.photoURL },
      { merge: true }
    );
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

function detectProvider(user: User): UserProfile['provider'] {
  const id = user.providerData[0]?.providerId;
  if (id === 'google.com') return 'google';
  if (id === 'facebook.com') return 'facebook';
  if (id === 'apple.com') return 'apple';
  return 'email';
}
