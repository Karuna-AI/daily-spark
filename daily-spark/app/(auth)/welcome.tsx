import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ProgressDots } from '../../src/components/common/ProgressDots';
import { TopicSelector } from '../../src/components/onboarding/TopicSelector';
import { NotificationSchedule } from '../../src/components/onboarding/NotificationSchedule';
import { Colors } from '../../src/constants/colors';
import { useTopicsStore } from '../../src/stores/topicsStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useAuthStore } from '../../src/stores/authStore';
import { saveUserTopics } from '../../src/services/firebase/topics';
import { saveNotificationTimes } from '../../src/services/firebase/notifications';
import { registerForPushNotifications } from '../../src/hooks/useNotifications';

const TOTAL_STEPS = 3;

export default function WelcomeScreen() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const { selectedTopics } = useTopicsStore();
  const { notificationTimes } = useSettingsStore();
  const { user, setProfile } = useAuthStore();
  const router = useRouter();

  const handleNext = async () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      if (selectedTopics.length === 0) {
        Alert.alert('Pick at least one topic!', 'Select what sparks your curiosity to continue.');
        return;
      }
      setStep(2);
    } else {
      // Final step — mark onboarding complete locally and navigate immediately
      setSaving(true);

      // Update local profile so auth gate lets us through right away
      setProfile({
        uid: user?.uid ?? '',
        email: user?.email ?? '',
        displayName: user?.displayName ?? 'Spark Fan',
        selectedTopics,
        onboardingComplete: true,
        notifications: {
          times: notificationTimes,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          enabled: true,
        },
        seenSparkIds: [],
        seenSparkDates: [],
        location: { enabled: false },
      } as any);

      // Navigate immediately — don't wait for Firestore
      router.replace('/(app)');

      // Background sync to Firestore (non-blocking, fails silently if not set up yet)
      if (user) {
        Promise.all([
          saveUserTopics(user.uid, selectedTopics),
          saveNotificationTimes(user.uid, notificationTimes),
          registerForPushNotifications(user.uid),
        ]).catch((err) => console.warn('Background save failed (will retry on next launch):', err));
      }

      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const ctaLabel =
    step === 0 ? "Let's Go ⚡" :
    step === 1 ? 'Next →' :
    saving ? 'Igniting…' : 'Start Sparking! 🚀';

  return (
    <LinearGradient colors={['#0D0D1A', '#161628', '#0D0D1A']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {step > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn} accessibilityRole="button">
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtn} />
          )}
          <ProgressDots count={TOTAL_STEPS} currentIndex={step} />
          <View style={styles.backBtn} />
        </View>

        {/* Step content */}
        <View style={styles.content}>
          {step === 0 && <IntroStep />}
          {step === 1 && <TopicSelector />}
          {step === 2 && <NotificationSchedule />}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.ctaBtn, saving && styles.ctaBtnDisabled]}
          onPress={handleNext}
          disabled={saving}
          accessibilityRole="button"
          accessibilityLabel={ctaLabel}
        >
          <LinearGradient
            colors={[Colors.spark, Colors.sparkGlow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

function IntroStep() {
  return (
    <View style={styles.intro}>
      <Text style={styles.introIcon}>⚡</Text>
      <Text style={styles.introTitle}>Welcome to Daily Spark!</Text>
      <Text style={styles.introBody}>
        Every day, we'll send you{' '}
        <Text style={styles.introHighlight}>3 amazing, positive sparks</Text>{' '}
        based on what you love.{'\n\n'}
        Facts that'll blow your mind. News that'll make you smile. Moments that'll make
        your day better.{'\n\n'}
        Ready to ignite your curiosity?
      </Text>

      <View style={styles.statsRow}>
        {[
          { value: '3', label: 'sparks daily' },
          { value: '9+', label: 'topic categories' },
          { value: '90', label: 'days unique' },
        ].map((s) => (
          <View key={s.label} style={styles.statBlock}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingVertical: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: { width: 60 },
  backText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '600' },
  content: { flex: 1 },

  // Intro step
  intro: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  introIcon: { fontSize: 64, marginBottom: 16 },
  introTitle: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  introBody: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  introHighlight: { color: Colors.spark, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBlock: { alignItems: 'center', flex: 1 },
  statValue: { color: Colors.spark, fontSize: 28, fontWeight: '900' },
  statLabel: { color: Colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 2 },

  // CTA
  ctaBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 16 },
  ctaBtnDisabled: { opacity: 0.6 },
  ctaGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
