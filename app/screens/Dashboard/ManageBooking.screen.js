import React, {useRef, useState} from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {StyleSheet, View, Alert} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import SearchListItem from './SearchListItem.component';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {strings} from 'i18n/i18n';
import {_formatDate} from 'resources/CommonFunction';
import {setstoreFinalLocData} from 'app/redux/actions/bookingActions';
import SVGIcon from 'components/Icon';

//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';
import Loader from 'components/Loader';
import {Setlocation} from 'app/redux/actions/locationActions';
import PropertyCard from './PropertyCard.component';
import DropShadow from 'react-native-drop-shadow';
const data = Array(1)
  .fill()
  .map(() => {
    return {
      image:
        'https://res.cloudinary.com/mrunal/image/upload/c_scale,w_300/v1620744309/Images/60413f1b7ad6431300000001_xjvzmr.png',
      name: 'Bongo Milanos',
      location: 'Toscana',
      address: 'Marine di Pietrasanta',
      freeCancellation: true,
      noPrePaymentRequired: true,
      availability: Math.random() < 0.7,
      favorite: Math.random() < 0.5,
      directBookNow: Math.random() < 0.5,
    };
  });
const ManageBookingScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {bookingSummary, reservations, totalAmount} = route.params || {};
  console.log('totalAmount', totalAmount);
  const [loading, setLoding] = useState(false);
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
  let barServiceData = [];
  let normalServiceData = [];
  let hourlyServiceData = [];

  if (bookingSummary && bookingSummary.bookFor === 'service') {
    barServiceData =
      bookingSummary &&
      bookingSummary.locReserveData &&
      bookingSummary.locReserveData.servicesData.barServiceData
        ? bookingSummary.locReserveData.servicesData.barServiceData.filter(
            item => item.count > 0,
          )
        : [];
    normalServiceData =
      bookingSummary &&
      bookingSummary.locReserveData &&
      bookingSummary.locReserveData.servicesData.normalServiceData
        ? bookingSummary.locReserveData.servicesData.normalServiceData.filter(
            item => item.count > 0,
          )
        : [];
    hourlyServiceData =
      bookingSummary &&
      bookingSummary.locReserveData &&
      bookingSummary.locReserveData.servicesData.hourlyServiceData
        ? bookingSummary.locReserveData.servicesData.hourlyServiceData
        : [];
  }

  const cancelBooking = () => {
    const postData = {
      id:
        bookingSummary &&
        bookingSummary.locReserveData &&
        bookingSummary.locReserveData.id
          ? bookingSummary.locReserveData.id
          : 0,
    };
    Alert.alert(strings('cancel_booking'), strings('removeBooking'), [
      // The "Yes" button
      {
        text: strings('yes'),
        onPress: () => {
          deleteBooking(postData);
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: strings('no'),
      },
    ]);
  };

  const deleteBooking = async postData => {
    setLoding(true);
    const {data, error, message, status} = await postDataToServer(
      `${Api.deleteBooking}`,
      postData,
    );
    if (status) {
      setLoding(false);
      navigation.navigate('BookingCancel');
    } else {
      setLoding(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };

  const continueBooking = () => {
    dispatch(setstoreFinalLocData([]));
    dispatch(setShowBooking(false));
    navigation.navigate('Search', {screen: 'SearchHome'});
  };

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
      <SecondaryHeader title={strings('manage_booking')} />
      {loading ? (
        <Loader color="#253C7E" visible={loading} />
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
              <PropertyCard
                name={selectedProperty.bathouseName}
                address={selectedProperty.address}
                imageUrl={selectedProperty.mainPhoto}
                email={selectedProperty.email}
                phoneNo={selectedProperty.mobile}
                showButton
                showImage
                showContact
                plain
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <View>
                  <Typography
                    category="s2"
                    style={{fontWeight: '400'}}
                    status="basic">
                    {bookingSummary &&
                      bookingSummary.bookFor === 'location' && (
                        <> {strings('booking_number')} </>
                      )}

                    {bookingSummary && bookingSummary.bookFor === 'service' && (
                      <>{strings('reservation_number')}: </>
                    )}
                  </Typography>
                </View>
                <View>
                  <Typography
                    category="s1"
                    style={{fontWeight: '600'}}
                    status="basic">
                    {bookingSummary &&
                      bookingSummary.locReserveData &&
                      bookingSummary.locReserveData.id}
                  </Typography>
                </View>
              </View>

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
                    {bookingSummary && bookingSummary.bookFor == 'services' ? (
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
                              style={{fontWeight: '600', fontSize: 14}}
                              status="basic">
                              {strings('location')}
                            </Typography>
                          </View>
                          <View style={styles.rightSection}>
                            <Typography
                              category="s2"
                              style={{
                                fontWeight: '600',
                                fontSize: 13,
                                color: themeConfig.colors.primary,
                              }}
                              status="basic">
                              {item.Location}
                            </Typography>
                          </View>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <View style={styles.leftSection}>
                            <Typography
                              category="s1"
                              style={{fontWeight: '600', fontSize: 14}}
                              status="basic">
                              {strings('package')}
                            </Typography>
                          </View>
                          <View style={styles.rightSection}>
                            <Typography
                              category="s2"
                              style={{
                                fontWeight: '600',
                                fontSize: 13,
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
                                          style={{fontSize: 14}}
                                          status="basic">
                                          {strings('no_of_Person')}
                                        </Typography>
                                      </View>
                                      <View style={styles.rightSection}>
                                        <Typography
                                          category="s2"
                                          style={{
                                            fontSize: 13,
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
                                                  <View
                                                    style={styles.leftSection}>
                                                    <Typography
                                                      category="s1"
                                                      style={{
                                                        fontSize: 14,
                                                      }}
                                                      status="basic">
                                                      {strings(
                                                        'additional_items',
                                                      )}
                                                    </Typography>
                                                  </View>
                                                  <View
                                                    style={styles.rightSection}>
                                                    <Typography
                                                      category="s2"
                                                      style={{
                                                        fontSize: 13,
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
                        {bookingSummary &&
                          bookingSummary.bookFor === 'service' && (
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
                                        style={{fontSize: 14}}
                                        status="basic">
                                        {strings('additiona_services')}
                                      </Typography>
                                    </View>
                                    <View style={styles.rightSection}>
                                      <Typography
                                        category="s2"
                                        style={{
                                          fontSize: 13,
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
                                        style={{fontSize: 14}}
                                        status="basic">
                                        {strings('additiona_services')}
                                      </Typography>
                                    </View>
                                    <View style={styles.rightSection}>
                                      <Typography
                                        category="s2"
                                        style={{
                                          fontSize: 13,
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
                                            style={{fontSize: 14}}
                                            status="basic">
                                            {strings('additiona_services')}
                                          </Typography>
                                        </View>
                                        <View style={styles.rightSection}>
                                          <Typography
                                            category="s2"
                                            style={{
                                              fontSize: 13,
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
              {bookingSummary &&
              bookingSummary.propertyDetails &&
              bookingSummary.propertyDetails.bathHouseData &&
              bookingSummary.propertyDetails.bathHouseData.cancellation &&
              bookingSummary.propertyDetails.bathHouseData.cancellation !==
                'Not Allowed' ? (
                <ButtonComponent status="basic" onPress={() => cancelBooking()}>
                  <Typography category="h6" style={{fontWeight: '400'}}>
                    {strings('cancel_booking')}
                  </Typography>
                </ButtonComponent>
              ) : (
                <>
                  {reservations ? null : (
                    <ButtonComponent onPress={() => continueBooking()}>
                      <Typography
                        status="control"
                        category="h6"
                        style={{fontWeight: '400'}}>
                        {strings('continue_Booking')}
                      </Typography>
                    </ButtonComponent>
                  )}
                </>
              )}
            </Layout>
          </ScrollView>
        </>
      )}

      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        positionValue={200}
      />
    </Layout>
  );
};
export default ManageBookingScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
  },
  leftSection: {
    width: 100,
    marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    marginBottom: themeConfig.margin / 2,
  },
  packageCardStyle: {
    backgroundColor: themeConfig.colors.lightBule,
    padding: themeConfig.padding * 2,
    margin: themeConfig.margin * 2,
    marginVertical: themeConfig.margin * 2,
    borderRadius: themeConfig.radius * 2,
  },
});
