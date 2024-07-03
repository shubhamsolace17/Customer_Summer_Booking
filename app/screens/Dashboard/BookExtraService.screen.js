import React, {useEffect, useState, useRef} from 'react';
import {Icon, Layout, Divider} from '@ui-kitten/components';
import {StyleSheet, TouchableOpacity, View, FlatList} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import HeroImage from 'components/HeroImage';
import InputComponent from 'components/Input';
import {strings} from 'i18n/i18n';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import moment from 'moment';
import Toast from 'react-native-easy-toast';
import HourSelectPopup from './HourSelectPopup.component';

import {_formatDate} from 'resources/CommonFunction';
import BookExtraComponent from './Extraservices';

import {useDispatch, useSelector} from 'react-redux';
import {
  setBarServiceData,
  setNormalServiceData,
  setHourlyServiceData,
} from 'app/redux/actions/servicesActions';

import {setBookFor, setShowBooking} from 'app/redux/actions/globalActions';
import CustomSkeletonList from 'components/CustomSkeleton';
import DropShadow from 'react-native-drop-shadow';
import {_checkIsNumberFloat} from 'resources/ArithmaticService';
const ArrowIcon = props => <Icon {...props} name="arrow-ios-forward-outline" />;

const BookExtraServiceScreen = ({navigation}) => {
  const dispatch = useDispatch();
  let totalPrice = 0;
  const [barServices, setBarServices] = useState([]);
  const [hourlyServie, setHourlyServie] = useState([]);
  const [normalService, setNormalService] = useState([]);
  const [loading, setloading] = useState(false);
  const [isopenHousrlyPopup, setisopenHousrlyPopup] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const [subData, setSubData] = useState([]);
  const [selectedHourlyService, setselectedHourlyService] = useState({});
  const [addSurcharge, setAddSurcharge] = useState(null);
  const [
    language,
    propertyId,
    barServiceData,
    normalServiceData,
    hourServiceData,
    userProfile,
    onlingBookingSetting,
  ] = useSelector(state => [
    state.globalReducerData.language,
    state.globalReducerData.propertyId,
    state.servicesReducerData.barServiceData,
    state.servicesReducerData.normalServiceData,
    state.servicesReducerData.hourServiceData,
    state.UserReducerData.userProfile,
    state.globalReducerData.onlingBookingSetting,
  ]);
  barServices &&
    barServices.forEach(data => {
      var td = parseInt(data.ServicePrice) * parseInt(data.count);
      totalPrice = parseInt(totalPrice) + parseInt(td);
    });

  normalService &&
    normalService.forEach(data => {
      var td = parseInt(data.ServicePrice) * parseInt(data.count);
      totalPrice = parseInt(totalPrice) + parseInt(td);
    });

  hourlyServie &&
    hourlyServie.forEach(data => {
      var td = data.totalPrice ? parseFloat(data.totalPrice) : 0;
      totalPrice = parseFloat(totalPrice) + parseFloat(td);
    });

  const [wrapSelectedDates, setwrapSelectedDates] = useState([]);
  const [servicesCounts, setServicesCounts] = useState([]);
  const [passServiceCount, setpassServiceCount] = useState(false);
  const toast = useRef('');

  const loadServicesCount = async () => {
    setAddSurcharge(onlingBookingSetting?.serviceBookingOptions?.addSurcharge);
    setloading(true);
    let date_ob = new Date();

    // adjust 0 before single digit date
    let dates = ('0' + date_ob.getDate()).slice(-2);

    // current month
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    let finaldate =
      year + '-' + month + '-' + dates + ' ' + '00' + ':' + '00' + ':' + '00';

    const postData = {
      propertyId: propertyId,
      booking_date: finaldate,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.getServiceBookingCount}`,
      postData,
    );
    console.log('status', status, data);
    if (status) {
      if (data?.data?.length > 0) {
        setServicesCounts(data.data);
        setpassServiceCount(true);
      } else {
        setServicesCounts(data.data);
        setpassServiceCount(true);
      }
    } else {
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
      setloading(false);
    }
  };
  const loadBarServices = async () => {
    setloading(true);
    var currentDate = moment().format('YYYY-MM-DD');
    const postData = {
      propertyId: propertyId,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.viewServices}`,
      postData,
    );
    if (status) {
      const filterBarData =
        data.data &&
        data.data.barServices &&
        data.data.barServices.length > 0 &&
        data.data.barServices.filter(x => x.PurchaseStatus);

      const filterNormalData =
        data.data &&
        data.data.normalServices &&
        data.data.normalServices.length > 0 &&
        data.data.normalServices.filter(x => x.PurchaseStatus);

      const filterHourlyData =
        data.data &&
        data.data.hourlyServices &&
        data.data.hourlyServices.length > 0 &&
        data.data.hourlyServices.filter(x => x.PurchaseStatus);

      filterBarData &&
        filterBarData.length > 0 &&
        filterBarData.forEach((element, i) => {
          element.count = 0;
          element.selectedVariant = [];
          element.selectedData = [{date: currentDate, click: 0}];
          servicesCounts?.forEach(item => {
            if (
              item.service_name == element.ServiceName &&
              item.service_type == 'Bar Service'
            ) {
              element.msg = '';
              element.Total = item.Total;
            }
          });
        });

      filterNormalData &&
        filterNormalData.length > 0 &&
        filterNormalData.forEach((element, i) => {
          element.count = 0;
          element.selectedData = [{date: currentDate, click: 0}];
          servicesCounts?.forEach(item => {
            if (
              item.service_name == element.ServiceName &&
              item.service_type == 'Normal Service'
            ) {
              element.msg = '';
              element.Total = item.Total;
            }
          });
        });

      filterHourlyData &&
        filterHourlyData.length > 0 &&
        filterHourlyData.forEach((element, i) => {
          element.count = 0;
          element.time = 0;
          element.selectedData = [];
          element.totalPrice = 0;
          servicesCounts?.forEach(item => {
            element.totalBookings = item.Total;
          });
        });

      await setBarServices(filterBarData);
      await setNormalService(filterNormalData);
      await setHourlyServie(filterHourlyData);

      Promise.all([
        dispatch(setBarServiceData(filterBarData)),
        dispatch(setNormalServiceData(filterNormalData)),
        dispatch(setHourlyServiceData(filterHourlyData)),
      ]);

      setloading(false);
    } else {
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
      setloading(false);
    }
  };
  const isMaxReservationReached = (max, booked, currentcount) => {
    let available = max - booked;
    if (available > currentcount) {
      return true;
    } else {
      return false;
    }
  };

  const onChooseClick = data => {
    setisopenHousrlyPopup(true);
    setselectedHourlyService(data);
  };

  const toggleHourPopup = () => {
    setisopenHousrlyPopup(!isopenHousrlyPopup);
  };
  console.log('barServices', barServices);

  const _calcPrice = price => {
    console.log({addSurcharge});
    if (addSurcharge !== null && addSurcharge > 0) {
      let newSurcharge = _checkIsNumberFloat(addSurcharge);
      newSurcharge =
        parseFloat(price) + parseFloat(price) * (newSurcharge / 100);
      console.log('newSurcharge from if', newSurcharge);
      return _checkIsNumberFloat(newSurcharge);
    } else {
      console.log('newSurcharge from else', price);
      return _checkIsNumberFloat(parseFloat(price));
    }
  };

  const updateCounter = async (type, id, action, data) => {
    var currentDate = moment().format('YYYY-MM-DD');
    console.log('data from', data);
    if (type === 'bar') {
      if (action === 0) {
        if (barServices[id].count !== 0) {
          barServices[id].count = barServices[id].count - 1;
          barServices[id].msg = '';
          barServices[id].priceSurcharge = _calcPrice(
            barServices[id].ServicePrice,
          );
          let a =
            barServices[id].selectedData && barServices[id].selectedData.length;
          if (barServices[id].selectedData[a - 1].click > 0) {
            barServices[id].selectedData[a - 1].click =
              (await parseInt(barServices[id].selectedData[a - 1].click)) - 1;
            if (barServices[id].selectedData[a - 1].click === 0) {
              barServices[id].selectedData.splice(a - 1, 1);
            }
          }
          setBarServices([...barServices]);
        }
      } else {
        if (barServices[id].maximumReservations) {
          console.log('oneeeeeeeeeeeeee');
          if (
            isMaxReservationReached(
              parseInt(barServices[id].maximumReservations),
              barServices[id].Total ? parseInt(barServices[id].Total) : 0,
              barServices[id].count,
            )
          ) {
            console.log('twoooooooooooooooo');
            barServices[id].count = barServices[id].count + 1;
            barServices[id].msg = '';
            barServices[id].priceSurcharge = _calcPrice(
              barServices[id].ServicePrice,
            );

            let a = barServices[id].selectedData;
            let d = await a.map(c => c.date);
            if (d.includes(currentDate)) {
              for (var i = 0; i < a.length; i++) {
                if (a[i].date === currentDate) {
                  a[i].click = (await parseInt(a[i].click)) + 1;
                }
              }
            } else {
              var b = {date: currentDate, click: 0};
              await barServices[id].selectedData.push(b);
              for (var i = 0; i < barServices[id].selectedData.length; i++) {
                if (barServices[id].selectedData[i].date === currentDate) {
                  barServices[id].selectedData[i].click =
                    parseInt(barServices[id].selectedData[i].click) + 1;
                }
              }
            }
            setBarServices([...barServices]);
          } else {
            console.log('threeeeeeeeeeeeeeeeee');
            // debugger
            barServices[id].msg = lang.max_reach;
            barServices[id].priceSurcharge = _calcPrice(
              barServices[id].ServicePrice,
            );
            setBarServices([...barServices]);
          }
        } else {
          console.log('fourrrrrrrrrrrrrrrr');
          barServices[id].count = barServices[id].count + 1;
          barServices[id].msg = '';
          barServices[id].priceSurcharge = _calcPrice(
            barServices[id].ServicePrice,
          );
          let a = barServices[id].selectedData;
          let d = await a.map(c => c.date);
          if (d.includes(currentDate)) {
            for (var i = 0; i < a.length; i++) {
              if (a[i].date === currentDate) {
                a[i].click = (await parseInt(a[i].click)) + 1;
              }
            }
          } else {
            var b = {date: currentDate, click: 0};
            await barServices[id].selectedData.push(b);
            for (var i = 0; i < barServices[id].selectedData.length; i++) {
              if (barServices[id].selectedData[i].date === currentDate) {
                barServices[id].selectedData[i].click =
                  parseInt(barServices[id].selectedData[i].click) + 1;
              }
            }
          }
          setBarServices([...barServices]);
        }
      }
    } else {
      if (action === 0) {
        if (normalService[id].count !== 0) {
          normalService[id].count = normalService[id].count - 1;
          normalService[id].msg = '';
          normalService[id].priceSurcharge = _calcPrice(
            normalService[id].ServicePrice,
          );
          let a =
            normalService[id].selectedData &&
            normalService[id].selectedData.length;
          if (normalService[id].selectedData[a - 1].click > 0) {
            normalService[id].selectedData[a - 1].click =
              (await parseInt(normalService[id].selectedData[a - 1].click)) - 1;
            if (normalService[id].selectedData[a - 1].click === 0) {
              normalService[id].selectedData.splice(a - 1, 1);
            }
          }
          setNormalService([...normalService]);
        }
      } else {
        if (normalService[id].maximumReservations) {
          if (
            isMaxReservationReached(
              parseInt(normalService[id].maximumReservations),
              normalService[id].Total ? parseInt(normalService[id].Total) : 0,
              normalService[id].count,
            )
          ) {
            normalService[id].count = normalService[id].count + 1;
            normalService[id].msg = '';
            normalService[id].priceSurcharge = _calcPrice(
              normalService[id].ServicePrice,
            );
            let a = normalService[id].selectedData;
            let d = await a.map(c => c.date);
            if (d.includes(currentDate)) {
              for (var i = 0; i < a.length; i++) {
                if (a[i].date === currentDate) {
                  a[i].click = (await parseInt(a[i].click)) + 1;
                }
              }
            } else {
              var b = {date: currentDate, click: 0};
              await normalService[id].selectedData.push(b);
              for (var i = 0; i < normalService[id].selectedData.length; i++) {
                if (normalService[id].selectedData[i].date === currentDate) {
                  normalService[id].selectedData[i].click =
                    parseInt(normalService[id].selectedData[i].click) + 1;
                }
              }
            }
            setNormalService([...normalService]);
          } else {
            // debugger
            normalService[id].msg = lang.max_reach;
            normalService[id].priceSurcharge = _calcPrice(
              normalService[id].ServicePrice,
            );
            setNormalService([...normalService]);
          }
        } else {
          normalService[id].count = normalService[id].count + 1;
          normalService[id].msg = '';
          normalService[id].priceSurcharge = _calcPrice(
            normalService[id].ServicePrice,
          );
          let a = normalService[id].selectedData;
          let d = await a.map(c => c.date);
          if (d.includes(currentDate)) {
            for (var i = 0; i < a.length; i++) {
              if (a[i].date === currentDate) {
                a[i].click = (await parseInt(a[i].click)) + 1;
              }
            }
          } else {
            var b = {date: currentDate, click: 0};
            await normalService[id].selectedData.push(b);
            for (var i = 0; i < normalService[id].selectedData.length; i++) {
              if (normalService[id].selectedData[i].date === currentDate) {
                normalService[id].selectedData[i].click =
                  parseInt(normalService[id].selectedData[i].click) + 1;
              }
            }
          }
          setNormalService([...normalService]);
        }
      }
    }
    dispatch(setBarServiceData(barServices)),
      dispatch(setNormalServiceData(normalService)),
      dispatch(setHourlyServiceData(hourlyServie));
  };

  // const updateCounter = async (type, id, action) => {
  //   if (type === 'bar') {
  //     if (action === 0) {
  //       if (barServices[id].count !== 0) {
  //         barServices[id].count = barServices[id].count - 1;
  //         barServices[id].msg = '';
  //         barServices[id].priceSurcharge = _calcPrice(barServices[id].ServicePrice);
  //         let a = barServices[id].selectedData && barServices[id].selectedData.length
  //         if (barServices[id].selectedData[a - 1].click > 0) {
  //           barServices[id].selectedData[a - 1].click = await parseInt(barServices[id].selectedData[a - 1].click) - 1;
  //             if (barServices[id].selectedData[a - 1].click === 0) {
  //               barServices[id].selectedData.splice(a - 1, 1)
  //             }
  //         }
  //         setBarServices([...barServices]);
  //       }
  //     } else {
  //       if (barServices[id].maximumReservations) {
  //         if (
  //           isMaxReservationReached(
  //             parseInt(barServices[id].maximumReservations),
  //             barServices[id].Total ? parseInt(barServices[id].Total) : 0,
  //             barServices[id].count,
  //           )
  //         ) {
  //           barServices[id].count = barServices[id].count + 1;
  //           barServices[id].msg = '';
  //           barServices[id].priceSurcharge = _calcPrice(barServices[id].ServicePrice);
  //           let a = barServices[id].selectedData;
  //           let d = await a.map(c => c.date);
  //           if (d.includes(currentDate)) {
  //               for (var i = 0; i < a.length; i++) {
  //                   if (a[i].date === currentDate) {
  //                       a[i].click = await parseInt(a[i].click) + 1
  //                   }
  //               }
  //           } else {
  //               var b = { date: currentDate, click: 0 };
  //               await barServices[id].selectedData.push(b)
  //               for (var i = 0; i < barServices[id].selectedData.length; i++) {
  //                   if (barServices[id].selectedData[i].date === currentDate) {
  //                     barServices[id].selectedData[i].click = parseInt(barServices[id].selectedData[i].click) + 1
  //                   }
  //               }
  //           }
  //           setBarServices([...barServices]);
  //         } else {
  //           barServices[id].msg = 'Maximum bookings count reached';
  //           setBarServices([...barServices]);
  //         }
  //       } else {
  //         barServices[id].count = barServices[id].count + 1;
  //         setBarServices([...barServices]);
  //       }
  //     }
  //   } else {
  //     if (action === 0) {
  //       if (normalService[id].count !== 0) {
  //         normalService[id].count = normalService[id].count - 1;
  //         normalService[id].msg = '';
  //         setNormalService([...normalService]);
  //       }
  //     } else {
  //       if (normalService[id].maximumReservations) {
  //         if (
  //           isMaxReservationReached(
  //             parseInt(normalService[id].maximumReservations),
  //             normalService[id].Total ? parseInt(normalService[id].Total) : 0,
  //             normalService[id].count,
  //           )
  //         ) {
  //           normalService[id].count = normalService[id].count + 1;
  //           normalService[id].msg = '';
  //           setNormalService([...normalService]);
  //         } else {
  //           normalService[id].msg = 'Maximum bookings count reached';
  //           setNormalService([...normalService]);
  //         }
  //       } else {
  //         normalService[id].count = normalService[id].count + 1;
  //         setNormalService([...normalService]);
  //       }
  //     }
  //   }
  //   dispatch(setBarServiceData(barServices)),
  //     dispatch(setNormalServiceData(normalService)),
  //     dispatch(setHourlyServiceData(hourlyServie));

  //   // if(type == 'bar'){
  //   //   dispatch(setBarServiceData(barServices))
  //   // }

  //   // if(type == 'normal'){
  //   //   dispatch(setNormalServiceData(normalService))
  //   // }
  // };

  useEffect(async () => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await loadServicesCount();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  useEffect(async () => {
    if (passServiceCount) {
      await loadBarServices();
    }
  }, [passServiceCount]);

  const wrapSelectedDatesFunc = date => {
    const saveDate = moment(date).format('YYYY, MM, DD');
    saveDate.toString();
    wrapSelectedDates.push(new Date(saveDate));
    setwrapSelectedDates(wrapSelectedDates);
  };

  const setNewData = data => {
    setHourlyServiceData(data);
  };

  const openSelected = id => {
    let data = hourServiceData ? hourServiceData : [];
    var getSubData = data[id].selectedData;
    setSubData(getSubData);
    setShowSub(true);
  };

  const onBookNowClick = () => {
    Promise.all([
      dispatch(setBarServiceData(barServices)),
      dispatch(setNormalServiceData(normalService)),
      dispatch(setHourlyServiceData(hourlyServie)),
    ]);
    dispatch(setBookFor('services'));
    dispatch(setShowBooking(true));
    if (userProfile && userProfile.id) {
      navigation.navigate('FinishBooking');
    } else {
      navigation.navigate('AddPersonalInfo');
    }
  };

  const removeSelected = (name, index, price) => {
    const hSer = hourServiceData;
    let removedService = hSer.findIndex(a => a.ServiceName === name);
    console.log('removedService', removedService, name);
    if (removedService !== -1) {
      hSer[removedService] &&
        hSer[removedService].selectedData.splice(index, 1);
      hSer[removedService].totalPrice =
        parseInt(hSer[removedService].totalPrice) - parseInt(price);
      setShowSub(false);
      console.log('skmsmk', hSer);
      setHourlyServie([...hSer]);
      setHourlyServiceData(hSer);
    }
  };

  const servicesRender = React.useCallback(
    ({item, index}) => (
      <BookExtraComponent
        item={item}
        index={index}
        type="bar"
        updateCounter={(type, index, action) =>
          updateCounter(type, index, action)
        }
      />
    ),
    [],
  );

  const renderItem = ({item, index}) => {
    return (
      <>
        <BookExtraComponent
          item={item}
          index={index}
          type="bar"
          updateCounter={(type, index, action, data) =>
            updateCounter('bar', index, action, data)
          }
        />
      </>
    );
  };

  const renderNormalServicesItem = ({item, index}) => {
    return (
      <>
        <BookExtraComponent
          item={item}
          index={index}
          type="normal"
          updateCounter={(type, index, action, data) =>
            updateCounter('normal', index, action, data)
          }
        />
      </>
    );
  };

  const keyExtractor = React.useCallback((item, index) => index, []);

  const NewBarServiceData =
    barServiceData && barServiceData.filter(x => x.count > 0);
  const NewNormalServiceData =
    normalServiceData && normalServiceData.filter(x => x.count > 0);
  const NewHourServiceData =
    hourServiceData && hourServiceData.filter(x => x.totalPrice > 0);

  console.log('NewBarServiceData', NewHourServiceData);
  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <SecondaryHeader title={strings('bookExtra_Services')} />
      {loading ? (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      ) : (
        <>
          <ScrollView bounces={false}>
            <Layout level="1" style={[styles.container]}>
              <View style={{}}>
                <View style={{marginVertical: themeConfig.margin}}>
                  {barServices && barServices.length > 0 && (
                    <View style={styles.servicesContiner}>
                      <Typography
                        category="s1"
                        style={{fontWeight: '700', margin: themeConfig.margin}}>
                        {strings('bar_services')}
                      </Typography>
                      <FlatList
                        data={barServices}
                        renderItem={renderItem}
                        removeClippedSubviews
                        initialNumToRender={1}
                        keyExtractor={keyExtractor}
                        maxToRenderPerBatch={12}
                      />
                    </View>
                  )}

                  {normalService && normalService.length > 0 && (
                    <View style={styles.servicesContiner}>
                      <Typography
                        category="h3"
                        style={{margin: themeConfig.margin}}>
                        {strings('services')}
                      </Typography>
                      <FlatList
                        data={normalService}
                        renderItem={renderNormalServicesItem}
                        removeClippedSubviews
                        initialNumToRender={1}
                        keyExtractor={keyExtractor}
                        maxToRenderPerBatch={12}
                      />
                    </View>
                  )}

                  {hourlyServie && hourlyServie.length > 0 && (
                    <View style={styles.servicesContiner}>
                      <Typography
                        category="s1"
                        style={{fontWeight: '700', margin: themeConfig.margin}}>
                        {strings('hour_services')}
                      </Typography>
                      {hourlyServie &&
                        hourlyServie.length > 0 &&
                        hourlyServie.map((service, index) => {
                          console.log('hourlyServie', service);
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: themeConfig.margin / 2,
                              }}
                              key={index}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}>
                                <View style={styles.icon}>
                                  <HeroImage
                                    uri={
                                      service.Servicemage
                                        ? service.Servicemage
                                        : ''
                                    }
                                    style={styles.imageStyle}
                                    height={24}
                                  />
                                </View>
                                <Typography
                                  category="s1"
                                  style={{fontSize: 13}}
                                  status="basic">
                                  {service.ServiceName}
                                </Typography>
                              </View>

                              <View style={{flexDirection: 'row'}}>
                                {service.selectedData &&
                                  service.selectedData.length > 0 && (
                                    <TouchableOpacity
                                      style={{marginRight: themeConfig.margin}}
                                      onPress={() =>
                                        removeSelected(
                                          service.ServiceName,
                                          index,
                                          service.ServicePrice,
                                        )
                                      }>
                                      <Icon
                                        style={styles.closeicon}
                                        fill={themeConfig.colors.red}
                                        name="trash-outline"
                                      />
                                    </TouchableOpacity>
                                  )}
                                <TouchableOpacity
                                  style={{
                                    alignItems: 'center',
                                    backgroundColor: themeConfig.colors.primary,
                                    paddingHorizontal:
                                      themeConfig.padding * 2.4,
                                    paddingVertical: themeConfig.padding / 2,
                                    borderRadius: themeConfig.radius,
                                  }}
                                  onPress={() => onChooseClick(service)}>
                                  <Typography
                                    category="s1"
                                    style={{fontWeight: '400'}}
                                    status="control">
                                    {strings('choose')}
                                  </Typography>
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        })}
                    </View>
                  )}

                  <Divider />

                  {showSub &&
                    subData &&
                    subData.length > 0 &&
                    subData.map((item, i) => {
                      return (
                        <>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: themeConfig.margin / 2,
                            }}
                            key={i}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                            />

                            <Typography
                              category="s2"
                              style={{fontWeight: '400'}}
                              status="basic">
                              {_formatDate(item.bookingDate)}
                              {'\n'}
                              {item.time && item.time.selectedPeriod}
                            </Typography>

                            <Typography
                              category="s2"
                              style={{fontWeight: '400'}}
                              status="basic">
                              X {item.count}
                            </Typography>

                            <Typography
                              category="s2"
                              style={{fontWeight: '400'}}
                              status="basic">
                              {parseInt(item.price)} €
                            </Typography>
                            <TouchableOpacity
                              style={{marginRight: themeConfig.margin}}
                              onPress={() =>
                                removeSelected(item.name, i, item.price)
                              }>
                              <Icon
                                style={styles.closeicon}
                                fill={themeConfig.colors.primary}
                                name="close-outline"
                              />
                            </TouchableOpacity>
                          </View>
                        </>
                      );
                    })}
                </View>
              </View>
              <View style={{margin: themeConfig.margin}}>
                <InputComponent
                  multiline={true}
                  textStyle={{minHeight: 120}}
                  placeholder={strings('note_msg')}
                />
              </View>

              <Divider />
              <Layout level="1" style={{margin: themeConfig.margin}}>
                <Typography
                  category="h3"
                  style={{
                    fontWeight: '500',
                    marginVertical: themeConfig.margin,
                  }}>
                  {strings('summary')}
                </Typography>
                {NewBarServiceData && NewBarServiceData.length > 0 ? (
                  <Typography category="h6" style={{fontSize: 13}}>
                    {strings('bar_services')}
                  </Typography>
                ) : null}
                {NewBarServiceData &&
                  NewBarServiceData.length > 0 &&
                  NewBarServiceData.map((bar, index) => {
                    console.log('bar', bar);
                    return (
                      <>
                        {bar?.selectedData &&
                          bar.selectedData.map((a, i) => {
                            return (
                              <>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                  }}>
                                  <View style={styles.leftSection}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <HeroImage
                                        uri={
                                          bar.Servicemage ? bar.Servicemage : ''
                                        }
                                        style={[
                                          styles.imageStyle,
                                          {marginLeft: 5},
                                        ]}
                                        height={24}
                                      />
                                      <Typography
                                        category="s1"
                                        style={{
                                          fontWeight: '400',
                                          fontSize: 13,
                                          marginLeft: 10,
                                        }}
                                        status="basic">
                                        {bar.ServiceName}
                                      </Typography>
                                    </View>
                                  </View>
                                  <View style={styles.rightSection}>
                                    <Typography
                                      category="s1"
                                      style={{fontSize: 13}}
                                      status="basic">
                                      {bar.click}
                                    </Typography>
                                  </View>
                                  <View style={styles.rightSection}>
                                    <Typography
                                      category="s1"
                                      style={{fontSize: 13}}
                                      status="basic">
                                      {/* {parseInt(bar.count) *
                                parseFloat(bar.ServicePrice)}{' '} */}
                                      {_calcPrice(
                                        _checkIsNumberFloat(
                                          _checkIsNumberFloat(
                                            bar.ServicePrice,
                                          ) * parseInt(a.click),
                                        ),
                                      )}
                                      €
                                    </Typography>
                                  </View>
                                </View>
                              </>
                            );
                          })}
                      </>
                    );
                  })}

                {NewNormalServiceData && NewNormalServiceData.length > 0 ? (
                  <Typography category="h6" style={{fontSize: 13}}>
                    {strings('services')}
                  </Typography>
                ) : null}

                {NewNormalServiceData &&
                  NewNormalServiceData.length > 0 &&
                  NewNormalServiceData.map((normal, index) => {
                    console.log('bar selectedData', normal.selectedData);
                    return (
                      <>
                        {normal.selectedData &&
                          normal.selectedData.map((a, i) => {
                            return (
                              <>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                  }}>
                                  <View style={styles.leftSection}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <HeroImage
                                        uri={
                                          normal.Servicemage
                                            ? normal.Servicemage
                                            : ''
                                        }
                                        style={[
                                          styles.imageStyle,
                                          {marginLeft: 5},
                                        ]}
                                        height={24}
                                      />
                                      <Typography
                                        category="s1"
                                        style={{
                                          fontWeight: '400',
                                          fontSize: 13,
                                          marginLeft: 10,
                                        }}
                                        status="basic">
                                        {normal.ServiceName}
                                      </Typography>
                                    </View>
                                  </View>
                                  <View style={styles.rightSection}>
                                    <Typography
                                      category="s1"
                                      style={{fontSize: 13}}
                                      status="basic">
                                      {normal.click}
                                    </Typography>
                                  </View>
                                  <View style={styles.rightSection}>
                                    <Typography
                                      category="s1"
                                      style={{fontSize: 13}}
                                      status="basic">
                                      {/* {parseInt(normal.count) *
                                parseFloat(normal.ServicePrice)}{' '} */}
                                      {_calcPrice(
                                        _checkIsNumberFloat(
                                          _checkIsNumberFloat(
                                            normal.ServicePrice,
                                          ) * parseInt(a.click),
                                        ),
                                      )}
                                      €
                                    </Typography>
                                  </View>
                                </View>
                              </>
                            );
                          })}
                      </>
                    );
                  })}

                {NewHourServiceData && NewHourServiceData.length > 0 ? (
                  <Typography category="h6" style={{fontSize: 13}}>
                    {strings('hour_services')}
                  </Typography>
                ) : null}

                {NewHourServiceData &&
                  NewHourServiceData.length > 0 &&
                  NewHourServiceData.map((data, index) => {
                    return (
                      <>
                        {data &&
                          data.selectedData &&
                          data.selectedData.length > 0 &&
                          data.selectedData.map((item, i) => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  flex: 1,
                                }}>
                                <View style={styles.leftSection}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                    }}>
                                    <HeroImage
                                      uri={
                                        data.Servicemage ? data.Servicemage : ''
                                      }
                                      style={[
                                        styles.imageStyle,
                                        {marginLeft: 5},
                                      ]}
                                      height={24}
                                    />
                                    <Typography
                                      category="s1"
                                      style={{fontSize: 13}}
                                      status="basic">
                                      {item.name}
                                    </Typography>
                                  </View>
                                </View>
                                <View style={styles.leftSection}>
                                  <Typography
                                    category="s1"
                                    style={{fontSize: 13}}
                                    status="basic">
                                    {_formatDate(item.bookingDate)}
                                    {'\n'}
                                    {item.time && item.time.selectedPeriod}
                                  </Typography>
                                </View>
                                <View style={styles.rightSection}>
                                  <Typography
                                    category="s1"
                                    style={{fontSize: 13}}
                                    status="basic">
                                    X {item.count}
                                  </Typography>
                                </View>
                                <View style={styles.rightSection}>
                                  <Typography
                                    category="s1"
                                    style={{fontSize: 13}}
                                    status="basic">
                                    {parseFloat(item.price)} €
                                  </Typography>
                                </View>
                              </View>
                            );
                          })}
                      </>
                    );
                  })}
              </Layout>
              <HourSelectPopup
                open={isopenHousrlyPopup}
                language={language}
                onClose={() => setisopenHousrlyPopup(false)}
                selectedHourlyService={selectedHourlyService}
                handleHourPopup={() => toggleHourPopup()}
                wrapSelectedDatesFunc={wrapSelectedDatesFunc}
                hourServiceData={hourServiceData}
                setHourlyService={data => setNewData(data)}
                addSurcharge={addSurcharge}
              />
            </Layout>
          </ScrollView>

          {/* <Layout style={styles.boxStyle}>
          <View
              style={[
                styles.boxStyle,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Typography
                category="h6"
                status="basic"
                style={{
                  marginHorizontal: themeConfig.margin * 2,
                  fontWeight: '600',
                  fontSize: 16,
                  top: themeConfig.margin,
                }}>
                {strings('total')}
              </Typography>
              <Typography
                category="s1"
                style={{
                  fontSize: 16,
                  top: themeConfig.margin,
                }}>
                price: €
              </Typography>
              <View style={{flex: 1}}>

              <ButtonComponent onPress={() => onBookNowClick()}>
              <Typography
                status="control"
                category="s2"
                style={{fontWeight: '400'}}>
                {strings('book')}
              </Typography>
            </ButtonComponent>
              </View>
            </View>

          </Layout> */}

          <Layout>
            <Divider />
            <View
              style={[
                styles.boxStyle,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <View style={{flex: 4, flexDirection: 'row'}}>
                <Typography
                  category="h6"
                  status="basic"
                  style={{
                    marginHorizontal: themeConfig.margin * 2,
                    fontSize: 14,
                  }}>
                  {strings('total')}{' '}
                </Typography>
                <Typography
                  category="s1"
                  style={{
                    right: themeConfig.margin,
                    fontSize: 14,
                  }}>
                  {totalPrice} €
                </Typography>
              </View>

              <View style={{flex: 3}}>
                <DropShadow
                  style={{
                    shadowColor: '#0F379f',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                  }}>
                  <ButtonComponent
                    size="small"
                    onPress={() => onBookNowClick()}>
                    <Typography
                      status="control"
                      category="h6"
                      style={{fontWeight: '400'}}>
                      {strings('book')}
                    </Typography>
                  </ButtonComponent>
                </DropShadow>
              </View>
            </View>
          </Layout>
        </>
      )}

      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={3000}
        positionValue={200}
      />
    </Layout>
  );
};
export default React.memo(BookExtraServiceScreen);

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  icon: {
    padding: themeConfig.padding,
    paddingRight: themeConfig.padding + 4,
  },
  imageStyle: {
    width: 24,
    height: 24,
  },
  head: {height: 40},
  text: {
    margin: 6,
    color: '#9d9d9d',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '400',
  },
  closeicon: {
    width: 25,
    height: 25,
    top: 5,
  },
  leftSection: {
    flex: 3,
    // width: 130,
    marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    marginBottom: themeConfig.margin / 2,
  },
  servicesContiner: {
    backgroundColor: themeConfig.colors.lightBule,
    marginBottom: themeConfig.margin * 2,
    padding: themeConfig.padding,
  },
});
