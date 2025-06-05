import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Fitness Tracker</Text>
      <Text style={styles.subText}>Track your health, meals, and workouts smarter.</Text>

      <View style={styles.buttonGroup}>
        

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.cardContent}>
            <MaterialCommunityIcons name="account-circle" size={32} color="#4FC3F7" />
            <Text style={styles.cardText}>Profile</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Workouts')}>
          <View style={styles.cardContent}>
            <MaterialCommunityIcons name="dumbbell" size={32} color="#81C784" />
            <Text style={styles.cardText}>Workouts</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Meals')}>
          <View style={styles.cardContent}>
            <MaterialCommunityIcons name="food-apple" size={32} color="#FFB74D" />
            <Text style={styles.cardText}>Meals</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FAFAFA',
  },
  subText: {
    fontSize: 16,
    color: '#B0BEC5',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  buttonGroup: {
    width: '100%',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '80%',
  },
  logoutCard: {
    backgroundColor: '#2B1A1A',
  },
  cardText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FAFAFA',
    textAlign: 'center',
    marginLeft: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


