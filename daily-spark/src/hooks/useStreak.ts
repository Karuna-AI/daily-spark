import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useStreakStore } from '../stores/streakStore';
import { useAuthStore } from '../stores/authStore';
import { syncStreakToFirestore } from '../services/firebase/streak';

/**
 * Manages streak lifecycle:
 * - Calls checkAndUpdateStreak() on mount and when app foregrounds
 * - Syncs updated streak data to Firestore in the background
 */
export function useStreak() {
  const {
    current,
    longest,
    lastOpenedDate,
    earnedBadgeIds,
    newlyUnlockedBadge,
    likedSparkCount,
    shareCount,
    referralCount,
    sparksSeenTotal,
    checkAndUpdateStreak,
    clearNewBadge,
  } = useStreakStore();

  const { user } = useAuthStore();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const runCheck = () => {
    checkAndUpdateStreak();
    // Sync to Firestore in background (non-blocking)
    if (user) {
      syncStreakToFirestore(user.uid, {
        streak: { current, longest, lastOpenedDate },
        earnedBadgeIds,
        likedSparkCount,
        shareCount,
        referralCount,
        sparksSeenTotal,
      }).catch(() => {
        // silently ignore — will sync next time
      });
    }
  };

  useEffect(() => {
    // Run on first mount
    runCheck();

    // Run when app comes back to foreground
    const subscription = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === 'active'
        ) {
          runCheck();
        }
        appState.current = nextState;
      }
    );

    return () => subscription.remove();
  }, [user?.uid]); // re-bind when user changes

  return {
    streak: current,
    longestStreak: longest,
    earnedBadgeIds,
    earnedBadgeCount: earnedBadgeIds.length,
    newlyUnlockedBadge,
    clearNewBadge,
  };
}
