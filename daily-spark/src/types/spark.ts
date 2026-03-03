export interface Spark {
  id: string;
  text: string;
  topic: string;       // e.g. 'sports.cricket'
  topicLabel: string;  // e.g. 'Cricket'
  parentTopic: string; // e.g. 'Sports'
  emoji: string;       // e.g. '🏏'
  topicColor: string;  // hex gradient start
  topicColorEnd: string;
  source?: string;
  createdAt: Date;
  generatedDate: string; // 'YYYY-MM-DD'
  totalSeen?: number;
  totalLikes?: number;
  totalDislikes?: number;
}

export type SparkReaction = 'like' | 'dislike';

export interface SparkFeedback {
  uid: string;
  sparkId: string;
  reaction: SparkReaction;
  topic: string;
  timestamp: Date;
}

export interface DailySession {
  date: string;        // 'YYYY-MM-DD'
  sparksShown: string[]; // sparkIds
  completed: boolean;
}
