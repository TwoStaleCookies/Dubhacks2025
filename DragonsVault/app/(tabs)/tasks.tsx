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

type Task = { id: string; text: string; rewardInput?: string };

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
        const userTasks = (data.tasks ?? []).map((t: any) => {
          // derive a displayable reward string. Firestore tasks may use `rewardInput` (string)
          // or `value` (number, cents) depending on who wrote them.
          let rewardStr: string | undefined;
          if (t == null) rewardStr = undefined;
          else if (t.rewardInput != null) rewardStr = String(t.rewardInput);
          else if (typeof t.value === 'number') rewardStr = (t.value / 100).toFixed(2);
          else rewardStr = undefined;

          return { id: t.id ?? t.name ?? String(Math.random()), text: t.title ?? t.name ?? String(t), rewardInput: rewardStr };
        });
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
    <View style={styles.screen}>
      {/* Title spacer under header */}
      <ThemedView style={styles.topSpacer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }} />
      </ThemedView>

      {/* Stats strip */}
      <ThemedView style={styles.statsBar}>
        <ThemedText style={styles.statsText}>
          Total: <ThemedText style={styles.statsEmph}>{totalMoney}$</ThemedText>{"  "}
          XP: <ThemedText style={styles.statsEmph}>{totalXP}</ThemedText> / 100
        </ThemedText>
      </ThemedView>

      {/* Page title */}
      <View style={styles.centerTitleContainer}>
        <ThemedText type="title" style={[{ fontFamily: Fonts.rounded }, styles.title]}>
          Tasks
        </ThemedText>
      </View>

      {/* Card container */}
      <ThemedView style={styles.card}>
        <FlatList
          data={tasks}
          keyExtractor={(item: Task) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }: { item: Task }) => (
            <View style={styles.row}>
              <ThemedText style={styles.taskText}>{item.text}</ThemedText>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{item.rewardInput ? `+$${item.rewardInput}` : '+$0.00'}</ThemedText>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 4 }}
        />
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f9ff", // soft off-white background
  },
  topSpacer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  statsBar: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#cfd6e0", // darker divider
  },
  statsText: {
    fontWeight: "600",
    color: "#000", // solid black
  },
  statsEmph: {
    fontWeight: "800",
    color: "#0057ff", // accent blue for totals
  },
  centerTitleContainer: {
    alignItems: "center",
    marginVertical: 14,
  },
  /** 🔹 Title style — now black */
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000000", // solid black
    letterSpacing: 0.3,
    textAlign: "center",
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e0e6ef",
  },
  separator: {
    height: 1,
    backgroundColor: "#d8dee9",
    marginHorizontal: 10,
  },
  row: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskText: {
    fontSize: 17,
    color: "#000", // deep black for visibility
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#e7f1ff",
    borderWidth: 1,
    borderColor: "#b3d1ff",
  },
  badgeText: {
    fontWeight: "700",
    color: "#003cbe",
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
            {/* dynamic money label from task */}
            <ThemedText style={{ fontWeight: '600' }}>{item.rewardInput ? `$${item.rewardInput}` : '$0.00'}</ThemedText>
          </View>
        )}
      />
    </View>
  );
}
