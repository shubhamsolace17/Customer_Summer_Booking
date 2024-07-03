import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UserHomeScreen from 'screens/User/Home.screen';
const Stack = createStackNavigator();
const {Navigator: CommonStackNavigator, Screen: CommonStackScreen} =
  createStackNavigator();
export default function CommonNavigation() {
  return (
    <Stack.Navigator headerMode="UserHome">
      <CommonStackScreen name="UserHome" component={UserHomeScreen} />
    </Stack.Navigator>
  );
}
