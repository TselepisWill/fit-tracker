import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const userId = 1; 

  useEffect(() => {
    fetch(`http://10.0.0.232:3001/api/profile/${userId}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error('Error loading profile:', err));
  }, []);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <Text style={styles.info}>Username: {profile.username}</Text>
      <Text style={styles.info}>Email: {profile.email}</Text>
      <Text style={styles.info}>Total Workouts: {profile.totalWorkouts}</Text>
      <Text style={styles.info}>Total Meals Logged: {profile.totalMeals}</Text>
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
