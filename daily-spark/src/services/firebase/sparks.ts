import { httpsCallable } from 'firebase/functions';
import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  collection,
  addDoc,
} from 'firebase/firestore';
import { db, functions } from './config';
import { Spark, SparkReaction } from '../../types/spark';

interface GetUserSparksResponse {
  sparks: Spark[];
}

// ─── Fetch today's 3 sparks from Cloud Function ──────────────────────────────
export async function getUserSparks(uid: string): Promise<Spark[]> {
  const callable = httpsCallable<{ uid: string }, GetUserSparksResponse>(
    functions,
    'getUserSparks'
  );
  const result = await callable({ uid });
  return result.data.sparks;
}

// ─── Record like/dislike feedback ────────────────────────────────────────────
export async function recordFeedback(
  uid: string,
  sparkId: string,
  topic: string,
  reaction: SparkReaction
): Promise<void> {
  const callable = httpsCallable(functions, 'recordFeedback');
  await callable({ uid, sparkId, topic, reaction });
}

// ─── Mark spark as seen (client-side optimistic update) ──────────────────────
export async function markSparkSeen(uid: string, sparkId: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    seenSparkIds: arrayUnion(sparkId),
    seenSparkDates: arrayUnion(new Date().toISOString()),
  });
}
