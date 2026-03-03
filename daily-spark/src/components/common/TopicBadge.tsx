import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getTopicColors, getSubtopicById } from '../../constants/topics';

interface TopicBadgeProps {
  topicId: string;
  size?: 'sm' | 'md';
}

export function TopicBadge({ topicId, size = 'md' }: TopicBadgeProps) {
  const [colorStart, colorEnd] = getTopicColors(topicId);
  const result = getSubtopicById(topicId);
  if (!result) return null;

  const { subtopic } = result;
  const isSmall = size === 'sm';

  return (
    <LinearGradient
      colors={[colorStart + 'CC', colorEnd + 'CC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.badge, isSmall && styles.badgeSm]}
    >
      <Text style={[styles.emoji, isSmall && styles.emojiSm]}>{subtopic.emoji}</Text>
      <Text style={[styles.label, isSmall && styles.labelSm]}>{subtopic.label}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  emoji: { fontSize: 14 },
  emojiSm: { fontSize: 11 },
  label: { color: '#fff', fontSize: 13, fontWeight: '700' },
  labelSm: { fontSize: 11, fontWeight: '600' },
});
