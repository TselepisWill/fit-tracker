import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

export default function MealsScreen() {
  const [mealText, setMealText] = useState('');

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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
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
    width: '100%',
  },
});
