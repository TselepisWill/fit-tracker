import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.info}>Username: (coming soon)</Text>
      <Text style={styles.info}>Email: (coming soon)</Text>
      <Text style={styles.info}>Total Workouts: (coming soon)</Text>
      <Text style={styles.info}>Total Meals Logged: (coming soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});
