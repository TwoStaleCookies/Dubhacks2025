import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: { fontSize: 12 },
      }}>
    


      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarLabelStyle: { fontSize: 20 },
          tabBarIcon: ({ color }) => <IconSymbol size={0} name="tasks.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabelStyle: { fontSize: 20 },
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="egg.fill" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="lessons"
        options={{
          title: 'Lessons',
          tabBarLabelStyle: { fontSize: 20 },
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="books.fill" size={0} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
