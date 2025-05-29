import React, { useEffect, useState } from 'react';
import {
 View,
 Text,
 StyleSheet,
 ActivityIndicator,
 ScrollView,
 Platform,
 Alert,
} from 'react-native';


const BASE_URL = Platform.select({
 ios: 'http://10.0.0.232:3001',
 android: 'http://10.0.2.2:3001',
 default: 'http://75.102.235.226:3001',
});


export default function ProfileScreen() {
 const [profile, setProfile] = useState(null);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(true);
 const userId = 1;


 useEffect(() => {
   const fetchProfile = async () => {
     try {
       const res = await fetch(`${BASE_URL}/api/profile/${userId}`);
       if (!res.ok) throw new Error('Failed to load profile');
       const data = await res.json();
       setProfile(data);
     } catch (err) {
       console.error('Error loading profile:', err);
       setError('Could not load profile.');
       Alert.alert('Error', 'Unable to load user profile.');
     } finally {
       setLoading(false);
     }
   };


   fetchProfile();
 }, []);


 if (loading) {
   return (
     <View style={styles.centered}>
       <ActivityIndicator size="large" color="#4CAF50" />
       <Text style={styles.loadingText}>Loading Profile...</Text>
     </View>
   );
 }


 if (error || !profile) {
   return (
     <View style={styles.centered}>
       <Text style={styles.errorText}>{error || 'Profile not found.'}</Text>
     </View>
   );
 }


 return (
   <ScrollView contentContainerStyle={styles.container}>
     <Text style={styles.title}> User Profile</Text>


     <View style={styles.card}>
       <Text style={styles.label}> Username</Text>
       <Text style={styles.value}>{profile.username}</Text>


       <Text style={styles.label}> Email</Text>
       <Text style={styles.value}>{profile.email}</Text>
     </View>


     <View style={styles.card}>
       <Text style={styles.label}> Total Workouts</Text>
       <Text style={styles.value}>{profile.totalWorkouts}</Text>


       <Text style={styles.label}> Meals Logged</Text>
       <Text style={styles.value}>{profile.totalMeals}</Text>
     </View>


     <View style={styles.card}>
       <Text style={styles.label}> Calories Today</Text>
       <Text style={styles.value}>{profile.todayCalories} kcal</Text>


       <Text style={styles.label}> Protein Today</Text>
       <Text style={styles.value}>{profile.todayProtein} g</Text>
     </View>
   </ScrollView>
 );
}


const styles = StyleSheet.create({
 container: {
   paddingVertical: 30,
   paddingHorizontal: 16,
   alignItems: 'center',
   backgroundColor: '121212',
   minHeight: '100%',
 },
 centered: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#000',
 },
 title: {
   fontSize: 24,
   fontWeight: '600',
   marginBottom: 20,
   color: '#fff',
   textAlign: 'center',
 },
 card: {
   backgroundColor: '#000',
   padding: 12,
   borderRadius: 10,
   marginBottom: 12,
   width: '100%',
   elevation: 2,
   shadowColor: '#aaa',
   shadowOpacity: 0.08,
   shadowOffset: { width: 0, height: 2 },
   shadowRadius: 4,
 },
 label: {
   fontSize: 13,
   fontWeight: '500',
   color: '#555',
   marginTop: 8,
 },
 value: {
   fontSize: 15,
   fontWeight: '600',
   color: '#111',
   marginTop: 2,
 },
 loadingText: {
   marginTop: 10,
   fontSize: 15,
   color: '#666',
 },
 errorText: {
   fontSize: 15,
   color: 'red',
   textAlign: 'center',
 },
});

