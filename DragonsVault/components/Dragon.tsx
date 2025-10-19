import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

export default function Dragon({ dragonState }: { dragonState: 'idle' | 'eating' | 'happy' }) {
  let dragonImage;

  switch (dragonState) {
    case 'eating':
      dragonImage = require('@/assets/images/dragon/dragon-eating.png');
      break;
    case 'happy':
      dragonImage = require('@/assets/images/dragon/dragon-happy.png');
      break;
    default:
      dragonImage = require('@/assets/images/dragon/dragon-idle.png');
      break;
  }

  return (
    <View style={styles.container}>
      <Image source={dragonImage} style={styles.dragonImage} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragonImage: {
    width: 250,
    height: 250,
  },
});
