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

const HistoricBathHousesInfo = ({navigation}) => {
  const [loading, setloading] = React.useState(false);
  const [historicBathhousesInfo, setHistoricBathhousesInfo] = React.useState(
    [],
  );
  var originalArray = GLOBAL.idearsInsipraton.slice(0);
  const toast = React.useRef('');
  const [language, userProfile] = useSelector(state => [
    state.globalReducerData.language,
    state.UserReducerData.userProfile,
  ]);

  const loadData = async () => {
    // setloading(true);

    const locale = await AsyncStorage.getItem('selectedLocale');
    I18n.locale = locale;

    var arr = originalArray.splice(3, 1);
    setHistoricBathhousesInfo(originalArray);
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
                {strings('historic_bathouses')}
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
                  {strings('which_are_the_first_bathouses_that_were')}
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
                    source={require('../../../resources/images/histoic1.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('seaside_tourism_we_know_them_today') +
                      '\n \n' +
                      strings('the_culture_of_water_as_a_source_of') +
                      '\n \n' +
                      strings(
                        'in_the_past_seaside_tourism_was_considered_an_exclusive',
                      ) +
                      '\n \n' +
                      strings(
                        'the_bathing_establishments_were_born_near_the_sea_therefore',
                      ) +
                      '\n \n' +
                      strings(
                        'the_first_bathing_establishments_in_italy_were',
                      ) +
                      '\n \n' +
                      strings(
                        'the_first_was_reserved_exclusively_for_distinguished_ladies_and_girls',
                      ) +
                      '\n \n' +
                      strings(
                        'the_ladies_wore_a_woolen_costume_a_material_that_did_not',
                      ) +
                      '\n \n' +
                      strings(
                        'the_establishment_de_bagni_on_the_other_and_was_designed',
                      ) +
                      '\n \n' +
                      strings(
                        'here_guests_could_find_all_the_comforts_required_undress_in',
                      ) +
                      '\n \n' +
                      strings(
                        'the_stilts_in_the_bathing_establishments_of_viareggio',
                      ) +
                      '\n \n' +
                      strings(
                        'in_the_bagni_beretti_were_built_in_livorno_a_closed',
                      ) +
                      '\n' +
                      strings(
                        'in_versilia_the_bathing_establishment_of_forte_dei_marmi',
                      )}
                  </Typography>
                </Layout>
                <Layout>
                  <ImageBackground
                    source={require('../../../resources/images/histoic2.png')}
                    resizeMode="cover"
                    style={styles.mainImage}
                  />
                  <Typography
                    style={{
                      marginVertical: themeConfig.margin + 15,
                      fontSize: 16,
                      color: '#000',
                    }}>
                    {strings('italy_therefore_with_its_over')}
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
                  data={historicBathhousesInfo}
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
export default React.memo(HistoricBathHousesInfo);

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
