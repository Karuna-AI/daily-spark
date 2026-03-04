import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from './config';

const PREMIUM_TOPIC_IDS = [
  'philosophy',
  'psychology',
  'astronomy',
  'ancientmysteries',
];

const REFERRALS_TO_UNLOCK_PREMIUM = 2;

/**
 * Generate a referral link for the user.
 * Format: https://dailyspark.app/join?ref={uid}&spark={sparkId}
 * Also writes a record to referrals/{uid}
 */
export async function generateReferralLink(
  uid: string,
  sparkId?: string
): Promise<string> {
  if (db) {
    const refDoc = doc(db, 'referrals', uid);
    await setDoc(
      refDoc,
      { uid, createdAt: serverTimestamp(), count: 0 },
      { merge: true }
    );
  }

  const base = 'https://dailyspark.app/join';
  const params = new URLSearchParams({ ref: uid });
  if (sparkId) params.append('spark', sparkId);
  return `${base}?${params.toString()}`;
}

/**
 * Record a new referral when a new user signs up via a referral link.
 * If referrer reaches REFERRALS_TO_UNLOCK_PREMIUM, unlocks premium topics for them.
 */
export async function recordReferral(
  referrerId: string,
  newUserId: string
): Promise<void> {
  if (!db) return;

  // Don't let users refer themselves
  if (referrerId === newUserId) return;

  const refDoc = doc(db, 'referrals', referrerId);
  await setDoc(
    refDoc,
    {
      count: increment(1),
      referredUids: arrayUnion(newUserId),
      lastReferralAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Check if referrer has hit the threshold
  const snap = await getDoc(refDoc);
  const count = (snap.data()?.count as number) ?? 0;

  if (count >= REFERRALS_TO_UNLOCK_PREMIUM) {
    // Unlock premium topics for the referrer
    const userRef = doc(db, 'users', referrerId);
    await updateDoc(userRef, {
      selectedTopics: arrayUnion(...PREMIUM_TOPIC_IDS),
      referralCount: count,
    });
  } else {
    // Just update the count
    const userRef = doc(db, 'users', referrerId);
    await updateDoc(userRef, { referralCount: count });
  }
}

/**
 * Get the referral count for a user.
 */
export async function getReferralCount(uid: string): Promise<number> {
  if (!db) return 0;
  const snap = await getDoc(doc(db, 'referrals', uid));
  return (snap.data()?.count as number) ?? 0;
}
