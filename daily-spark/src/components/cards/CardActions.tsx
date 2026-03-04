import React, { RefObject, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Colors } from '../../constants/colors';
import { Spark, SparkReaction } from '../../types/spark';
import { shareSparkAsImage, shareSpark } from '../../utils/share';
import { useHaptics } from '../../hooks/useHaptics';

interface CardActionsProps {
  spark: Spark | null;
  onReaction: (reaction: SparkReaction) => void;
  disabled?: boolean;
  /** Ref to the ViewShot wrapping the ShareCard (for image capture) */
  viewShotRef?: RefObject<ViewShot>;
}

export function CardActions({
  spark,
  onReaction,
  disabled = false,
  viewShotRef,
}: CardActionsProps) {
  const { successNotification, errorNotification, mediumImpact } = useHaptics();
  const [sharing, setSharing] = useState(false);

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
    setSharing(true);
    try {
      if (viewShotRef?.current && typeof (viewShotRef.current as any).capture === 'function') {
        // Capture the ShareCard as an image and share it
        const uri = await (viewShotRef.current as any).capture() as string | undefined;
        if (uri) {
          await shareSparkAsImage(uri, spark);
          return;
        }
      }
      // Fallback to plain text share
      await shareSpark(spark);
    } catch (err) {
      console.warn('Share failed:', err);
      // Fallback to text share on error
      await shareSpark(spark);
    } finally {
      setSharing(false);
    }
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
        style={[styles.actionBtn, styles.shareBtn, (disabled || sharing) && styles.disabled]}
        onPress={handleShare}
        disabled={disabled || sharing || !spark}
        accessibilityLabel="Share this spark as an image"
        accessibilityRole="button"
      >
        {sharing ? (
          <ActivityIndicator size="small" color={Colors.share} />
        ) : (
          <Text style={styles.actionIcon}>📤</Text>
        )}
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
