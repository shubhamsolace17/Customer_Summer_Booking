import React, {useEffect, useState, useRef} from 'react';
import {Layout, Icon, Modal} from '@ui-kitten/components';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import CarousalComponent from 'components/Carousel';
import SVGIcon from 'components/Icon';
import {strings} from 'i18n/i18n';
import {Share} from 'react-native';
import CustomSkeletonList from 'components/CustomSkeleton/index';
import {checkDateInSeason} from 'resources/CommonFunction';
import MapView, {Marker} from 'react-native-maps';
import {
  _getCurrentDayBookable,
  _getPeriodRangeValid,
  _getIfReservationValid,
  _checkBlockOnlineBooking,
} from 'resources/ReservationServices';
const ArrowIcon = props => <Icon {...props} name="arrow-ios-forward-outline" />;
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';
import Loader from 'components/Loader';
import GLOBALS from 'resources/constant';
import {useDispatch, useSelector} from 'react-redux';
import {
  setPropertyId,
  setBathHouseId,
  setDynamicIns,
  setSelectProperty,
  setOnlineBookingSetting,
} from 'app/redux/actions/globalActions';
import {
  SetSeasonalDates,
  SetSeasonalPeriods,
} from 'app/redux/actions/beachMapActions';
import DropShadow from 'react-native-drop-shadow';
import RNFetchBlob from 'rn-fetch-blob';

const SearchSingleLocationScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {slug, showButton} = route.params || {};
  const [error, setError] = useState('');
  const [detailsData, setdetailsData] = useState();
  const [isFavourite, setisFavourite] = useState(false);
  const [enableOnlineServBook, setEnableOnlineServBook] = useState(false);
  const [enableOnlineLocBook, setEnableOnlineLocBook] = useState(false);
  const [isLocServiceEnabled, setIsLocServiceEnabled] = useState(false);
  const [locationOptionObj, setLocationOptionObj] = useState({});
  const [onlinePurchase, setOnlinePurchase] = useState(false);
  const [daysCountForBooking, setDaysCountForBooking] = useState(null);
  const [currentDayBookable, setCurrentDayBookable] = useState(false);
  const [isEnablePeriod, setIsEnablePeriode] = useState(false);
  const [periodSelectedRange, setperiodSelectedRange] = useState({});
  const [isSeasonInRange, setIsSeasonInRange] = useState(null);
  const [blockOnlinePayment, setBlockOnlinePayment] = useState(null);
  const [isAdminDisableOnLinePayment, setIsAdminDisableOnLinePayment] =
    useState(null);
  const [mapSelectedLocations, setmapSelectedLocations] = useState([]);
  const [isServicePresent, setIsServicePresent] = useState(false);
  const [
    isSignedIn,
    userProfile,
    language,
    dynamicIns,
    searchDate,
    seasonalDate,
  ] = useSelector(state => [
    state.UserReducerData.isSignedIn,
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
    state.globalReducerData.dynamicIns,
    state.globalReducerData.searchDate,
    state.BeachMapReducerData.seasonalDate,
  ]);
  const [showMap, setShowMap] = useState(false);
  const [loading, setloading] = useState(false);
  const [favorite, setfavorite] = useState(false);
  const [changeLaneg, setchangeLaneg] = useState(false);
  const toast = useRef('');

  const loadlikeData = async propertyId => {
    setloading(true);
    const {data, message, error} = await postDataToServer(`${Api.like}`);
    if (data) {
      const filterList = data.data.filter(e => {
        if (e.bathHouseId === propertyId && e.userId === userProfile.id) {
          setisFavourite(true);
          setfavorite(true);
        }
      });
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  const getOnlineReservationStatusByAdmin = async p_id => {
    const postData = {
      propertyId: p_id,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.getOnlineReservationStatusByAdmin}`,
      postData,
    );
    if (status) {
      const resData = data.data;
      setIsAdminDisableOnLinePayment(resData[0].isAdminDisableOnLinePayment);
    } else {
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
      setloading(false);
    }
  };

  const loadData = async () => {
    setloading(true);
    const postData = {
      slug: slug,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.getPropertyIdAndBathhouseFromSlug}`,
      postData,
    );
    if (status) {
      // loadPropertyDetails(data.data);
      getOnlineBookingSettings(data.data);
      getOnlineReservationStatusByAdmin(data.data.propertyId);
    } else {
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
      setloading(false);
    }
  };

  const getOnlineBookingSettings = async propertyData => {
    let postData = {
      propertyId: propertyData.propertyId,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.getOnlineBookingSettings}`,
      postData,
    );
    if (status) {
      let resData = data.data;
      let onlineBookingOptions = resData.onlineBookingOptions;
      let onlineLocationObj = onlineBookingOptions.locationOptionObj;
      let checkLocationObj =
        resData && onlineBookingOptions && onlineLocationObj;
      let blockOnlinePayment =
        checkLocationObj && checkLocationObj.blockReservation
          ? onlineLocationObj.blockReservation
          : false;
      dispatch(setOnlineBookingSetting(data.data));
      setEnableOnlineServBook(resData.serviceOnlineBooking == 0 ? true : false);
      setEnableOnlineLocBook(resData.onlineReservation == 0 ? true : false);
      setIsLocServiceEnabled(
        resData.serviceOnlineBooking == 0 && resData.onlineReservation == 0
          ? true
          : false,
      );
      setLocationOptionObj(resData.onlineBookingOptions?.locationOptionObj);
      setOnlinePurchase(
        resData.onlineBookingOptions
          ? resData?.onlineBookingOptions?.isEnabledMap
          : false,
      );
      setDaysCountForBooking(
        resData.onlineBookingOptions
          ? resData.onlineBookingOptions.locationOptionObj.blockReservation
          : null,
      );
      setIsEnablePeriode(
        resData.onlineBookingOptions
          ? resData.onlineBookingOptions.isEnablePeriod
          : false,
      );
      setperiodSelectedRange(
        resData.onlineBookingOptions ? resData.onlineBookingOptions.period : {},
      );
      setCurrentDayBookable(
        resData.onlineBookingOptions
          ? resData.onlineBookingOptions.locationOptionObj.currentDayBookable
          : false,
      );
      setBlockOnlinePayment(blockOnlinePayment ? blockOnlinePayment : null);
      setmapSelectedLocations(
        resData.onlineBookingOptions && resData.onlineBookingOptions.locations
          ? resData.onlineBookingOptions.locations
          : [],
      );
      // blockOnlinePayment: resData?.onlineBookingOptions?.locationOptionObj?.blockOnlinePayment,
      await loadSeasonsperiods(propertyData, resData);
    } else {
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
      setloading(false);
    }
  };

  const loadSeasonsperiods = async (propertyData, resData) => {
    const postData = {
      propertyId: propertyData.propertyId,
    };
    const {data, message, status, error} = await postDataToServer(
      `${Api.viewseasonsperiods}`,
      postData,
    );
    if (status) {
      //set reducer for seasonal data
      const res = data.data;
      let SeasonsDates = {
        seasonFrom: res.seasonFrom ? res.seasonFrom : new Date(),
        seasonTo: res.seasonTo ? res.seasonTo : new Date(),
      };
      dispatch(SetSeasonalDates(SeasonsDates));
      dispatch(SetSeasonalPeriods(res.periods ? res.periods : []));
      await loadPropertyDetails(propertyData, SeasonsDates, resData);
    } else {
      dispatch(SetSeasonalDates([]));
      dispatch(SetSeasonalPeriods([]));
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };

  const shareMessage = () => {
    Share.share({
      message: `${GLOBALS.shareLink_Url}${slug}`,
    })
      //after successful share return result
      .then(result => console.log(result))
      //If any thing goes wrong it comes here
      .catch(errorMsg => console.log(errorMsg));
  };

  const loadPropertyDetails = async (slugData, SeasonsDates, settingData) => {
    const postData = {
      propertyId: slugData.propertyId,
      bathHouseId: slugData.batHouseId,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.getPropertyWithBathHouseDetails}`,
      postData,
    );
    if (status) {
      const ins = {
        cancellation: data.data
          ? data.data.bathHouseData
            ? data.data.bathHouseData.cancellation
            : ''
          : '',
        patAtproperty: data.data
          ? data.data.paymentOptions
            ? data.data.paymentOptions.pay_at_property_info
            : ''
          : '',
      };
      const resData = await data.data;
      const seasonStartDate = SeasonsDates.seasonFrom
        ? SeasonsDates.seasonFrom
        : '';
      const seasonEndDate = SeasonsDates.seasonTo ? SeasonsDates.seasonTo : '';
      const tempStartate = searchDate.startDate
        ? searchDate.startDate
        : new Date();
      const tempEndDate = searchDate.endDate ? searchDate.endDate : new Date();
      const isSeasonInRange = await checkDateInSeason(
        tempStartate,
        tempEndDate,
        seasonStartDate,
        seasonEndDate,
      );
      console.log('isSeasonInRange', isSeasonInRange);
      console.log(
        'isSeasonInRange',
        tempStartate,
        tempEndDate,
        seasonStartDate,
        seasonEndDate,
      );
      dispatch(setSelectProperty(data.data.bathHouseData));
      dispatch(setPropertyId(slugData.propertyId));
      dispatch(setBathHouseId(slugData.batHouseId));
      dispatch(setDynamicIns(ins));
      setIsSeasonInRange(tempStartate);
      // setPropertyId(slugData.propertyId);
      // setBathHouseId(slugData.batHouseId);
      setdetailsData(data.data);
      if (isSeasonInRange) {
        _returnReservValidForMap(tempStartate, tempEndDate, settingData);
      } else {
        setError(strings('date_not_present'));
        setloading(false);
      }
      await loadlikeData(slugData.batHouseId);
      await loadServices(slugData.propertyId);
    } else {
      let errorMessage = error ? error : message;
      setError(errorMessage);
      setloading(false);
    }
  };

  const loadServices = async propertyId => {
    setloading(true);
    const postData = {
      propertyId: propertyId,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.viewServices}`,
      postData,
    );
    if (status) {
      const barServiceData = data.data.barServices;
      const normalServiceData = data.data.normalServices;
      const hourServiceData = data.data.hourlyServices;

      const newbarServiceData = barServiceData
        ? barServiceData.filter(item => item.PurchaseStatus === true)
        : [];

      const newnormalServiceData = normalServiceData
        ? normalServiceData.filter(item => item.PurchaseStatus === true)
        : [];

      const newhourServiceData = hourServiceData
        ? hourServiceData.filter(item => item.PurchaseStatus === true)
        : [];

      let isServicePresent =
        newbarServiceData.length > 0 ||
        newnormalServiceData.length > 0 ||
        newhourServiceData.length > 0;

      console.log('isServicePresent', isServicePresent);

      setIsServicePresent(isServicePresent);
      setloading(false);
    } else {
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
      setloading(false);
    }
  };

  const _returnReservValidForMap = async (fromDate, endDate, resData) => {
    const daysCountForBooking = resData.onlineBookingOptions
      ? resData.onlineBookingOptions.locationOptionObj.blockReservation
      : null;
    const isEnablePeriod = resData.onlineBookingOptions
      ? resData.onlineBookingOptions.isEnablePeriod
      : false;
    const periodSelectedRange = resData.onlineBookingOptions
      ? resData.onlineBookingOptions.period
      : {};
    const currentDayBookable = resData.onlineBookingOptions
      ? resData.onlineBookingOptions.locationOptionObj.currentDayBookable
      : false;
    const isMapEnabled = resData.onlineBookingOptions
      ? resData.onlineBookingOptions.isEnabledMap
      : false;
    const blockOnlinePaymentData = resData.onlineBookingOptions
      ? resData.onlineBookingOptions.locationOptionObj.blockOnlinePayment
      : null;
    const getIfReservationValid = await _getIfReservationValid(
      daysCountForBooking,
      endDate,
    );
    let checkPeriodDatesInRange = await _getPeriodRangeValid(
      periodSelectedRange,
      fromDate,
      endDate,
      isEnablePeriod,
    );
    let checkCurrentDayBookable = await _getCurrentDayBookable(
      currentDayBookable,
      fromDate,
    );
    let checkBlockOnlinePayment = await _checkBlockOnlineBooking(
      blockOnlinePaymentData,
      fromDate,
    );
    if (checkBlockOnlinePayment) {
      if (checkCurrentDayBookable) {
        if (getIfReservationValid) {
          if (checkPeriodDatesInRange) {
            if (isMapEnabled === true) {
              setError('');
            } else {
              setError('');
            }
          } else {
            setError(
              language === 'it'
                ? strings('sorry_property_no_availability')
                : strings('date_not_in_range'),
            );
          }
        } else {
          setError(strings('sorry_property_no_availability'));
        }
      } else {
        setError(
          language === 'it'
            ? strings('sorry_property_no_availability')
            : strings('current_day_not_bookable'),
        );
      }
    } else {
      setError(strings('sorry_property_no_availability'));
    }
  };

  useEffect(() => {
    navigation.setParams({refresh: true});
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
      // loaderUserData()
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  React.useEffect(() => {
    setchangeLaneg(true);
    setTimeout(() => {
      setchangeLaneg(false);
    }, 1000);
  }, [language]);

  const likePropertyData = async index => {
    if (isSignedIn) {
      const favouriteData = !isFavourite;
      const postData = {
        userId: userProfile ? userProfile.id : '',
        bathHouseId: detailsData.bathHouseData.id,
        islike: `${favouriteData === true ? '1' : '0'}`,
      };
      const {data, message, error, sucess} = await postDataToServer(
        `${Api.likeProperty}`,
        postData,
      );
      if (sucess) {
        setisFavourite(!isFavourite);
      } else {
        let errorMessage = error ? error : message;
        setloading(false);
        setError(errorMessage);
      }
    } else {
      toast.current.show(strings('sign_in_required'));
    }
  };

  const BookNow = () => {
    if (isSeasonInRange) {
      if (onlinePurchase) {
        navigation.navigate('BookNow', {
          location: mapSelectedLocations,
        });
      } else {
        navigation.navigate('TabularBookingScreen');
      }
    }
  };

  const checkPermission = async url => {
    // Function to check the platform
    // If Platform is Android then check for permissions.
    console.log('');
    if (Platform.OS === 'ios') {
      downloadFile(url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: strings('storage_permission'),
            message: strings('storage_message_permission'),
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(url);
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert(
            strings('storage_permission'),
            strings('Permissions_not_Granted'),
          );
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadFile = fileUrl => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          '/file_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        toast.current.show(strings('file_Download'));
      });
  };

  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />

      {!loading && detailsData && detailsData.bathHouseData ? (
        <>
          <SecondaryHeader
            title={
              detailsData &&
              detailsData.bathHouseData &&
              detailsData.bathHouseData.bathouseName
                ? detailsData.bathHouseData.bathouseName
                : ''
            }
            actionIcon="Share"
            heartIcon={isFavourite ? 'HeartFill' : 'Heart'}
            onActionClick={shareMessage}
            heartIconClick={likePropertyData}
          />
          <Layout style={[styles.boxStyle, {marginBottom: themeConfig.margin}]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {detailsData && detailsData.bathHouseData && (
                <>
                  <SVGIcon
                    type="Location"
                    width={16}
                    height={16}
                    color="black"
                  />
                </>
              )}
              <Typography
                status="basic"
                style={{
                  marginLeft: themeConfig.margin / 2,
                  fontWeight: '400',
                }}
                category="p2">
                {detailsData &&
                detailsData.bathHouseData &&
                detailsData.bathHouseData.address
                  ? detailsData.bathHouseData.address
                  : ''}
              </Typography>
            </View>
          </Layout>
          <ScrollView bounces={false}>
            <Layout level="1" style={styles.container}>
              <Layout
                style={[
                  styles.boxStyle,
                  {
                    marginBottom: themeConfig.margin,
                    marginVertical: themeConfig.margin,
                  },
                ]}>
                {detailsData &&
                detailsData.bathHouseData &&
                detailsData &&
                detailsData.bathHouseData.photos &&
                JSON.parse(detailsData.bathHouseData.photos) !== 'undefined' ? (
                  <CarousalComponent
                    data={
                      detailsData && detailsData.bathHouseData
                        ? JSON.parse(detailsData.bathHouseData.photos)
                        : []
                    }
                  />
                ) : (
                  <></>
                )}
              </Layout>
            </Layout>
            <Layout
              style={[styles.boxStyle, {marginBottom: themeConfig.margin}]}>
              <Typography category="h3" style={{fontWeight: '400'}}>
                {strings('the_property')}
              </Typography>
              <Typography
                category="p2"
                status="basic"
                style={{fontWeight: '400'}}>
                {detailsData &&
                detailsData.bathHouseData &&
                detailsData.bathHouseData.description
                  ? detailsData.bathHouseData.description
                  : ''}
              </Typography>
            </Layout>

            <Layout style={styles.boxStyle}>
              {detailsData && detailsData.bathHouseData && (
                <>
                  {detailsData.bathHouseData.priceListPDF && (
                    <TouchableOpacity
                      onPress={() =>
                        checkPermission(detailsData.bathHouseData.priceListPDF)
                      }
                      style={styles.menuButton}>
                      <Typography
                        status="basic"
                        category="s2"
                        style={{
                          color: themeConfig.colors.primary,
                          textDecorationLine: 'underline',
                        }}>
                        {strings('list')}
                      </Typography>
                    </TouchableOpacity>
                  )}

                  {detailsData.bathHouseData.menuPDF && (
                    <TouchableOpacity
                      onPress={() =>
                        checkPermission(detailsData.bathHouseData.menuPDF)
                      }
                      style={styles.menuButton}>
                      <Typography
                        status="basic"
                        category="s2"
                        style={{
                          fontWeight: '800',
                          color: themeConfig.colors.primary,
                          textDecorationLine: 'underline',
                        }}>
                        {strings('menu')}
                      </Typography>
                    </TouchableOpacity>
                  )}

                  {detailsData && detailsData.bathHouseData && (
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() =>
                        detailsData && detailsData.bathHouseData
                          ? navigation.navigate('PropertyFacilities', {
                              data: detailsData.bathHouseData,
                            })
                          : ''
                      }>
                      <Typography
                        status="basic"
                        category="s2"
                        style={{
                          fontWeight: '800',
                          color: themeConfig.colors.primary,
                        }}>
                        {strings('services')}
                      </Typography>
                      <Icon
                        style={styles.icon}
                        fill={themeConfig.colors.primary}
                        name={'arrow-ios-forward'}
                      />
                    </TouchableOpacity>
                  )}

                  {detailsData && detailsData.bathHouseData && (
                    <TouchableOpacity
                      style={styles.menuButton}
                      onPress={() =>
                        detailsData && detailsData.bathHouseData
                          ? navigation.navigate('PropertyPolicy', {
                              bathHouseData: detailsData.bathHouseData,
                            })
                          : ''
                      }>
                      <Typography
                        status="basic"
                        category="s1"
                        style={{
                          fontWeight: '800',
                          color: themeConfig.colors.primary,
                        }}>
                        {strings('read_Before_Booking')}
                      </Typography>
                      <Icon
                        style={styles.icon}
                        fill={themeConfig.colors.primary}
                        name={'arrow-ios-forward'}
                      />
                    </TouchableOpacity>
                  )}
                </>
              )}
              {detailsData && detailsData.bathHouseData && (
                <View
                  style={[
                    {
                      borderRadius: themeConfig.radius * 2,
                      overflow: 'hidden',
                      marginVertical: themeConfig.margin * 2,
                      marginBottom: themeConfig.margin,
                    },
                  ]}>
                  <MapView
                    style={styles.mapStyle}
                    showsUserLocation={false}
                    zoomEnabled={true}
                    provider="google"
                    zoomControlEnabled={true}
                    initialRegion={{
                      latitude: parseFloat(detailsData.bathHouseData.latitude),
                      longitude: parseFloat(
                        detailsData.bathHouseData.longitude,
                      ),
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}>
                    <Marker
                      coordinate={{
                        latitude: parseFloat(detailsData.bathHouseData.latitude)
                          ? parseFloat(detailsData.bathHouseData.latitude)
                          : -34.397,
                        longitude: parseFloat(
                          detailsData.bathHouseData.longitude,
                        )
                          ? parseFloat(detailsData.bathHouseData.longitude)
                          : 150.644,
                      }}
                      pinColor={themeConfig.colors.primary}
                    />
                  </MapView>
                </View>
              )}
              <View
                style={{
                  margin: themeConfig.margin * 2,
                  marginBottom: themeConfig.margin / 2,
                }}>
                <ButtonComponent onPress={() => setShowMap(true)}>
                  <Typography
                    status="control"
                    category="h6"
                    style={{fontWeight: '400'}}>
                    {strings('View_on_map')}
                  </Typography>
                </ButtonComponent>
              </View>
            </Layout>
          </ScrollView>

          <Layout style={styles.boxStyle}>
            {enableOnlineLocBook && error ? (
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Typography
                  status="danger"
                  category="s2"
                  style={{
                    marginLeft: themeConfig.margin / 2,
                    fontWeight: '400',
                  }}>
                  {error}
                </Typography>
              </View>
            ) : (
              <>
                {isSeasonInRange && showButton && (
                  <>
                    {((isAdminDisableOnLinePayment && enableOnlineLocBook) ||
                      enableOnlineServBook) && (
                      <>
                        <DropShadow
                          style={{
                            shadowColor: '#0F379f',
                            shadowOffset: {
                              width: 0,
                              height: 6,
                            },
                            shadowOpacity: 1,
                            shadowRadius: 6,
                          }}>
                          <ButtonComponent onPress={() => BookNow()}>
                            <Typography
                              status="control"
                              category="h6"
                              style={{fontWeight: '400'}}>
                              {strings('book')}
                            </Typography>
                          </ButtonComponent>
                        </DropShadow>
                      </>
                    )}
                    <DropShadow
                      style={{
                        shadowColor: themeConfig.colors.primary,
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 6,
                      }}>
                      {enableOnlineServBook && isServicePresent && (
                        <TouchableOpacity
                          style={[
                            styles.navigationButton,
                            {
                              justifyContent: 'center',
                              borderColor: themeConfig.colors.primary,
                              marginTop: themeConfig.margin,
                            },
                          ]}
                          onPress={() =>
                            navigation.navigate('BookExtraService')
                          }>
                          <Typography
                            status="basic"
                            category="s2"
                            style={{
                              fontWeight: '400',
                              color: themeConfig.colors.primary,
                            }}>
                            {strings('bookAn_extra_services')}
                          </Typography>
                        </TouchableOpacity>
                      )}
                    </DropShadow>
                  </>
                )}
              </>
            )}
          </Layout>
        </>
      ) : (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      )}

      {!loading && showMap && (
        <Layout>
          <Modal
            style={{
              backgroundColor: themeConfig.colors.white,
              width: '90%',
              height: '50%',
              justifyContent: 'center',
              flex: 1,
              alignItems: 'center',
              borderRadius: themeConfig.radius * 2,
            }}
            backdropStyle={styles.backdrop}
            visible={showMap}
            onBackdropPress={() => setShowMap(false)}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                borderRadius: 15,
                backgroundColor: themeConfig.colors.primary,
              }}
              onPress={() => setShowMap(!showMap)}>
              <Icon
                name="close-outline"
                style={{
                  width: 28,
                  height: 28,
                }}
                fill={themeConfig.colors.white}
              />
            </TouchableOpacity>
            <MapView
              style={[
                styles.mapStyle,
                {
                  width: '90%',
                  height: '50%',
                },
              ]}
              showsUserLocation={false}
              zoomEnabled={true}
              provider="google"
              zoomControlEnabled={true}
              initialRegion={{
                latitude: parseFloat(detailsData.bathHouseData.latitude),
                longitude: parseFloat(detailsData.bathHouseData.longitude),
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: parseFloat(detailsData.bathHouseData.latitude)
                    ? parseFloat(detailsData.bathHouseData.latitude)
                    : -34.397,
                  longitude: parseFloat(detailsData.bathHouseData.longitude)
                    ? parseFloat(detailsData.bathHouseData.longitude)
                    : 150.644,
                }}
                title={
                  detailsData &&
                  detailsData.bathHouseData &&
                  detailsData.bathHouseData.bathouseName
                    ? detailsData.bathHouseData.bathouseName
                    : ''
                }
                pinColor={themeConfig.colors.primary}
              />
            </MapView>
          </Modal>
        </Layout>
      )}
      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
      />
    </Layout>
  );
};
export default React.memo(SearchSingleLocationScreen);

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 3,
  },
  mapStyle: {
    width: '100%',
    height: 140,
    borderRadius: themeConfig.radius * 4,
    borderWidth: themeConfig.borderWidth,
    borderColor: 'white',
  },
  navigationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: themeConfig.radius * 4,
    borderWidth: themeConfig.borderWidth,
    borderColor: themeConfig.colors.borderColor,
    padding: themeConfig.padding + 4,
    marginBottom: themeConfig.margin,
  },
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: themeConfig.colors.borderColor,
    padding: themeConfig.padding + 4,
    backgroundColor: themeConfig.colors.white,
    marginBottom: themeConfig.margin,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: themeConfig.margin,
    paddingVertical: themeConfig.padding / 2,
  },
  imageContainer: {
    width: 130,
    maxHeight: '100%',
  },
  imageStyle: {
    borderRadius: themeConfig.radius,
    width: 130,
    height: 180,
  },
  itemContainer: {
    borderRadius: themeConfig.radius,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: themeConfig.margin * 2,
    position: 'relative',
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleBorder: {
    width: 1,
    borderColor: themeConfig.colors.borderColor,
    borderWidth: 0.7,
    height: themeConfig.boxHeightUnit / 2,
  },
  filterSortChild: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: themeConfig.boxHeightUnit,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  icon: {
    width: 40,
    height: 30,
  },
});
