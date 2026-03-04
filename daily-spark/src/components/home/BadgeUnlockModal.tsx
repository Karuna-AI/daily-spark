import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { BadgeDefinition } from '../../types/streak';
import { RARITY_COLORS } from '../../constants/badges';

interface BadgeUnlockModalProps {
  badge: BadgeDefinition | null;
  onDismiss: () => void;
}

export function BadgeUnlockModal({ badge, onDismiss }: BadgeUnlockModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (badge) {
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    } else {
      scaleAnim.setValue(0.5);
      opacityAnim.setValue(0);
    }
  }, [badge]);

  const rarityColor = badge ? RARITY_COLORS[badge.rarity] : Colors.spark;

  return (
    <Modal
      visible={!!badge}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              borderColor: rarityColor,
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Glow ring */}
          <View style={[styles.glowRing, { backgroundColor: rarityColor + '20', borderColor: rarityColor + '60' }]}>
            <Text style={styles.badgeEmoji}>{badge?.emoji}</Text>
          </View>

          <Text style={styles.unlockedLabel}>Badge Unlocked!</Text>

          <Text style={[styles.rarityLabel, { color: rarityColor }]}>
            {badge?.rarity?.toUpperCase()}
          </Text>

          <Text style={styles.badgeName}>{badge?.label}</Text>
          <Text style={styles.badgeDescription}>{badge?.description}</Text>

          <TouchableOpacity
            style={[styles.awesomeBtn, { borderColor: rarityColor }]}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss badge notification"
          >
            <Text style={[styles.awesomeBtnText, { color: rarityColor }]}>
              Awesome! 🎉
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 2,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  glowRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeEmoji: {
    fontSize: 48,
  },
  unlockedLabel: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  rarityLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  badgeName: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  badgeDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  awesomeBtn: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 2,
  },
  awesomeBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
