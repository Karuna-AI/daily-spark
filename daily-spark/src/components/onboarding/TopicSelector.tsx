import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TOPICS } from '../../constants/topics';
import { Colors } from '../../constants/colors';
import { useTopicsStore } from '../../stores/topicsStore';

export function TopicSelector() {
  const { selectedTopics, toggleTopic } = useTopicsStore();
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleExpand = (topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  return (
    <ScrollView
      style={styles.scroll}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>What sparks your curiosity?</Text>
      <Text style={styles.subtitle}>Pick any topics you love — the more the merrier!</Text>

      {TOPICS.map((topic) => {
        const isExpanded = expandedTopics.has(topic.id);
        const selectedCount = topic.subtopics.filter((s) =>
          selectedTopics.includes(s.id)
        ).length;

        return (
          <View key={topic.id} style={styles.topicBlock}>
            {/* Parent topic header */}
            <TouchableOpacity
              style={styles.parentRow}
              onPress={() => toggleExpand(topic.id)}
              accessibilityRole="button"
              accessibilityLabel={`${topic.label} category, ${selectedCount} selected`}
            >
              <LinearGradient
                colors={[topic.color + '40', topic.colorEnd + '20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.parentGradient}
              >
                <Text style={styles.parentEmoji}>{topic.emoji}</Text>
                <Text style={styles.parentLabel}>{topic.label}</Text>
                {selectedCount > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{selectedCount}</Text>
                  </View>
                )}
                <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Subtopics */}
            {isExpanded && (
              <View style={styles.subtopicsRow}>
                {topic.subtopics.map((sub) => {
                  const selected = selectedTopics.includes(sub.id);
                  return (
                    <TouchableOpacity
                      key={sub.id}
                      onPress={() => toggleTopic(sub.id)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={sub.label}
                    >
                      <LinearGradient
                        colors={selected ? [sub.color, sub.colorEnd] : ['transparent', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.chip, selected && styles.chipSelected]}
                      >
                        <Text style={styles.chipEmoji}>{sub.emoji}</Text>
                        <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                          {sub.label}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  title: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  topicBlock: { marginBottom: 10 },
  parentRow: { borderRadius: 14, overflow: 'hidden' },
  parentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  parentEmoji: { fontSize: 22, marginRight: 10 },
  parentLabel: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  countBadge: {
    backgroundColor: Colors.spark,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  countText: { color: '#000', fontSize: 11, fontWeight: '800' },
  chevron: { color: Colors.textMuted, fontSize: 12 },
  subtopicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    paddingLeft: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
  },
  chipSelected: {
    borderColor: 'transparent',
  },
  chipEmoji: { fontSize: 16 },
  chipLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
});
