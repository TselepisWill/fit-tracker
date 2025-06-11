import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Fitness Tracker</Text>
      <Text style={{ color: '#aaa', marginBottom: 20, textAlign: 'center' }}>
        Track your health, meals, and workouts smarter.
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Profile')}
      >
        <MaterialCommunityIcons name="account-circle" size={24} color="#2196F3" style={{ marginRight: 10 }} />
        <Text style={styles.cardText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Workouts')}
      >
        <MaterialCommunityIcons name="dumbbell" size={24} color="#4CAF50" style={{ marginRight: 10 }} />
        <Text style={styles.cardText}>Workouts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('Meals')}
      >
        <MaterialCommunityIcons name="food-apple" size={24} color="#FF9800" style={{ marginRight: 10 }} />
        <Text style={styles.cardText}>Meals</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    width: '100%',
    marginVertical: 8,
  },
  cardText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
};


