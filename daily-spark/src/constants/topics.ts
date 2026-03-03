import { Topic } from '../types/topic';

export const TOPICS: Topic[] = [
  {
    id: 'sports',
    label: 'Sports',
    emoji: '🏆',
    color: '#1A237E',
    colorEnd: '#283593',
    subtopics: [
      { id: 'sports.cricket', label: 'Cricket', emoji: '🏏', color: '#1B5E20', colorEnd: '#2E7D32' },
      { id: 'sports.football', label: 'Football', emoji: '⚽', color: '#4A148C', colorEnd: '#6A1B9A' },
      { id: 'sports.basketball', label: 'Basketball', emoji: '🏀', color: '#E65100', colorEnd: '#F57C00' },
      { id: 'sports.tennis', label: 'Tennis', emoji: '🎾', color: '#1A237E', colorEnd: '#1565C0' },
      { id: 'sports.formula1', label: 'Formula 1', emoji: '🏎️', color: '#B71C1C', colorEnd: '#C62828' },
    ],
  },
  {
    id: 'science',
    label: 'Science & Nature',
    emoji: '🔭',
    color: '#0D47A1',
    colorEnd: '#1565C0',
    subtopics: [
      { id: 'science.space', label: 'Space', emoji: '🚀', color: '#0D0D2B', colorEnd: '#1A1A4E' },
      { id: 'science.biology', label: 'Biology', emoji: '🧬', color: '#1B5E20', colorEnd: '#388E3C' },
      { id: 'science.environment', label: 'Environment', emoji: '🌿', color: '#004D40', colorEnd: '#00695C' },
      { id: 'science.physics', label: 'Physics', emoji: '⚛️', color: '#311B92', colorEnd: '#4527A0' },
    ],
  },
  {
    id: 'technology',
    label: 'Technology',
    emoji: '💻',
    color: '#006064',
    colorEnd: '#00838F',
    subtopics: [
      { id: 'technology.ai', label: 'AI & ML', emoji: '🤖', color: '#1A237E', colorEnd: '#283593' },
      { id: 'technology.gadgets', label: 'Gadgets', emoji: '📱', color: '#37474F', colorEnd: '#546E7A' },
      { id: 'technology.innovation', label: 'Innovation', emoji: '💡', color: '#004D40', colorEnd: '#00695C' },
      { id: 'technology.startups', label: 'Startups', emoji: '🚀', color: '#E65100', colorEnd: '#EF6C00' },
    ],
  },
  {
    id: 'health',
    label: 'Health & Wellness',
    emoji: '💪',
    color: '#880E4F',
    colorEnd: '#AD1457',
    subtopics: [
      { id: 'health.fitness', label: 'Fitness', emoji: '🏋️', color: '#BF360C', colorEnd: '#D84315' },
      { id: 'health.nutrition', label: 'Nutrition', emoji: '🥗', color: '#33691E', colorEnd: '#558B2F' },
      { id: 'health.mentalhealth', label: 'Mental Health', emoji: '🧠', color: '#4A148C', colorEnd: '#6A1B9A' },
      { id: 'health.yoga', label: 'Yoga & Mindfulness', emoji: '🧘', color: '#880E4F', colorEnd: '#C2185B' },
    ],
  },
  {
    id: 'history',
    label: 'History & Culture',
    emoji: '🏛️',
    color: '#3E2723',
    colorEnd: '#4E342E',
    subtopics: [
      { id: 'history.worldhistory', label: 'World History', emoji: '🌍', color: '#4E342E', colorEnd: '#6D4C41' },
      { id: 'history.art', label: 'Art', emoji: '🎨', color: '#880E4F', colorEnd: '#AD1457' },
      { id: 'history.music', label: 'Music', emoji: '🎵', color: '#1A237E', colorEnd: '#283593' },
      { id: 'history.literature', label: 'Literature', emoji: '📚', color: '#3E2723', colorEnd: '#5D4037' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    emoji: '💰',
    color: '#1B5E20',
    colorEnd: '#2E7D32',
    subtopics: [
      { id: 'finance.personal', label: 'Personal Finance', emoji: '💸', color: '#1B5E20', colorEnd: '#388E3C' },
      { id: 'finance.markets', label: 'Markets', emoji: '📈', color: '#0D47A1', colorEnd: '#1565C0' },
      { id: 'finance.crypto', label: 'Crypto & Web3', emoji: '₿', color: '#E65100', colorEnd: '#F57C00' },
    ],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    emoji: '🎬',
    color: '#880E4F',
    colorEnd: '#AD1457',
    subtopics: [
      { id: 'entertainment.movies', label: 'Movies', emoji: '🎥', color: '#311B92', colorEnd: '#4527A0' },
      { id: 'entertainment.tvshows', label: 'TV Shows', emoji: '📺', color: '#006064', colorEnd: '#00838F' },
      { id: 'entertainment.gaming', label: 'Gaming', emoji: '🎮', color: '#1A237E', colorEnd: '#283593' },
      { id: 'entertainment.books', label: 'Books', emoji: '📖', color: '#3E2723', colorEnd: '#4E342E' },
    ],
  },
  {
    id: 'fun',
    label: 'Fun & Humor',
    emoji: '😄',
    color: '#F57F17',
    colorEnd: '#F9A825',
    subtopics: [
      { id: 'fun.facts', label: 'Amazing Facts', emoji: '🤯', color: '#F57F17', colorEnd: '#F9A825' },
      { id: 'fun.jokes', label: 'Jokes', emoji: '😂', color: '#E65100', colorEnd: '#F57C00' },
      { id: 'fun.didyouknow', label: 'Did You Know?', emoji: '💬', color: '#006064', colorEnd: '#00838F' },
      { id: 'fun.riddles', label: 'Riddles', emoji: '🧩', color: '#4A148C', colorEnd: '#6A1B9A' },
    ],
  },
  {
    id: 'news',
    label: 'Positive World News',
    emoji: '🌟',
    color: '#0D47A1',
    colorEnd: '#1976D2',
    subtopics: [
      { id: 'news.positive', label: 'Good News', emoji: '🌈', color: '#1B5E20', colorEnd: '#2E7D32' },
    ],
  },
];

export const ALL_SUBTOPIC_IDS = TOPICS.flatMap(t => t.subtopics.map(s => s.id));

export function getTopicById(id: string): Topic | undefined {
  return TOPICS.find(t => t.id === id);
}

export function getSubtopicById(id: string) {
  for (const topic of TOPICS) {
    const sub = topic.subtopics.find(s => s.id === id);
    if (sub) return { topic, subtopic: sub };
  }
  return null;
}

export function getTopicColors(topicId: string): [string, string] {
  const result = getSubtopicById(topicId);
  if (result?.subtopic) return [result.subtopic.color, result.subtopic.colorEnd];
  const topic = getTopicById(topicId);
  if (topic) return [topic.color, topic.colorEnd];
  return ['#1A237E', '#283593'];
}
