import React, {useEffect} from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import StatusBarComponent from 'components/StatusBar';
import {AppNavigator} from 'navigation/Main.navigation';
import ThemeContextProvider, {useThemeContext} from 'themes/Theme.context';
import themeConfig from 'configurations/Theme.configuration';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from 'react-native-i18n';
import store from 'app/redux/store';
import {Provider} from 'react-redux';
import {useDispatch, useSelector} from 'react-redux';
import {initApp, setLanguage} from 'app/redux/actions/globalActions';
import {setUserLoggedIn, setUserProfile} from 'app/redux/actions/userActions';
// import {initApp,setLanguage} from 'redux/'
const AppWrapper = () => {
  const dispatch = useDispatch();
  // const {initApp, setLanguage} = useApplicationController();
  useEffect(() => {
    (async () => {
      const isSignedIn = await AsyncStorage.getItem('isSignedIn');
      const userProfileString = await AsyncStorage.getItem('userProfile');
      const locale = await AsyncStorage.getItem('selectedLocale');
      I18n.locale = locale ? locale : 'it';
      try {
        const userProfile = userProfileString
          ? JSON.parse(userProfileString)
          : {};
        if (Object.keys(userProfile).length > 0) {
          dispatch(setUserLoggedIn(true));
          dispatch(setUserProfile(userProfile));
          dispatch(initApp({isSignedIn: isSignedIn === 'true', userProfile}));
          dispatch(setLanguage(locale ? locale : 'it'));
        } else {
          dispatch(setUserLoggedIn(false));
          dispatch(setUserProfile({}));
          dispatch(initApp({isSignedIn: isSignedIn === 'false', userProfile}));
          dispatch(setLanguage(locale ? locale : 'it'));
        }
        SplashScreen.hide();
      } catch (error) {
        dispatch(initApp({isSignedIn: isSignedIn === 'true', userProfile: {}}));
        dispatch(setLanguage(locale ? locale : 'it'));
        SplashScreen.hide();
      }
    })();
  }, []);
  return (
    <>
      <StatusBarComponent />
      <IconRegistry icons={EvaIconsPack} />
      <AppNavigator />
    </>
  );
};
const strictTheme = {['text-font-family']: 'Roboto'}; // <-- Your Font
const customMapping = {strict: strictTheme};

const ApplicationProviderWrapper = () => {
  const {themeName, defaultTheme} = useThemeContext();
  return (
    <>
      <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider
          {...eva}
          mapping={customMapping}
          theme={{...eva[themeName], ...defaultTheme}}>
          <AppWrapper />
        </ApplicationProvider>
      </Provider>
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        marginBottom: Platform.OS === 'ios' ? themeConfig.margin : 0,
      }}>
      <ThemeContextProvider>
        <ApplicationProviderWrapper />
      </ThemeContextProvider>
    </SafeAreaProvider>
  );
};

export default App;