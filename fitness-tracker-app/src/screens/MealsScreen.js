import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView,
  Platform, Alert, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './config';

export default function MealsScreen() {
  const [meal,   setMeal]   = useState({ desc:'', cal:'', pro:'', carb:'', fat:'' });
  const [log,    setLog]    = useState([]);
  const [info,   setInfo]   = useState('');

  useEffect(() => { fetchMeals(); }, []);

  const fetchMeals = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const today = new Date().toISOString().slice(0,10);
      const res = await fetch(`${BASE_URL}/api/meals?date=${today}`, {
        headers:{ Authorization:`Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Fetch failed');
      setLog(await res.json());
    } catch(err) {
      Alert.alert('Error', err.message);
    }
  };

  const submitMeal = async () => {
    if (!meal.desc.trim()) {
      return Alert.alert('Enter a meal description.');
    }
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/meals`, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          description: meal.desc,
          calories: Number(meal.cal)||0,
          protein:  Number(meal.pro)||0,
          carbs:    Number(meal.carb)||0,
          fats:     Number(meal.fat)||0
        })
      });
      if (!res.ok) throw new Error('Submit failed');
      setInfo('Logged!');
      setMeal({ desc:'', cal:'', pro:'', carb:'', fat:'' });
      fetchMeals();
      setTimeout(()=>setInfo(''),2000);
    } catch(err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex:1 }}
      behavior={Platform.OS==='ios'?'padding':'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Meal Tracker</Text>
        {info ? <Text style={styles.info}>{info}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="What did you eat?"
          placeholderTextColor="#888"
          value={meal.desc}
          onChangeText={t=>setMeal({...meal,desc:t})}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input,styles.half]}
            placeholder="Calories"
            placeholderTextColor="#888"
            value={meal.cal}
            keyboardType="numeric"
            onChangeText={t=>setMeal({...meal,cal:t})}
          />
          <TextInput
            style={[styles.input,styles.half]}
            placeholder="Protein (g)"
            placeholderTextColor="#888"
            value={meal.pro}
            keyboardType="numeric"
            onChangeText={t=>setMeal({...meal,pro:t})}
          />
        </View>
        <View style={styles.row}>
          <TextInput
            style={[styles.input,styles.half]}
            placeholder="Carbs (g)"
            placeholderTextColor="#888"
            value={meal.carb}
            keyboardType="numeric"
            onChangeText={t=>setMeal({...meal,carb:t})}
          />
          <TextInput
            style={[styles.input,styles.half]}
            placeholder="Fats (g)"
            placeholderTextColor="#888"
            value={meal.fat}
            keyboardType="numeric"
            onChangeText={t=>setMeal({...meal,fat:t})}
          />
        </View>
        <TouchableOpacity style={styles.logBtn} onPress={submitMeal}>
          <Text style={styles.btnText}>LOG MEAL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.refBtn} onPress={fetchMeals}>
          <Text style={styles.refText}>REFRESH MEALS</Text>
        </TouchableOpacity>

        {log.length>0
          ? log.map((m,i)=>(
              <View key={i} style={styles.item}>
                <Text style={styles.desc}>{m.description}</Text>
                <Text style={styles.macros}>
                  {m.calories} kcal • P:{m.protein}g • C:{m.carbs}g • F:{m.fats}g
                </Text>
                <Text style={styles.time}>
                  {new Date(m.date).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                </Text>
              </View>
            ))
          : <Text style={styles.empty}>No meals logged today.</Text>
        }
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:{ flexGrow:1, padding:20, backgroundColor:'#121212', paddingBottom:40 },
  title:{ fontSize:28, fontWeight:'bold', color:'#4CAF50', textAlign:'center', marginBottom:20 },
  info:{ color:'#4CAF50', textAlign:'center', marginBottom:10 },
  input:{
    borderColor:'#ddd', borderWidth:1, borderRadius:8,
    padding:14, marginBottom:12, color:'#fff', backgroundColor:'#1a1a1a'
  },
  row:{ flexDirection:'row', justifyContent:'space-between' },
  half:{ width:'48%' },
  logBtn:{ backgroundColor:'#4CAF50', paddingVertical:14, borderRadius:8, marginBottom:12 },
  btnText:{ color:'#fff', textAlign:'center', fontSize:16, fontWeight:'600' },
  refBtn:{ backgroundColor:'#fff', borderWidth:1, borderColor:'#4CAF50', paddingVertical:14, borderRadius:8, marginBottom:20 },
  refText:{ color:'#4CAF50', textAlign:'center', fontSize:16, fontWeight:'600' },
  item:{ backgroundColor:'#1e1e1e', padding:12, borderRadius:8, marginBottom:12 },
  desc:{ color:'#fff', fontSize:16, marginBottom:6 },
  macros:{ color:'#ccc', marginBottom:4 },
  time:{ color:'#888', textAlign:'right', fontSize:12 },
  empty:{ color:'#888', textAlign:'center', marginTop:20, fontStyle:'italic' }
});
