import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

const LESSONS = [
  { id: '1', title: 'Treasure Trades!', duration: '5m', subtitle: 'Spend your gold wisely' },
  { id: '2', title: 'Quest Planning?', duration: '10m', subtitle: 'Plan your adventures and reach new heights' },
  { id: '3', title: 'Gold Guarding!', duration: '8m', subtitle: 'Budget your coins' },
  { id: '4', title: 'Hoarding?', duration: '6m', subtitle: 'Save gems, treasures, and loot' },
  

];

type ChatMsg = { id: string; role: 'user' | 'assistant'; text: string };

// Replace with your Gemini API key (for development only)
const GEMINI_API_KEY = 'SDKJDALKSJDALSKJDLASKJDLAKSDJ';

export default function LessonsScreen() {
  const router = useRouter();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item }: { item: typeof LESSONS[number] }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardLeft}>
        <Image
          source={require('@/assets/images/actual_gold_drago.png')}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.duration}>{item.duration}</Text>
      </View>
    </Pressable>
  );

  async function generateTextDirect(prompt: string): Promise<string> {
    try {
      const resp = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-turbo:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GEMINI_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: { text: prompt },
            maxOutputTokens: 200,
          }),
        }
      );

      const data = await resp.json();

      // Extract text safely
      const text =
        data?.candidates?.[0]?.content?.text ??
        data?.output?.[0]?.content?.text ??
        JSON.stringify(data);

      return text;
    } catch (err) {
      console.error('GenAI call failed', err);
      return 'Error generating response.';
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMsg = { id: String(Date.now()), role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    const replyText = await generateTextDirect(text);

    const assistantMsg: ChatMsg = { id: String(Date.now() + 1), role: 'assistant', text: replyText };
    setMessages((m) => [...m, assistantMsg]);
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Lessons' }} />
      {!chatOpen && (
        <>
          <Image
            source={require('@/assets/images/drago_eater.png')}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <FlatList
            data={LESSONS}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity style={styles.chatButton} onPress={() => setChatOpen(true)}>
            <Text style={styles.chatButtonText}>Chat with Tutor</Text>
          </TouchableOpacity>
        </>
      )}

      {chatOpen && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Tutor Chat</Text>
            <TouchableOpacity onPress={() => setChatOpen(false)}>
              <Text style={styles.chatClose}>Close</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.chatList}
            renderItem={({ item }) => (
              <View style={[styles.chatBubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                <Text style={styles.chatText}>{item.text}</Text>
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={loading ? 'Waiting...' : 'Ask a question'}
              style={styles.textInput}
              editable={!loading}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity onPress={sendMessage} disabled={loading} style={styles.sendButton}>
              <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#a9ecffff' },
  headerImage: { width: '100%', height: 140 },
  list: { padding: 16, paddingTop: 10 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffffff', padding: 20, borderRadius: 20, marginBottom: 20, marginTop:0 },
  cardPressed: { opacity: 0.85 },
  thumbnail: { width: 56, height: 56, borderRadius: 400, marginRight: 12 },
  cardLeft: { marginRight: 8 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: '#6b7280' },
  cardRight: { marginLeft: 8 },
  duration: { fontSize: 13, color: '#374151' },
  chatButton: { position: 'absolute', right: 16, bottom: 24, backgroundColor: '#4a83ffff', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 24, elevation: 3 },
  chatButtonText: { color: '#fff', fontWeight: '600' },
  chatContainer: { flex: 1, padding: 12 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  chatTitle: { fontSize: 18, fontWeight: '700' },
  chatClose: { color: '#2563eb' },
  chatList: { paddingVertical: 8 },
  chatBubble: { marginVertical: 6, padding: 10, borderRadius: 8, maxWidth: '80%' },
  userBubble: { backgroundColor: '#dbeafe', alignSelf: 'flex-end' },
  assistantBubble: { backgroundColor: '#f3f4f6', alignSelf: 'flex-start' },
  chatText: { fontSize: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingTop: 8 },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  sendButton: { backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  sendText: { color: '#fff', fontWeight: '600' },
});
