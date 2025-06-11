import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator,
  ScrollView, Alert, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/profile`, {
        headers:{ Authorization:`Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load');
      setProfile(await res.json());
    } catch (err) {
      Alert.alert('Error','Could not load profile');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#4CAF50" />
      <Text style={styles.loading}>Loading…</Text>
    </View>
  );
  if (!profile) return (
    <View style={styles.center}>
      <Text style={styles.error}>No profile</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {[
        ['Username', profile.username],
        ['Email',    profile.email],
        ['Workouts', profile.totalWorkouts],
        ['Meals',    profile.totalMeals],
        ['Calories', `${profile.todayCalories} kcal`],
        ['Protein',  `${profile.todayProtein} g`],
      ].map(([label,val])=>(
        <View key={label} style={styles.card}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{val}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ padding:20, backgroundColor:'#121212', alignItems:'center' },
  center:{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#121212' },
  loading:{ marginTop:10, color:'#888' },
  error:{ color:'red', fontSize:16 },
  title:{ fontSize:24, fontWeight:'600', color:'#fff', marginBottom:20 },
  card:{
    backgroundColor:'#1e1e1e',
    padding:12,
    borderRadius:10,
    width:'100%',
    marginBottom:12
  },
  label:{ fontSize:14, color:'#aaa' },
  value:{ fontSize:16, color:'#fff', marginTop:4 }
});
