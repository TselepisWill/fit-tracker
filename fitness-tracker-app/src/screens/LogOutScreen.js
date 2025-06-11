import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogOutScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); 
      navigation.reset({
        index: 0,
        routes: [{ name: 'LogIn' }]          
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Are you sure you want to log out?</Text>
      <View style={s.row}>
        <TouchableOpacity style={s.btn} onPress={handleLogout}>
          <Text style={s.btnTxt}>Yes, log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btn, s.cancel]} onPress={() => navigation.goBack()}>
          <Text style={s.btnTxt}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%'
  },
  btn: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 6
  },
  cancel: {
    backgroundColor: '#777'
  },
  btnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13
  }
});

