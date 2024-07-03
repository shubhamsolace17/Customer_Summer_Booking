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
import {strings} from 'i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GLOBAL from 'resources/constant';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//redux
import {useSelector} from 'react-redux';
import SubscribeComponent from '../Subscribe.component';
import SendEmailComponent from '../../Dashboard/HolidaysInfo/SendEmail.component';
import FaceBookClipboardComponent from '../../Dashboard/HolidaysInfo/FaceBookClipboard.component';
import CustomSkeletonList from 'components/CustomSkeleton';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const IcecreamInfo = ({navigation}) => {
  const [loading, setloading] = React.useState(false);
  const [IcecreamInfo, setIcecreamInfo] = React.useState([]);
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
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
      var arr = originalArray.splice(4, 1);
      setIcecreamInfo(originalArray);
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
                {strings('things_you_dont_know_about_ice_cream')}
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
                    'curiosities_about_ice_cream_that_you_may_not_have_known',
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
                    source={require('../../../resources/images/icecream1.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('tasted_in_summer_but_gladly_also_in_winter') +
                      '\n \n' +
                      strings(
                        'the_artisan_ice_cream_however_unlike_the_industrial_one',
                      ) +
                      '\n \n' +
                      strings(
                        'we_italians_love_ice_cream_so_much_that_we_consume_almost',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/icecream2.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('ice_cream_is_a_very_ancient_food') +
                      '\n \n' +
                      strings(
                        'it_is_said_that_the_cone_was_born_by_chance_and',
                      ) +
                      '\n \n' +
                      strings(
                        'currently_there_are_about_flavors_of_ice_cream',
                      ) +
                      '\n \n' +
                      strings(
                        'for_the_strangest_ice_cream_flavors_in_the_world',
                      ) +
                      '\n \n' +
                      strings('from_the_previous_extravagances_to_the')}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/icecream3.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />

                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'five_of_the_curiosities_concerning_the_most_delicious',
                    )}
                  </Typography>
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
                  data={IcecreamInfo}
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
export default React.memo(IcecreamInfo);

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
