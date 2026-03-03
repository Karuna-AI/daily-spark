export const Colors = {
  // Brand
  background: '#0D0D1A',
  backgroundSecondary: '#161628',
  surface: '#1E1E35',
  surfaceHover: '#252540',
  border: '#2A2A4A',

  // Brand accent
  spark: '#FFD700',      // Gold — the "spark"
  sparkGlow: '#FFA500',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0C0',
  textMuted: '#606080',

  // Actions
  like: '#4CAF50',
  likeLight: '#81C784',
  dislike: '#F44336',
  dislikeLight: '#E57373',
  share: '#2196F3',

  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Overlay
  overlay: 'rgba(0,0,0,0.6)',
  overlayLight: 'rgba(0,0,0,0.3)',
} as const;

// Topic gradient colors [start, end]
export const TopicColors: Record<string, [string, string]> = {
  // Sports
  'sports': ['#1A237E', '#283593'],
  'sports.cricket': ['#1B5E20', '#2E7D32'],
  'sports.football': ['#4A148C', '#6A1B9A'],
  'sports.basketball': ['#E65100', '#F57C00'],
  'sports.tennis': ['#1A237E', '#1565C0'],
  'sports.formula1': ['#B71C1C', '#C62828'],

  // Science
  'science': ['#0D47A1', '#1565C0'],
  'science.space': ['#0D0D2B', '#1A1A4E'],
  'science.biology': ['#1B5E20', '#388E3C'],
  'science.environment': ['#004D40', '#00695C'],
  'science.physics': ['#311B92', '#4527A0'],

  // Technology
  'technology': ['#006064', '#00838F'],
  'technology.ai': ['#1A237E', '#283593'],
  'technology.gadgets': ['#37474F', '#546E7A'],
  'technology.innovation': ['#004D40', '#00695C'],
  'technology.startups': ['#E65100', '#EF6C00'],

  // Health
  'health': ['#880E4F', '#AD1457'],
  'health.fitness': ['#BF360C', '#D84315'],
  'health.nutrition': ['#33691E', '#558B2F'],
  'health.mentalhealth': ['#4A148C', '#6A1B9A'],
  'health.yoga': ['#880E4F', '#C2185B'],

  // History
  'history': ['#3E2723', '#4E342E'],
  'history.worldhistory': ['#4E342E', '#6D4C41'],
  'history.art': ['#880E4F', '#AD1457'],
  'history.music': ['#1A237E', '#283593'],
  'history.literature': ['#3E2723', '#5D4037'],

  // Finance
  'finance': ['#1B5E20', '#2E7D32'],
  'finance.personal': ['#1B5E20', '#388E3C'],
  'finance.markets': ['#0D47A1', '#1565C0'],
  'finance.crypto': ['#E65100', '#F57C00'],

  // Entertainment
  'entertainment': ['#880E4F', '#AD1457'],
  'entertainment.movies': ['#311B92', '#4527A0'],
  'entertainment.tvshows': ['#006064', '#00838F'],
  'entertainment.gaming': ['#1A237E', '#283593'],
  'entertainment.books': ['#3E2723', '#4E342E'],

  // Fun
  'fun': ['#F57F17', '#F9A825'],
  'fun.facts': ['#F57F17', '#F9A825'],
  'fun.jokes': ['#E65100', '#F57C00'],
  'fun.didyouknow': ['#006064', '#00838F'],
  'fun.riddles': ['#4A148C', '#6A1B9A'],

  // World News
  'news': ['#0D47A1', '#1976D2'],
  'news.positive': ['#1B5E20', '#2E7D32'],
};
