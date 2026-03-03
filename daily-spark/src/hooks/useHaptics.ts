import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../stores/settingsStore';

export function useHaptics() {
  const { hapticsEnabled } = useSettingsStore();

  const lightImpact = () => {
    if (!hapticsEnabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const mediumImpact = () => {
    if (!hapticsEnabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const heavyImpact = () => {
    if (!hapticsEnabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const successNotification = () => {
    if (!hapticsEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const errorNotification = () => {
    if (!hapticsEnabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  return { lightImpact, mediumImpact, heavyImpact, successNotification, errorNotification };
}
