import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';

export default function WorkoutsScreen() {
  const [workout, setWorkout] = useState('');
  const [goal, setGoal] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [message, setMessage] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  const submitWorkout = async () => {
    if (!workout.trim()) return Alert.alert('Please enter a workout.');
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ description: workout })
      });
      if (!res.ok) throw new Error('Failed to save workout');
      setWorkout('');
      setMessage('Workout saved!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const displayWorkouts = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/workouts?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch workouts');
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const getRecommendations = () => {
    if (!goal.trim()) {
      Alert.alert('Please enter a goal (e.g., strength, cardio)');
      return;
    }

    const g = goal.toLowerCase();
    let recs = [];

    if (g.includes('strength')) {
      recs = ['Deadlifts', 'Bench Press', 'Squats'];
    } else if (g.includes('cardio')) {
      recs = ['Running', 'Cycling', 'Jump Rope'];
    } else if (g.includes('flexibility')) {
      recs = ['Yoga', 'Stretching', 'Pilates'];
    } else {
      recs = ['Push-ups', 'Planks', 'Burpees'];
    }

    setRecommendations(recs);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log/Display Workouts</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter workout"
        placeholderTextColor="#999"
        value={workout}
        onChangeText={setWorkout}
      />

      <TouchableOpacity style={styles.button} onPress={submitWorkout}>
        <Text style={styles.buttonText}>SUBMIT WORKOUT</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={displayWorkouts}>
        <Text style={styles.buttonText}>DISPLAY WORKOUTS</Text>
      </TouchableOpacity>

      {workouts.length > 0 ? (
        workouts.map((w, i) => (
          <Text key={i} style={styles.workoutItem}>
            {i + 1}. {w.description}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyText}>No workouts found.</Text>
      )}

      <Text style={styles.subTitle}>Get Workout Recommendations</Text>

      <TextInput
        style={styles.input}
        placeholder="What do you want to work on?"
        placeholderTextColor="#999"
        value={goal}
        onChangeText={setGoal}
      />

      <TouchableOpacity style={styles.button} onPress={getRecommendations}>
        <Text style={styles.buttonText}>GET RECOMMENDATIONS</Text>
      </TouchableOpacity>

      {recommendations.length > 0 && (
        <View style={{ marginTop: 16 }}>
          <Text style={styles.subTitle}>Recommended:</Text>
          {recommendations.map((r, i) => (
            <Text key={i} style={styles.recommendation}>
              • {r}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 20,
    flexGrow: 1
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16
  },
  subTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 24
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 12
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  },
  workoutItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4
  },
  recommendation: {
    color: '#00FF99',
    fontSize: 16,
    paddingLeft: 6,
    marginBottom: 4
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8
  }
});


