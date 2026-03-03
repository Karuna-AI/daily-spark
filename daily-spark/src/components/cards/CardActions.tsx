import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  AccessibilityProps,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spark, SparkReaction } from '../../types/spark';
import { shareSpark } from '../../utils/share';
import { useHaptics } from '../../hooks/useHaptics';

interface CardActionsProps {
  spark: Spark | null;
  onReaction: (reaction: SparkReaction) => void;
  disabled?: boolean;
}

export function CardActions({ spark, onReaction, disabled = false }: CardActionsProps) {
  const { successNotification, errorNotification, mediumImpact } = useHaptics();

  const handleLike = () => {
    successNotification();
    onReaction('like');
  };

  const handleDislike = () => {
    errorNotification();
    onReaction('dislike');
  };

  const handleShare = async () => {
    if (!spark) return;
    mediumImpact();
    await shareSpark(spark);
  };

  return (
    <View style={styles.container}>
      {/* Dislike */}
      <TouchableOpacity
        style={[styles.actionBtn, styles.dislikeBtn, disabled && styles.disabled]}
        onPress={handleDislike}
        disabled={disabled}
        accessibilityLabel="Skip this spark"
        accessibilityRole="button"
      >
        <Text style={styles.actionIcon}>👎</Text>
      </TouchableOpacity>

      {/* Share */}
      <TouchableOpacity
        style={[styles.actionBtn, styles.shareBtn, disabled && styles.disabled]}
        onPress={handleShare}
        disabled={disabled || !spark}
        accessibilityLabel="Share this spark"
        accessibilityRole="button"
      >
        <Text style={styles.actionIcon}>📤</Text>
      </TouchableOpacity>

      {/* Like */}
      <TouchableOpacity
        style={[styles.actionBtn, styles.likeBtn, disabled && styles.disabled]}
        onPress={handleLike}
        disabled={disabled}
        accessibilityLabel="Like this spark"
        accessibilityRole="button"
      >
        <Text style={styles.actionIcon}>⚡</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 16,
  },
  actionBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  dislikeBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.dislike,
  },
  shareBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.share,
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  likeBtn: {
    backgroundColor: Colors.spark,
    borderWidth: 2,
    borderColor: Colors.sparkGlow,
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  actionIcon: {
    fontSize: 24,
  },
  disabled: {
    opacity: 0.4,
  },
});
