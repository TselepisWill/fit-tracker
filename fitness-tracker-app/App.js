import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/screens/HomeScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import MealsScreen from './src/screens/MealsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen from './src/screens/AuthScreen';
import { View, StatusBar } from 'react-native';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <NavigationContainer theme={DarkTheme}>
        <Drawer.Navigator
          initialRouteName="Home"
          screenOptions={{
            drawerStyle: {
              backgroundColor: '#1c1c1c',
              width: 240,
            },
            headerStyle: {
              backgroundColor: '#121212',
            },
            headerTintColor: '#fff',
            drawerLabelStyle: {
              color: '#fff',
            },
          }}
        >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Log-In" component={AuthScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
          <Drawer.Screen name="Workouts" component={WorkoutsScreen} />
          <Drawer.Screen name="Meals" component={MealsScreen} />
          
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
