import React from 'react';
import UserProfileScreen from './UserProfile.screen';
import SignInScreen from './SignIn.screen';
import {useSelector} from 'react-redux';

const UserHomeScreen = ({navigation}) => {
  const [isSignedIn] = useSelector(state => [state.UserReducerData.isSignedIn]);
  if (isSignedIn) {
    return <UserProfileScreen navigation={navigation} />;
  }
  return <SignInScreen navigation={navigation} />;
};
export default UserHomeScreen;
