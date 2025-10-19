// app/(tabs)/DragonScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import XPBar from '../../components/XP-bar';
import SlidingPanel from '../../components/sidebar';
import Bar from '../../components/hunger-happiness';
import { db } from '@/firebase/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DragonScreen() {
  const [xp, setXP] = useState(0);
  const [hunger, setHunger] = useState(50); // Fixed: Start at 50
  const [happiness, setHappiness] = useState(50); // Fixed: Start at 50
  const [foodPanelVisible, setFoodPanelVisible] = useState(false);
  const [activitiesPanelVisible, setActivitiesPanelVisible] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const dragPosition = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [draggingItem, setDraggingItem] = useState<{ name: string; value: number } | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  const dragonImage = isInteracting
    ? require('@/assets/images/dragon/dragon-eating.png')
    : require('@/assets/images/dragon/dragon-idle.png');

  const backgroundImage = require('@/assets/images/home-bg.png');

  const foods = [
    { name: 'Apple', value: 10 },
    { name: 'Gold Coin', value: 20 },
    { name: 'Treasure Chest', value: 40 },
  ];

  const activities = [
    { name: 'Play', value: 10 },
    { name: 'Cuddle', value: 15 },
    { name: 'Dance', value: 25 },
  ];

  const toggleFoodPanel = () => {
    setFoodPanelVisible((prev) => !prev);
    setActivitiesPanelVisible(false);
  };

  const toggleActivitiesPanel = () => {
    setActivitiesPanelVisible((prev) => !prev);
    setFoodPanelVisible(false);
  };

  // Gain XP every 3 minutes if full
  useEffect(() => {
    const xpInterval = setInterval(() => {
      if (hunger === 100 && happiness === 100) {
        setXP((prev) => Math.min(prev + 3, 100));
      }
    }, 10 * 1000);
    return () => clearInterval(xpInterval);
  }, [hunger, happiness]);

  // Decrease hunger and happiness every 5 minutes
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setHunger((prev) => Math.max(prev - 5, 0));
      setHappiness((prev) => Math.max(prev - 5, 0));
    }, 60 * 1000);
    return () => clearInterval(decayInterval);
  }, []);

  const feedDragon = (value: number) => {
    setIsInteracting(true);
    setHunger((prev) => Math.min(prev + value, 100));
    setTimeout(() => setIsInteracting(false), 2000);
  };

  const doActivity = (value: number) => {
    setIsInteracting(true);
    setHappiness((prev) => Math.min(prev + value, 100));
    setTimeout(() => setIsInteracting(false), 2000);
  };

  const createPanResponder = (item: { name: string; value: number }) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        setDraggingItem(item);
        setDragStartPos({ x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
        dragPosition.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: dragPosition.x, dy: dragPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        // Dragon area - adjusted for new position (higher and bigger)
        const dragonCenterX = SCREEN_WIDTH / 2;
        const dragonCenterY = SCREEN_HEIGHT * 0.35;
        const dragonSize = 150;
        
        // Calculate final touch position
        const finalX = dragStartPos.x + gesture.dx;
        const finalY = dragStartPos.y + gesture.dy;

        // Check if dropped on dragon
        const distance = Math.sqrt(
          Math.pow(finalX - dragonCenterX, 2) + 
          Math.pow(finalY - dragonCenterY, 2)
        );

        if (distance < dragonSize) {
          if (foodPanelVisible) feedDragon(item.value);
          if (activitiesPanelVisible) doActivity(item.value);
        }

        setDraggingItem(null);
        dragPosition.setValue({ x: 0, y: 0 });
      },
    });
  };

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.container}
      imageStyle={styles.backgroundImage} // Fixed: Position background to show left side
    >
      <View style={{ height: 70 }} />
      <XPBar xp={xp} />

      <View style={styles.barsContainer}>
        <Bar label="Hunger" value={hunger} color="#FF6B6B" />
        <Bar label="Happiness" value={happiness} color="#FFD93D" />
      </View>

      <View style={{ height: 30 }} />

      {/* Dragon - moved up and made bigger */}
      <View style={styles.mainArea}>
        <Image source={dragonImage} style={styles.dragon} />
      </View>

      {/* Dragging item preview - Fixed positioning */}
      {draggingItem && (
        <Animated.View
          style={[
            styles.dragItem,
            {
              left: dragStartPos.x - 40,
              top: dragStartPos.y - 25,
              transform: [
                { translateX: dragPosition.x },
                { translateY: dragPosition.y },
              ],
            },
          ]}
          pointerEvents="none"
        >
          <Text style={{ fontWeight: 'bold' }}>{draggingItem.name}</Text>
        </Animated.View>
      )}

      {/* Panels and Tabs */}
      <View style={styles.panelWrapper}>
        <SlidingPanel visible={foodPanelVisible} height={250}>
          {foods.map((food) => (
            <Animated.View
              key={food.name}
              {...createPanResponder(food).panHandlers}
            >
              <View style={styles.actionButton}>
                <Text>{food.name}</Text>
              </View>
            </Animated.View>
          ))}
        </SlidingPanel>

        <SlidingPanel visible={activitiesPanelVisible} height={250}>
          {activities.map((activity) => (
            <Animated.View
              key={activity.name}
              {...createPanResponder(activity).panHandlers}
            >
              <View style={styles.actionButton}>
                <Text>{activity.name}</Text>
              </View>
            </Animated.View>
          ))}
        </SlidingPanel>

        <View style={styles.bottomTabs}>
          <TouchableOpacity style={styles.tabButton} onPress={toggleFoodPanel}>
            <Text>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={toggleActivitiesPanel}>
            <Text>Activities</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    // Fixed: Position background to show left side
    resizeMode: 'cover',
    alignSelf: 'flex-start',
    width: '120%', // Make it wider to shift left
    left: '-10%', // Shift left to show left side of image
  },
  mainArea: {
    flex: 1,
    marginBottom: 12,
    justifyContent: 'flex-start', // Changed to move dragon up
    alignItems: 'center',
    paddingTop: 20, // Add some padding from top
  },
  dragon: {
    width: 280, // Increased from 200
    height: 280, // Increased from 200
    resizeMode: 'contain',
  },
  dragItem: {
    position: 'absolute',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  barsContainer: {
    marginBottom: 16,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  panelWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    width: '90%',
    zIndex: 10,
  },
  tabButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 3,
    minWidth: 100,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
});