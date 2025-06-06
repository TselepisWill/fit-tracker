import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';

export default function WorkoutsScreen() {
  const [workoutText, setWorkoutText] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [message, setMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const userId = 1;

  const submitWorkout = async () => {
    if (!workoutText.trim()) {
      Alert.alert('Please enter a workout description.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, description: workoutText }),
      });

      if (res.ok) {
        setWorkoutText('');
        setMessage('Workout saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to save workout');
      }
    } catch (err) {
      console.error('Error submitting workout:', err);
      Alert.alert('Error', 'Could not submit workout.');
    }
  };

  const fetchWorkouts = async () => {
    try {
      setWorkouts([]);
      const res = await fetch(`http://localhost:3001/api/workouts/${userId}?t=${Date.now()}`);
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      Alert.alert('Error', 'Could not fetch workouts.');
    }
  };

  const handleAiSubmit = () => {
    // Placeholder for your team to implement OpenAI fetch
    setAiResponse('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log/Display Workouts</Text>

        {message ? <Text style={styles.success}>{message}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Enter workout"
          placeholderTextColor="#888"
          value={workoutText}
          onChangeText={setWorkoutText}
        />

        <TouchableOpacity style={styles.button} onPress={submitWorkout}>
          <Text style={styles.buttonText}>SUBMIT WORKOUT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={fetchWorkouts}>
          <Text style={styles.buttonText}>DISPLAY WORKOUTS</Text>
        </TouchableOpacity>

        {workouts.length > 0 ? (
          workouts.map((w, i) => (
            <Text key={i} style={styles.item}>
              {i + 1}. {w.description}
            </Text>
          ))
        ) : (
          <Text style={styles.empty}>No workouts found.</Text>
        )}

        <View style={{ marginTop: 30 }}>
          <Text style={styles.title}>Get Workout Recommendations</Text>

          <TextInput
            style={styles.input}
            placeholder="What do you want to work on?"
            placeholderTextColor="#888"
            value={aiPrompt}
            onChangeText={setAiPrompt}
          />

          <TouchableOpacity style={styles.button} onPress={handleAiSubmit}>
            <Text style={styles.buttonText}>GET RECOMMENDATIONS</Text>
          </TouchableOpacity>

          {aiResponse ? (
            <Text style={styles.item}>{aiResponse}</Text>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#121212',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 18,
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 6,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
  },
  item: {
    fontSize: 18,
    paddingVertical: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    textAlign: 'left',
    paddingHorizontal: 5,
    color: '#fff',
  },
  empty: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
    fontSize: 16,
  },
});


