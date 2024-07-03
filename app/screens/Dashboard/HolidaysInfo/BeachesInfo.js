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
import CustomSkeletonList from 'components/CustomSkeleton';

//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//redux
import {useSelector} from 'react-redux';
import SubscribeComponent from '../Subscribe.component';
import SendEmailComponent from '../../Dashboard/HolidaysInfo/SendEmail.component';
import FaceBookClipboardComponent from '../../Dashboard/HolidaysInfo/FaceBookClipboard.component';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const BeachesInfo = ({navigation}) => {
  const [loading, setloading] = React.useState(false);
  const [beachesInfo, setBeachesInfo] = React.useState([]);
  var originalArray = GLOBAL.idearsInsipraton.slice(0);
  const [language, userProfile] = useSelector(state => [
    state.globalReducerData.language,
    state.UserReducerData.userProfile,
  ]);
  const toast = React.useRef('');

  const loadData = async () => {
    const locale = await AsyncStorage.getItem('selectedLocale');
    I18n.locale = locale;

    var arr = originalArray.splice(2, 1);
    setBeachesInfo(originalArray);
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
                {strings('the_most_beautiful_beaches_in_italy')}
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
                    'find_out_which_are_the_dream_destinations_to_visit_at_least_once_in_your',
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
                    source={require('../../../resources/images/beach1.png')}
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
                      'the_summer_season_is_close_to_us_and_so_the_search_for_the',
                    ) +
                      '\n' +
                      strings(
                        'the_question_promptly_arrives_but_which_are_the_most',
                      ) +
                      '\n' +
                      strings(
                        'our_beautiful_country_from_north_to_south_boasts_truly',
                      )}
                  </Typography>

                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'the_sea_of_italy_is_considered_among_the_most_beautiful',
                    ) +
                      '\n' +
                      strings(
                        'going_up_and_down_the_Peninsula_you_will_discover_bays_of',
                      ) +
                      '\n' +
                      strings('sicily_can_boast_some_of_the_most_beautiful')}
                  </Typography>

                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings(
                      'the_egadi_with_the_marvelous_cala_rossa_di_favignana',
                    ) +
                      '\n' +
                      strings(
                        'the_beautiful_spiaggia_dei_conigli_of_Lampedusa_can_be',
                      )}
                  </Typography>
                </Layout>

                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/beach2.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <ImageBackground
                    source={require('../../../resources/images/beach3.png')}
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
                      'among_the_fantastic_beaches_of_sardinia_there_is_he_pelosa',
                    )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/beach4.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('cala_goloritzé_in_the_gulf_of_orosei_is_natural')}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/beach5.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('porto_giunco_beach_in_villasimius')}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/beach6.png')}
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
                      'cala_violina_in_the_province_of_grosseto_is_a_beach_with',
                    ) +
                      '\n' +
                      strings(
                        'among_other_things_this_has_a_particular_characteristic',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/beach7.png')}
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
                      'puglia_with_its_indisputable_charm_offers_suggestive_and',
                    )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/beach8.png')}
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
                      'liguria_land_of_sea_beaches_and_cliffs_the_baia_dei',
                    ) +
                      '\n \n' +
                      strings(
                        'the_bay_of_silence_is_a_jewel_set_among_the_most_beautiful',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/beach9.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <ImageBackground
                    source={require('../../../resources/images/beach10.png')}
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
                      'among_the_most_beautiful_beaches_in_calabria_we_must_mention',
                    ) +
                      '\n' +
                      strings(
                        'although_it_is_called_Rotonda_in_reality_it_has_an',
                      )}
                  </Typography>
                </Layout>

                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/beach11.png')}
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
                      'capri_considered_one_of_the_most_beautiful_slands_in',
                    ) +
                      '\n' +
                      strings(
                        'it_is_a_small_cove_of_pebbles_placed_in_front_of_the_scoglio',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/beach12.png')}
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
                      'from_north_to_south_including_the_islands_italy_remains',
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
                  data={beachesInfo}
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
export default React.memo(BeachesInfo);

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
