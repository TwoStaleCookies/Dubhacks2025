// app/(tabs)/DragonScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DragonBlob from '../../components/Dragon';
import XPBar from '../../components/XP-bar';
import SlidingPanel from '../../components/sidebar';
import Bar from '../../components/hunger-happiness';
import { db } from '@/firebase/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function DragonScreen() {
  const [xp, setXP] = useState<number>(0);
  const [hunger, setHunger] = useState<number>(0);
  const [happiness, setHappiness] = useState<number>(0);

  const [foodPanelVisible, setFoodPanelVisible] = useState<boolean>(false);
  const [activitiesPanelVisible, setActivitiesPanelVisible] = useState<boolean>(false);

  const toggleFoodPanel = () => {
    setFoodPanelVisible((prev) => !prev);
    setActivitiesPanelVisible(false); // close activities panel
  };

  const toggleActivitiesPanel = () => {
    setActivitiesPanelVisible((prev) => !prev);
    setFoodPanelVisible(false); // close food panel
  };

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

  // Whenever hunger and happiness are both full (>=100), increase XP by 2
  useEffect(() => {
    if (hunger >= 100 && happiness >= 100) {
      setXP((prev) => prev + 2);
      // Optionally reset hunger and happiness
      setHunger(0);
      setHappiness(0);
    }
    (async () => {
      try {
        const ref = doc(db, "test", "ping");
        await setDoc(ref, { ok: true, time: Date.now() });
        const snap = await getDoc(ref);
        console.log("🔥 Firebase connected! Data:", snap.data());
      } catch (err) {
        console.error("💀 Firebase NOT connected:", err);
      }
    })();
  }, [hunger, happiness]);

  const feedDragon = (value: number) => {
    setHunger((prev) => Math.min(prev + value, 100));
  };

  const doActivity = (value: number) => {
    setHappiness((prev) => Math.min(prev + value, 100));
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 70 }} />
      {/* XP Bar at top */}
      <XPBar xp={xp} />

      {/* Hunger & Happiness Bars */}
      <View style={styles.barsContainer}>
        <Bar label="Hunger" value={hunger} color="#FF6B6B" />
        <Bar label="Happiness" value={happiness} color="#FFD93D" />
      </View>

      <View style={{ height: 70 }} />

      {/* Dragon in center */}
      <View style={styles.mainArea}>
        <DragonBlob xp={xp} />
      </View>

      {/* Bottom Tabs */}
      <View style={styles.panelWrapper}>
        {/* Sliding Panel */}
        <SlidingPanel visible={foodPanelVisible} height={250}>
          {foods.map((food) => (
            <TouchableOpacity
              key={food.name}
              style={styles.actionButton}
              onPress={() => feedDragon(food.value)}
            >
              <Text>{food.name} (+{food.value} Hunger)</Text>
            </TouchableOpacity>
          ))}
        </SlidingPanel>

        <SlidingPanel visible={activitiesPanelVisible} height={250}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.name}
              style={styles.actionButton}
              onPress={() => doActivity(activity.value)}
            >
              <Text>{activity.name} (+{activity.value} Happiness)</Text>
            </TouchableOpacity>
          ))}
        </SlidingPanel>

        {/* Tabs always on top of panels */}
        <View style={styles.bottomTabs}>
          <TouchableOpacity style={styles.tabButton} onPress={toggleFoodPanel}>
            <Text>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={toggleActivitiesPanel}>
            <Text>Activities</Text>
          </TouchableOpacity>
        </View>
      </View>

  </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  mainArea: {
    flex: 1,
    marginBottom: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    zIndex: 10, // make sure tabs are above the panel
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
