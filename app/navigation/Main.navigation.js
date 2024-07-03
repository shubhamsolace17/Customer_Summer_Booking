import React from 'react';
import {Linking, ImageBackground} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from '@ui-kitten/components';
import HomeScreen from 'screens/Dashboard/Home.screen';
import Maintanance from 'screens/Dashboard/Maintanance';
import {createStackNavigator} from '@react-navigation/stack';


import SearchNavigation from 'navigation/Search.navigation';
// import UserHomeScreen from 'screens/User/Home.screen';
// import ManageAccountScreen from 'screens/User/ManageAccount.screen';
// import FavoritesScreen from 'screens/User/Favorites.screen';
// import CardDetailsScreen from 'screens/User/CardDetails.screen';
// import LoginScreen from 'screens/User/Login';
// import ForgetPasswordScreen from 'screens/User/ForgetPassword.screen';
// import ResetPasswordScreen from 'screens/User/ResetPassword.screen';
import {map} from 'lodash';
// import {createStackNavigator} from '@react-navigation/stack';
// import SearchSingleLocationScreen from 'screens/Dashboard/SearchSingleLocation.screen';
// import PropertyPolicyScreen from 'screens/Dashboard/PropertyPolicy.screen';
// import PropertyFacilitiesScreen from 'screens/Dashboard/PropertyFacilities.screen';
// import BookExtraServiceScreen from 'screens/Dashboard/BookExtraService.screen';
// import BookNowScreen from 'screens/Dashboard/BookNow.screen';
// import BookNowFinalScreen from 'screens/Dashboard/BookNowFinal.screen';
// import SVGIcon from 'components/Icon';
// import AddPersonalInfo from 'screens/User/AddPersonalInfo.screen';
// import FinishBooking from 'screens/Dashboard/FinishBooking.screen';
// import PaymentScreen from 'screens/Dashboard/Payment.screen';
// import BookingConfirm from 'screens/Dashboard/BookingConfirm.screen';
// import ManageBookingScreen from 'screens/Dashboard/ManageBooking.screen';
// import BookingCancel from 'screens/Dashboard/BookingCancel.screen';
import ReservationsNavigation from './Reservations.navigation';
// import UserNavigation from './User.navigation';
// import CreateAccountScreen from 'screens/User/CreateAccount.screen';
// import LoginWithEmailScreen from 'screens/User/LoginWithEmail.screen';
// import filterScreen from 'screens/Dashboard/filterList.screen';
// import ListOfPropertyScreen from 'screens/Dashboard/ListOfProperty.screen';
// import PaymentProcessingScreen from 'screens/Dashboard/PaymentWithCard.screen';
import ReservationsHomeScreen from 'screens/Reservations/Home.screen';
// import ResetPasswordUrlScreen from 'screens/Dashboard/ResetPasswordfromUrl.screen';
// import BookingWebViewScreen from 'screens/Dashboard/BookingWebView.screen';
// import HomeScreenNew from 'screens/Dashboard/HolidaysInfo/HomeScreenNew';
// import SummerDishesInfo from 'screens/Dashboard/HolidaysInfo/SummerDishesInfo';
// import BeachesInfo from 'screens/Dashboard/HolidaysInfo/BeachesInfo';
// import HistoricBathHousesInfo from 'screens/Dashboard/HolidaysInfo/HistoricBathHousesInfo';
// import IcecreamInfo from 'screens/Dashboard/HolidaysInfo/IcecreamInfo';
// import AddReservationScreen from 'screens/Reservations/AddReservation.screen';
// import SharingScreen from 'screens/Reservations/Sharing.screen';
// import BookingAccountScreen from 'screens/Reservations/BookingAccount.screen';
// import ReservationSummary from 'screens/Reservations/ReservationSummary.screen';
// import TabularBookingScreen from 'screens/Dashboard/TabularBooking.Screen';
// import SearchResultScreen from 'screens/Dashboard/SearchResult.screen';
import NoNetworkModal from 'resources/NoNetworkModel';
import {useSelector} from 'react-redux';
import CustomeTabBar from './TabBar.navigation';
import CommonNavigation from './common.navigation';
// import SafetyScreen from 'screens/User/Safety.screen';
// import NotificationScreen from 'screens/User/Notification.screen';
const {Navigator: CommonStackNavigator, Screen: CommonStackScreen} =
  createStackNavigator();

const {Navigator: BottomTabNavigator, Screen: BottomTabScreen} =
  createBottomTabNavigator();

const SearchIcon = props => (
  <SVGIcon
    type="Search"
    color={props.style.tintColor}
    width={28}
    height={28}
    {...props}
  />
);
const BriefcaseIcon = props => (
  <SVGIcon
    type="Reservation"
    color={props.style.tintColor}
    width={28}
    height={28}
    {...props}
  />
);
const ProfileIcon = props => (
  <SVGIcon
    type="User"
    color={props.style.tintColor}
    width={28}
    height={28}
    {...props}
  />
);

const bottomNavigationProps = [
  {
    name: 'Search',
    title: 'Search',
    icon: SearchIcon,
    component: SearchNavigation,
  },
  {
    name: 'Reservation',
    title: 'Reservation',
    icon: BriefcaseIcon,
    component: ReservationsNavigation,
  },
];

const bottomNavigationItProps = [
  {
    name: 'Search',
    title: 'Cerca',
    icon: SearchIcon,
    component: SearchNavigation,
  },
  {
    name: 'Reservation',
    title: 'Prenotazione',
    icon: BriefcaseIcon,
    component: HomeScreen,
  },
  {
    name: 'SignIn',
    title: 'Accedi',
    icon: ProfileIcon,
    component: HomeScreen,
  },
];
const BottomTabBar = ({navigation, state}) => {
  return (
    <CustomeTabBar
      navigationProps={bottomNavigationProps}
      navigation={navigation}
      state={state}
    />
    // <CustomeTabBar navigationProps ={bottomNavigationProps} navigation={navigation} state={state} />
  );
};

const TabNavigator = () => {
  const [isSignedIn, language] = useSelector(state => [
    state.UserReducerData.isSignedIn,
    state.globalReducerData.language,
  ]);
  // const {isSignedIn, language} = useApplicationContext();
  // bottomNavigationProps[2].title = isSignedIn
  //   ? language == 'en'
  //     ? 'Profile'
  //     : 'Profilo'
  //   : language == 'en'
  //   ? 'Sign In'
  //   : 'Accedi';
  bottomNavigationProps[0].title = language == 'en' ? 'Search' : 'Cerca';
  bottomNavigationProps[1].title =
    language == 'en' ? 'Reservation' : 'Prenotazione';
  return (
    <BottomTabNavigator
      initialRouteName={bottomNavigationProps[0].name}
      tabBar={props => <BottomTabBar {...props} />}
      tabBarOptions={{
        keyboardHidesTabBar: true,
      }}>
      {map(bottomNavigationProps, ({name, component: NavigationComponent}) => {
        return (
          <BottomTabScreen
            key={name}
            name={name}
            component={NavigationComponent}
          />
        );
      })}
    </BottomTabNavigator>
  );
};
const StackNavigator = () => {
  return (
    <CommonStackNavigator
      screenOptions={{
        headerShown: false,
      }}>
      <CommonStackScreen name="Maintanance" component={Maintanance} />
    
    </CommonStackNavigator>
  );
};

const deepLinking = {
  prefixes: ['https://summerbooking.it', 'summer-app://'],
  async getInitialURL() {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();
    if (url != null) {
      return url;
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({url}) => listener(url);

    Linking.addEventListener('url', onReceiveURL);

    return () => {
      // Clean up the event listener
      Linking.removeEventListener('url', onReceiveURL);
    };
  },
  config: {
    ResetPasswordUrlScreen: 'reset-password/:email',
  },
};

// const deepLinking = {
//   prefixes: ['http://www.example.com/gizmos', 'summer-app://'],
//   config:{
//       ListOfProperty: 'bTab3'
//     // UserHome:'UserHome',
//     // ResetPassword:{
//     //   path:'ResetPassword',
//     //   params:{
//     //     id:1
//     //   }
//     // }
//  }
// }

export const AppNavigator = () => (
  <NavigationContainer>
    <NoNetworkModal />
    <StackNavigator />
  </NavigationContainer>
);
