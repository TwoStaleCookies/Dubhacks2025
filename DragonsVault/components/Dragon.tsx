import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface DragonBlobProps {
  xp: number;
}

export default function DragonBlob({ xp }: DragonBlobProps) {
  const scale = 1 + xp / 200; // subtle growth as XP increases

  return (
    <Animated.View
      style={[
        styles.dragon,
        { transform: [{ scale }] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dragon: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#4b9cd3',
    borderWidth: 4,
    borderColor: '#2c6f91',
  },
});
