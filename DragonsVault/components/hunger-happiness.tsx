import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface BarProps {
  label: string;
  value: number; // 0-100
  color: string;
}

export default function Bar({ label, value, color }: BarProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolated = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}: {value}/100</Text>
      <View style={styles.barBackground}>
        <Animated.View
          style={[styles.barFill, { width: widthInterpolated, backgroundColor: color }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  label: {
    fontWeight: '600',
    marginBottom: 4,
  },
  barBackground: {
    width: '100%',
    height: 14,
    backgroundColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
  },
});
