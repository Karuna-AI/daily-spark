// Mirror of client-side topics — used by Cloud Functions

export interface TopicDef {
  id: string;
  label: string;
  emoji: string;
  subtopics: SubTopicDef[];
}

export interface SubTopicDef {
  id: string;
  label: string;
  emoji: string;
}

export const TOPICS: TopicDef[] = [
  {
    id: 'sports', label: 'Sports', emoji: '🏆',
    subtopics: [
      { id: 'sports.cricket', label: 'Cricket', emoji: '🏏' },
      { id: 'sports.football', label: 'Football', emoji: '⚽' },
      { id: 'sports.basketball', label: 'Basketball', emoji: '🏀' },
      { id: 'sports.tennis', label: 'Tennis', emoji: '🎾' },
      { id: 'sports.formula1', label: 'Formula 1', emoji: '🏎️' },
    ],
  },
  {
    id: 'science', label: 'Science & Nature', emoji: '🔭',
    subtopics: [
      { id: 'science.space', label: 'Space', emoji: '🚀' },
      { id: 'science.biology', label: 'Biology', emoji: '🧬' },
      { id: 'science.environment', label: 'Environment', emoji: '🌿' },
      { id: 'science.physics', label: 'Physics', emoji: '⚛️' },
    ],
  },
  {
    id: 'technology', label: 'Technology', emoji: '💻',
    subtopics: [
      { id: 'technology.ai', label: 'AI & ML', emoji: '🤖' },
      { id: 'technology.gadgets', label: 'Gadgets', emoji: '📱' },
      { id: 'technology.innovation', label: 'Innovation', emoji: '💡' },
      { id: 'technology.startups', label: 'Startups', emoji: '🚀' },
    ],
  },
  {
    id: 'health', label: 'Health & Wellness', emoji: '💪',
    subtopics: [
      { id: 'health.fitness', label: 'Fitness', emoji: '🏋️' },
      { id: 'health.nutrition', label: 'Nutrition', emoji: '🥗' },
      { id: 'health.mentalhealth', label: 'Mental Health', emoji: '🧠' },
      { id: 'health.yoga', label: 'Yoga & Mindfulness', emoji: '🧘' },
    ],
  },
  {
    id: 'history', label: 'History & Culture', emoji: '🏛️',
    subtopics: [
      { id: 'history.worldhistory', label: 'World History', emoji: '🌍' },
      { id: 'history.art', label: 'Art', emoji: '🎨' },
      { id: 'history.music', label: 'Music', emoji: '🎵' },
      { id: 'history.literature', label: 'Literature', emoji: '📚' },
    ],
  },
  {
    id: 'finance', label: 'Finance', emoji: '💰',
    subtopics: [
      { id: 'finance.personal', label: 'Personal Finance', emoji: '💸' },
      { id: 'finance.markets', label: 'Markets', emoji: '📈' },
      { id: 'finance.crypto', label: 'Crypto & Web3', emoji: '₿' },
    ],
  },
  {
    id: 'entertainment', label: 'Entertainment', emoji: '🎬',
    subtopics: [
      { id: 'entertainment.movies', label: 'Movies', emoji: '🎥' },
      { id: 'entertainment.tvshows', label: 'TV Shows', emoji: '📺' },
      { id: 'entertainment.gaming', label: 'Gaming', emoji: '🎮' },
      { id: 'entertainment.books', label: 'Books', emoji: '📖' },
    ],
  },
  {
    id: 'fun', label: 'Fun & Humor', emoji: '😄',
    subtopics: [
      { id: 'fun.facts', label: 'Amazing Facts', emoji: '🤯' },
      { id: 'fun.jokes', label: 'Jokes', emoji: '😂' },
      { id: 'fun.didyouknow', label: 'Did You Know?', emoji: '💬' },
      { id: 'fun.riddles', label: 'Riddles', emoji: '🧩' },
    ],
  },
  {
    id: 'news', label: 'Positive World News', emoji: '🌟',
    subtopics: [
      { id: 'news.positive', label: 'Good News', emoji: '🌈' },
    ],
  },
];

export const ALL_SUBTOPICS = TOPICS.flatMap((t) => t.subtopics);

export function getSubtopicById(id: string): (SubTopicDef & { parentLabel: string }) | null {
  for (const topic of TOPICS) {
    const sub = topic.subtopics.find((s) => s.id === id);
    if (sub) return { ...sub, parentLabel: topic.label };
  }
  return null;
}
