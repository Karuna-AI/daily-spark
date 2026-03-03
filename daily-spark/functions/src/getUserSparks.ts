import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

const MAX_SPARKS = 3;
const DEDUP_DAYS = 90;

export const getUserSparks = onCall(
  { maxInstances: 100 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in.');
    }

    const uid = request.auth.uid;
    const db = admin.firestore();

    // Get user profile
    const userSnap = await db.doc(`users/${uid}`).get();
    if (!userSnap.exists) {
      throw new HttpsError('not-found', 'User not found.');
    }

    const userData = userSnap.data()!;
    const selectedTopics: string[] = userData.selectedTopics ?? [];
    let seenSparkIds: string[] = userData.seenSparkIds ?? [];
    let seenSparkDates: string[] = userData.seenSparkDates ?? [];

    if (selectedTopics.length === 0) {
      return { sparks: [] };
    }

    // Prune 90-day window server-side
    const cutoff = Date.now() - DEDUP_DAYS * 24 * 60 * 60 * 1000;
    const filtered = seenSparkIds
      .map((id, i) => ({ id, date: seenSparkDates[i] ?? '' }))
      .filter(({ date }) => date && new Date(date).getTime() >= cutoff);
    seenSparkIds = filtered.map((f) => f.id);
    seenSparkDates = filtered.map((f) => f.date);

    // Query sparks for user's topics (Firestore 'in' supports up to 30 values)
    const topicsChunk = selectedTopics.slice(0, 30);
    const cutoffDate = new Date(cutoff).toISOString().split('T')[0];

    const sparksSnap = await db
      .collection('sparks')
      .where('topic', 'in', topicsChunk)
      .where('generatedDate', '>=', cutoffDate)
      .orderBy('generatedDate', 'desc')
      .orderBy('wowFactor', 'desc')
      .limit(200) // Fetch candidates
      .get();

    // Filter out seen sparks
    const candidates = sparksSnap.docs
      .filter((doc) => !seenSparkIds.includes(doc.id))
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    if (candidates.length === 0) {
      // Fallback: all sparks from topics regardless of seen date
      const fallbackSnap = await db
        .collection('sparks')
        .where('topic', 'in', topicsChunk)
        .orderBy('wowFactor', 'desc')
        .limit(MAX_SPARKS)
        .get();
      return {
        sparks: fallbackSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      };
    }

    // Pick MAX_SPARKS with variety (prefer different topics)
    const selected = pickWithTopicVariety(candidates, MAX_SPARKS, selectedTopics);

    // Update seen list
    const now = new Date().toISOString();
    await db.doc(`users/${uid}`).update({
      seenSparkIds: [...seenSparkIds, ...selected.map((s) => s.id)],
      seenSparkDates: [...seenSparkDates, ...selected.map(() => now)],
    });

    return { sparks: selected };
  }
);

function pickWithTopicVariety(
  candidates: Array<Record<string, unknown> & { id: string; topic: unknown }>,
  count: number,
  preferredOrder: string[]
): typeof candidates {
  const result: typeof candidates = [];
  const usedTopics = new Set<string>();

  // First pass: one per topic in preference order
  for (const topicId of preferredOrder) {
    if (result.length >= count) break;
    const match = candidates.find((c) => c.topic === topicId && !usedTopics.has(topicId));
    if (match) {
      result.push(match);
      usedTopics.add(topicId);
    }
  }

  // Second pass: fill remaining from best remaining candidates
  for (const candidate of candidates) {
    if (result.length >= count) break;
    if (!result.find((r) => r.id === candidate.id)) {
      result.push(candidate);
    }
  }

  return result.slice(0, count);
}
