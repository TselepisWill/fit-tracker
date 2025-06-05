import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StatusBar, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import HomeScreen from './src/screens/HomeScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import MealsScreen from './src/screens/MealsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';
import LogOutScreen from './src/screens/LogOutScreen';

const Drawer = createDrawerNavigator();

function LogoutScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Log-In' }],
      });
    }, 1000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={{ color: '#fff', marginTop: 10 }}>Logging out...</Text>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <NavigationContainer theme={DarkTheme}>
        <Drawer.Navigator
          initialRouteName="Home"
          screenOptions={({ navigation }) => ({
            // ... other styling
            headerRight: ({ tintColor }) => (  // <-- Replace here
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginHorizontal: 6 }}>
                  <MaterialCommunityIcons name="weight-lifter" size={26} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Log-In')} style={{ marginHorizontal: 6 }}>
                  <MaterialCommunityIcons name="login" size={26} color={tintColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Log Out')} style={{ marginHorizontal: 6 }}>
                  <MaterialCommunityIcons name="logout" size={26} color="#FF5252" />
                </TouchableOpacity>
              </View>
            ),
          })}
        >


          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Log-In" component={AuthScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="Workouts" component={WorkoutsScreen} />
          <Drawer.Screen name="Meals" component={MealsScreen} />
          <Drawer.Screen name="Log Out" component={LogOutScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
