import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../stores/authStore';
import { useStreakStore } from '../../stores/streakStore';
import { generateReferralLink, getReferralCount } from '../../services/firebase/referrals';

const PREMIUM_TOPICS = [
  { emoji: '🤔', label: 'Philosophy', description: 'Mind-bending ideas from Plato to Nietzsche' },
  { emoji: '🧠', label: 'Psychology', description: 'Fascinating insights into the human mind' },
  { emoji: '🔭', label: 'Astronomy', description: 'Jaw-dropping facts about the universe' },
  { emoji: '🏛️', label: 'Ancient Mysteries', description: 'Secrets of lost civilizations' },
];

const REFERRALS_NEEDED = 2;

interface ChallengeSheetProps {
  onClose: () => void;
}

export function ChallengeSheet({ onClose }: ChallengeSheetProps) {
  const { user } = useAuthStore();
  const { recordReferral: recordReferralLocal } = useStreakStore();
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getReferralCount(user.uid)
        .then(setReferralCount)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user?.uid]);

  const handleShare = async () => {
    if (!user) return;
    setLinkLoading(true);
    try {
      const link = await generateReferralLink(user.uid);
      const result = await Share.share(
        {
          message: `🔥 I've been loving Daily Spark — 3 amazing facts delivered to you every day!\n\nJoin me and unlock premium topics: ${link}`,
          title: 'Join me on Daily Spark ⚡',
        },
        { dialogTitle: 'Invite a friend to Daily Spark' }
      );
      if (result.action === Share.sharedAction) {
        // Optimistically update local count UI
        recordReferralLocal();
      }
    } catch (err) {
      console.warn('Share failed:', err);
    } finally {
      setLinkLoading(false);
    }
  };

  const progress = Math.min(referralCount, REFERRALS_NEEDED);
  const unlocked = referralCount >= REFERRALS_NEEDED;

  return (
    <LinearGradient colors={['#0D0D1A', '#161628', '#0D0D1A']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Challenge a Friend ⚡</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Invite friends to Daily Spark and unlock{' '}
          <Text style={styles.highlight}>4 exclusive premium topics</Text>!
        </Text>

        {/* Progress bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>
              {unlocked ? '🎉 Premium Unlocked!' : `${progress} of ${REFERRALS_NEEDED} referrals`}
            </Text>
            {loading && <ActivityIndicator size="small" color={Colors.spark} />}
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(progress / REFERRALS_NEEDED) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressHint}>
            {unlocked
              ? 'You\'ve unlocked premium topics. Keep inviting!'
              : `Invite ${REFERRALS_NEEDED - progress} more friend${REFERRALS_NEEDED - progress !== 1 ? 's' : ''} to unlock`}
          </Text>
        </View>

        {/* Invite button */}
        <TouchableOpacity
          style={[styles.inviteBtn, linkLoading && styles.inviteBtnDisabled]}
          onPress={handleShare}
          disabled={linkLoading}
          accessibilityRole="button"
          accessibilityLabel="Invite a friend"
        >
          <LinearGradient
            colors={[Colors.spark, Colors.sparkGlow]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.inviteBtnGradient}
          >
            {linkLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.inviteBtnText}>📲 Invite a Friend</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Premium topics list */}
        <View style={styles.premiumSection}>
          <Text style={styles.premiumTitle}>
            {unlocked ? '✅ Premium Topics Unlocked' : '🔒 Premium Topics (unlock at 2 referrals)'}
          </Text>
          {PREMIUM_TOPICS.map((topic) => (
            <View
              key={topic.label}
              style={[styles.premiumTopic, unlocked && styles.premiumTopicUnlocked]}
            >
              <Text style={styles.premiumTopicEmoji}>{topic.emoji}</Text>
              <View style={styles.premiumTopicInfo}>
                <Text style={[styles.premiumTopicLabel, unlocked && { color: Colors.textPrimary }]}>
                  {topic.label}
                </Text>
                <Text style={styles.premiumTopicDesc}>{topic.description}</Text>
              </View>
              <Text style={styles.lockIcon}>{unlocked ? '✅' : '🔒'}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  highlight: {
    color: Colors.spark,
    fontWeight: '700',
  },

  // Progress
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.spark,
    borderRadius: 4,
  },
  progressHint: {
    color: Colors.textMuted,
    fontSize: 12,
  },

  // Invite button
  inviteBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  inviteBtnDisabled: { opacity: 0.6 },
  inviteBtnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },

  // Premium topics
  premiumSection: { flex: 1 },
  premiumTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  premiumTopic: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    opacity: 0.7,
  },
  premiumTopicUnlocked: {
    opacity: 1,
    borderColor: Colors.spark + '50',
  },
  premiumTopicEmoji: { fontSize: 22, marginRight: 12 },
  premiumTopicInfo: { flex: 1 },
  premiumTopicLabel: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  premiumTopicDesc: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  lockIcon: { fontSize: 16 },
});
