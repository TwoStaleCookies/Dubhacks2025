import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

const LESSONS = [
  { id: '1', title: 'Intro to Dragons', duration: '5m', subtitle: 'Basics & lore' },
  { id: '2', title: 'Dragon Biology', duration: '8m', subtitle: 'Anatomy & senses' },
  { id: '3', title: 'Dragon Care 101', duration: '6m', subtitle: 'Feeding & habitat' },
];

export default function LessonsScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof LESSONS[number] }) => (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => {
        // navigate to a detail route when implemented
        router.push(`/lessons/${item.id}`);
      }}
    >
      <View style={styles.cardLeft}>
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Lessons' }} />
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImage: { width: '100%', height: 140 },
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f8fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  cardPressed: { opacity: 0.85 },
  thumbnail: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  cardLeft: { marginRight: 8 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: '#6b7280' },
  cardRight: { marginLeft: 8 },
  duration: { fontSize: 13, color: '#374151' },
});