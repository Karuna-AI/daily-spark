import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TOPICS } from '../../src/constants/topics';
import { Colors } from '../../src/constants/colors';
import { useTopicsStore } from '../../src/stores/topicsStore';
import { useAuthStore } from '../../src/stores/authStore';
import { saveUserTopics } from '../../src/services/firebase/topics';
import type { SubTopic, Topic } from '../../src/types/topic';

type FlatItem =
  | { type: 'parent'; topic: Topic }
  | { type: 'sub'; sub: SubTopic; parentId: string };

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedTopics, toggleTopic } = useTopicsStore();
  const { user } = useAuthStore();

  const handleToggle = async (subId: string) => {
    toggleTopic(subId);
    if (user) {
      const updated = selectedTopics.includes(subId)
        ? selectedTopics.filter((id) => id !== subId)
        : [...selectedTopics, subId];
      await saveUserTopics(user.uid, updated);
    }
  };

  const flatItems: FlatItem[] = TOPICS.flatMap((topic) => {
    const filteredSubs = searchQuery
      ? topic.subtopics.filter((s) =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : topic.subtopics;

    if (searchQuery && filteredSubs.length === 0) return [];

    return [
      { type: 'parent' as const, topic },
      ...filteredSubs.map((sub) => ({ type: 'sub' as const, sub, parentId: topic.id })),
    ];
  });

  const renderItem = ({ item }: { item: FlatItem }) => {
    if (item.type === 'parent') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEmoji}>{item.topic.emoji}</Text>
          <Text style={styles.sectionTitle}>{item.topic.label}</Text>
        </View>
      );
    }

    const { sub } = item;
    const selected = selectedTopics.includes(sub.id);

    return (
      <TouchableOpacity
        onPress={() => handleToggle(sub.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selected }}
        accessibilityLabel={sub.label}
      >
        <LinearGradient
          colors={selected ? [sub.color, sub.colorEnd] : [Colors.surface, Colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.subCard, selected && styles.subCardSelected]}
        >
          <Text style={styles.subEmoji}>{sub.emoji}</Text>
          <Text style={[styles.subLabel, selected && styles.subLabelSelected]}>{sub.label}</Text>
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#0D0D1A', '#161628', '#0D0D1A']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Topics</Text>
          <Text style={styles.headerSub}>
            {selectedTopics.length} topics selected
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search topics…"
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search topics"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} accessibilityLabel="Clear search">
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Topic list */}
        <FlatList
          data={flatItems}
          keyExtractor={(item) =>
            item.type === 'parent' ? `parent-${item.topic.id}` : `sub-${item.sub.id}`
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 8, paddingBottom: 16 },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
  },
  headerSub: {
    color: Colors.spark,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  clearBtn: { color: Colors.textMuted, fontSize: 16, padding: 4 },
  listContent: { paddingBottom: 100 },
  separator: { height: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionEmoji: { fontSize: 20 },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  subCardSelected: {
    borderColor: 'transparent',
  },
  subEmoji: { fontSize: 22 },
  subLabel: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  subLabelSelected: { color: '#FFFFFF' },
  checkmark: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});
