import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function LogOutScreen({ navigation }) {
  const handleLogout = () => {
    // Clear auth state if needed
    navigation.navigate('Log-In');
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to log out?</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#121212',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 30,
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    gap: 16, // Optional: adds space between buttons
  },
  button: {
    width: '45%',
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 6,
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#777',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
  },
});
