import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

export default function MealsScreen() {
  const [mealText, setMealText] = useState('');
  const [workouts, setWorkouts] = useState([]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meals</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter meal"
        value={mealText}
        onChangeText={setMealText}
      />

      <View style={styles.button}>
        <Button title="Submit Meal" onPress={() => {}} />
      </View>

      <View style={styles.button}>
        <Button title="Display Meals" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',     // start higher on the screen
    alignItems: 'flex-start',         // align to the left
    paddingHorizontal: 20,
    paddingTop: 80,                   // move content down from the top
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: 250,                       // narrower input box
    height: 50,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    width: 150,                       // narrower button
  },
});
