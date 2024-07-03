import React, {useEffect} from 'react';
import {Divider, Layout, Icon} from '@ui-kitten/components';
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SVGIcon from 'components/Icon';
//API
import {strings} from 'i18n/i18n';
import {useSelector} from 'react-redux';
import {SvgCssUri} from 'react-native-svg';

const windowHeight = Dimensions.get('window').height;

const SignInScreen = ({navigation}) => {
  const [language] = useSelector(state => [state.globalReducerData.language]);

  useEffect(async () => {}, [navigation]);

  const UserData = [
    {
      icon: 'briefcase',
      name: 'my_reservation',
      navigatorName: 'Reservation',
      screen: 'ReservationHome',
      iconUrl:
        'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/briefcase.svg',
    },
    {
      icon: 'heart',
      name: 'favorites',
      navigatorName: 'Favorites',
      iconUrl:
        'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/heart.svg',
    },
  ];

  const SupportData = [
    {
      icon: 'question-mark-circle',
      name: 'conatct_customer_Services',
      url: 'mailto:info@summerbooking.it',
      itUrl: '',
      iconUrl:
        'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/contact-customer.svg',
    },
    {
      icon: 'options',
      name: 'about',
      url: 'https://qbitsoft.it/en/chi-siamo/',
      itUrl: 'https://qbitsoft.it/chi-siamo/',
      iconUrl:
        'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/about.svg',
    },
    {
      icon: 'phone-call',
      name: 'corporate_contact',
      url: 'https://qbitsoft.it/en/contatti/',
      itUrl: 'https://qbitsoft.it/contatti/',
      iconUrl:
        'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/company-contact.svg',
    },
  ];

  const legalData = [
    {
      icon: 'checkmark-square-2',
      name: 'terms_conditions',
      url: 'https://summerbooking.it/terms-and-conditions',
      itUrl: '',
      iconUrl:
        'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/terms-condition.svg',
    },
    {
      icon: 'file',
      name: 'legal_notices',
      url: 'https://summerbooking.it/legal-notices',
      itUrl: 'https://summerbooking.it/legal-notices-italian',
      iconUrl:
        'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/legal-notice.svg',
    },
    {
      icon: 'file',
      name: 'privacy_Cookie',
      url: 'https://summerbooking.it/privacy-cookie-statement',
      itUrl: 'https://summerbooking.it/privacy-cookie-statement-italian',
      iconUrl:
        'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/legal-notice.svg',
    },
  ];

  const partnersData = [
    {
      icon: 'home',
      name: 'registerProperty',
      iconUrl:
        'https://summerbooking.s3.us-east-2.amazonaws.com/images/app/home-register.svg',
    },
  ];

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
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <SVGIcon
              type="User"
              color={themeConfig.colors.primary}
              width={40}
              height={40}
            />
            <ButtonComponent
              size="small"
              style={{
                color: themeConfig.colors.white,
                backgroundColor: themeConfig.colors.primary,
                width: '40%',
              }}
              onPress={() => navigation.navigate('Login')}>
              <Typography
                status="control"
                category="s2"
                style={{fontWeight: '400'}}>
                {strings('login')}
              </Typography>
            </ButtonComponent>
          </View>

          {UserData.map(item => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.screen) {
                    navigation.navigate(item.navigatorName, {
                      screen: item.screen,
                    });
                  } else {
                    navigation.navigate(item.navigatorName);
                  }
                }}
                style={styles.button}>
                <SvgCssUri style={styles.icon} uri={item.iconUrl} />
                <Typography
                  category="p1"
                  style={{fontSize: 14, color: themeConfig.colors.primary}}
                  status="basic">
                  {strings(item.name)}
                </Typography>
              </TouchableOpacity>
            );
          })}
          <View style={styles.titleContainer}>
            <Typography category="h3" status="basic" style={styles.title}>
              {strings('help_support')}
            </Typography>
            {SupportData.map(item => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      language === 'it' && item.itUrl ? item.itUrl : item.url,
                    )
                  }
                  style={styles.button}>
                  <SvgCssUri style={styles.icon} uri={item.iconUrl} />
                  <Typography
                    category="p1"
                    style={{fontSize: 14, color: themeConfig.colors.primary}}
                    status="basic">
                    {strings(item.name)}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.titleContainer}>
            <Typography category="h3" status="basic" style={styles.title}>
              {strings('setting_legal')}
            </Typography>
            {legalData.map(item => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      language === 'it' && item.itUrl ? item.itUrl : item.url,
                    )
                  }
                  style={styles.button}>
                  <SvgCssUri style={styles.icon} uri={item.iconUrl} />
                  <Typography
                    category="p1"
                    style={{fontSize: 14, color: themeConfig.colors.primary}}
                    status="basic">
                    {strings(item.name)}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.titleContainer}>
            <Typography category="h3" status="basic" style={styles.title}>
              {strings('partners')}
            </Typography>
            {partnersData.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('ListOfProperty')}
                  style={styles.button}>
                  <SvgCssUri style={styles.icon} uri={item.iconUrl} />
                  <Typography
                    category="p2"
                    style={{fontSize: 14, color: themeConfig.colors.primary}}
                    status="basic">
                    {strings(item.name)}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
export default SignInScreen;

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
    marginHorizontal: themeConfig.margin * 2,
    marginBottom: themeConfig.margin,
    color: themeConfig.colors.primary,
    fontSize: 14,
  },
  profile: {
    width: 30,
    height: 30,
  },
  icon: {
    width: themeConfig.radius * 2,
    height: themeConfig.radius * 2,
    marginRight: themeConfig.margin + 4,
  },
  button: {
    marginTop: themeConfig.margin,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeConfig.colors.lightBule,
    borderRadius: themeConfig.radius * 4,
    padding: themeConfig.padding + 5,
    margin: themeConfig.margin,
  },
});
