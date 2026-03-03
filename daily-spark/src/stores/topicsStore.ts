import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TopicsState {
  selectedTopics: string[];  // e.g. ['sports.cricket', 'science.space']
  setSelectedTopics: (topics: string[]) => void;
  toggleTopic: (topicId: string) => void;
  clearTopics: () => void;
}

export const useTopicsStore = create<TopicsState>()(
  persist(
    (set) => ({
      selectedTopics: [],

      setSelectedTopics: (selectedTopics) => set({ selectedTopics }),

      toggleTopic: (topicId) =>
        set((s) => ({
          selectedTopics: s.selectedTopics.includes(topicId)
            ? s.selectedTopics.filter((id) => id !== topicId)
            : [...s.selectedTopics, topicId],
        })),

      clearTopics: () => set({ selectedTopics: [] }),
    }),
    {
      name: 'topics-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
