import React from 'react';
import {
  Layout,
  Divider,
  NativeDateService,
  CheckBox,
} from '@ui-kitten/components';
import {StyleSheet, Image, View, Dimensions, Alert, LogBox} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import HorizontalImageList from 'components/HorizontalImageList';
import VerticalImageList from 'components/VerticalImageList';
import {ScrollView} from 'react-native-gesture-handler';
import I18n from 'react-native-i18n';
import {strings} from 'i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-easy-toast';
import moment from 'moment';
import SearchComponent from './Search.component';
import GLOBAL from 'resources/constant';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//redux
import {useDispatch, useSelector} from 'react-redux';
import {
  setUserSearchDate,
  setSearchData,
} from 'app/redux/actions/globalActions';
import CustomSkeletonList from 'components/CustomSkeleton';
import SubscribeComponent from './Subscribe.component';
const windowHeight = Dimensions.get('window').height;
const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [range, setRange] = React.useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [date, setDate] = React.useState({});
  const [autoInput, setautoInput] = React.useState('');
  const forceUpdate = React.useReducer(() => ({}))[1];
  const [rangeError, setrangeError] = React.useState('');
  const [propertySearchData, setpropertySearchData] = React.useState();
  const [propertyevidence, setpropertyevidence] = React.useState();
  const [autoInputError, setautoInputError] = React.useState('');
  const [loading, setloading] = React.useState(false);
  const toast = React.useRef('');
  const [language, userProfile] = useSelector(state => [
    state.globalReducerData.language,
    state.UserReducerData.userProfile,
  ]);

  const loadData = async () => {
    setloading(true);

    const locale = await AsyncStorage.getItem('selectedLocale');
    I18n.locale = locale;
    const getlastRequest = await AsyncStorage.getItem('lastRequest');
    const lastRequest = JSON.parse(getlastRequest);
    const regionCacheData = await AsyncStorage.getItem('regionData');

    // AsyncStorage.clear()
    try {
      await AsyncStorage.removeItem('bookLocationData');
      await AsyncStorage.removeItem('locationSum');
      await AsyncStorage.removeItem('selectedBookedLocation');
    } catch (exception) {
      console.log(exception);
    }

    var today = new Date();
    let ts = moment(lastRequest).format('YYYY-MM-DD');
    let ts1 = moment(today).format('YYYY-MM-DD');
    let startDate = moment(ts);
    let endDate = moment(ts1);
    const duration = moment.duration(endDate.diff(startDate)).asDays();
    if (lastRequest == null || duration == 1) {
      const {data, message, error} = await postDataToServer(
        `${Api.getpropertiesByRegionForHomePage}`,
      );
      if (data) {
        AsyncStorage.setItem('lastRequest', JSON.stringify(new Date()));
        await AsyncStorage.setItem('regionData', JSON.stringify(data.data));
        const estList = data.data.filter(item => {
          var propertyType = item.propertyType;
          return propertyType == 'est';
        });
        if (estList && estList.length > 0) {
          setpropertyevidence(estList);
        }
        const searchList = data.data.filter(item => {
          var propertyType = item.propertyType;
          return propertyType == 'search';
        });
        if (searchList && searchList.length > 0) {
          setpropertySearchData(searchList);
        }
        setloading(false);
      } else {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
        setloading(false);
      }
    } else {
      setloading(false);
      const cacheData = JSON.parse(regionCacheData);
      if (cacheData && cacheData.length > 0) {
        const estList =
          cacheData &&
          cacheData.filter(item => {
            var propertyType = item.propertyType;
            return propertyType == 'est';
          });
        if (estList && estList.length > 0) {
          setpropertyevidence(estList);
        }
        const searchList =
          cacheData &&
          cacheData.filter(item => {
            var propertyType = item.propertyType;
            return propertyType == 'search';
          });
        if (searchList && searchList.length > 0) {
          setpropertySearchData(searchList);
        }
      }
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      forceUpdate();
      loadData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const onSumbit = async () => {
    let isValid = true;
    if (autoInput == '') {
      isValid = false;
      setautoInputError(strings('placeVad'));
    }

    if (Object.keys(range).length === 0) {
      isValid = false;
      setrangeError(strings('dateVad'));
    }

    if (Object.keys(range).length > 0 && !range.startDate) {
      isValid = false;
      setrangeError(strings('startDateVad'));
    }

    if (Object.keys(range).length > 0 && !range.endDate) {
      isValid = false;
      setrangeError(strings('endDateVad'));
    }
    if (isValid) {
      const searchData = {
        searchKey: autoInput,
        range: range,
      };
      dispatch(setUserSearchDate(range));
      await dispatch(setSearchData(searchData)).then(() => {
        navigation.navigate('SearchResult', searchData);
      });
      // navigation.navigate('TabularBookingScreen');

      // navigation.navigate('BookingConfirm');
      // dispatch(setSearchData(searchData));
      // navigation.navigate('SearchResult', searchData);
    }
  };

  const discountProperty = async () => {
    dispatch(setUserSearchDate(range));
    const searchData = {
      searchKey: 'Bagno Argo',
      range: range,
    };
    await dispatch(setSearchData(searchData)).then(() => {
      navigation.navigate('SearchResult', searchData);
    });
  };

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
  React.useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  const navigateSearchLocation = async (item, showButton) => {
    dispatch(setUserSearchDate(range));
    const searchData = {
      searchKey: item.slug,
      range: range,
    };
    await dispatch(setSearchData(searchData)).then(() => {
      navigation.navigate('SearchSingleLocationScreen', {
        slug: item.slug,
        showButton: showButton,
      });
    });
  };
  return (
    <Layout style={{flex: 1, bottom: 10}}>
      <HeaderComponent />
      <Divider />

      {loading && (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      )}

      {!loading && (
        <>
          <ScrollView
            bounces={false}
            contentContainerStyle={{paddingBottom: windowHeight / 8}}>
            <Layout level="1">
              <SearchComponent
                showDatePicker
                range={range}
                inputCaption={autoInputError ? autoInputError : ''}
                setInputValue={data => {
                  setautoInput(data), setautoInputError('');
                }}
                showSearch={true}
                inputStatus={autoInputError ? 'danger' : ''}
                dateCaption={rangeError ? rangeError : ''}
                dateStatus={rangeError ? 'danger' : ''}
                onDateSelect={nextRange => {
                  setRange(nextRange), setrangeError('');
                }}
                onSearchSumbit={() => {
                  onSumbit();
                }}
                locale={language}
              />
              <Layout style={styles.boxStyle}>
                <Typography
                  category="h3"
                  style={{
                    marginVertical: themeConfig.margin,
                    marginHorizontal: themeConfig.margin,
                    fontSize: 16,
                  }}>
                  {strings('summar_offers')}
                </Typography>
                <Layout id="discount" style={styles.discountBoxStyle}>
                  <View style={{marginHorizontal: themeConfig.margin * 2}}>
                    <Image
                      style={{
                        width: 20,
                        height: 35,
                        top: -20,
                        left: -20,
                        position: 'absolute',
                        justifyContent: 'center',
                      }}
                      source={require('app/resources/images/priceTag.png')}
                    />
                    <Typography
                      category="s2"
                      style={{
                        marginVertical: themeConfig.margin,
                        fontSize: 13,
                        fontWeight: '400',
                      }}>
                      {strings('find_bathHouse')}
                    </Typography>

                    <ButtonComponent
                      size="small"
                      style={{
                        color: themeConfig.colors.white,
                        backgroundColor: themeConfig.colors.primary,
                        width: '60%',
                      }}
                      onPress={() => discountProperty()}>
                      <Typography
                        status="control"
                        category="s2"
                        style={{color: 'white'}}>
                        {strings('discover_offers')}
                      </Typography>
                    </ButtonComponent>
                  </View>
                </Layout>
              </Layout>
              <Layout style={styles.boxStyle}>
                <HorizontalImageList
                  iconName="BeachUmbrella"
                  title={strings('mosted_Booked_Bathouse')}
                  data={propertyevidence}
                  onPress={
                    item => navigateSearchLocation(item, false)
                    // navigation.navigate('SearchSingleLocationScreen', {
                    //   slug: item.slug,
                    //   showButton: false,
                    // })
                  }
                />
              </Layout>
              <Layout style={styles.boxStyle}>
                <HorizontalImageList
                  isTwoRow
                  iconName="Location"
                  title={strings('search_by_region')}
                  data={propertySearchData}
                  onPress={
                    item => navigateSearchLocation(item, true)
                    // navigation.navigate('SearchSingleLocationScreen', {
                    //   slug: item.slug,
                    // })
                  }
                />
              </Layout>
              <Layout style={styles.boxStyle}>
                <VerticalImageList
                  isTwoRow
                  iconName="BeachUmbrella"
                  title={strings(
                    'ideas_and_inspiration_for_your_summer_holidays',
                  )}
                  onPress={item => {
                    console.log('item111', item),
                      // navigation.navigate('BookingWebViewScreen', {
                      //   url: item.url,
                      // });
                      navigation.navigate(item.url);
                  }}
                  data={GLOBAL.idearsInsipraton}
                />
              </Layout>
              <Layout style={styles.boxStyle}>
                <HorizontalImageList
                  iconName="BeachUmbrella"
                  title={strings('most_popular_bathouses')}
                  data={GLOBAL.popularBathouses}
                  onPress={
                    item => navigateSearchLocation(item, true)
                    // navigation.navigate('SearchSingleLocationScreen', {
                    //   slug: item.slug,
                    // })
                  }
                />
              </Layout>
            </Layout>
            <SubscribeComponent onSumbit={values => onSubscribe(values)} />
          </ScrollView>
        </>
      )}

      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        style={{backgroundColor: 'red'}}
        positionValue={200}
        textStyle={{color: 'white'}}
      />
    </Layout>
  );
};
export default React.memo(HomeScreen);

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
  subscibeBoxStyle: {
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding * 2,
    // justifyContent:"center"
  },
});
