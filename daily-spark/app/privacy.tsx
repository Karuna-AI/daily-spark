import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../src/constants/colors';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#0D0D1A', '#161628', '#0D0D1A']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Privacy Policy</Text>
        </View>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.updated}>Last updated: March 2025</Text>

          <Section title="Overview">
            Daily Spark ("we", "us", or "our") is committed to protecting your privacy.
            This policy explains what data we collect, how we use it, and your rights.
          </Section>

          <Section title="Data We Collect">
            {`• Account information: email address and display name (via Google, Facebook, or Apple Sign-In)\n• Topic preferences you select during onboarding\n• Notification time preferences\n• Which sparks you have viewed (to avoid repeats)\n• Feedback reactions (like/dislike) on sparks\n• Approximate city-level location (only if you opt in) to personalise sparks\n• Device push notification token (to send you daily sparks)`}
          </Section>

          <Section title="What We Do NOT Collect">
            {`• Precise GPS location — only city-level approximation\n• Contacts, photos, microphone, or camera data\n• Payment information of any kind\n• Browsing history outside this app`}
          </Section>

          <Section title="How We Use Your Data">
            {`• To deliver 3 personalised sparks every day via push notification\n• To remember your topic preferences and avoid showing you repeated sparks\n• To track your daily streak and award achievement badges\n• To enable the "Invite Friends" referral feature`}
          </Section>

          <Section title="Third-Party Services">
            {`Daily Spark uses the following third-party services:\n\n• Firebase (Google) — Authentication, database, and push notifications. Google Privacy Policy: policies.google.com/privacy\n• OpenAI — AI-generated spark content (server-side only; no user data is sent to OpenAI)\n• Expo — App build and update infrastructure`}
          </Section>

          <Section title="Data Sharing">
            We do not sell, trade, or rent your personal information to third parties.
            Data is only shared with service providers listed above, solely to operate the app.
          </Section>

          <Section title="Data Retention">
            Your account data is retained while your account is active. You can request
            deletion at any time by emailing us. Seen-spark history is automatically pruned
            after 90 days.
          </Section>

          <Section title="Children's Privacy">
            Daily Spark is not intended for users under 13. We do not knowingly collect
            personal information from children under 13.
          </Section>

          <Section title="Your Rights">
            {`• Access: Request a copy of your data\n• Deletion: Request deletion of your account and all associated data\n• Correction: Update incorrect information via Settings\n\nContact us at privacy@dailyspark.app`}
          </Section>

          <Section title="Changes to This Policy">
            We may update this policy periodically. We will notify you via the app for any
            material changes. Continued use of the app after changes constitutes acceptance.
          </Section>

          <Text style={styles.contact}>
            Questions? Email us at privacy@dailyspark.app
          </Text>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Section({ title, children }: { title: string; children: string | React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { marginRight: 12 },
  backText: { color: Colors.spark, fontSize: 16, fontWeight: '600' },
  title: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  scroll: { flex: 1, paddingHorizontal: 20 },
  updated: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionBody: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  contact: {
    color: Colors.spark,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
