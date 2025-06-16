import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';

export default function WorkoutsScreen() {
  const [workout, setWorkout] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submitWorkout = async () => {
    if (!workout.trim()) return Alert.alert('Please enter a workout description.');

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
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const displayWorkouts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/workouts`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to fetch workouts');

      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/recommend-workout`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to get recommendation');

      const data = await res.json();
      const splitLines = data.suggestion.split('\n').map(line => line.trim()).filter(Boolean);
      setRecommendations(splitLines);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏋️‍♂️ Workout Tracker</Text>

      <TextInput
        style={styles.input}
        placeholder="Log a workout (e.g. Pushups, Yoga...)"
        placeholderTextColor="#888"
        value={workout}
        onChangeText={setWorkout}
      />

      <TouchableOpacity style={styles.button} onPress={submitWorkout}>
        <Text style={styles.buttonText}>SUBMIT WORKOUT</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={displayWorkouts}>
        <Text style={styles.buttonText}>SHOW MY WORKOUTS</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.success}>{message}</Text> : null}
      {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 20 }} />}

      {workouts.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.subTitle}>📝 My Workouts:</Text>
          {workouts.map((w, i) => (
            <Text key={i} style={styles.listItem}>
              {i + 1}. {w.description}
            </Text>
          ))}
        </View>
      )}

      <Text style={styles.subTitle}>AI Recommendations</Text>

      <TouchableOpacity style={styles.button} onPress={getRecommendations}>
        <Text style={styles.buttonText}>GET RECOMMENDATIONS</Text>
      </TouchableOpacity>

      {recommendations.length > 0 && (
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationTitle}>💡 Suggested Workouts:</Text>
          {recommendations.map((r, i) => (
            <View key={i} style={styles.recommendationRow}>
              <Text style={styles.recommendationBullet}>{i + 1}.</Text>
              <Text style={styles.recommendationText}>{r.replace(/^\d+\.\s*/, '')}</Text>
            </View>
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
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  subTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 12
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 14,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 16
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 10
  },
  buttonSecondary: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16
  },
  success: {
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 16
  },
  listSection: {
    marginTop: 10
  },
  listItem: {
    color: '#ccc',
    fontSize: 15,
    marginBottom: 4,
    paddingLeft: 8
  },
  recommendationSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4EA6EA',
    marginBottom: 12,
    textAlign: 'left',
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  recommendationBullet: {
    color: '#fff',
    width: 24,
    textAlign: 'right',
    paddingRight: 6,
    fontSize: 16,
  },
  recommendationText: {
    color: '#fff',
    fontSize: 16,
    flexShrink: 1,
  },
});
