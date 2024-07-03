import React, {useState, useRef, useEffect} from 'react';
import {Layout} from '@ui-kitten/components';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import * as Yup from 'yup';
import {Formik} from 'formik';
import moment, {utc} from 'moment';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//Translation
import {strings} from 'i18n/i18n';
import Toast from 'react-native-easy-toast';
import {useSelector, useDispatch} from 'react-redux';
import CustomSkeletonList from 'components/CustomSkeleton';
import {_formatDate} from 'resources/CommonFunction';

const ForgetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('email_error').required('emailVal'),
});

const BookingAccountScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {id, fromPage, bathHouseId, reservations} = route.params || {};
  const [loading, setloading] = useState(false);
  const [locReserveData, setlocReserveData] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [barServiceData, setBarServiceData] = useState([]);
  const [normalServiceData, setNormalServiceData] = useState([]);
  const [hourlyServiceData, sethourlyServiceData] = useState([]);
  const [cardData, setCardData] = useState();
  const [
    userProfile,
    searchDate,
    getFinalLocData,
    selectedBookedLocation,
    selectedProperty,
  ] = useSelector(state => [
    state.UserReducerData.userProfile,
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
    console.log('data', data, status, postData);
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

  const loadCardDetails = async () => {
    const postData = {
      // booking_id: id,
      // user_id: userProfile.id,
      user_id: 3,
      booking_id: 1,
    };
    console.log('postData', postData);
    const {data, error, message, success} = await postDataToServer(
      `${Api.getCardTransactionDetailsByBookingId}`,
      postData,
    );
    console.log('data', data);
    if (success) {
      setCardData(data.cardDetails);
      setloading(false);
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCardDetails();
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
      <Typography category="h6" style={styles.primaryText} status="basic">
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
        <ScrollView bounces={false}>
          <Layout
            level="1"
            style={[
              styles.container,
              {marginTop: themeConfig.margin},
              styles.boxStyle,
            ]}>
            <SecondaryHeader title={strings('booking_account')} />

            <Layout level="1" style={styles.packageCardStyle}>
              <Typography category="s1" style={styles.titleText} status="basic">
                {propertyDetails.bathHouseData &&
                  propertyDetails.bathHouseData.bathouseName}
              </Typography>
              <Typography category="s1" style={styles.titleText} status="basic">
                {propertyDetails.bathHouseData &&
                  propertyDetails.bathHouseData.address}
                ,{' '}
                {propertyDetails.bathHouseData &&
                  propertyDetails.bathHouseData.city}
              </Typography>
              {locReserveData && (
                <>
                  <Typography
                    category="s1"
                    style={styles.titleText}
                    status="basic">
                    {strings('from')}{' '}
                    {renderDate(
                      _formatDate(locReserveData.booking_start_date),
                      // moment(locReserveData.booking_start_date).format(
                      //   'DD/MM/YYYY',
                      // ),
                    )}{' '}
                    {strings('to')}{' '}
                    {renderDate(_formatDate(locReserveData.booking_end_date))}
                  </Typography>
                  {locReserveData.packageSelectedData &&
                    locReserveData.packageSelectedData.length > 0 && (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: themeConfig.margin,
                          }}>
                          <View style={styles.leftSection}>
                            <Typography
                              category="s1"
                              style={styles.blacktext}
                              status="basic">
                              {strings('package')}:
                            </Typography>
                          </View>
                          <View style={styles.rightSection}>
                            <Typography
                              category="h6"
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
                                  }}>
                                  <View style={styles.leftSection}>
                                    <Typography
                                      category="s1"
                                      style={styles.blacktext}
                                      status="basic">
                                      {strings('additional_items')}:
                                    </Typography>
                                  </View>
                                  <View style={styles.rightSection}>
                                    <Typography
                                      category="h6"
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
                              <Typography category="s1" status="basic">
                                {strings('additiona_services')}
                              </Typography>
                            </View>
                            <View style={styles.rightSection}>
                              <Typography
                                category="h6"
                                style={{
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
                                category="h6"
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
                                    category="h6"
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
                </>
              )}
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
                    {strings('subtotal')}
                  </Typography>
                </View>
                <View style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                  <Typography
                    category="h6"
                    style={styles.primaryText}
                    status="basic">
                    {locReserveData &&
                    locReserveData?.booking_payments?.subTotal
                      ? locReserveData?.booking_payments?.subTotal
                      : 0}{' '}
                    €
                  </Typography>
                </View>
              </View>

              {locReserveData &&
                locReserveData.length > 0 &&
                Object.keys(locReserveData?.booking_discount).length > 0 &&
                locReserveData?.booking_discount.constructor === Object && (
                  <React.Fragment>
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
                          {strings('discount_voucher')}
                        </Typography>
                      </View>
                      <View
                        style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                        <Typography
                          category="h6"
                          style={styles.primaryText}
                          status="basic">
                          {locReserveData &&
                          locReserveData?.booking_discount?.name
                            ? locReserveData?.booking_discount?.name
                            : 0}{' '}
                          €
                        </Typography>
                      </View>
                    </View>

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
                          {strings('total')}
                        </Typography>
                      </View>
                      <View
                        style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                        <Typography
                          category="h6"
                          style={styles.primaryText}
                          status="basic">
                          {locReserveData && locReserveData.booking_payments
                            ? locReserveData?.booking_discount?.value
                            : 0}{' '}
                          €
                        </Typography>
                      </View>
                    </View>
                  </React.Fragment>
                )}

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
                    {strings('final_balance')}
                  </Typography>
                </View>
                <View style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                  <Typography
                    category="h6"
                    style={styles.primaryText}
                    status="basic">
                    {locReserveData &&
                    locReserveData?.booking_payments?.subTotal
                      ? locReserveData?.booking_payments?.subTotal
                      : 0}{' '}
                    €
                  </Typography>
                </View>
              </View>

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
                    {strings('deposit')}
                  </Typography>
                </View>
                <View style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                  <Typography
                    category="h6"
                    style={styles.primaryText}
                    status="basic">
                    {locReserveData && locReserveData?.booking_payments?.deposit
                      ? locReserveData?.booking_payments?.deposit
                      : 0}{' '}
                    €
                  </Typography>
                </View>
              </View>

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
                    {strings('remains_to_be_paid')}
                  </Typography>
                </View>
                <View style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                  <Typography
                    category="h6"
                    style={styles.primaryText}
                    status="basic">
                    {locReserveData && locReserveData?.booking_payments?.toPay
                      ? locReserveData?.booking_payments?.toPay
                      : 0}{' '}
                    €
                  </Typography>
                </View>
              </View>
            </Layout>
            {cardData && cardData.length > 0 && (
              <>
                <Layout level="1" style={styles.packageCardStyle}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: themeConfig.margin,
                    }}>
                    <View style={styles.leftSection}>
                      <Typography
                        category="s1"
                        style={styles.blacktext}
                        status="basic">
                        {strings('balance')}:
                      </Typography>
                    </View>
                    <View style={styles.rightSection}>
                      <Typography
                        category="h6"
                        style={styles.primaryText}
                        status="basic">
                        10 €
                      </Typography>
                    </View>
                  </View>
                  <Typography
                    category="s1"
                    style={styles.titleText}
                    status="basic">
                    {strings('movements')}
                  </Typography>
                  {cardData.map((e, i) => {
                    return (
                      <>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginTop: themeConfig.margin,
                            justifyContent: 'space-between',
                          }}>
                          <View style={styles.leftSection}>
                            <Typography
                              category="h6"
                              style={styles.primaryText}
                              status="basic">
                              {e.identifier}
                            </Typography>
                          </View>
                          {/* <View style={[styles.centerSection,{alignItems:"center"}]}>
                  <Typography
                    category="h6"
                    style={[styles.primaryText,{fontSize:11}]}
                    status="basic">

                  </Typography>
                </View> */}
                          <View
                            style={[
                              styles.rightSection,
                              {alignItems: 'flex-end'},
                            ]}>
                            <Typography
                              category="h6"
                              style={styles.primaryText}
                              status="basic">
                              {e.amount} €
                            </Typography>
                          </View>
                        </View>
                      </>
                    );
                  })}
                </Layout>
              </>
            )}
          </Layout>
          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          />
        </ScrollView>
      )}

      <Toast
        ref={toast} //eslint-disable-line
        position="center"
        defaultCloseDelay={10000}
        positionValue={200}
      />
    </Layout>
  );
};
export default BookingAccountScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
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
  },
  packageCardStyle: {
    backgroundColor: themeConfig.colors.lightBule,
    padding: themeConfig.padding * 2,
    margin: themeConfig.margin,
    marginVertical: themeConfig.margin * 2,
    borderRadius: themeConfig.radius * 2,
    padding: themeConfig.padding * 4,
  },
  leftSection: {
    // width: 120,
    // marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    marginHorizontal: themeConfig.margin * 2,
    // marginBottom: themeConfig.margin / 2,
  },
  centerSection: {
    flex: 1,
    marginHorizontal: themeConfig.margin * 2,
    // marginBottom: themeConfig.margin / 2,
  },
  titleText: {
    fontWeight: '600',
    marginTop: themeConfig.margin,
    color: '#5e5e5e',
    fontSize: 13,
  },
  blacktext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#5e5e5e',
  },
  primaryText: {
    fontSize: 13,
    fontWeight: '800',
    color: themeConfig.colors.primary,
  },
});
