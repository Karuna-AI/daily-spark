import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import {
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Spark, SparkReaction } from '../../types/spark';
import { SparkCard, CARD_WIDTH, CARD_HEIGHT } from './SparkCard';
import { Colors } from '../../constants/colors';
import { Config } from '../../constants/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * Config.SWIPE_THRESHOLD_RATIO;

interface SwipeDeckProps {
  sparks: Spark[];
  currentIndex: number;
  onSwipe: (reaction: SparkReaction) => void;
  onCardShown?: () => void;
}

export function SwipeDeck({ sparks, currentIndex, onSwipe, onCardShown }: SwipeDeckProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Trigger sound/haptic when card appears
  useEffect(() => {
    onCardShown?.();
    // Entry animation
    scale.value = 0.92;
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
  }, [currentIndex]);

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      onSwipe(direction === 'right' ? 'like' : 'dislike');
    },
    [onSwipe]
  );

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.4; // dampen vertical
    })
    .onEnd((e) => {
      const shouldSwipe = Math.abs(translateX.value) > SWIPE_THRESHOLD;
      if (shouldSwipe) {
        const dir = translateX.value > 0 ? 'right' : 'left';
        const exitX = dir === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
        translateX.value = withTiming(exitX, { duration: 280 }, () => {
          runOnJS(handleSwipe)(dir);
          // Reset for next card
          translateX.value = 0;
          translateY.value = 0;
        });
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const topCardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-Config.CARD_ROTATION_MAX_DEG, 0, Config.CARD_ROTATION_MAX_DEG],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
    };
  });

  // Like / Dislike overlays
  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));
  const dislikeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const currentSpark = sparks[currentIndex];
  const nextSpark = sparks[currentIndex + 1];

  if (!currentSpark) return null;

  return (
    <View style={styles.container}>
      {/* Background card (next spark) */}
      {nextSpark && (
        <View style={[styles.cardWrapper, styles.backgroundCard]}>
          <SparkCard spark={nextSpark} />
        </View>
      )}

      {/* Foreground card (current spark) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardWrapper, topCardStyle]}>
          {/* LIKE overlay */}
          <Animated.View style={[styles.overlay, styles.likeOverlay, likeOpacity]}>
            <Text style={styles.overlayText}>⚡ LIKE</Text>
          </Animated.View>

          {/* DISLIKE overlay */}
          <Animated.View style={[styles.overlay, styles.dislikeOverlay, dislikeOpacity]}>
            <Text style={styles.overlayText}>SKIP 👎</Text>
          </Animated.View>

          <SparkCard spark={currentSpark} isTop />
        </Animated.View>
      </GestureDetector>

      {/* Swipe hint */}
      <Text style={styles.hint}>Swipe right to like · left to skip</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: CARD_HEIGHT + 60,
  },
  cardWrapper: {
    position: 'absolute',
  },
  backgroundCard: {
    transform: [{ scale: 0.95 }, { translateY: 16 }],
    opacity: 0.85,
  },
  overlay: {
    position: 'absolute',
    top: 40,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 3,
  },
  likeOverlay: {
    left: 24,
    borderColor: Colors.like,
    transform: [{ rotate: '-15deg' }],
  },
  dislikeOverlay: {
    right: 24,
    borderColor: Colors.dislike,
    transform: [{ rotate: '15deg' }],
  },
  overlayText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  hint: {
    position: 'absolute',
    bottom: -4,
    color: Colors.textMuted,
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
