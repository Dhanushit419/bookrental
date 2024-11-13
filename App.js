import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons'; 
import Auth from './screens/auth'; 
import Rent from './screens/rent'; 
import Add from './screens/add'; 
import registerNNPushToken from 'native-notify';


import { registerIndieID, unregisterIndieDevice } from 'native-notify';
import axios from 'axios';

const Tab = createBottomTabNavigator();

export default function App() {

  registerNNPushToken(24645, '4m9C9SVi7j1YfRzk0doa1h');

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Auth Page') {
              iconName = focused ? 'person-circle' : 'person-circle-outline'; 
            } else if (route.name === 'Rent Page') {
              iconName = focused ? 'book' : 'book-outline'; 
            } else if (route.name === 'Add Book') {
              iconName = focused ? 'add-circle' : 'add-circle-outline'; 
            }

            return <Ionicons name={iconName} size={size} color={"#164863"} />;
          },
        })}
      >
        <Tab.Screen name="Auth Page" component={Auth} />
        <Tab.Screen name="Rent Page" component={Rent} />
        <Tab.Screen name="Add Book" component={Add} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
