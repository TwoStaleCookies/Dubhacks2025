import React, { useState } from "react";
import { useAuth} from "@/providers/AuthProvider";
import { addCoins, ensureUserDoc } from "@/lib/firestoreUser";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { green } from "react-native-reanimated/lib/typescript/Colors";

type Task = {
  id: string;
  title: string;
  notes?: string;
  createdAt: number;
  rewardInput?: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [title, setTitle] = useState("");
  const [rewardInput, setRewardInput] = useState("");
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  function addTask() {
    const t = title.trim();
    const r = rewardInput.trim();
    const n = notes.trim();
    if (!t) return; // simple validation
    setTasks((prev: Task[]) => [
      { id: Math.random().toString(36).slice(2), title: t, rewardInput: r, notes: n || undefined, createdAt: Date.now() },
      ...prev,
    ]);
    setTitle("");
    setRewardInput("");
    setNotes("");
  }

  
  function removeTask(id: string) {
    setTasks((prev: Task[]) => prev.filter((x: Task) => x.id !== id));
  }

  async function completeTask(id: string) {
    // find and remove locally
  const task = tasks.find((t: Task) => t.id === id);
    setTasks((prev: Task[]) => prev.filter((x: Task) => x.id !== id));

    if (!task) return;

    // determine reward from the stored task
    const raw = (task as any).reward ?? (task as any).rewardInput ?? "0";
    const parsed = Number(String(raw).replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(parsed) || parsed < 0) {
      console.warn("Invalid reward value for task:", raw);
      return;
    }
    const delta = Math.round(parsed); // store cents

    try {
      if (!uid) throw new Error("Not authenticated");
      await ensureUserDoc(uid);
      await addCoins(uid, delta);
    } catch (err) {
      console.error("Failed to add coins:", err);
      // optionally restore the task or notify user
    }
  }

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.rowTitle} numberOfLines={1}>{item.rewardInput}</Text>
        {!!item.notes && <Text style={styles.rowNotes} numberOfLines={3}>{item.notes}</Text>}
      </View>
      <Pressable onPress={() => removeTask(item.id)} style={styles.deleteBtn}>
        <Text style={{ color: "white", fontWeight: "700" }}>Delete</Text>
      </Pressable>
      <Pressable onPress={() => completeTask(item.id)} style={styles.completeBtn}>
        <Text style={{ color: "white", fontWeight: "700" }}>Completed</Text>
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Fixed inputs (don’t scroll) */}
      <View style={styles.header}>
        <Text style={styles.h1}>Add a task</Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
          placeholderTextColor= "#444"
          style={[styles.input, { minHeight: 48 }]}
          returnKeyType="next"
        />

        <TextInput
          value={rewardInput}
          onChangeText={setRewardInput}
          placeholder="Money Reward"
          placeholderTextColor= "#444"
          style={[styles.input, { minHeight: 48, minWidth: 100 }]}
          returnKeyType="next"
        />

        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes / description"
          placeholderTextColor= "#444"
          multiline
          style={[styles.input, { minHeight: 84, textAlignVertical: "top" }]}
        />

        <Button title="Add" onPress={addTask} />
      </View>

      {/* Scrolling list */}
      <FlatList
        data={tasks}
  keyExtractor={(i: Task) => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={<Text style={styles.empty}>No tasks yet</Text>}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
        style={{ flex: 1 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    gap: 10,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  h1: { fontSize: 20, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#383838ff",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowTitle: { fontSize: 16, fontWeight: "600", color: "#222" },
  rowNotes: { marginTop: 4, color: "#555" },
  deleteBtn: {
    backgroundColor: "#d33",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
    completeBtn: {
    backgroundColor: "rgba(4, 205, 4, 1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  sep: { height: 1, backgroundColor: "#eee" },
  empty: { textAlign: "center", padding: 24, color: "#666" },
});
