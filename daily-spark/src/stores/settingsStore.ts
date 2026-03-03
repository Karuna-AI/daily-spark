import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/config';

interface SettingsState {
  notificationTimes: string[];   // ['08:00', '13:00', '19:00']
  notificationsEnabled: boolean;
  locationEnabled: boolean;
  locationCity: string | null;
  locationCountry: string | null;
  soundEnabled: boolean;
  hapticsEnabled: boolean;

  setNotificationTimes: (times: string[]) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setLocation: (city: string, country: string) => void;
  setLocationEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationTimes: Config.DEFAULT_NOTIFICATION_TIMES,
      notificationsEnabled: false,
      locationEnabled: false,
      locationCity: null,
      locationCountry: null,
      soundEnabled: true,
      hapticsEnabled: true,

      setNotificationTimes: (notificationTimes) => set({ notificationTimes }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setLocation: (city, country) => set({ locationCity: city, locationCountry: country }),
      setLocationEnabled: (locationEnabled) => set({ locationEnabled }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
