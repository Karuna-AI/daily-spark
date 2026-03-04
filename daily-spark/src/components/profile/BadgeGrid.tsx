import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { BADGE_DEFINITIONS, RARITY_COLORS } from '../../constants/badges';
import { useStreakStore } from '../../stores/streakStore';

interface BadgeGridProps {
  onClose?: () => void;
}

export function BadgeGrid({ onClose }: BadgeGridProps) {
  const { earnedBadgeIds, current, longest } = useStreakStore();
  const earnedSet = new Set(earnedBadgeIds);

  return (
    <LinearGradient colors={['#0D0D1A', '#161628', '#0D0D1A']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Badges</Text>
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Close badges"
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Streak summary */}
        <View style={styles.streakRow}>
          <View style={styles.streakStat}>
            <Text style={styles.streakValue}>{current}</Text>
            <Text style={styles.streakLabel}>current 🔥</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakStat}>
            <Text style={styles.streakValue}>{longest}</Text>
            <Text style={styles.streakLabel}>longest 🏆</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakStat}>
            <Text style={styles.streakValue}>{earnedBadgeIds.length}</Text>
            <Text style={styles.streakLabel}>of {BADGE_DEFINITIONS.length} 🏅</Text>
          </View>
        </View>

        {/* Badge grid */}
        <FlatList
          data={BADGE_DEFINITIONS}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const earned = earnedSet.has(item.id);
            const rarityColor = RARITY_COLORS[item.rarity];

            return (
              <View
                style={[
                  styles.badgeCell,
                  earned
                    ? { borderColor: rarityColor + '80' }
                    : { borderColor: Colors.border, opacity: 0.45 },
                ]}
              >
                <View
                  style={[
                    styles.badgeEmojiBg,
                    earned
                      ? { backgroundColor: rarityColor + '20' }
                      : { backgroundColor: Colors.backgroundSecondary },
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{earned ? item.emoji : '🔒'}</Text>
                </View>
                <Text
                  style={[styles.badgeLabel, earned ? { color: Colors.textPrimary } : { color: Colors.textMuted }]}
                  numberOfLines={2}
                >
                  {item.label}
                </Text>
                <Text
                  style={[styles.rarityDot, { color: earned ? rarityColor : Colors.textMuted }]}
                >
                  ●
                </Text>
              </View>
            );
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 26,
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

  // Streak summary row
  streakRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakStat: {
    flex: 1,
    alignItems: 'center',
  },
  streakValue: {
    color: Colors.spark,
    fontSize: 24,
    fontWeight: '900',
  },
  streakLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  streakDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },

  // Grid
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  badgeCell: {
    flex: 1,
    margin: 6,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  badgeEmojiBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  rarityDot: {
    fontSize: 8,
    marginTop: 4,
  },
});
