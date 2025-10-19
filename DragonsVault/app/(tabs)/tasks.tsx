import { Image } from 'expo-image';
import { Platform, StyleSheet, View, FlatList, TextInput, Pressable } from 'react-native';
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { getUserData } from '@/lib/firestoreUser';
import { useAuth } from '@/providers/AuthProvider';

type Task = { id: string; text: string };

export default function TabTwoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();
  const uid = user?.uid;

  const [loading, setLoading] = useState(false);
  const totalMoney = 0;
  const totalXP = 0;

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!uid) return;
      setLoading(true);
      try {
        const data = await getUserData(uid);
        // expect data.tasks to be Task[] or similar; map to text-only Task if needed
        const userTasks = (data.tasks ?? []).map((t: any) => ({ id: t.id, text: t.title ?? t.name ?? String(t) }));
        if (mounted) setTasks(userTasks);
      } catch (err) {
        console.error('Failed to load user tasks', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, [uid]);

  return (
    <>
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
        <ThemedText style={styles.statsText}>Total: {totalMoney}$   XP: {totalXP} / 100</ThemedText>
      </ThemedView>

      {/* Centered Tasks title */}
      <View style={styles.centerTitleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>Tasks</ThemedText>
      </View>

      {/* Editable list of objectives/tasks */}
      <ThemedView style={styles.listContainer}>
        <TasksList tasks={tasks} />
      </ThemedView>
  </>
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
            <ThemedText style={{ fontWeight: '600' }}>{50}</ThemedText>
          </View>
        )}
      />
    </View>
  );
}
