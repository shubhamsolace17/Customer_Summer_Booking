import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
import SearchHomeScreen from 'screens/Dashboard/Home.screen';
import SearchResultScreen from 'screens/Dashboard/SearchResult.screen';
// import PropertyFacilitiesScreen from 'screens/Dashboard/PropertyFacilities.screen';
// import PropertyPolicyScreen from 'screens/Dashboard/PropertyPolicy.screen';
export default function ProfileNavigation() {
  return (
    <Stack.Navigator headerMode="SearchHome">
      <Stack.Screen name="SearchHome" component={SearchHomeScreen} />
      {/* <Stack.Screen name="SearchResult" component={SearchResultScreen} /> */}

      {/* <Stack.Screen
        name="PropertyFacilities"
        component={PropertyFacilitiesScreen}
      />
      <Stack.Screen name="PropertyPolicy" component={PropertyPolicyScreen} /> */}
    </Stack.Navigator>
  );
}
