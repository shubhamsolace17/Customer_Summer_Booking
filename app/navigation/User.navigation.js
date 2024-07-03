import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
import UserHomeScreen from 'screens/User/Home.screen';
import ManageAccountScreen from 'screens/User/ManageAccount.screen';
import FavoritesScreen from 'screens/User/Favorites.screen';
import CardDetailsScreen from 'screens/User/CardDetails.screen';
import LoginScreen from 'screens/User/Login';
import ForgetPasswordScreen from 'screens/User/ForgetPassword.screen';
import ResetPasswordScreen from 'screens/User/ResetPassword.screen';
import NotificationScreen from 'screens/User/Notification.screen';
import SafetyScreen from 'screens/User/Safety.screen';
export default function UserNavigation() {
  return (
    <Stack.Navigator headerMode="UserHome">
      <Stack.Screen name="UserHome" component={UserHomeScreen} />
      {/* <Stack.Screen name="ManageAccount" component={ManageAccountScreen}/>
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="CardDetails" component={CardDetailsScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      {/* <Stack.Screen name="Safety" component={SafetyScreen} />
      <Stack.Screen name="Notications" component={NotificationScreen} /> */}
    </Stack.Navigator>
  );
}
