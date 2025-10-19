import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';

interface XPBarProps {
  xp: number;
}

export default function XPBar({ xp }: XPBarProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: xp,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [xp]);

  const widthInterpolated = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.barContainer}>
      <Text style={styles.label}>XP: {xp}/100</Text>
      <View style={styles.barBackground}>
        <Animated.View style={[styles.barFill, { width: widthInterpolated }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    marginTop: 40,
    marginHorizontal: 20,
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
    backgroundColor: '#4b9cd3',
    borderRadius: 8,
  },
});
