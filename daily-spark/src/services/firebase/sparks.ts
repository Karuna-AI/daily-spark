import { httpsCallable } from 'firebase/functions';
import {
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db, functions } from './config';
import { Spark, SparkReaction } from '../../types/spark';

interface GetUserSparksResponse {
  sparks: Spark[];
}

// ─── Demo sparks shown when Cloud Functions aren't deployed yet ───────────────
const DEMO_SPARKS: Spark[] = [
  {
    id: 'demo_1',
    text: 'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible.',
    emoji: '🍯',
    topic: 'science.biology',
    topicLabel: 'Biology',
    parentTopic: 'Science & Nature',
    topicColor: '#1B5E20',
    topicColorEnd: '#388E3C',
    createdAt: new Date(),
    generatedDate: new Date().toISOString().split('T')[0],
    totalSeen: 0,
    totalLikes: 0,
    totalDislikes: 0,
  },
  {
    id: 'demo_2',
    text: 'The Eiffel Tower grows about 15 cm taller in summer because heat causes the iron to expand — and shrinks back in winter.',
    emoji: '🗼',
    topic: 'science.physics',
    topicLabel: 'Physics',
    parentTopic: 'Science & Nature',
    topicColor: '#311B92',
    topicColorEnd: '#4527A0',
    createdAt: new Date(),
    generatedDate: new Date().toISOString().split('T')[0],
    totalSeen: 0,
    totalLikes: 0,
    totalDislikes: 0,
  },
  {
    id: 'demo_3',
    text: "Otters hold hands while sleeping so they don't drift apart. This behavior is called \"rafting\" and it keeps families together.",
    emoji: '🦦',
    topic: 'fun.facts',
    topicLabel: 'Amazing Facts',
    parentTopic: 'Fun & Humor',
    topicColor: '#F57F17',
    topicColorEnd: '#F9A825',
    createdAt: new Date(),
    generatedDate: new Date().toISOString().split('T')[0],
    totalSeen: 0,
    totalLikes: 0,
    totalDislikes: 0,
  },
];

// ─── Fetch today's 3 sparks from Cloud Function ──────────────────────────────
export async function getUserSparks(uid: string): Promise<Spark[]> {
  // If Firebase Functions aren't configured, return demo sparks
  if (!functions) return DEMO_SPARKS;

  try {
    const callable = httpsCallable<{ uid: string }, GetUserSparksResponse>(
      functions,
      'getUserSparks'
    );
    const result = await callable({ uid });
    const sparks = result.data.sparks;
    // Fall back to demo sparks if function returns empty
    return sparks?.length > 0 ? sparks : DEMO_SPARKS;
  } catch {
    // Function not deployed yet → show demo sparks
    return DEMO_SPARKS;
  }
}

// ─── Record like/dislike feedback ────────────────────────────────────────────
export async function recordFeedback(
  uid: string,
  sparkId: string,
  topic: string,
  reaction: SparkReaction
): Promise<void> {
  if (!functions) return;
  try {
    const callable = httpsCallable(functions, 'recordFeedback');
    await callable({ uid, sparkId, topic, reaction });
  } catch {
    // Silently ignore if function not deployed
  }
}

// ─── Mark spark as seen (client-side optimistic update) ──────────────────────
export async function markSparkSeen(uid: string, sparkId: string): Promise<void> {
  if (!db) return;
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      seenSparkIds: arrayUnion(sparkId),
      seenSparkDates: arrayUnion(new Date().toISOString()),
    });
  } catch {
    // Silently ignore
  }
}
