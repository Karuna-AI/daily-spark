import { doc, setDoc } from 'firebase/firestore';
import { db } from './config';

export interface StreakFirestoreData {
  streak: {
    current: number;
    longest: number;
    lastOpenedDate: string | null;
  };
  earnedBadgeIds: string[];
  likedSparkCount: number;
  shareCount: number;
  referralCount: number;
  sparksSeenTotal: number;
}

/**
 * Sync streak & badge data to Firestore.
 * Always uses merge:true so it doesn't overwrite other user fields.
 * Called in background — callers should not await this.
 */
export async function syncStreakToFirestore(
  uid: string,
  data: StreakFirestoreData
): Promise<void> {
  if (!db) return; // Firebase not configured (dev/preview mode)
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, data, { merge: true });
}
