import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { BadgeGrid } from '../profile/BadgeGrid';

interface StreakBannerProps {
  streak: number;
  earnedBadgeCount: number;
}

export function StreakBanner({ streak, earnedBadgeCount }: StreakBannerProps) {
  const [showBadges, setShowBadges] = useState(false);

  if (streak === 0) return null;

  const flameEmoji = streak >= 30 ? '🔥🔥' : streak >= 7 ? '🔥' : '⚡';

  return (
    <>
      <TouchableOpacity
        style={styles.banner}
        onPress={() => setShowBadges(true)}
        accessibilityRole="button"
        accessibilityLabel={`${streak} day streak. ${earnedBadgeCount} badges earned. Tap to view.`}
      >
        <View style={styles.streakSection}>
          <Text style={styles.flameEmoji}>{flameEmoji}</Text>
          <View>
            <Text style={styles.streakCount}>{streak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.badgeSection}>
          <Text style={styles.badgeEmoji}>🏅</Text>
          <View>
            <Text style={styles.badgeCount}>{earnedBadgeCount}</Text>
            <Text style={styles.badgeLabel}>badges</Text>
          </View>
        </View>

        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <Modal
        visible={showBadges}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBadges(false)}
      >
        <BadgeGrid onClose={() => setShowBadges(false)} />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.spark + '40',
    marginBottom: 12,
  },
  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  flameEmoji: {
    fontSize: 22,
  },
  streakCount: {
    color: Colors.spark,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  streakLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  badgeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  badgeEmoji: {
    fontSize: 20,
  },
  badgeCount: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  badgeLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  chevron: {
    color: Colors.textMuted,
    fontSize: 22,
    fontWeight: '300',
    marginLeft: 4,
  },
});
