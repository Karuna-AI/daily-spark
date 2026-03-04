import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { useAuth } from '../../src/hooks/useAuth';
import { recordReferral } from '../../src/services/firebase/referrals';
import { useStreakStore } from '../../src/stores/streakStore';

export default function JoinScreen() {
  const { ref: referrerId, spark: sparkId } = useLocalSearchParams<{
    ref: string;
    spark?: string;
  }>();
  const router = useRouter();
  const { user, isInitialized } = useAuth();
  const { recordReferral: recordReferralLocal } = useStreakStore();
  const [referralRecorded, setReferralRecorded] = useState(false);

  // Once the user is signed in after clicking the join link, record the referral
  useEffect(() => {
    if (!isInitialized || !user || !referrerId || referralRecorded) return;
    if (user.uid === referrerId) return; // don't self-refer

    setReferralRecorded(true);
    recordReferral(referrerId, user.uid).catch(() => {});
    recordReferralLocal(); // update local streak store for the referrer (if this device)
  }, [user, isInitialized, referrerId]);

  const handleJoin = () => {
    if (user) {
      // Already signed in — go straight to app
      router.replace('/(app)');
    } else {
      // Not signed in — go to login, referrer ID will be picked up on return
      router.replace('/(auth)/login');
    }
  };

  return (
    <LinearGradient colors={['#0D0D1A', '#161628', '#0D0D1A']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Brand */}
        <View style={styles.brand}>
          <Text style={styles.brandIcon}>⚡</Text>
          <Text style={styles.brandName}>Daily Spark</Text>
          <Text style={styles.tagline}>Your friend thinks you'll love this!</Text>
        </View>

        {/* Spark preview (if sparkId provided) */}
        {sparkId ? (
          <View style={styles.sparkPreview}>
            <Text style={styles.sparkPreviewLabel}>They shared this spark with you:</Text>
            <View style={styles.sparkCard}>
              <Text style={styles.sparkCardEmoji}>✨</Text>
              <Text style={styles.sparkCardText}>
                Open the app to see this spark and get 3 amazing facts every day!
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.featureList}>
            {[
              '⚡ 3 amazing sparks delivered daily',
              '🎯 Personalized to your interests',
              '🔥 Build a daily curiosity streak',
              '🏅 Earn badges for exploring',
            ].map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={handleJoin}
          accessibilityRole="button"
          accessibilityLabel="Join Daily Spark for free"
        >
          <LinearGradient
            colors={[Colors.spark, Colors.sparkGlow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>
              {user ? 'Open Daily Spark ⚡' : 'Join Daily Spark — It\'s Free!'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.legal}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  brand: { alignItems: 'center', marginTop: 20 },
  brandIcon: { fontSize: 64, marginBottom: 12 },
  brandName: {
    color: Colors.textPrimary,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  tagline: {
    color: Colors.spark,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  featureList: {
    width: '100%',
    gap: 12,
  },
  featureRow: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  sparkPreview: { width: '100%' },
  sparkPreviewLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  sparkCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.spark + '40',
  },
  sparkCardEmoji: { fontSize: 48, marginBottom: 12 },
  sparkCardText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  ctaBtn: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
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
  legal: {
    color: Colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
