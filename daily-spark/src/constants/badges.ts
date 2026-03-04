import { BadgeDefinition } from '../types/streak';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ─── Streak Badges ────────────────────────────────────────────────────────
  {
    id: 'streak_1',
    label: 'First Spark',
    emoji: '⚡',
    description: 'Opened Daily Spark for the first time.',
    rarity: 'common',
    check: (s) => s.streakCurrent >= 1,
  },
  {
    id: 'streak_3',
    label: 'Hat Trick',
    emoji: '🔥',
    description: '3 days in a row — you\'re on fire!',
    rarity: 'common',
    check: (s) => s.streakCurrent >= 3,
  },
  {
    id: 'streak_7',
    label: 'Week Warrior',
    emoji: '🗓️',
    description: 'A full week without missing a spark.',
    rarity: 'rare',
    check: (s) => s.streakCurrent >= 7,
  },
  {
    id: 'streak_14',
    label: 'Fortnight Flame',
    emoji: '💪',
    description: '14 consecutive days of sparking curiosity.',
    rarity: 'rare',
    check: (s) => s.streakCurrent >= 14,
  },
  {
    id: 'streak_30',
    label: 'Monthly Maestro',
    emoji: '🏆',
    description: '30 days straight — truly dedicated!',
    rarity: 'epic',
    check: (s) => s.streakCurrent >= 30,
  },
  {
    id: 'streak_100',
    label: 'Century Spark',
    emoji: '💯',
    description: '100 days! You are a Spark Legend.',
    rarity: 'legendary',
    check: (s) => s.streakCurrent >= 100,
  },

  // ─── Like Badges ──────────────────────────────────────────────────────────
  {
    id: 'like_1',
    label: 'First Like',
    emoji: '💛',
    description: 'You loved your first spark.',
    rarity: 'common',
    check: (s) => s.likedCount >= 1,
  },
  {
    id: 'like_10',
    label: 'Superfan',
    emoji: '🌟',
    description: 'Liked 10 sparks — you know what you love.',
    rarity: 'common',
    check: (s) => s.likedCount >= 10,
  },
  {
    id: 'like_50',
    label: 'Spark Collector',
    emoji: '💎',
    description: 'Liked 50 sparks. Quite the curator!',
    rarity: 'rare',
    check: (s) => s.likedCount >= 50,
  },
  {
    id: 'like_100',
    label: 'Legend',
    emoji: '👑',
    description: 'Liked 100 sparks. True Spark royalty.',
    rarity: 'epic',
    check: (s) => s.likedCount >= 100,
  },

  // ─── Explorer Badges ──────────────────────────────────────────────────────
  {
    id: 'explorer_3',
    label: 'Curious Cat',
    emoji: '🐱',
    description: 'Explored sparks across 3 different topics.',
    rarity: 'common',
    check: (s) => s.topicsExplored >= 3,
  },
  {
    id: 'explorer_5',
    label: 'Polymath',
    emoji: '🧠',
    description: 'Dived into 5 different topics — renaissance vibes.',
    rarity: 'rare',
    check: (s) => s.topicsExplored >= 5,
  },
  {
    id: 'explorer_all',
    label: 'Omnivore',
    emoji: '🌍',
    description: 'Seen sparks from every single topic category!',
    rarity: 'legendary',
    check: (s) => s.topicsExplored >= 9, // 9 top-level topic groups
  },

  // ─── Social Badges ────────────────────────────────────────────────────────
  {
    id: 'share_1',
    label: 'Spark Spreader',
    emoji: '📤',
    description: 'Shared your first spark with a friend.',
    rarity: 'common',
    check: (s) => s.shareCount >= 1,
  },
  {
    id: 'share_10',
    label: 'Viral Spark',
    emoji: '🚀',
    description: 'Shared 10 sparks — you\'re spreading the love!',
    rarity: 'rare',
    check: (s) => s.shareCount >= 10,
  },
  {
    id: 'referral_1',
    label: 'Igniter',
    emoji: '🕯️',
    description: 'Referred 1 friend who joined Daily Spark.',
    rarity: 'rare',
    check: (s) => s.referralCount >= 1,
  },
  {
    id: 'referral_5',
    label: 'Fire Starter',
    emoji: '🔥',
    description: 'Referred 5 friends. You\'re ablaze!',
    rarity: 'epic',
    check: (s) => s.referralCount >= 5,
  },

  // ─── Completionist Badges ─────────────────────────────────────────────────
  {
    id: 'complete_day_1',
    label: 'Full Spark',
    emoji: '✅',
    description: 'Saw all 3 sparks in a single day.',
    rarity: 'common',
    check: (s) => s.sparksSeenTotal >= 3,
  },
  {
    id: 'complete_week',
    label: 'Perfect Week',
    emoji: '🎯',
    description: 'Saw all 3 sparks every day for 7 days straight.',
    rarity: 'epic',
    check: (s) => s.completedDaysInARow >= 7,
  },

  // ─── Special Badges ───────────────────────────────────────────────────────
  {
    id: 'early_adopter',
    label: 'Early Adopter',
    emoji: '🌅',
    description: 'One of the first to join Daily Spark.',
    rarity: 'legendary',
    check: (_s) => false, // Granted manually / via server flag
  },
  {
    id: 'night_owl',
    label: 'Night Owl',
    emoji: '🦉',
    description: 'Opened the app after 10 PM.',
    rarity: 'common',
    check: (s) => s.openHour >= 22,
  },
  {
    id: 'morning_person',
    label: 'Morning Person',
    emoji: '🌄',
    description: 'Opened the app before 7 AM.',
    rarity: 'common',
    check: (s) => s.openHour < 7,
  },
];

/** Map for O(1) lookup */
export const BADGE_MAP = Object.fromEntries(
  BADGE_DEFINITIONS.map((b) => [b.id, b])
) as Record<string, BadgeDefinition>;

export const RARITY_COLORS: Record<string, string> = {
  common: '#9E9E9E',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FFD700',
};
