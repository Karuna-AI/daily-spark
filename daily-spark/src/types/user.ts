export interface NotificationPrefs {
  times: string[];         // e.g. ['08:00', '13:00', '19:00'] in user local time
  timezone: string;        // e.g. 'Asia/Kolkata'
  enabled: boolean;
  fcmToken?: string;
}

export interface LocationPrefs {
  enabled: boolean;
  city?: string;
  country?: string;
  countryCode?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'facebook' | 'apple' | 'email';
  createdAt: Date;

  // Topics
  selectedTopics: string[];    // e.g. ['sports.cricket', 'science.space']
  topicsSetAt?: Date;

  // Notifications
  notifications: NotificationPrefs;

  // Location
  location: LocationPrefs;

  // Deduplication (90-day window)
  seenSparkIds: string[];
  seenSparkDates: string[];   // parallel ISO date strings for pruning

  // Onboarding
  onboardingComplete: boolean;

  // Streak & Gamification
  streak?: {
    current: number;
    longest: number;
    lastOpenedDate: string; // 'YYYY-MM-DD'
  };
  earnedBadgeIds?: string[];
  likedSparkCount?: number;
  seenSparkCountByTopic?: Record<string, number>; // topicId → count
  shareCount?: number;
  referralCount?: number;
  sparksSeenTotal?: number;
}
