import React from 'react';
import {Divider, Layout, Icon} from '@ui-kitten/components';
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import {ScrollView} from 'react-native-gesture-handler';
import SVGIcon from 'components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setUserLoggedIn,
  setUserProfile,
  logout,
} from 'app/redux/actions/userActions';
import {setLanguage, initApp} from 'app/redux/actions/globalActions';
import {useDispatch, useSelector} from 'react-redux';
import {strings} from 'i18n/i18n';
import {useLayoutEffect} from 'react';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {SvgCssUri} from 'react-native-svg';

const about =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/about.svg';
const briefcase =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/briefcase.svg';
const companyContact =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/company-contact.svg';
const contactCustomer =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/contact-customer.svg';
const propertyRegister =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/home-register.svg';
const legalNotices =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/legal-notice.svg';
const termsConditions =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/terms-condition.svg';
const hearts =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/heart.svg';

const windowHeight = Dimensions.get('window').height;

export function useHiddenTabs(hiddenTabRoutesArray, fallbackRoute) {
  const navigation = useNavigation();
  const route = useRoute();

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? fallbackRoute;
    navigation.setOptions({
      tabBarVisible: !hiddenTabRoutesArray.includes(routeName),
    });
  }, [navigation, route]);
}
const UserProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [userProfile, language] = useSelector(state => [
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
  ]);
  console.log("userProfile",userProfile.profilePic)
  const singOut = () => {
    let user = {};
    // dispatch(setUserLoggedIn(false));
    // dispatch(setUserProfile(user));
    // dispatch(initApp({isSignedIn: 'false', userProfile:user}));
    // dispatch(setLanguage('it'));
    dispatch(setUserLoggedIn(false));
    dispatch(setUserProfile({}));
    dispatch(initApp({isSignedIn: 'false', userProfile: {}}));
    dispatch(setLanguage('it'));
    // dispatch(logout());
    AsyncStorage.clear();
  };

  const onLogout = () => {
    Alert.alert(
      strings('logout'),
      strings('LogOut_message'),
      [
        {
          text: strings('no'),
          onPress: () => {},
          style: strings('cancel'),
        },
        {
          text: strings('yes'),
          onPress: () => singOut(),
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <ScrollView
        bounces={false}
        contentContainerStyle={{paddingBottom: windowHeight / 8}}>
        <Layout
          level="1"
          style={[
            styles.container,
            {marginTop: themeConfig.margin},
            styles.boxStyle,
          ]}>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: themeConfig.margin,
              margin: themeConfig.margin,
              alignItems: 'center',
            }}>
            {userProfile && userProfile.profilePic ? (
              <Image
                style={styles.profile}
                source={{
                  uri: userProfile.profilePic,
                }}
              />
            ) : (
              <SVGIcon
                type="User"
                color={themeConfig.colors.primary}
                width={40}
                height={40}
              />
            )}
            <Typography
              status="basic"
              category="h3"
              style={{
                fontWeight: '500',
                marginTop: themeConfig.margin,
                color: themeConfig.colors.primary,
                fontSize: 14,
                marginHorizontal: themeConfig.margin,
              }}>
              {strings('hello')} {userProfile.firstname || 'User'}
            </Typography>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ManageAccount');
            }}
            style={styles.button}>
            <View style={styles.icon}>
              <SVGIcon
                type="ProfileUser"
                color={themeConfig.colors.primary}
                width={themeConfig.radius * 4}
                height={themeConfig.radius * 4}
              />
            </View>
            <Typography category="p1" style={styles.text} status="basic">
              {strings('personal_data')}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CardDetails');
            }}
            style={styles.button}>
            <View style={styles.icon}>
              <SVGIcon
                type="Card"
                color={themeConfig.colors.primary}
                width={themeConfig.radius * 4}
                height={themeConfig.radius * 4}
              />
            </View>
            <Typography category="p1" style={styles.text} status="basic">
              {strings('my_card')}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Safety');
            }}
            style={styles.button}>
            <View style={styles.icon}>
              <SVGIcon
                type="Safety"
                color={themeConfig.colors.primary}
                width={themeConfig.radius * 4}
                height={themeConfig.radius * 4}
              />
            </View>
            <Typography category="p1" style={styles.text} status="basic">
              {strings('Safety')}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Notications');
            }}
            style={styles.button}>
            <View style={styles.icon}>
              <SVGIcon
                type="Notification"
                color={themeConfig.colors.primary}
                width={themeConfig.radius * 4}
                height={themeConfig.radius * 4}
              />
            </View>
            <Typography category="p1" style={styles.text} status="basic">
              {strings('notification')}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Reservation', {screen: 'ReservationHome'});
            }}
            style={styles.button}>
            <SvgCssUri style={styles.icon} uri={briefcase} />
            <Typography category="p1" style={styles.text} status="basic">
              {strings('my_reservation')}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Favorites');
            }}
            style={styles.button}>
            <SvgCssUri style={styles.icon} uri={hearts} />
            <Typography category="p1" style={styles.text} status="basic">
              {strings('favourite')}
            </Typography>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Typography category="h3" status="basic" style={styles.title}>
              {strings('help_support')}
            </Typography>
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:info@summerbooking.it')}
              style={styles.button}>
              <SvgCssUri style={styles.icon} uri={contactCustomer} />
              <Typography category="p1" style={styles.text} status="basic">
                {strings('conatct_customer_Services')}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  language === 'it'
                    ? 'https://qbitsoft.it/chi-siamo/'
                    : 'https://qbitsoft.it/en/chi-siamo/',
                )
              }
              style={styles.button}>
              <SvgCssUri style={styles.icon} uri={about} />
              <Typography category="p1" style={styles.text} status="basic">
                {strings('about')}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  language === 'it'
                    ? 'https://qbitsoft.it/contatti/'
                    : 'https://qbitsoft.it/en/contatti/',
                )
              }
              style={styles.button}>
              <SvgCssUri style={styles.icon} uri={companyContact} />
              <Typography category="p1" style={styles.text} status="basic">
                {strings('corporate_contact')}
              </Typography>
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Typography category="h3" status="basic" style={styles.title}>
              {strings('setting_legal')}
            </Typography>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://summerbooking.it/terms-and-conditions')
              }
              style={styles.button}>
              <SvgCssUri style={styles.icon} uri={termsConditions} />
              <Typography category="p1" style={styles.text} status="basic">
                {strings('terms_conditions')}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  language === 'it'
                    ? 'https://summerbooking.it/legal-notices-italian'
                    : 'https://summerbooking.it/legal-notices',
                )
              }
              style={styles.button}>
              <SvgCssUri style={styles.icon} uri={legalNotices} />
              <Typography category="p1" style={styles.text} status="basic">
                {strings('legal_notices')}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  language === 'it'
                    ? 'https://summerbooking.it/privacy-cookie-statement-italian'
                    : 'https://summerbooking.it/privacy-cookie-statement',
                )
              }
              style={styles.button}>
              <SvgCssUri style={styles.icon} uri={legalNotices} />
              <Typography category="p1" style={styles.text} status="basic">
                {strings('privacy_Cookie')}
              </Typography>
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Typography category="h3" status="basic" style={styles.title}>
              {strings('partners')}
            </Typography>
            <TouchableOpacity
              onPress={() => navigation.navigate('ListOfProperty')}
              style={styles.button}>
              <SvgCssUri style={styles.icon} uri={propertyRegister} />
              <Typography category="p1" style={styles.text} status="basic">
                {strings('registerProperty')}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout} style={styles.button}>
              <Icon
                style={styles.icon}
                fill={themeConfig.colors.primary}
                name="log-out"
              />
              <Typography category="p1" style={styles.text} status="basic">
                {strings('sign_out')}
              </Typography>
            </TouchableOpacity>
          </View>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  dot: {
    width: themeConfig.radius * 3,
    height: themeConfig.radius * 3,
    borderRadius: themeConfig.radius * 2,
    backgroundColor: themeConfig.colors.grey,
    marginRight: themeConfig.margin + 4,
  },
  titleContainer: {
    marginTop: themeConfig.margin,
  },
  title: {
    fontWeight: '500',
    marginBottom: themeConfig.margin,
    color: themeConfig.colors.primary,
    fontSize: 14,
    marginHorizontal: themeConfig.margin * 2,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: themeConfig.margin,
  },
  icon: {
    width: themeConfig.radius * 4,
    height: themeConfig.radius * 4,
    marginRight: themeConfig.margin + 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: themeConfig.margin,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeConfig.colors.lightBule,
    borderRadius: themeConfig.radius * 4,
    padding: themeConfig.padding + 5,
    margin: themeConfig.margin * 1.2,
  },
  text: {
    fontSize: 14,
    color: themeConfig.colors.primary,
  },
});
