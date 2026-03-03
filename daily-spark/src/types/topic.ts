export interface SubTopic {
  id: string;          // e.g. 'sports.cricket'
  label: string;       // e.g. 'Cricket'
  emoji: string;
  color: string;       // gradient start hex
  colorEnd: string;    // gradient end hex
}

export interface Topic {
  id: string;          // e.g. 'sports'
  label: string;       // e.g. 'Sports'
  emoji: string;
  color: string;
  colorEnd: string;
  subtopics: SubTopic[];
}
