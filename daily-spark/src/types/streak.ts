export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BadgeStats {
  streakCurrent: number;
  streakLongest: number;
  likedCount: number;
  topicsExplored: number;   // number of unique topic IDs seen
  sparksSeenTotal: number;
  referralCount: number;
  shareCount: number;
  openHour: number;         // 0–23, hour of day app was opened (for time-based badges)
  completedDaysInARow: number; // days where all 3 sparks were seen
}

export interface BadgeDefinition {
  id: string;
  label: string;
  emoji: string;
  description: string;
  rarity: BadgeRarity;
  /** Returns true if the user has earned this badge given their stats */
  check: (stats: BadgeStats) => boolean;
}

export interface StreakData {
  current: number;
  longest: number;
  lastOpenedDate: string | null; // 'YYYY-MM-DD'
}
