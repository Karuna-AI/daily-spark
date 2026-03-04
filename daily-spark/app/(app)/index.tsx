import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SwipeDeck } from '../../src/components/cards/SwipeDeck';
import { CardActions } from '../../src/components/cards/CardActions';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { StreakBanner } from '../../src/components/home/StreakBanner';
import { BadgeUnlockModal } from '../../src/components/home/BadgeUnlockModal';
import { ShareCard } from '../../src/components/cards/ShareCard';
import { Colors } from '../../src/constants/colors';
import { useSparks } from '../../src/hooks/useSparks';
import { useSparkSound } from '../../src/hooks/useSound';
import { useHaptics } from '../../src/hooks/useHaptics';
import { useStreakStore } from '../../src/stores/streakStore';
import { Config } from '../../src/constants/config';
import ViewShot from 'react-native-view-shot';

export default function HomeScreen() {
  const { todaySparks, currentSpark, currentIndex, isDone, isLoading, error, loadSparks, handleReaction } =
    useSparks();
  const { playSparkSound } = useSparkSound();
  const { lightImpact } = useHaptics();
  const viewShotRef = useRef<ViewShot>(null);

  const {
    current: streakCurrent,
    earnedBadgeIds,
    newlyUnlockedBadge,
    clearNewBadge,
    recordTopicSeen,
    recordSparkSeen,
  } = useStreakStore();

  useEffect(() => {
    loadSparks();
  }, []);

  if (isLoading) {
    return (
      <LinearGradient colors={['#0D0D1A', '#161628']} style={styles.fill}>
        <LoadingSpinner message="Igniting your sparks…" />
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#0D0D1A', '#161628']} style={styles.fill}>
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>😔</Text>
          <Text style={styles.errorTitle}>Couldn't load sparks</Text>
          <Text style={styles.errorBody}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadSparks} accessibilityRole="button">
            <Text style={styles.retryText}>Try Again ⚡</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (isDone || todaySparks.length === 0) {
    return (
      <LinearGradient colors={['#0D0D1A', '#161628']} style={styles.fill}>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.doneIcon}>⚡</Text>
          <Text style={styles.doneTitle}>You're all sparked out!</Text>
          <Text style={styles.doneBody}>
            You've seen all {Config.MAX_SPARKS_PER_DAY} sparks for today.{'\n'}
            Come back tomorrow for fresh ones!
          </Text>
          <Text style={styles.doneHint}>
            🔔 We'll notify you when new sparks arrive
          </Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const handleCardShown = () => {
    playSparkSound();
    lightImpact();
    // Track topic seen for explorer badges
    if (currentSpark?.topic) {
      recordTopicSeen(currentSpark.topic);
    }
    recordSparkSeen();
  };

  return (
    <LinearGradient colors={['#0D0D1A', '#161628', '#0D0D1A']} style={styles.fill}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>⚡ Daily Spark</Text>
            <Text style={styles.headerSub}>
              {currentIndex + 1} of {todaySparks.length} today
            </Text>
          </View>
          <View style={styles.progressPills}>
            {todaySparks.map((_, i) => (
              <View
                key={i}
                style={[styles.progressPill, i <= currentIndex && styles.progressPillActive]}
              />
            ))}
          </View>
        </View>

        {/* Streak Banner */}
        <StreakBanner
          streak={streakCurrent}
          earnedBadgeCount={earnedBadgeIds.length}
        />

        {/* Swipe Deck */}
        <View style={styles.deckContainer}>
          <SwipeDeck
            sparks={todaySparks}
            currentIndex={currentIndex}
            onSwipe={handleReaction}
            onCardShown={handleCardShown}
          />
        </View>

        {/* Action buttons */}
        <CardActions
          spark={currentSpark}
          onReaction={handleReaction}
          viewShotRef={viewShotRef}
        />
      </SafeAreaView>

      {/* Off-screen share card for image capture */}
      <ShareCard spark={currentSpark} ref={viewShotRef} />

      {/* Badge unlock overlay */}
      <BadgeUnlockModal badge={newlyUnlockedBadge} onDismiss={clearNewBadge} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  progressPills: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  progressPill: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  progressPillActive: {
    backgroundColor: Colors.spark,
  },

  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Error state
  errorIcon: { fontSize: 52, marginBottom: 16 },
  errorTitle: { color: Colors.textPrimary, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  errorBody: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 8 },
  retryBtn: {
    marginTop: 24,
    backgroundColor: Colors.spark,
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  retryText: { color: '#000', fontSize: 16, fontWeight: '800' },

  // Done state
  doneIcon: { fontSize: 72, marginBottom: 16 },
  doneTitle: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
  },
  doneBody: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  doneHint: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
