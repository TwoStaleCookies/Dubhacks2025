import { Stack } from 'expo-router';
import React from 'react';

export default function ParentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}