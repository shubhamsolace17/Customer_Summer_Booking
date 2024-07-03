import React from 'react';
import {Layout, Divider} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  ImageBackground,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import VerticalImageList from 'components/VerticalImageList';
import {ScrollView} from 'react-native-gesture-handler';
import I18n from 'react-native-i18n';
import {useSelector} from 'react-redux';

import {strings} from 'i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GLOBAL from 'resources/constant';
import SubscribeComponent from '../Subscribe.component';
import SendEmailComponent from '../../Dashboard/HolidaysInfo/SendEmail.component';
import FaceBookClipboardComponent from '../../Dashboard/HolidaysInfo/FaceBookClipboard.component';
import CustomSkeletonList from 'components/CustomSkeleton';

import {postDataToServer} from 'services/AuthApi';
import Api from 'services/Api';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const HomeScreenNew = ({navigation}) => {
  const [loading, setloading] = React.useState(false);
  const [indianHolydays, setIndianHolydays] = React.useState([]);
  var originalArray = GLOBAL.idearsInsipraton.slice(0);
  const [language, userProfile] = useSelector(state => [
    state.globalReducerData.language,
    state.UserReducerData.userProfile,
  ]);
  const toast = React.useRef('');
  const loadData = async () => {
    //setloading(true);

    const locale = await AsyncStorage.getItem('selectedLocale');
    I18n.locale = locale;

    var arr = originalArray.splice(0, 1);
    setIndianHolydays(originalArray);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const onSubscribe = async values => {
    setloading(true);
    const postData = {
      email: values.email,
    };
    console.log('postData', postData);
    const {data, message, error, success, sucess} = await postDataToServer(
      `${Api.createSubscribe}`,
      postData,
    );
    console.log(data, success);
    if (sucess) {
      Alert.alert(
        strings('success'),
        strings('newsletter_message'),
        [
          {
            text: strings('ok'),
            onPress: () => {
              setloading(false);
            },
            style: strings('cancel'),
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
      toast.current.show(errorMessage);
    }
  };

  return (
    <Layout style={{flex: 1, bottom: 10}}>
      <HeaderComponent showBackButton />
      <Divider />
      {loading ? (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      ) : (
        <>
          <ScrollView
            bounces={false}
            nestedScrollEnabled={false}
            contentContainerStyle={{paddingBottom: windowHeight / 8}}>
            <Layout level="1">
              <Typography
                category="h6"
                style={{
                  marginVertical: themeConfig.margin,
                  marginHorizontal: themeConfig.margin,
                  padding: themeConfig.padding + 2,
                  fontSize: 28,
                }}>
                {strings('italian_holidays')}
              </Typography>
              <View
                style={{
                  borderBottomColor: themeConfig.colors.primary,
                  borderBottomWidth: 3,
                  width: '40%',
                  marginLeft: 25,
                }}
              />
              <Layout style={styles.boxStyle}>
                <Typography
                  style={{
                    marginVertical: themeConfig.margin + 15,
                    fontSize: 16,
                  }}>
                  {strings(
                    'when_are_bathing_establishments_and_summer_holidays_born_in_italy',
                  )}
                </Typography>
              </Layout>

              <Layout style={styles.boxStyle}>
                <Typography
                  style={{
                    marginVertical: themeConfig.margin,
                    fontSize: 16,
                  }}>
                  {strings('subscribe_to_newsLetter')}
                </Typography>
              </Layout>
              <SendEmailComponent onSumbit={values => onSubscribe(values)} />
              <Layout style={styles.boxStyle}>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/holyday1.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('the_transition_from_the_spas_so_much_in_vogue') +
                      '\n' +
                      strings(
                        'trend_that_overcomes_and_leaves_out_stupid_social_moralisms',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/holyday2.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('from_venice_to_palermo_the_sea_began') +
                      '\n\n' +
                      strings(
                        'only_during_fascism_while_the_real_boom_took_place_after_the_second',
                      ) +
                      '\n \n' +
                      strings('boarthe_legendary_fiat_with_beach_umbrellas')}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/holyday3.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <ImageBackground
                    source={require('../../../resources/images/holyday4.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('even_fashions_adapt_to_the_times_from_the_new')}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/holyday5.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                </Layout>
              </Layout>
              <FaceBookClipboardComponent
                onSumbit={values => onSubscribe(values)}
              />

              <Layout style={styles.boxStyle}>
                <VerticalImageList
                  isTwoRow
                  iconName="BeachUmbrella"
                  title={
                    strings('check_out_other_articles_from_the_blog') +
                    '\n' +
                    strings('ideas_and_inspiration_for_your_summer_holidays')
                  }
                  onPress={item => {
                    console.log('item', item), navigation.navigate(item.url);
                  }}
                  data={indianHolydays}
                />
              </Layout>
            </Layout>
            <SubscribeComponent onSumbit={values => onSubscribe(values)} />
          </ScrollView>
        </>
      )}
    </Layout>
  );
};
export default React.memo(HomeScreenNew);

const styles = StyleSheet.create({
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
  },
  discountBoxStyle: {
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding,
    margin: themeConfig.padding,
    borderRadius: themeConfig.radius * 5,
    marginVertical: themeConfig.margin,
  },
  mainImage: {
    flex: 1,
    height: windowWidth / 2,
    width: '100%',
    resizeMode: 'cover',
    marginVertical: 10,
  },
  subscibeBoxStyle: {
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding * 2,
    // justifyContent:"center"
  },
});
