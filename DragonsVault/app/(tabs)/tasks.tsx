import { StyleSheet, View, FlatList } from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";

type Task = { id: string; text: string };

export default function TabTwoScreen() {
  const [tasks] = useState<Task[]>([
    { id: "1", text: "Put your dishes in the dishwasher" },
    { id: "2", text: "Pick up your toys" },
    { id: "3", text: "Do your homework" },
  ]);

  const totalMoney = 0;
  const totalXP = 0;

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
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <ThemedText style={styles.taskText}>{item.text}</ThemedText>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>+50$</ThemedText>
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
