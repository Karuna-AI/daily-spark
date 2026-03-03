import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useSettingsStore } from '../stores/settingsStore';

export function useSparkSound() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const { soundEnabled } = useSettingsStore();

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: false });
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const playSparkSound = async () => {
    if (!soundEnabled) return;
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/spark.mp3'),
          { shouldPlay: true, volume: 0.6 }
        );
        soundRef.current = sound;
      }
    } catch {
      // Silently fail — sound is non-critical
    }
  };

  return { playSparkSound };
}
