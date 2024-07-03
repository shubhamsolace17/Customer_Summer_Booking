import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
import ReservationsHomeScreen from 'screens/Reservations/Home.screen';

export default function ReservationsNavigation() {
  return (
    <Stack.Navigator headerMode="ReservationHome">
      <Stack.Screen name="ReservationHome" component={ReservationsHomeScreen} />
    </Stack.Navigator>
  );
}
