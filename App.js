import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Auth from './screens/auth'; // Import Auth screen
import Rent from './screens/rent'; // Import Rent screen
import Add from './screens/add';

// Create a Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Auth Page" component={Auth} />
        <Tab.Screen name="Rent Page" component={Rent} />
        <Tab.Screen name="Add Book" component={Add} />
        {/* Add more screens here if needed */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
