import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons'; // Import Ionicons
import Auth from './screens/auth'; // Import Auth screen
import Rent from './screens/rent'; // Import Rent screen
import Add from './screens/add'; // Import Add Book screen

// Create a Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Auth Page') {
              iconName = focused ? 'person-circle' : 'person-circle-outline'; // Change as needed
            } else if (route.name === 'Rent Page') {
              iconName = focused ? 'book' : 'book-outline'; // Change as needed
            } else if (route.name === 'Add Book') {
              iconName = focused ? 'add-circle' : 'add-circle-outline'; // Change as needed
            }

            // You can return any component that you like here!
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
