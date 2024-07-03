import React, {useState, useEffect, useRef} from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {StyleSheet, View, ImageBackground} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SVGIcon from 'components/Icon';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {strings} from 'i18n/i18n';
import {_formatDate} from 'resources/CommonFunction';
import {setstoreFinalLocData} from 'app/redux/actions/bookingActions';
import PropertyCard from './PropertyCard.component';
import {string} from 'prop-types';
const BookingConfirm = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {id, fromPage, bathHouseId, reservations} = route.params || {};
  const [loading, setloading] = useState(false);
  const [locReserveData, setlocReserveData] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [barServiceData, setBarServiceData] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
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
      if (data.data && data.data.booking_payments) {
        setTotalAmount(data.data.booking_payments.payableAmount);
      }
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
      if (data.data && data.data.booking_payments) {
        setTotalAmount(data.data.booking_payments.payableAmount);
      }
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
    navigation.navigate('ManageBooking', {
      bookingSummary: data,
      reservations: reservations,
      totalAmount: totalAmount,
    });
    // navigation.navigate('ManageBooking');
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
      <ScrollView bounces={false}>
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
              marginVertical: themeConfig.margin,
              marginHorizontal: themeConfig.margin * 2,
            }}>
            <SVGIcon type="Checked" width={30} height={30} />
            <Typography
              category="s1"
              style={{
                fontWeight: '500',
                marginLeft: themeConfig.margin,
                color: themeConfig.colors.green,
              }}>
              {strings('booking_confirm_msg')}
            </Typography>
          </View>

          <Layout
            level="3"
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: themeConfig.margin,
              paddingVertical: themeConfig.padding,
              marginHorizontal: themeConfig.margin * 2,
            }}>
            <Typography
              category="s1"
              status="basic"
              style={{
                fontWeight: '400',
                marginLeft: themeConfig.margin,
              }}>
              {fromPage === 'location' && <> {strings('booking_number')}:</>}

              {fromPage === 'service' && <> {strings('reservation_number')}:</>}
            </Typography>
            <Typography
              category="s1"
              status="basic"
              style={{
                fontWeight: '500',
                marginLeft: themeConfig.margin,
              }}>
              {id && id}
            </Typography>
          </Layout>
          <Layout style={{marginHorizontal: themeConfig.margin}}>
            <PropertyCard
              name={selectedProperty.bathouseName}
              address={selectedProperty.address}
              imageUrl={selectedProperty.mainPhoto}
              email={selectedProperty.email}
              phoneNo={selectedProperty.mobile}
              showButton
              showImage
              showContact
            />
          </Layout>

          <Layout level="1" style={styles.packageCardStyle}>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: themeConfig.margin,
              }}>
              <SVGIcon type="Calender" width={30} height={30} />
              <Typography
                category="s1"
                style={{
                  fontWeight: '500',
                  marginLeft: themeConfig.margin,
                  color: '#5e5e5e',
                  fontSize: 12,
                }}>
                {fromPage == 'service' ? (
                  `${renderDate(moment(new Date()).format('DD/MM/YYYY'))}`
                ) : (
                  <>
                    {strings('from')}{' '}
                    {renderDate(
                      moment(searchDate.startDate).format('DD/MM/YYYY'),
                    )}{' '}
                    {strings('to')}{' '}
                    {renderDate(
                      moment(searchDate.endDate).format('DD/MM/YYYY'),
                    )}
                  </>
                )}
              </Typography>
            </View>
            {getFinalLocData &&
              getFinalLocData.length > 0 &&
              getFinalLocData.map((item, index) => {
                return (
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View style={styles.leftSection}>
                        <Typography
                          category="s1"
                          style={{fontWeight: '600'}}
                          status="basic">
                          {strings('package')}
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
                          {item.PackageName}
                        </Typography>
                      </View>
                    </View>

                    {selectedBookedLocation &&
                      selectedBookedLocation.length > 0 &&
                      selectedBookedLocation.map((element, index) => {
                        return (
                          <>
                            {element.name === item.Location && (
                              <>
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
                                      {strings('no_of_Person')}
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
                                      {element.forPeopleCount}
                                    </Typography>
                                  </View>
                                </View>
                                {element &&
                                  element.additem &&
                                  element.additem.length > 0 &&
                                  element.additem.map((e, i) => {
                                    return (
                                      <>
                                        {e && e.value > 0 && (
                                          <>
                                            <View
                                              style={{
                                                flexDirection: 'row',
                                                marginVertical:
                                                  themeConfig.margin,
                                              }}>
                                              <View style={styles.leftSection}>
                                                <Typography
                                                  category="s1"
                                                  style={{fontWeight: '600'}}
                                                  status="basic">
                                                  {strings('additional_items')}
                                                </Typography>
                                              </View>
                                              <View style={styles.rightSection}>
                                                <Typography
                                                  category="s2"
                                                  style={{
                                                    fontWeight: '600',
                                                    color:
                                                      themeConfig.colors
                                                        .primary,
                                                  }}
                                                  status="basic">
                                                  {e.value + ' ' + e.name}
                                                </Typography>
                                              </View>
                                            </View>
                                          </>
                                        )}
                                      </>
                                    );
                                  })}
                              </>
                            )}
                          </>
                        );
                      })}
                    {index + 1 !== getFinalLocData.length && (
                      <Divider
                        style={{
                          backgroundColor: themeConfig.colors.primary,
                          borderWidth: 1,
                          borderColor: themeConfig.colors.primary,
                        }}
                      />
                    )}

                    {fromPage === 'service' && (
                      <>
                        {barServiceData &&
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
                                      {a.name}
                                    </Typography>
                                  </View>
                                </View>
                              )),
                          )}
                      </>
                    )}
                  </>
                );
              })}
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={[styles.rightSection, {alignItems: 'flex-end'}]}>
                <Typography
                  category="s2"
                  style={{
                    fontWeight: '600',
                    color: themeConfig.colors.primary,
                  }}
                  status="basic">
                  {strings('total')} {totalAmount ? totalAmount : 0} €
                </Typography>
              </View>
            </View>
          </Layout>
          <Divider style={{marginVertical: themeConfig.margin / 2}} />

          {fromPage === 'service' && (
            <>
              {barServiceData &&
                barServiceData.map((data, index) => (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View style={styles.leftSection}>
                      <Typography
                        category="s2"
                        style={{fontWeight: '400'}}
                        status="basic">
                        {data.ServiceName}
                      </Typography>
                    </View>
                    <View style={styles.leftSection}>
                      <Typography
                        category="s2"
                        style={{fontWeight: '400'}}
                        status="basic">
                        {}
                      </Typography>
                    </View>
                    <View style={styles.rightSection}>
                      <Typography
                        category="s2"
                        style={{fontWeight: '600'}}
                        status="basic">
                        X {data.count}
                      </Typography>
                    </View>
                    <View style={styles.rightSection}>
                      <Typography
                        category="s2"
                        style={{fontWeight: '600'}}
                        status="basic">
                        {parseInt(data.ServicePrice) * parseInt(data.count)} €
                      </Typography>
                    </View>
                  </View>
                ))}

              {normalServiceData &&
                normalServiceData.map((data, index) => (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <View style={styles.leftSection}>
                      <Typography
                        category="s2"
                        style={{fontWeight: '400'}}
                        status="basic">
                        {data.ServiceName}
                      </Typography>
                    </View>
                    <View style={styles.leftSection}>
                      <Typography
                        category="s2"
                        style={{fontWeight: '400'}}
                        status="basic">
                        {}
                      </Typography>
                    </View>
                    <View style={styles.rightSection}>
                      <Typography
                        category="s2"
                        style={{fontWeight: '600'}}
                        status="basic">
                        X {data.count}
                      </Typography>
                    </View>
                    <View style={styles.rightSection}>
                      <Typography
                        category="s2"
                        style={{fontWeight: '600'}}
                        status="basic">
                        {parseInt(data.ServicePrice) * parseInt(data.count)} €
                      </Typography>
                    </View>
                  </View>
                ))}

              {hourlyServiceData &&
                hourlyServiceData.map(
                  data =>
                    data.selectedData &&
                    data.selectedData.length > 0 &&
                    data.selectedData.map((a, index) => (
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View style={styles.leftSection}>
                          <Typography
                            category="s2"
                            style={{fontWeight: '400'}}
                            status="basic">
                            {a.name}
                          </Typography>
                        </View>
                        <View style={styles.leftSection}>
                          <Typography
                            category="s2"
                            style={{fontWeight: '400'}}
                            status="basic">
                            {_formatDate(a.bookingDate)}
                            {'\n'}
                            {a.time && a.time.selectedPeriod}
                          </Typography>
                        </View>
                        <View style={styles.rightSection}>
                          <Typography
                            category="s2"
                            style={{fontWeight: '600'}}
                            status="basic">
                            X {a.count}
                          </Typography>
                        </View>
                        <View style={styles.rightSection}>
                          <Typography
                            category="s2"
                            style={{fontWeight: '600'}}
                            status="basic">
                            {parseInt(a.price)} €
                          </Typography>
                        </View>
                      </View>
                    )),
                )}
            </>
          )}
        </Layout>
      </ScrollView>

      <Layout
        style={{
          margin: themeConfig.margin,
          marginHorizontal: themeConfig.margin * 2,
        }}>
        <Divider />

        <ButtonComponent
          style={{backgroundColor: themeConfig.colors.primary}}
          onPress={() => ManageAccount()}>
          <Typography
            status="control"
            category="h6"
            style={{fontWeight: '400'}}>
            {strings('manage_booking')}
          </Typography>
        </ButtonComponent>

        {reservations ? null : (
          <ButtonComponent
            style={{backgroundColor: 'transparent'}}
            appearance="outline"
            onPress={() => continueBooking()}>
            <Typography
              status="control"
              category="h6"
              style={{fontWeight: '400'}}>
              {strings('continue_Booking')}
            </Typography>
          </ButtonComponent>
        )}
      </Layout>
    </Layout>
  );
};
export default BookingConfirm;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  leftSection: {
    // width: 100,
    marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },

  // leftSection: {
  //   // width: 120,
  //   // marginBottom: themeConfig.margin / 2,
  // },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    // marginBottom: themeConfig.margin / 2,
  },
  packageCardStyle: {
    backgroundColor: themeConfig.colors.lightBule,
    padding: themeConfig.padding * 3,
    margin: themeConfig.margin,
    marginVertical: themeConfig.margin * 2,
    borderRadius: themeConfig.radius * 2,
    marginHorizontal: themeConfig.margin * 2,
  },
});
