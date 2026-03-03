import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

type Reaction = 'like' | 'dislike';

export const recordFeedback = onCall(
  { maxInstances: 50 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in.');
    }

    const { sparkId, topic, reaction } = request.data as {
      sparkId: string;
      topic: string;
      reaction: Reaction;
    };

    if (!sparkId || !topic || !['like', 'dislike'].includes(reaction)) {
      throw new HttpsError('invalid-argument', 'Invalid feedback data.');
    }

    const uid = request.auth.uid;
    const db = admin.firestore();
    const now = admin.firestore.FieldValue.serverTimestamp();

    // Write feedback document
    await db.doc(`feedback/${uid}_${sparkId}`).set({
      uid,
      sparkId,
      topic,
      reaction,
      timestamp: now,
    });

    // Update spark aggregate counters
    const sparkRef = db.doc(`sparks/${sparkId}`);
    await sparkRef.update({
      totalSeen: admin.firestore.FieldValue.increment(1),
      [reaction === 'like' ? 'totalLikes' : 'totalDislikes']:
        admin.firestore.FieldValue.increment(1),
    });

    return { success: true };
  }
);
