import { Image } from 'expo-image';
import { Platform, StyleSheet, View, FlatList, TextInput, Pressable } from 'react-native';
import { useState } from 'react';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

type Task = { id: string; text: string };

export default function TabTwoScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Placeholder task 1' },
    { id: '2', text: 'Placeholder task 2' },
    { id: '3', text: 'Placeholder task 3' },
  ]);

  const totalMoney = tasks.length * 50;
  const totalXP = tasks.length * 10;

  return (
    <ParallaxScrollView
      // use a solid blue header background
      headerBackgroundColor={{ light: '#0000FF', dark: '#0000FF' }}
      headerImage={
        <IconSymbol
          size={78} // half of 155 -> ~78
          color="#ffffff"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
      // reduce header height via prop recognized by ParallaxScrollView
      headerHeight={60}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          {/* small spacer to push title below header visually */}
        </ThemedText>
      </ThemedView>

      {/* Secondary stats header right below blue header */}
      <ThemedView style={styles.statsBar}>
        <ThemedText style={styles.statsText}>Total ${totalMoney}   XP {totalXP}</ThemedText>
      </ThemedView>

      {/* Centered Tasks title */}
      <View style={styles.centerTitleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>Tasks</ThemedText>
      </View>

      {/* Editable list of objectives/tasks */}
      <ThemedView style={styles.listContainer}>
        <TasksList tasks={tasks} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  centerTitleContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  statsBar: {
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  statsText: {
    fontWeight: '600',
  },
});

// Small inline component for task list
function TasksList({ tasks }: { tasks: Task[] }) {
  return (
    <View>
      <FlatList
        data={tasks}
        keyExtractor={(item: Task) => item.id}
        renderItem={({ item }: { item: Task }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <ThemedText>{item.text}</ThemedText>
            {/* static money label */}
            <ThemedText style={{ fontWeight: '600' }}>50$</ThemedText>
          </View>
        )}
      />
    </View>
  );
}
