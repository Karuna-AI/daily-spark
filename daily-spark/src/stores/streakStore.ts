import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BadgeDefinition, BadgeStats } from '../types/streak';
import { BADGE_DEFINITIONS } from '../constants/badges';

const TODAY = () => new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
const YESTERDAY = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

interface StreakState {
  // Streak
  current: number;
  longest: number;
  lastOpenedDate: string | null;

  // Badges
  earnedBadgeIds: string[];
  newlyUnlockedBadge: BadgeDefinition | null; // triggers modal

  // Stats for badge checking
  likedSparkCount: number;
  seenSparkCountByTopic: Record<string, number>; // topicId → count
  shareCount: number;
  referralCount: number;
  sparksSeenTotal: number;
  completedDaysInARow: number;

  // Actions
  checkAndUpdateStreak: () => BadgeDefinition[];
  recordLike: (topicId: string) => BadgeDefinition[];
  recordShare: () => BadgeDefinition[];
  recordReferral: () => BadgeDefinition[];
  recordTopicSeen: (topicId: string) => void;
  recordSparkSeen: () => void;
  clearNewBadge: () => void;
  grantEarlyAdopter: () => void;
}

/** Check which new badges were just unlocked given updated stats */
function checkNewBadges(
  stats: BadgeStats,
  alreadyEarned: string[]
): BadgeDefinition[] {
  const earned = new Set(alreadyEarned);
  return BADGE_DEFINITIONS.filter(
    (badge) => !earned.has(badge.id) && badge.check(stats)
  );
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      // Initial state
      current: 0,
      longest: 0,
      lastOpenedDate: null,
      earnedBadgeIds: [],
      newlyUnlockedBadge: null,
      likedSparkCount: 0,
      seenSparkCountByTopic: {},
      shareCount: 0,
      referralCount: 0,
      sparksSeenTotal: 0,
      completedDaysInARow: 0,

      /** Call on every app open / foreground resume */
      checkAndUpdateStreak: () => {
        const { current, longest, lastOpenedDate, earnedBadgeIds } = get();
        const today = TODAY();

        if (lastOpenedDate === today) {
          // Already opened today — no change to streak
          return [];
        }

        const yesterday = YESTERDAY();
        const newStreak =
          lastOpenedDate === yesterday ? current + 1 : 1;
        const newLongest = Math.max(longest, newStreak);

        set({
          current: newStreak,
          longest: newLongest,
          lastOpenedDate: today,
        });

        const state = get();
        const stats: BadgeStats = {
          streakCurrent: newStreak,
          streakLongest: newLongest,
          likedCount: state.likedSparkCount,
          topicsExplored: Object.keys(state.seenSparkCountByTopic).length,
          sparksSeenTotal: state.sparksSeenTotal,
          referralCount: state.referralCount,
          shareCount: state.shareCount,
          openHour: new Date().getHours(),
          completedDaysInARow: state.completedDaysInARow,
        };

        const newBadges = checkNewBadges(stats, earnedBadgeIds);
        if (newBadges.length > 0) {
          set({
            earnedBadgeIds: [...earnedBadgeIds, ...newBadges.map((b) => b.id)],
            newlyUnlockedBadge: newBadges[0], // show the first one
          });
        }
        return newBadges;
      },

      recordLike: (topicId: string) => {
        const {
          likedSparkCount,
          seenSparkCountByTopic,
          earnedBadgeIds,
          current,
          longest,
          sparksSeenTotal,
          shareCount,
          referralCount,
          completedDaysInARow,
        } = get();

        const newLikedCount = likedSparkCount + 1;
        set({ likedSparkCount: newLikedCount });

        const stats: BadgeStats = {
          streakCurrent: current,
          streakLongest: longest,
          likedCount: newLikedCount,
          topicsExplored: Object.keys(seenSparkCountByTopic).length,
          sparksSeenTotal,
          referralCount,
          shareCount,
          openHour: new Date().getHours(),
          completedDaysInARow,
        };

        const newBadges = checkNewBadges(stats, earnedBadgeIds);
        if (newBadges.length > 0) {
          set({
            earnedBadgeIds: [...earnedBadgeIds, ...newBadges.map((b) => b.id)],
            newlyUnlockedBadge: newBadges[0],
          });
        }
        return newBadges;
      },

      recordShare: () => {
        const {
          shareCount,
          earnedBadgeIds,
          current,
          longest,
          likedSparkCount,
          seenSparkCountByTopic,
          sparksSeenTotal,
          referralCount,
          completedDaysInARow,
        } = get();

        const newShareCount = shareCount + 1;
        set({ shareCount: newShareCount });

        const stats: BadgeStats = {
          streakCurrent: current,
          streakLongest: longest,
          likedCount: likedSparkCount,
          topicsExplored: Object.keys(seenSparkCountByTopic).length,
          sparksSeenTotal,
          referralCount,
          shareCount: newShareCount,
          openHour: new Date().getHours(),
          completedDaysInARow,
        };

        const newBadges = checkNewBadges(stats, earnedBadgeIds);
        if (newBadges.length > 0) {
          set({
            earnedBadgeIds: [...earnedBadgeIds, ...newBadges.map((b) => b.id)],
            newlyUnlockedBadge: newBadges[0],
          });
        }
        return newBadges;
      },

      recordReferral: () => {
        const {
          referralCount,
          earnedBadgeIds,
          current,
          longest,
          likedSparkCount,
          seenSparkCountByTopic,
          sparksSeenTotal,
          shareCount,
          completedDaysInARow,
        } = get();

        const newCount = referralCount + 1;
        set({ referralCount: newCount });

        const stats: BadgeStats = {
          streakCurrent: current,
          streakLongest: longest,
          likedCount: likedSparkCount,
          topicsExplored: Object.keys(seenSparkCountByTopic).length,
          sparksSeenTotal,
          referralCount: newCount,
          shareCount,
          openHour: new Date().getHours(),
          completedDaysInARow,
        };

        const newBadges = checkNewBadges(stats, earnedBadgeIds);
        if (newBadges.length > 0) {
          set({
            earnedBadgeIds: [...earnedBadgeIds, ...newBadges.map((b) => b.id)],
            newlyUnlockedBadge: newBadges[0],
          });
        }
        return newBadges;
      },

      recordTopicSeen: (topicId: string) => {
        const { seenSparkCountByTopic } = get();
        const prev = seenSparkCountByTopic[topicId] ?? 0;
        set({
          seenSparkCountByTopic: { ...seenSparkCountByTopic, [topicId]: prev + 1 },
        });
      },

      recordSparkSeen: () => {
        const { sparksSeenTotal } = get();
        set({ sparksSeenTotal: sparksSeenTotal + 1 });
      },

      clearNewBadge: () => set({ newlyUnlockedBadge: null }),

      grantEarlyAdopter: () => {
        const { earnedBadgeIds } = get();
        if (!earnedBadgeIds.includes('early_adopter')) {
          set({ earnedBadgeIds: [...earnedBadgeIds, 'early_adopter'] });
        }
      },
    }),
    {
      name: 'streak-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
