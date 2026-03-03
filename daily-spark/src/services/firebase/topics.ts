import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export async function saveUserTopics(uid: string, selectedTopics: string[]): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    selectedTopics,
    topicsSetAt: serverTimestamp(),
    onboardingComplete: true,
  });
}

export async function getUserTopics(uid: string): Promise<string[]> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return [];
  return snap.data().selectedTopics ?? [];
}
