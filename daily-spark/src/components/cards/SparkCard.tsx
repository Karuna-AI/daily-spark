import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Spark } from '../../types/spark';
import { getTopicColors } from '../../constants/topics';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = SCREEN_WIDTH * 0.88;
export const CARD_HEIGHT = CARD_WIDTH * 1.45;

interface SparkCardProps {
  spark: Spark;
  isTop?: boolean;
}

export function SparkCard({ spark, isTop = false }: SparkCardProps) {
  const [colorStart, colorEnd] = getTopicColors(spark.topic);

  return (
    <LinearGradient
      colors={[colorStart, colorEnd, '#0D0D1A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, isTop && styles.cardTop]}
    >
      {/* Topic badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{spark.parentTopic}</Text>
        <Text style={styles.badgeDot}>·</Text>
        <Text style={styles.badgeText}>{spark.topicLabel}</Text>
      </View>

      {/* Emoji */}
      <Text style={styles.emoji}>{spark.emoji}</Text>

      {/* Spark text */}
      <Text style={styles.sparkText}>{spark.text}</Text>

      {/* Decorative corner spark */}
      <Text style={styles.cornerSpark}>⚡</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
  },
  cardTop: {
    // Subtle scale up for the top card to create depth
  },
  badge: {
    position: 'absolute',
    top: 24,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  badgeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  badgeDot: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 24,
    textAlign: 'center',
  },
  sparkText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
    textAlign: 'center',
    letterSpacing: 0.2,
    paddingHorizontal: 8,
  },
  cornerSpark: {
    position: 'absolute',
    bottom: 20,
    right: 24,
    fontSize: 24,
    opacity: 0.4,
  },
});
