import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';

const API_URL = "http://localhost:3001"; // Change to your IP if testing on physical device

export default function MealsScreen() {
  const [meal, setMeal] = useState({
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });
  const [meals, setMeals] = useState([]);
  const [dailyTotal, setDailyTotal] = useState({ calories: 0, protein: 0 });

  // Load meals on component mount
  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/api/meals/1?date=${today}`);
      const data = await response.json();
      setMeals(data);
      updateDailyTotals(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load meals");
    }
  };

  const updateDailyTotals = (meals) => {
    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein
    }), { calories: 0, protein: 0 });
    setDailyTotal(totals);
  };

  const handleInputChange = (field, value) => {
    setMeal(prev => ({ ...prev, [field]: value }));
  };

  const logMeal = async () => {
    try {
      const response = await fetch(`${API_URL}/api/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          ...meal,
          calories: Number(meal.calories),
          protein: Number(meal.protein),
          carbs: Number(meal.carbs),
          fats: Number(meal.fats)
        })
      });
      
      const result = await response.json();
      setMeals([...meals, result.meal]);
      setDailyTotal({
        calories: dailyTotal.calories + result.meal.calories,
        protein: dailyTotal.protein + result.meal.protein
      });
      setMeal({ description: '', calories: '', protein: '', carbs: '', fats: '' });
      Alert.alert("Success", "Meal logged successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to log meal");
    }
  };

  const analyzeMeal = async () => {
    if (!meal.description.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/api/analyze-meal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: meal.description })
      });
      const data = await response.json();
      setMeal(prev => ({
        ...prev,
        calories: data.calories.toString(),
        protein: data.protein_g.toString(),
        carbs: data.carbs_g.toString(),
        fats: data.fats_g.toString()
      }));
    } catch (error) {
      Alert.alert("Error", "Could not analyze meal");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meal Tracker</Text>
      <Text style={styles.subheader}>
        Today: {dailyTotal.calories} kcal | {dailyTotal.protein}g protein
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Describe your meal"
        value={meal.description}
        onChangeText={(text) => handleInputChange('description', text)}
        onSubmitEditing={analyzeMeal}
      />

      <View style={styles.nutritionRow}>
        <TextInput
          style={styles.nutritionInput}
          placeholder="Calories"
          keyboardType="numeric"
          value={meal.calories}
          onChangeText={(text) => handleInputChange('calories', text)}
        />
        <TextInput
          style={styles.nutritionInput}
          placeholder="Protein (g)"
          keyboardType="numeric"
          value={meal.protein}
          onChangeText={(text) => handleInputChange('protein', text)}
        />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Analyze" onPress={analyzeMeal} />
        <Button title="Log Meal" onPress={logMeal} color="#4CAF50" />
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealCard}>
            <Text style={styles.mealTitle}>{item.description}</Text>
            <Text style={styles.mealDetails}>
              {item.calories} kcal • P: {item.protein}g • C: {item.carbs}g • F: {item.fats}g
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9'
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  nutritionInput: {
    width: '48%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f9f9f9'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  mealCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  mealTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 5
  },
  mealDetails: {
    color: '#666'
  }
});