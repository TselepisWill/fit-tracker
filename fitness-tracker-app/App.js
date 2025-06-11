import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, StatusBar, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen    from './src/screens/HomeScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import MealsScreen   from './src/screens/MealsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AuthScreen    from './src/screens/AuthScreen';
import LogOutScreen from './src/screens/LogOutScreen';


const Drawer = createDrawerNavigator();

function LogoutSplash({ navigation }) {
  React.useEffect(() => {
    const t = setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'LogIn' }] });
    }, 800);
    return () => clearTimeout(t);
  }, [navigation]);
  return (
    <View style={{ flex:1, backgroundColor:'#121212', justifyContent:'center', alignItems:'center' }}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={{ color:'#fff', marginTop:10 }}>Logging out…</Text>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex:1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <NavigationContainer theme={DarkTheme}>
        <Drawer.Navigator
          initialRouteName="Home"    
          screenOptions={({ navigation }) => ({
            headerRight: ({ tintColor }) => (
              <View style={{ flexDirection:'row', marginRight:12 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ marginHorizontal:6 }}>
                  <MaterialCommunityIcons name="home" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('LogIn')} style={{ marginHorizontal:6 }}>
                  <MaterialCommunityIcons name="login" size={24} color={tintColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('LogOut')} style={{ marginHorizontal:6 }}>
                  <MaterialCommunityIcons name="logout" size={24} color="#FF5252" />
                </TouchableOpacity>
              </View>
            ),
          })}
        >
          <Drawer.Screen name="Home"     component={HomeScreen}    />
          <Drawer.Screen name="LogIn"    component={AuthScreen}    options={{ title: 'Log In / Sign Up' }} />
          <Drawer.Screen name="Profile"  component={ProfileScreen} />
          <Drawer.Screen name="Workouts" component={WorkoutsScreen} options={{ title: 'Workouts' }} />
          <Drawer.Screen name="Meals"    component={MealsScreen}   options={{ title: 'Meals' }} />
          <Drawer.Screen name="LogOut" component={LogOutScreen} options={{ title: 'Log Out' }} />

        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
