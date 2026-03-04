import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import { Spark } from '../../types/spark';
import { TopicColors } from '../../constants/colors';

interface ShareCardProps {
  spark: Spark | null;
}

/**
 * A 390×390 branded gradient card rendered off-screen.
 * Wrap with <ViewShot ref={...}> to capture as a PNG.
 */
export const ShareCard = forwardRef<ViewShot, ShareCardProps>(({ spark }, ref) => {
  if (!spark) return null;

  const gradientColors = TopicColors[spark.topic] ??
    TopicColors['fun.facts'] ??
    ['#1A1A4E', '#0D0D2B'];

  return (
    // Render off-screen but still mounted so ViewShot can capture
    <View style={styles.offScreen} pointerEvents="none">
      <ViewShot ref={ref} options={{ format: 'png', quality: 0.95 }}>
        <LinearGradient
          colors={[gradientColors[0], gradientColors[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {/* Topic label */}
          <View style={styles.topicPill}>
            <Text style={styles.topicText}>{spark.topicLabel}</Text>
          </View>

          {/* Main emoji */}
          <Text style={styles.emoji}>{spark.emoji}</Text>

          {/* Spark text */}
          <Text style={styles.sparkText}>{spark.text}</Text>

          {/* Watermark */}
          <View style={styles.watermark}>
            <Text style={styles.watermarkIcon}>⚡</Text>
            <Text style={styles.watermarkText}>Daily Spark</Text>
          </View>
        </LinearGradient>
      </ViewShot>
    </View>
  );
});

ShareCard.displayName = 'ShareCard';

const CARD_SIZE = 390;

const styles = StyleSheet.create({
  // Position off-screen so the card is mounted but invisible to user
  offScreen: {
    position: 'absolute',
    top: -9999,
    left: -9999,
    opacity: 0,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicPill: {
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  topicText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 20,
    textAlign: 'center',
  },
  sparkText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.3,
    paddingHorizontal: 8,
  },
  watermark: {
    position: 'absolute',
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  watermarkIcon: {
    fontSize: 16,
  },
  watermarkText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
