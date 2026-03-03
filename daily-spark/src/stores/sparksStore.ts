import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Spark } from '../types/spark';

interface SparksState {
  todaySparks: Spark[];
  currentIndex: number;
  sessionDate: string;   // 'YYYY-MM-DD' — reset if different from today
  isLoading: boolean;
  error: string | null;

  setTodaySparks: (sparks: Spark[]) => void;
  advanceCard: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetSession: () => void;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export const useSparksStore = create<SparksState>()(
  persist(
    (set, get) => ({
      todaySparks: [],
      currentIndex: 0,
      sessionDate: '',
      isLoading: false,
      error: null,

      setTodaySparks: (sparks) =>
        set({ todaySparks: sparks, currentIndex: 0, sessionDate: todayStr(), error: null }),

      advanceCard: () =>
        set((s) => ({ currentIndex: Math.min(s.currentIndex + 1, s.todaySparks.length) })),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      resetSession: () =>
        set({ todaySparks: [], currentIndex: 0, sessionDate: '', error: null }),
    }),
    {
      name: 'sparks-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the cards for today; reset if date changed
      onRehydrateStorage: () => (state) => {
        if (state && state.sessionDate !== todayStr()) {
          state.resetSession();
        }
      },
    }
  )
);
