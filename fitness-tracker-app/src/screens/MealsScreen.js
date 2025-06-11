import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { getAuth } from '../utils/authStorage';

const API_URL = 'http://10.0.0.232:3001';

export default function MealsScreen() {
  const [meal, setMeal] = useState({
    description: '', calories: '', protein: '', carbs: '', fats: ''
  });
  const [meals, setMeals] = useState([]);
  const [message, setMessage] = useState('');
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const loadAuth = async () => {
      const authData = await getAuth();
      if (!authData) {
        Alert.alert('Auth required', 'Please log in');
        return;
      }
      setAuth(authData);
      fetchMeals(authData);
    };

    loadAuth();
  }, []);

  const submitMeal = async () => {
    if (!meal.description.trim()) {
      Alert.alert('Please enter a meal description.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/meals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          description: meal.description,
          calories: Number(meal.calories) || 0,
          protein: Number(meal.protein) || 0,
          carbs: Number(meal.carbs) || 0,
          fats: Number(meal.fats) || 0
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error logging meal');

      setMeal({ description: '', calories: '', protein: '', carbs: '', fats: '' });
      setMessage('Meal logged!');
      setMeals([data.meal, ...meals]);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting meal:', err);
      Alert.alert('Error', 'Could not log meal.');
    }
  };

  const fetchMeals = async (authData = auth) => {
    try {
      const res = await fetch(`${API_URL}/api/meals`, {
        headers: { 'Authorization': `Bearer ${authData.token}` }
      });
      const data = await res.json();
      setMeals(data);
    } catch (err) {
      console.error('Error fetching meals:', err);
      Alert.alert('Error', 'Could not fetch meals.');
    }
  };

  const handleInputChange = (field, value) => {
    setMeal(prev => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Meal Tracker</Text>
        {message ? <Text style={styles.success}>{message}</Text> : null}

        <TextInput style={styles.input} placeholder="What did you eat?" placeholderTextColor="#888"
          value={meal.description} onChangeText={(text) => handleInputChange('description', text)} />

        <View style={styles.nutritionRow}>
          <TextInput style={[styles.input, styles.nutritionInput]} placeholder="Calories" placeholderTextColor="#888"
            keyboardType="numeric" value={meal.calories}
            onChangeText={(text) => handleInputChange('calories', text)} />
          <TextInput style={[styles.input, styles.nutritionInput]} placeholder="Protein (g)" placeholderTextColor="#888"
            keyboardType="numeric" value={meal.protein}
            onChangeText={(text) => handleInputChange('protein', text)} />
        </View>

        <View style={styles.nutritionRow}>
          <TextInput style={[styles.input, styles.nutritionInput]} placeholder="Carbs (g)" placeholderTextColor="#888"
            keyboardType="numeric" value={meal.carbs}
            onChangeText={(text) => handleInputChange('carbs', text)} />
          <TextInput style={[styles.input, styles.nutritionInput]} placeholder="Fats (g)" placeholderTextColor="#888"
            keyboardType="numeric" value={meal.fats}
            onChangeText={(text) => handleInputChange('fats', text)} />
        </View>

        <TouchableOpacity style={styles.button} onPress={submitMeal}>
          <Text style={styles.buttonText}>LOG MEAL</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.refreshButton]} onPress={fetchMeals}>
          <Text style={[styles.buttonText, styles.refreshButtonText]}>REFRESH MEALS</Text>
        </TouchableOpacity>

        {meals.length > 0 ? meals.map((m, i) => (
          <View key={i} style={styles.mealItem}>
            <Text style={styles.mealDescription}>{m.description}</Text>
            <View style={styles.macroRow}>
              <Text style={styles.macroText}>{m.calories} kcal</Text>
              <Text style={styles.macroText}>P: {m.protein}g</Text>
              <Text style={styles.macroText}>C: {m.carbs}g</Text>
              <Text style={styles.macroText}>F: {m.fats}g</Text>
            </View>
            <Text style={styles.mealTime}>
              {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        )) : <Text style={styles.empty}>No meals logged today.</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#121212', paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#4CAF50' },
  input: {
    borderColor: '#ddd', borderWidth: 1, borderRadius: 8, padding: 14,
    marginBottom: 12, fontSize: 16, backgroundColor: '#1a1a1a', color: '#fff',
  },
  nutritionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  nutritionInput: { width: '48%' },
  button: {
    backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 8,
    marginBottom: 12, elevation: 2,
  },
  refreshButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#4CAF50' },
  buttonText: { color: '#fff', fontWeight: '600', textAlign: 'center', fontSize: 16 },
  refreshButtonText: { color: '#4CAF50' },
  mealItem: {
    backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12,
    marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#4CAF50',
  },
  mealDescription: { fontSize: 16, fontWeight: '500', marginBottom: 6 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  macroText: { fontSize: 14, color: '#555' },
  mealTime: { fontSize: 12, color: '#888', textAlign: 'right', marginTop: 4 },
  empty: { fontSize: 16, fontStyle: 'italic', color: '#888', textAlign: 'center', marginTop: 20 },
  success: { color: '#4CAF50', textAlign: 'center', marginBottom: 10, fontWeight: '500', fontSize: 16 },
});
