import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fitness Tracker</Text>

      <Pressable onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.link}>Profile</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Workouts')}>
        <Text style={styles.link}>Workouts</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Meals')}>
        <Text style={styles.link}>Meals</Text>
      </Pressable>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  link: {
    fontSize: 18,
    color: '#007bff',
    textDecorationLine: 'underline',
  },
});
