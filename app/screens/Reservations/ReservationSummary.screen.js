import React, {useState, useRef, useEffect} from 'react';
import {Layout, Icon} from '@ui-kitten/components';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import DateRangePickerComponent from 'components/DateRangePicker';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import * as Yup from 'yup';
import {Formik} from 'formik';
import SVGIcon from 'components/Icon';
import moment from 'moment';

//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//Translation
import {strings} from 'i18n/i18n';
import Toast from 'react-native-easy-toast';
import {useSelector, useDispatch} from 'react-redux';
import ProperyCard from 'screens/Dashboard/PropertyCard.component';
import CustomSkeletonList from 'components/CustomSkeleton';
function ReservationSummary({navigation, route}) {
  const dispatch = useDispatch();
  const {id, fromPage, bathHouseId, data} = route.params || {};
  const [loading, setloading] = useState(false);
  const [locReserveData, setlocReserveData] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [barServiceData, setBarServiceData] = useState([]);
  const [normalServiceData, setNormalServiceData] = useState([]);
  const [hourlyServiceData, sethourlyServiceData] = useState([]);
  const [
    searchDate,
    getFinalLocData,
    selectedBookedLocation,
    selectedProperty,
  ] = useSelector(state => [
    state.globalReducerData.searchDate,
    state.BookingReducerData.getFinalLocData,
    state.locationReducer.selectedBookedLocation,
    state.globalReducerData.selectedProperty,
  ]);
  const toast = useRef('');

  const loadBookingData = async () => {
    setloading(true);
    const postData = {
      id: id,
    };
    const {data, error, message, status} = await postDataToServer(
      `${Api.getBookedLocationData}`,
      postData,
    );
    if (status) {
      setlocReserveData(data.data);
      await loadProprty(data.data.property_id);
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };

  const loadReservationDetData = async () => {
    setloading(true);
    const postData = {
      serviceReservationId: id,
    };
    const {data, error, message, success} = await postDataToServer(
      `${Api.getServiceResData}`,
      postData,
    );
    if (success) {
      setlocReserveData(data.data);
      setBarServiceData(
        data && data.data && data.data.servicesData.barServiceData
          ? data.data.servicesData.barServiceData.filter(item => item.count > 0)
          : [],
      );
      setNormalServiceData(
        data && data.data && data.data.servicesData.normalServiceData
          ? data.data.servicesData.normalServiceData.filter(
              item => item.count > 0,
            )
          : [],
      );
      sethourlyServiceData(
        data && data.data && data.data.servicesData.hourlyServiceData
          ? data.data.servicesData.hourlyServiceData
          : [],
      );
      await loadProprty(data.data.propertyId);
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };

  const loadProprty = async propertyId => {
    const postData = {
      propertyId: propertyId,
      bathHouseId: bathHouseId,
    };
    const {data, error, message, status} = await postDataToServer(
      `${Api.getPropertyWithBathHouseDetails}`,
      postData,
    );
    if (status) {
      setPropertyDetails(data.data);
      setloading(false);
    } else {
      setloading(false);
      setPropertyDetails([]);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };

  const ManageAccount = () => {
    let data = {
      propertyDetails: propertyDetails,
      locReserveData: locReserveData,
      bookFor: fromPage,
    };
    // navigation.navigate('ManageBooking', {
    //   bookingSummary: data,
    //   reservations: reservations,
    // });

    navigation.navigate('ManageBooking');
  };

  const continueBooking = () => {
    dispatch(setstoreFinalLocData([]));
    navigation.navigate('Search', {screen: 'SearchHome'});
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (fromPage === 'location') {
        loadBookingData();
      }
      if (fromPage === 'service') {
        loadReservationDetData();
      }
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const renderDate = date => {
    return (
      <Typography category="s1" style={styles.primaryText} status="basic">
        {date}
      </Typography>
    );
  };
  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />

      {loading ? (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      ) : (
        <>
          <ScrollView bounces={false}>
            <Layout
              level="1"
              style={[
                styles.container,
                {marginTop: themeConfig.margin},
                styles.boxStyle,
              ]}>
              <SecondaryHeader title={strings('reservation_summary')} />
              {propertyDetails && propertyDetails.bathHouseData && (
                <ProperyCard
                  showImage
                  showContact
                  plain
                  name={propertyDetails.bathHouseData.bathouseName}
                  address={propertyDetails.bathHouseData.address}
                  imageUrl={propertyDetails.bathHouseData.mainPhoto}
                  email={propertyDetails.bathHouseData.email}
                  phoneNo={propertyDetails.bathHouseData.mobile}
                />
              )}
              {locReserveData && (
                <Layout level="1" style={styles.packageCardStyle}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <SVGIcon
                      type="Calender"
                      color={themeConfig.colors.primary}
                      style={{width: 70}}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <SVGIcon
                      type="Calender"
                      color={themeConfig.colors.primary}
                      style={{width: 20}}
                    />
                    <View style={styles.rightSection}>
                      <Typography
                        category="s1"
                        style={{fontSize: 12}}
                        status="basic">
                        {strings('from')}{' '}
                        {renderDate(
                          moment(locReserveData.booking_start_date).format(
                            'DD/MM/YYYY',
                          ),
                        )}{' '}
                        {strings('to')}{' '}
                        {renderDate(
                          moment(locReserveData.booking_end_date).format(
                            'DD/MM/YYYY',
                          ),
                        )}
                      </Typography>
                    </View>
                  </View>

                  {locReserveData.packageSelectedData &&
                    locReserveData.packageSelectedData.length > 0 && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: themeConfig.margin,
                            marginLeft: 5,
                          }}>
                          <View style={styles.leftSection}>
                            <Typography
                              category="s1"
                              style={styles.blacktext}
                              status="basic">
                              {strings('package')}:
                            </Typography>
                          </View>
                          <View
                            style={[
                              styles.rightSection,
                              {
                                alignItems: 'flex-end',
                                marginLeft: themeConfig.margin,
                              },
                            ]}>
                            <Typography
                              category="s2"
                              style={styles.primaryText}
                              status="basic">
                              {locReserveData.packageSelectedData[0]
                                .PackageName +
                                ' ' +
                                locReserveData.packageSelectedData[0]
                                  .PackageItemPrice}{' '}
                              €
                            </Typography>
                          </View>
                        </View>

                        {locReserveData.packageSelectedData[0].AdditionalItem &&
                          locReserveData.packageSelectedData[0].AdditionalItem.map(
                            (e, i) => {
                              return (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginVertical: themeConfig.margin,
                                    marginLeft: themeConfig.margin,
                                  }}>
                                  <View style={styles.leftSection}>
                                    <Typography
                                      category="s1"
                                      style={styles.blacktext}
                                      status="basic">
                                      {strings('additional_items')}:
                                    </Typography>
                                  </View>
                                  <View
                                    style={[
                                      styles.rightSection,
                                      {
                                        alignItems: 'flex-end',
                                        marginRight: themeConfig.margin,
                                      },
                                    ]}>
                                    <Typography
                                      category="s2"
                                      style={styles.primaryText}
                                      status="basic">
                                      {e.item} {e.price} €
                                    </Typography>
                                  </View>
                                </View>
                              );
                            },
                          )}
                      </>
                    )}

                  {/* <View
                style={{
                  flexDirection: 'row',
                  marginVertical: themeConfig.margin,
                }}>
                <View style={styles.leftSection}>
                  <Typography
                    category="s1"
                    style={styles.blacktext}
                    status="basic">
                    Number of people:
                  </Typography>
                </View>
                <View style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                  <Typography
                    category="s2"
                    style={styles.primaryText}
                    status="basic">
                    2
                  </Typography>
                </View>
              </View> */}
                  {fromPage === 'service' && (
                    <>
                      {barServiceData &&
                        barServiceData.length > 0 &&
                        barServiceData.map((data, index) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: themeConfig.margin,
                            }}>
                            <View style={styles.leftSection}>
                              <Typography
                                category="s1"
                                style={{fontWeight: '600'}}
                                status="basic">
                                {strings('additiona_services')}
                              </Typography>
                            </View>
                            <View style={styles.rightSection}>
                              <Typography
                                category="s2"
                                style={{
                                  fontWeight: '600',
                                  color: themeConfig.colors.primary,
                                }}
                                status="basic">
                                {data.ServiceName}
                              </Typography>
                            </View>
                          </View>
                        ))}

                      {normalServiceData &&
                        normalServiceData.length > 0 &&
                        normalServiceData.map((data, index) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: themeConfig.margin,
                            }}>
                            <View style={styles.leftSection}>
                              <Typography
                                category="s1"
                                style={{fontWeight: '600'}}
                                status="basic">
                                {strings('additiona_services')}
                              </Typography>
                            </View>
                            <View style={styles.rightSection}>
                              <Typography
                                category="s2"
                                style={{
                                  fontWeight: '600',
                                  color: themeConfig.colors.primary,
                                }}
                                status="basic">
                                {data.ServiceName}
                              </Typography>
                            </View>
                          </View>
                        ))}

                      {hourlyServiceData &&
                        hourlyServiceData.length > 0 &&
                        hourlyServiceData.map(
                          data =>
                            data.selectedData &&
                            data.selectedData.length > 0 &&
                            data.selectedData.map((a, index) => (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginVertical: themeConfig.margin,
                                }}>
                                <View style={styles.leftSection}>
                                  <Typography
                                    category="s1"
                                    style={styles.blacktext}
                                    status="basic">
                                    {strings('additiona_services')}
                                  </Typography>
                                </View>
                                <View style={styles.rightSection}>
                                  <Typography
                                    category="s2"
                                    style={styles.primaryText}
                                    status="basic">
                                    {a.name}
                                  </Typography>
                                </View>
                              </View>
                            )),
                        )}
                    </>
                  )}
                  {/* <View
                style={{
                  flexDirection: 'row',
                  marginVertical: themeConfig.margin,
                }}>
                <View style={styles.leftSection}>
                  <Typography
                    category="s1"
                    style={styles.blacktext}
                    status="basic">
                    Additional services :
                  </Typography>
                </View>
                <View style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                  <Typography
                    category="s2"
                    style={styles.primaryText}
                    status="basic">
                    1 safety box 5 €
                  </Typography>
                </View>
              </View> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      marginVertical: themeConfig.margin,
                    }}>
                    <View
                      style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                      <Typography
                        category="h6"
                        style={styles.primaryText}
                        status="basic">
                        {strings('total')} :{' '}
                        {locReserveData && locReserveData.booking_payments
                          ? locReserveData.booking_payments.payableAmount
                          : 0}{' '}
                        €
                      </Typography>
                    </View>
                  </View>
                </Layout>
              )}
              {/* <Layout level="1" style={styles.packageCardStyle}>
          </Layout> */}
            </Layout>
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            />
          </ScrollView>
          <Layout style={styles.boxStyle}>
            <TouchableOpacity
              style={styles.navigationButton}
              onPress={() =>
                navigation.navigate('BookingAccountScreen', {
                  id: id,
                  fromPage: fromPage,
                  bathHouseId: propertyDetails.bathHouseData.id,
                })
              }>
              <Typography
                status="basic"
                category="s2"
                style={{color: themeConfig.colors.primary}}>
                {strings('booking_account')}
              </Typography>
              <Icon
                style={styles.icon}
                fill={themeConfig.colors.primary}
                name={'arrow-ios-forward'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SharingScreen', {
                  data: data,
                })
              }
              style={styles.navigationButton}>
              <Typography
                status="basic"
                category="s2"
                style={{color: themeConfig.colors.primary}}>
                {strings('sharing')}
              </Typography>
              <Icon
                style={styles.icon}
                fill={themeConfig.colors.primary}
                name={'arrow-ios-forward'}
              />
            </TouchableOpacity>
          </Layout>
        </>
      )}

      <Toast
        ref={toast} //eslint-disable-line
        position="center"
        defaultCloseDelay={10000}
        positionValue={200}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin / 2,
  },
  navigationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: themeConfig.radius,
    borderWidth: themeConfig.borderWidth,
    borderColor: themeConfig.colors.borderColor,
    padding: themeConfig.padding + 4,
    marginBottom: themeConfig.margin,
    backgroundColor: '#5873BA',
    color: '#fff',
  },
  packageCardStyle: {
    backgroundColor: themeConfig.colors.lightBule,
    padding: themeConfig.padding / 2,
    margin: themeConfig.margin,
    marginVertical: themeConfig.margin / 2,
    borderRadius: themeConfig.radius * 2,
    padding: themeConfig.padding * 2,
  },
  leftSection: {
    width: 70,
    // marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    marginHorizontal: themeConfig.margin * 3,
    // marginBottom: themeConfig.margin / 2,
  },
  titleText: {
    fontWeight: '600',
    color: '#5e5e5e',
  },
  blacktext: {
    fontSize: 13,
    fontWeight: '500',
    color: '#5e5e5e',
  },
  primaryText: {
    fontSize: 13,
    fontWeight: '800',
    color: themeConfig.colors.primary,
    marginLeft: themeConfig.margin,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default ReservationSummary;
