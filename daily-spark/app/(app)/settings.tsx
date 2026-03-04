import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/authStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useStreakStore } from '../../src/stores/streakStore';
import { signOut } from '../../src/services/firebase/auth';
import { saveNotificationTimes } from '../../src/services/firebase/notifications';
import { registerForPushNotifications } from '../../src/hooks/useNotifications';
import { getCurrentCity } from '../../src/utils/location';
import { formatNotificationTime } from '../../src/utils/dateHelpers';
import { BadgeGrid } from '../../src/components/profile/BadgeGrid';
import { ChallengeSheet } from '../../src/components/home/ChallengeSheet';

export default function SettingsScreen() {
  const { user, profile } = useAuthStore();
  const {
    notificationTimes, notificationsEnabled, locationEnabled, locationCity,
    soundEnabled, hapticsEnabled, setNotificationTimes, setNotificationsEnabled,
    setLocationEnabled, setLocation, setSoundEnabled, setHapticsEnabled,
  } = useSettingsStore();
  const { current: streakCurrent, earnedBadgeIds } = useStreakStore();

  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [showBadges, setShowBadges] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value && user) {
      await registerForPushNotifications(user.uid);
    }
  };

  const handleToggleLocation = async (value: boolean) => {
    setLocationEnabled(value);
    if (value) {
      const loc = await getCurrentCity();
      if (loc) {
        setLocation(loc.city, loc.country);
        if (user) {
          const { doc, updateDoc } = await import('firebase/firestore');
          const { db } = await import('../../src/services/firebase/config');
          await updateDoc(doc(db, 'users', user.uid), {
            'location.enabled': true,
            'location.city': loc.city,
            'location.country': loc.country,
            'location.countryCode': loc.countryCode,
          });
        }
      } else {
        setLocationEnabled(false);
        Alert.alert('Location unavailable', 'Could not get your location. Please check permissions.');
      }
    }
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
    if (user) saveNotificationTimes(user.uid, updated);
    if (Platform.OS === 'android') setActiveSlot(null);
  };

  const parseTime = (timeStr: string): Date => {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  return (
    <LinearGradient colors={['#0D0D1A', '#161628', '#0D0D1A']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={styles.pageTitle}>Settings</Text>

          {/* Account */}
          <SectionHeader title="Account" />
          <View style={styles.card}>
            {profile?.photoURL && (
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              null // Avatar would use expo-image here
            )}
            <Text style={styles.displayName}>{profile?.displayName ?? user?.displayName}</Text>
            <Text style={styles.email}>{profile?.email ?? user?.email}</Text>
          </View>

          {/* Referrals */}
          <SectionHeader title="Friends" />
          <TouchableOpacity
            style={styles.card}
            onPress={() => setShowChallenge(true)}
            accessibilityRole="button"
            accessibilityLabel="Invite Friends"
          >
            <View style={styles.achievementRow}>
              <View style={styles.achievementLeft}>
                <Text style={styles.achievementIcon}>🎯</Text>
                <View>
                  <Text style={styles.achievementLabel}>Invite Friends</Text>
                  <Text style={styles.achievementSub}>Unlock premium topics at 2 referrals</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Streak & Badges */}
          <SectionHeader title="Achievements" />
          <TouchableOpacity
            style={styles.card}
            onPress={() => setShowBadges(true)}
            accessibilityRole="button"
            accessibilityLabel={`My Badges — ${earnedBadgeIds.length} earned`}
          >
            <View style={styles.achievementRow}>
              <View style={styles.achievementLeft}>
                <Text style={styles.achievementIcon}>🏅</Text>
                <View>
                  <Text style={styles.achievementLabel}>My Badges</Text>
                  <Text style={styles.achievementSub}>{earnedBadgeIds.length} earned</Text>
                </View>
              </View>
              <View style={styles.streakPill}>
                <Text style={styles.streakPillText}>{streakCurrent > 0 ? `🔥 ${streakCurrent}` : '—'}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          {/* Notifications */}
          <SectionHeader title="Notifications" />
          <View style={styles.card}>
            <SettingRow
              label="Enable Notifications"
              icon="🔔"
              control={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleToggleNotifications}
                  thumbColor={notificationsEnabled ? Colors.spark : Colors.textMuted}
                  trackColor={{ false: Colors.border, true: Colors.spark + '60' }}
                  accessibilityLabel="Enable notifications"
                />
              }
            />
          </View>

          {notificationsEnabled && (
            <View style={styles.card}>
              <Text style={styles.cardSubtitle}>Daily Spark Times</Text>
              {notificationTimes.map((time, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.timeRow, activeSlot === i && styles.timeRowActive]}
                  onPress={() => setActiveSlot(activeSlot === i ? null : i)}
                  accessibilityRole="button"
                  accessibilityLabel={`Spark ${i + 1} at ${formatNotificationTime(time)}`}
                >
                  <Text style={styles.timeRowLabel}>Spark {i + 1}</Text>
                  <Text style={styles.timeValue}>{formatNotificationTime(time)}</Text>
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
                />
              )}
            </View>
          )}

          {/* Location */}
          <SectionHeader title="Location" />
          <View style={styles.card}>
            <SettingRow
              label="Location-based Sparks"
              icon="📍"
              description={locationCity ? `Using: ${locationCity}` : 'Get local news & sports'}
              control={
                <Switch
                  value={locationEnabled}
                  onValueChange={handleToggleLocation}
                  thumbColor={locationEnabled ? Colors.spark : Colors.textMuted}
                  trackColor={{ false: Colors.border, true: Colors.spark + '60' }}
                  accessibilityLabel="Enable location-based sparks"
                />
              }
            />
          </View>

          {/* Preferences */}
          <SectionHeader title="Preferences" />
          <View style={styles.card}>
            <SettingRow
              label="Sound Effects"
              icon="🔊"
              control={
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  thumbColor={soundEnabled ? Colors.spark : Colors.textMuted}
                  trackColor={{ false: Colors.border, true: Colors.spark + '60' }}
                  accessibilityLabel="Enable sound effects"
                />
              }
            />
            <View style={styles.rowDivider} />
            <SettingRow
              label="Haptic Feedback"
              icon="📳"
              control={
                <Switch
                  value={hapticsEnabled}
                  onValueChange={setHapticsEnabled}
                  thumbColor={hapticsEnabled ? Colors.spark : Colors.textMuted}
                  trackColor={{ false: Colors.border, true: Colors.spark + '60' }}
                  accessibilityLabel="Enable haptic feedback"
                />
              }
            />
          </View>

          {/* Sign Out */}
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          {/* Legal */}
          <SectionHeader title="Legal" />
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => router.push('/privacy')}
              accessibilityRole="button"
              accessibilityLabel="Privacy Policy"
            >
              <View style={styles.achievementRow}>
                <Text style={[styles.settingLabel, { flex: 1 }]}>Privacy Policy</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>Daily Spark v1.0.0</Text>
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>

      {/* Badge grid modal */}
      <Modal
        visible={showBadges}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBadges(false)}
      >
        <BadgeGrid onClose={() => setShowBadges(false)} />
      </Modal>

      {/* Challenge / Referrals modal */}
      <Modal
        visible={showChallenge}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowChallenge(false)}
      >
        <ChallengeSheet onClose={() => setShowChallenge(false)} />
      </Modal>
    </LinearGradient>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

interface SettingRowProps {
  label: string;
  icon: string;
  description?: string;
  control: React.ReactNode;
}

function SettingRow({ label, icon, description, control }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingRowLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View>
          <Text style={styles.settingLabel}>{label}</Text>
          {description && <Text style={styles.settingDesc}>{description}</Text>}
        </View>
      </View>
      {control}
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  pageTitle: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
    paddingTop: 8,
  },
  sectionHeader: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 24,
    marginBottom: 8,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardSubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  displayName: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  email: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: { fontSize: 20 },
  settingLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: '600' },
  settingDesc: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  timeRowActive: {
    backgroundColor: Colors.backgroundSecondary,
  },
  timeRowLabel: { color: Colors.textSecondary, fontSize: 14 },
  timeValue: { color: Colors.spark, fontSize: 16, fontWeight: '800' },
  signOutBtn: {
    marginTop: 32,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.dislike + '60',
  },
  signOutText: {
    color: Colors.dislike,
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },

  // Achievements
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  achievementIcon: { fontSize: 24 },
  achievementLabel: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700' },
  achievementSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  streakPill: {
    backgroundColor: Colors.spark + '20',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  streakPillText: {
    color: Colors.spark,
    fontSize: 13,
    fontWeight: '800',
  },
  chevron: {
    color: Colors.textMuted,
    fontSize: 22,
    fontWeight: '300',
  },
});
