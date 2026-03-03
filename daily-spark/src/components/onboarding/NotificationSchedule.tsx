import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../constants/colors';
import { useSettingsStore } from '../../stores/settingsStore';
import { formatNotificationTime } from '../../utils/dateHelpers';

const SLOT_LABELS = ['Morning Spark ☀️', 'Afternoon Spark 🌤️', 'Evening Spark 🌙'];
const SLOT_DESCS = ['Start your day right', 'Beat the afternoon slump', 'Wind down with a spark'];

export function NotificationSchedule() {
  const { notificationTimes, setNotificationTimes } = useSettingsStore();
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const parseTime = (timeStr: string): Date => {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  const handleTimeChange = (_: unknown, selectedDate?: Date) => {
    if (!selectedDate || activeSlot === null) {
      setActiveSlot(null);
      return;
    }
    const h = selectedDate.getHours().toString().padStart(2, '0');
    const m = selectedDate.getMinutes().toString().padStart(2, '0');
    const updated = [...notificationTimes];
    updated[activeSlot] = `${h}:${m}`;
    setNotificationTimes(updated);
    if (Platform.OS === 'android') setActiveSlot(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Daily Spark Schedule</Text>
      <Text style={styles.subtitle}>
        We'll send you 3 amazing sparks every day. Pick your perfect times!
      </Text>

      {notificationTimes.map((time, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.slotCard, activeSlot === i && styles.slotCardActive]}
          onPress={() => setActiveSlot(activeSlot === i ? null : i)}
          accessibilityRole="button"
          accessibilityLabel={`${SLOT_LABELS[i]}, set to ${formatNotificationTime(time)}`}
        >
          <View style={styles.slotLeft}>
            <Text style={styles.slotLabel}>{SLOT_LABELS[i]}</Text>
            <Text style={styles.slotDesc}>{SLOT_DESCS[i]}</Text>
          </View>
          <View style={styles.timeChip}>
            <Text style={styles.timeText}>{formatNotificationTime(time)}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {activeSlot !== null && (
        <DateTimePicker
          value={parseTime(notificationTimes[activeSlot])}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          themeVariant="dark"
          style={styles.timePicker}
        />
      )}

      <View style={styles.note}>
        <Text style={styles.noteText}>
          ⚡ You can always change these in Settings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  slotCardActive: {
    borderColor: Colors.spark,
  },
  slotLeft: { flex: 1 },
  slotLabel: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  slotDesc: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  timeChip: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.spark + '60',
  },
  timeText: {
    color: Colors.spark,
    fontSize: 16,
    fontWeight: '800',
  },
  timePicker: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginTop: 8,
  },
  note: {
    marginTop: 24,
    alignItems: 'center',
  },
  noteText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
});
