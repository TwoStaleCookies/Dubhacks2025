import React, { useState } from "react";
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

type Task = {
  id: string;
  title: string;
  notes?: string;
  createdAt: number;
};

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  function addTask() {
    const t = title.trim();
    const n = notes.trim();
    if (!t) return; // simple validation
    setTasks((prev) => [
      { id: Math.random().toString(36).slice(2), title: t, notes: n || undefined, createdAt: Date.now() },
      ...prev,
    ]);
    setTitle("");
    setNotes("");
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((x) => x.id !== id));
  }

  const renderItem = ({ item }: { item: Task }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
        {!!item.notes && <Text style={styles.rowNotes} numberOfLines={3}>{item.notes}</Text>}
      </View>
      <Pressable onPress={() => removeTask(item.id)} style={styles.deleteBtn}>
        <Text style={{ color: "white", fontWeight: "700" }}>Delete</Text>
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
          style={[styles.input, { minHeight: 48 }]}
          returnKeyType="next"
        />

        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes / description"
          multiline
          style={[styles.input, { minHeight: 84, textAlignVertical: "top" }]}
        />

        <Button title="Add" onPress={addTask} />
      </View>

      {/* Scrolling list */}
      <FlatList
        data={tasks}
        keyExtractor={(i) => i.id}
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
    borderColor: "#ccc",
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
  },
  sep: { height: 1, backgroundColor: "#eee" },
  empty: { textAlign: "center", padding: 24, color: "#666" },
});
