import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { BASE_URL } from './config';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const handleAuth = async () => {
    const url = `${BASE_URL}/api/${isLogin ? 'login' : 'register'}`;
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.error || 'Something went wrong');
        return;
      }

      localStorage.setItem('token', data.token); // or AsyncStorage for native

      Alert.alert('Success', `${isLogin ? 'Login' : 'Registration'} successful`);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

    } catch (err) {
      Alert.alert('Network Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Log In' : 'Sign Up'}</Text>

      {!isLogin && (
        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      )}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button title={isLogin ? 'LOGIN' : 'REGISTER'} onPress={handleAuth} />

      <TouchableOpacity onPress={toggleMode}>
        <Text style={styles.link}>
          {isLogin ? `Don't have one? Sign Up →` : 'Already have an account? Log In →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6
  },
  link: {
    color: '#4EA6EA',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 15
  }
});
