import { useCallback } from 'react';
import { getUserSparks, recordFeedback, markSparkSeen } from '../services/firebase/sparks';
import { useSparksStore } from '../stores/sparksStore';
import { useAuthStore } from '../stores/authStore';
import { useStreakStore } from '../stores/streakStore';
import { SparkReaction } from '../types/spark';

export function useSparks() {
  const { user } = useAuthStore();
  const { todaySparks, currentIndex, isLoading, error, setTodaySparks, setLoading, setError, advanceCard } =
    useSparksStore();
  const { recordLike } = useStreakStore();

  const loadSparks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const sparks = await getUserSparks(user.uid);
      setTodaySparks(sparks);
    } catch (err) {
      setError('Could not load sparks. Try again!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleReaction = useCallback(
    async (reaction: SparkReaction) => {
      if (!user) return;
      const spark = todaySparks[currentIndex];
      if (!spark) return;

      // Record like in streak store (triggers badge checks)
      if (reaction === 'like') {
        recordLike(spark.topic);
      }

      // Optimistically advance
      advanceCard();

      // Mark seen + record feedback in parallel (background)
      Promise.all([
        markSparkSeen(user.uid, spark.id),
        recordFeedback(user.uid, spark.id, spark.topic, reaction),
      ]).catch((err) => console.warn('Feedback sync failed:', err));
    },
    [user, todaySparks, currentIndex, recordLike]
  );

  const currentSpark = todaySparks[currentIndex] ?? null;
  const isDone = currentIndex >= todaySparks.length && todaySparks.length > 0;

  return { todaySparks, currentSpark, currentIndex, isDone, isLoading, error, loadSparks, handleReaction };
}
