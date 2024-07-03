import React, {useEffect, useState, useRef} from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Share,
  RefreshControl,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import {strings} from 'i18n/i18n';
import Loader from 'components/Loader';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import moment, {utc} from 'moment';
import {
  setBeachMapDataCusotm,
  _checkItemPresent,
  returnOnlyFreeData,
} from 'resources/CommonFunction';
import Toast from 'react-native-easy-toast';
import GLOBALS from 'resources/constant';
import {useDispatch, useSelector, batch} from 'react-redux';
import {
  setAvailableItems,
  setBeachMapMainData,
  SetPackageData,
  SetAddItemData,
  SetSeasonalDates,
  SetSeasonalPeriods,
  SetReservationData,
  SetSelectedRowCol,
  setMapOneForConsumer,
} from 'app/redux/actions/beachMapActions';

import {
  setModalBookingPeriod,
  setSelectProperty,
} from 'app/redux/actions/globalActions';
import {
  setFinalPrice,
  setstoreFinalLocData,
} from 'app/redux/actions/bookingActions';
import {
  setTempAvailbleData,
  setMoveLocationObject,
  setSeasonalFlag,
} from 'app/redux/actions/bookingActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Setlocation,
  SetlocationData,
  setMultipleGridForReservation,
} from 'app/redux/actions/locationActions';
import BookNowFinalScreen from './BookNowFinal.screen';
import PropertyCard from './PropertyCard.component';
import Availability from './Availability.component';
import {_returnPkgString} from 'resources/ReservationServices';
const sunBed = require('app/resources/images/seat.png');
const bookedUmbrella = require('app/resources/images/bookedUmbrella.png');
const umbrella = require('app/resources/images/umbrella.png');
const seatAvailable = require('app/resources/images/seatAvailable.png');
const seatBooked = require('app/resources/images/seatBooked.png');
const tent = require('app/resources/images/tent.png');
const tentBooked = require('app/resources/images/tentBooked.png');
const backgroundTemp = require('app/resources/images/booknow.png');

const bookingOption = [
  {
    id: 1,
    title: 'Full Day',
    value: 'Full Day',
  },
];

const HalfDayBookOption = [
  {
    id: 1,
    title: 'Full Day',
    value: 'Full Day',
  },
  {
    id: 2,
    title: 'Morning',
    value: 'Morning',
  },
  {
    id: 3,
    title: 'Afternoon',
    value: 'Afternoon',
  },
];

const bookingItOption = [
  {
    id: 1,
    title: 'Giornaliero',
    value: 'Full Day',
  },
];

const HalfDayITBookOption = [
  {
    id: 1,
    title: 'Giornaliero',
    value: 'Full Day',
  },
  {
    id: 2,
    title: 'Mattina',
    value: 'Morning',
  },
  {
    id: 3,
    title: 'Pomeriggio',
    value: 'Afternoon',
  },
];

const freeTent =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/Tent/tent-empty.png';
const bookedTent =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/Tent/tent-booked.png';
const freeParking =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/Parking/parking-empty.png';
const bookedParking =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/Parking/parking-booked.png';
const freeCabin =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/Cabin/cabin-empty.png';
const bookedCabin =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/Cabin/cabin-booked.png';
const freeSpecialCabin =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/SpecialCabin/special-cabin-empty.png';
const bookedSpecialCabin =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/SpecialCabin/special-cabin-booked.png';
const freeSpecialUmbrella1 =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/Umbrella/umbrella-empty.png';
const freeSpecialUmbrella2 =
  'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/Umbrella/umbrella-empty.png';
const data = Array(4)
  .fill()
  .map((_, index) => {
    return {
      sunBedsName: `S${index}`,
      sunBedImage: sunBed,
      umbrellaName: `U${index}`,
      umbrellaBooked: Math.random() < 0.5,
      umbrellaBookedImage: bookedUmbrella,
      umbrellaAvailableImage: umbrella,
      seatName: `S${index}`,
      seatBookedImage: seatBooked,
      seatBooked: Math.random() < 0.5,
      seatAvailableImage: seatAvailable,
      tentName: `T${index}`,
      tentImage: tent,
      tentBooked: Math.random() < 0.5,
      tentBookedImage: tentBooked,
    };
  });

const WIDTH = Dimensions.get('window').width;
const BookNowScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {mapEnabled, location, name, slug} = route.params || {};
  const [changeLaneg, setchangeLaneg] = React.useState(false);
  const [loading, setloading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [templateImage, setTemplateImage] = useState();
  const toast = useRef('');
  const [bookedBeachMapData, setbookedBeachMapData] = useState();
  const [bookedUmbrella, setBookedUmbrella] = useState('');
  const [bookedSpecial1, setBokedSpecial1] = useState('');
  const [bookedSpecial2, setBookedSpecial2] = useState('');
  const [tempavailableItem, setTempAvailableItem] = useState('');
  const [imageLoading, setImageloading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingPeriod, setBookingPeriod] = useState('FullDay');
  const [enableHalfDayBook, setEnableHalfDayBook] = useState(false);
  const [fullInfo, setfullInfo] = useState('');
  const [seasonalCheckbox, setSeasonalCheckbox] = useState(false);
  const [seasonalReservation, setSeasonalReservation] = useState(false);
  let getFreeLocations = [];
  let getAbsenceLocations = [];
  const [
    language,
    propertyId,
    searchDate,
    availableItems,
    bookreservationData,
    beachMapData,
    selectedLocation,
    movedSelectedObj,
    selectedBookedLocation,
    packageData,
    addItemData,
    dynamicIns,
    selectedProperty,
    onlingBookingSetting,
    getFinalPrice,
    getFinalLocData,
  ] = useSelector(state => [
    state.globalReducerData.language,
    state.globalReducerData.propertyId,
    state.globalReducerData.searchDate,
    state.BeachMapReducerData.availableItems,
    state.BeachMapReducerData.bookreservationData,
    state.BeachMapReducerData.beachMapData,
    state.BeachMapReducerData.selectedLocation,
    state.BookingReducerData.movedSelectedObj,
    state.BookingReducerData.selectedBookedLocation,
    state.BeachMapReducerData.packageData,
    state.BeachMapReducerData.addItemData,
    state.globalReducerData.dynamicIns,
    state.globalReducerData.selectedProperty,
    state.globalReducerData.onlingBookingSetting,
    state.BookingReducerData.getFinalPrice,
    state.BookingReducerData.getFinalLocData,
  ]);
  // const {
  //   setAvailableItems,
  //   setBeachMapMainData,
  //   SetPackageData,
  //   SetAddItemData,
  //   SetSeasonalDates,
  //   SetSeasonalPeriods,
  //   SetReservationData,
  //   Setlocation,
  //   SetlocationData,
  //   SetSelectedRowCol,
  //   setTempAvailbleData,
  //   setMoveLocationObject,
  //   setMultipleGridForReservation,
  // } = applicationController();
  // const propertyId = 75;

  const loadBookedUmbrella = async () => {
    Promise.all([loadAbsenceLocation(), loadFreeLocation()]).then(
      async ([res1, res2, res3]) => {
        dispatch(setModalBookingPeriod(bookingPeriod));
        if (
          onlingBookingSetting.onlineBookingOptions &&
          onlingBookingSetting.onlineBookingOptions.locationOptionObj &&
          onlingBookingSetting.onlineBookingOptions.locationOptionObj
            .enableHalfDayBook === 'true'
        ) {
          setEnableHalfDayBook(true);
        }
        if (
          onlingBookingSetting.onlineBookingOptions &&
          onlingBookingSetting.onlineBookingOptions.locationOptionObj &&
          onlingBookingSetting.onlineBookingOptions.locationOptionObj
            .locationOptionObj
        ) {
          setfullInfo(
            onlingBookingSetting.onlineBookingOptions.locationOptionObj
              .useFulInfo,
          );
          console.log(
            'onlingBookingSetting.onlineBookingOptions.locationOptionObj.seasonalReservation from online setting',
            onlingBookingSetting.onlineBookingOptions.locationOptionObj
              .seasonalReservation,
          );
          setSeasonalReservation(
            onlingBookingSetting.onlineBookingOptions.locationOptionObj
              .seasonalReservation,
          );
        }
        if (
          onlingBookingSetting.serviceBookingOptions &&
          onlingBookingSetting.serviceBookingOptions.useFulInfo
        ) {
          setfullInfo(onlingBookingSetting.serviceBookingOptions.useFulInfo);
        }
        const postData = {
          propertyId: propertyId,
        };
        const {data, message, status, error} = await postDataToServer(
          `${Api.getBookedUmbrella}`,
          postData,
        );
        if (status) {
          let umbrellaImg = data.data
            ? data.data.umbrellaImg
            : 'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/2yja5bgukmxic259.png';
          setBookedUmbrella(
            data.data
              ? data.data.umbrellaImg
              : 'https://summerbooking.s3.us-east-2.amazonaws.com/images/configure/2yja5bgukmxic259.png',
          );
          setBokedSpecial1(data.data ? data.data.bookedSpecial1 : '');
          setBookedSpecial2(data.data ? data.data.specialUmbrella2 : '');
          await loadBookedLocationList(umbrellaImg);
        } else {
          dispatch(SetReservationData([]));
          // SetReservationData([]);
          let errorMessage = error ? error : message;
          setloading(false);
        }
      },
    );
  };

  //Call Booked and reserved location API

  const loadBookedLocationList = async image => {
    let startDate = moment(searchDate.startDate).format(
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    );
    let endDate = moment(searchDate.endDate).format(
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    );
    const postData = {
      fromDate: startDate,
      propertyId: propertyId,
      toDate: endDate,
      booking_period: bookingPeriod,
    };
    const {data, message, sucess, error} = await postDataToServer(
      `${Api.locationBooking}`,
      postData,
    );
    if (sucess) {
      await dispatch(SetReservationData(data.data));
      // SetReservationData(data.data);
      loadViewconfiguration(data.data, image);
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };

  //Call background images for map API
  const loadViewConfigMapData = async () => {
    // setloading(true);
    const postData = {
      propertyId: propertyId,
    };
    const {data, message, status, error} = await postDataToServer(
      `${Api.viewconfimaps}`,
      postData,
    );
    if (status) {
      setTemplateImage(
        data.data && data.data.templateImg
          ? data.data.templateImg
          : backgroundTemp,
      );
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };
  //Load default configuration API initial Empty locations
  const loadViewconfiguration = async (bookingData, image) => {
    const postData = {
      propertyId: propertyId,
    };
    const {data, message, status, error} = await postDataToServer(
      `${Api.viewconfiguration}`,
      postData,
    );
    if (status) {
      const result = data.data.beachMapData;
      if (result.length > 0) {
        await _concatConfigWithBookedReserved(result, bookingData, image);
      }
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };

  //Load default configuration API initial Empty locations
  const loadAbsenceLocation = async () => {
    const newStartDate = moment(searchDate.startDate).format(
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    );
    const newEndDate = moment(searchDate.endDate).format(
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    );
    const postData = {
      property_id: propertyId,
      start_date: newStartDate,
      end_date: newEndDate,
    };

    const {data, message, status, error} = await postDataToServer(
      `${Api.getAbsencesLocation}`,
      postData,
    );
    if (status) {
      if (data.data.length > 0) {
        getAbsenceLocations.push(data.data.map(String));
      }
    } else {
      let errorMessage = error ? error : message;
      if (data.data.length !== 0) {
        setloading(false);
      }
    }
  };

  //Load Free Location
  const loadFreeLocation = async () => {
    const newStartDate = moment(searchDate.startDate).format(
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    );
    const newEndDate = moment(searchDate.endDate).format(
      'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
    );
    const postData = {
      property_id: propertyId,
      start_date: newStartDate,
      end_date: newEndDate,
    };
    console.log('postData', postData);
    const {data, message, status, error} = await postDataToServer(
      `${Api.getSharedLocationsByDate}`,
      postData,
    );
    if (status) {
      if (data.data && data.data.length > 0) {
        data.data.map((e, i) => {
          getFreeLocations.push(e);
        });
      }
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };

  //Seasons and periods list for the Basthhouse
  const loadSeasonsperiods = async () => {
    const postData = {
      propertyId: propertyId,
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
      setRefreshing(false);
      setloading(false);zz
    } else {
      dispatch(SetSeasonalDates([]));
      dispatch(SetSeasonalPeriods([]));
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };

  //Getting packages and additionla items data
  const _getPackageAddItemList = async type => {
    const postData = {
      propertyId: propertyId,
      type: type,
    };

    const {data, message, status, error} = await postDataToServer(
      `${Api.allpricelist}`,
      postData,
    );
    if (status) {
      const resData = data.data;
      let getOnlineResPkg =
        resData && resData.filter(x => x.details.enableOnlineReservation);
      if (type == 'package') {
        dispatch(SetPackageData(getOnlineResPkg ? getOnlineResPkg : []));
        //set package data reducer
      } else {
        dispatch(SetAddItemData(getOnlineResPkg ? getOnlineResPkg : []));
        //set additional item data reducer
      }
    } else {
      dispatch(SetPackageData([]));
      dispatch(SetAddItemData([]));
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };

  //concatenation of beach map default data with booked and reserved locations
  const _concatConfigWithBookedReserved = async (
    configData,
    bookreservationData,
    bookedUmbrellaimage,
  ) => {
    const bookedLocData =
      bookreservationData &&
      bookreservationData.bookingData &&
      bookreservationData.bookingData.length > 0
        ? bookreservationData.bookingData
        : [];

    const reservedData =
      bookreservationData &&
      bookreservationData.locationData &&
      bookreservationData.locationData.length > 0
        ? bookreservationData.locationData
        : [];

    const extractOnlyLocation =
      (await bookedLocData) &&
      bookedLocData.length > 0 &&
      bookedLocData.map(booked => {
        return (
          booked.bookingLocations &&
          booked.bookingLocations.length > 0 &&
          booked.bookingLocations.map(locbook => {
            return {
              ...locbook,
              booking_id: booked.id,
              toPay: booked.booking_payments.toPay,
              paymentMethod: booked.booking_payments.paymentMode,
              booking_user: booked.bookingAgent,
              booking_end_date: booked.endDate,
              packageItemString:
                booked.packageSelectedData &&
                booked.packageSelectedData.length > 0 &&
                booked.packageSelectedData.map(item =>
                  item.packageItemString ? item.packageItemString : null,
                ),
            };
          })
        );
      });

    const extractOnlyResObj =
      (await reservedData) &&
      reservedData.length > 0 &&
      reservedData.map(reserved => {
        return {
          ...reserved.reservedObject,
          reserved_id: reserved.id,
          booking_user: reserved.bookingAgent,
        };
      });

    let locationArray = [];
    if (extractOnlyLocation && extractOnlyLocation.length > 0) {
      for (let v of extractOnlyLocation) {
        if (v.length > 0 && Array.isArray(v)) {
          for (let b of v) {
            await locationArray.push(b);
          }
        }
      }
    }

    let reservedArray = [];
    if (extractOnlyResObj && extractOnlyResObj.length > 0) {
      for (let v of extractOnlyResObj) {
        await reservedArray.push(v);
      }
    }

    const mergedArray = await locationArray.concat(reservedArray);
    const newconfigData = [...configData];
    var temp_morning_array = [];
    var temp_afternoon_array = [];

    newconfigData.map(data => {
      data.rec &&
        data.rec.map(async recData => {
          mergedArray &&
            mergedArray.filter(async merge => {
              if (recData.name === merge.Location) {
                let newPackageItemString = _returnPkgString(
                  merge.packageItemString,
                  recData.name,
                  merge.itemName,
                );

                if (merge.isBooked) {
                  let mergeLocation = merge.Location.toString();
                  console.log(
                    'getFreeLocations',
                    getFreeLocations,
                    getAbsenceLocations,
                  );
                  if (
                    getFreeLocations &&
                    getFreeLocations.length > 0 &&
                    getFreeLocations.includes(mergeLocation)
                  ) {
                    recData.isBooked = false;
                    recData.isShared = true;
                  } //if block close for if free location available
                  else {
                    //if block for absence locations
                    if (
                      getAbsenceLocations &&
                      getAbsenceLocations.length > 0 &&
                      getAbsenceLocations.includes(mergeLocation)
                    ) {
                      recData.isBooked = false;
                      recData.isShared = true;
                    } //if block close for if absence location available
                    else {
                      recData.isBooked = true;
                      recData.isShared = false;
                      recData.booking_id = merge.booking_id;
                      recData.toPay = merge.toPay;
                      recData.deposit = merge.deposit;
                      recData.remainingPayment = merge.remainingPayment;
                      recData.payableAmount = merge.payableAmount;
                      recData.paymentMethod = merge.paymentMethod;
                      recData.booking_user = merge.booking_user;
                      recData.userName = merge.userName;
                      recData.booking_period = merge.booking_period;
                      recData.booking_end_date = merge.booking_end_date;
                      recData.packageItemString = newPackageItemString;
                      recData.seasonalPass = merge.seasonalPass;
                      recData.booking_absence_dates =
                        merge.booking_absence_dates;
                      recData.booking_count = 1;
                      if (merge.booking_period === 'Morning') {
                        // console.log('in morning if block enter');
                        temp_morning_array.push(mergeLocation);
                        if (temp_afternoon_array.includes(mergeLocation)) {
                          recData.booking_count = 2;
                        }
                      }
                      if (merge.booking_period === 'Afternoon') {
                        // console.log('in afternoon if block enter');
                        temp_afternoon_array.push(mergeLocation);
                        if (temp_morning_array.includes(mergeLocation)) {
                          recData.booking_count = 2;
                        }
                      }
                    } //else block for absence location
                  } //else block for booked locations
                }

                if (merge.isReserved) {
                  recData.isReserved = true;
                  recData.reserved_id = merge.reserved_id;
                  recData.booking_user = merge.booking_user;
                  recData.userName = merge.userName;
                  recData.booking_period = merge.booking_period;
                  recData.booking_end_date = merge.booking_end_date;
                  recData.packageItemString = newPackageItemString;
                  recData.seasonalPass = merge.seasonalPass;
                  recData.booking_absence_dates = merge.booking_absence_dates;
                }
              }
            });
        });
    });

    // newconfigData.map(data => {
    //   data.rec &&
    //     data.rec.map(async recData => {
    //       mergedArray &&
    //         mergedArray.filter(async merge => {
    //           if (recData.name === merge.Location) {
    //             if (merge.isBooked) {
    //               recData.isBooked = true;
    //               recData.booking_id = merge.booking_id;
    //               recData.toPay = merge.toPay;
    //               recData.paymentMethod = merge.paymentMethod;
    //               recData.booking_user = merge.booking_user;
    //               recData.booking_period = merge.booking_period;
    //               recData.booking_end_date = merge.booking_end_date;
    //               recData.packageItemString = merge.packageItemString;
    //               recData.booking_count = 1;
    //               if (merge.booking_period === 'Morning') {
    //                 temp_morning_array.push(merge.Location);
    //                 if (temp_afternoon_array.includes(merge.Location)) {
    //                   recData.booking_count = 2;
    //                 }
    //               }
    //               if (merge.booking_period === 'Afternoon') {
    //                 temp_afternoon_array.push(merge.Location);
    //                 if (temp_morning_array.includes(merge.Location)) {
    //                   recData.booking_count = 2;
    //                 }
    //               }
    //             }
    //             if (merge.isReserved) {
    //               recData.isReserved = true;
    //               recData.reserved_id = merge.reserved_id;
    //               recData.booking_user = merge.booking_user;
    //               recData.booking_period = merge.booking_period;
    //               recData.booking_end_date = merge.booking_end_date;
    //               recData.packageItemString = merge.packageItemString;
    //             }
    //           }
    //         });
    //     });
    // });

    for (var j = 0; j < newconfigData.length; j++) {
      for (var k = 0; k < newconfigData[j].rec.length; k++) {
        if (
          newconfigData[j].rec[k] &&
          newconfigData[j].rec[k].items &&
          newconfigData[j].rec[k].items.name === 'Umbrella'
        ) {
          newconfigData[j].rec[k].items.bookedItemImg = bookedUmbrellaimage;
        }
        if (
          newconfigData[j].rec[k] &&
          newconfigData[j].rec[k].items &&
          newconfigData[j].rec[k].items.name === 'SpecialUmbrella1'
        ) {
          newconfigData[j].rec[k].items.bookedItemImg = bookedSpecial1;
        }
        if (
          newconfigData[j].rec[k] &&
          newconfigData[j].rec[k].items &&
          newconfigData[j].rec[k].items.name === 'SpecialUmbrella2'
        ) {
          newconfigData[j].rec[k].items.bookedItemImg = bookedSpecial2;
        }
      }
    }

    // const checkLocationdata = async (item, mergeData) =>
    //   newconfigData.reduce((matches, entry, index) => {
    //     if (entry) {
    //       const checkLocationValueExist = entry.rec.filter(
    //         e => e.name === item,
    //       );
    //       if (checkLocationValueExist && checkLocationValueExist.length > 0) {
    //         // if (mergeData.isBooked) {
    //         //   entry.isBooked = true;
    //         //   entry.booking_id = mergeData.booking_id;
    //         //   entry.toPay = mergeData.toPay;
    //         //   entry.paymentMethod = mergeData.paymentMethod;
    //         //   entry.booking_user = mergeData.booking_user;
    //         // }
    //         // if (mergeData.isReserved) {
    //         //   entry.isReserved = true;
    //         //   entry.reserved_id = mergeData.reserved_id;
    //         //   entry.booking_user = mergeData.booking_user;
    //         // }

    //         if (mergeData.isBooked) {
    //           entry.isBooked = true;
    //           entry.booking_id = mergeData.booking_id;
    //           entry.toPay = mergeData.toPay;
    //           entry.paymentMethod = mergeData.paymentMethod;
    //           entry.booking_user = mergeData.booking_user;
    //           entry.booking_period = mergeData.booking_period;
    //           entry.booking_end_date = mergeData.booking_end_date;
    //           entry.packageItemString = mergeData.packageItemString;
    //           entry.booking_count = 1;
    //           if (mergeData.booking_period === 'Morning') {
    //             temp_morning_array.push(mergeData.Location);
    //             if (temp_afternoon_array.includes(mergeData.Location)) {
    //               entry.booking_count = 2;
    //             }
    //           }
    //           if (mergeData.booking_period === 'Afternoon') {
    //             temp_afternoon_array.push(mergeData.Location);
    //             if (temp_morning_array.includes(mergeData.Location)) {
    //               entry.booking_count = 2;
    //             }
    //           }
    //         }
    //         if (mergeData.isReserved) {
    //           entry.isReserved = true;
    //           entry.reserved_id = mergeData.reserved_id;
    //           entry.booking_user = mergeData.booking_user;
    //           entry.booking_period = mergeData.booking_period;
    //           entry.booking_end_date = mergeData.booking_end_date;
    //           entry.packageItemString = mergeData.packageItemString;
    //         }
    //         const checkUmbrella =
    //           entry.rec &&
    //           entry.rec.length > 0 &&
    //           entry.rec.filter((e, i) => {
    //             if (
    //               e.items &&
    //               Object.keys(e.items).length > 0 &&
    //               e.items.name === 'Umbrella'
    //             ) {
    //               entry.rec[i].items.bookedItemImg = bookedUmbrellaimage;
    //             }
    //             if (
    //               e.items &&
    //               Object.keys(e.items).length > 0 &&
    //               e.items.name === 'SpecialUmbrella1'
    //             ) {
    //               entry.rec[i].items.bookedItemImg = bookedUmbrellaimage;
    //             }
    //             if (
    //               e.items &&
    //               Object.keys(e.items).length > 0 &&
    //               e.items.name === 'SpecialUmbrella2'
    //             ) {
    //               entry.rec[i].items.bookedItemImg = bookedUmbrellaimage;
    //             }
    //           });
    //         return entry;
    //       }
    //     }
    //   }, []);

    //   const newFilterconfigData =
    //   mergedArray &&
    //   mergedArray.filter(async merge => {
    //     const checkValueExist = await checkLocationdata(merge.Location, merge);
    //   });

    // newconfigData.map(data => {
    //   data.rec &&
    //     data.rec.map(async recData => {
    //       mergedArray &&
    //         mergedArray.filter(async merge => {
    //           if (recData.name === merge.Location) {
    //             if (merge.isBooked) {
    //               recData.isBooked = true;
    //               recData.booking_id = merge.booking_id;
    //               recData.toPay = merge.toPay;
    //               recData.paymentMethod = merge.paymentMethod;
    //               recData.booking_user = merge.booking_user;
    //             }

    //             if (merge.isReserved) {
    //               recData.isReserved = true;
    //               recData.reserved_id = merge.reserved_id;
    //               recData.booking_user = merge.booking_user;
    //             }
    //           }
    //         });
    //     });
    // });
    // for (var j = 0; j < newconfigData.length; j++) {
    //   for (var k = 0; k < newconfigData[j].rec.length; k++) {
    //     if (
    //       newconfigData[j].rec[k] &&
    //       newconfigData[j].rec[k].items &&
    //       newconfigData[j].rec[k].items.name === 'Umbrella'
    //     ) {
    //       newconfigData[j].rec[k].items.bookedItemImg = bookedUmbrellaimage;
    //     }
    //   }
    // }

    // newconfigData.map(data => {
    //   data.rec &&
    //     data.rec.map(async recData => {
    //       mergedArray &&
    //         mergedArray.filter(async merge => {
    //           if (recData.name === merge.Location) {
    //             if (merge.isBooked) {
    //               recData.isBooked = true;
    //               recData.booking_id = merge.booking_id;
    //               recData.toPay = merge.toPay;
    //               recData.paymentMethod = merge.paymentMethod;
    //               recData.booking_user = merge.booking_user;
    //             }

    //             if (merge.isReserved) {
    //               recData.isReserved = true;
    //               recData.reserved_id = merge.reserved_id;
    //               recData.booking_user = merge.booking_user;
    //             }
    //           }
    //         });
    //     });
    // });
    // for (var j = 0; j < newconfigData.length; j++) {
    //   for (var k = 0; k < newconfigData[j].rec.length; k++) {
    //     if (
    //       newconfigData[j].rec[k] &&
    //       newconfigData[j].rec[k].items &&
    //       newconfigData[j].rec[k].items.name === 'Umbrella'
    //     ) {
    //       newconfigData[j].rec[k].items.bookedItemImg = bookedUmbrellaimage;
    //     }
    //   }
    // }
    const newResData = await _checkBothTrue(newconfigData);
    console.log('newResData', newResData, newconfigData);
    const getSplitLocations = await setBeachMapDataCusotm(newResData);
    const getFreeMapData = await returnOnlyFreeData(getSplitLocations);
    const getPresentItem = await _checkItemPresent(getSplitLocations);
    dispatch(setAvailableItems(getPresentItem));
    // setAvailableItems(getPresentItem);
    setloading(false);
    setbookedBeachMapData(newResData);
    dispatch(setBeachMapMainData(newResData));
    dispatch(setMapOneForConsumer(getFreeMapData));
    // setbookedBeachMapData(newResData);
    // setBeachMapMainData(newResData);
    getItemsName(newResData);
  };

  const getItemsName = Data => {
    let names = [];
    let temp = [];
    for (var i = 0; i < Data.length; i++) {
      for (var j = 0; j < Data[i].rec.length; j++) {
        if (Data[i].rec[j] && Data[i].rec[j].items) {
          let item = Data[i].rec[j].items && Data[i].rec[j].items.name;
          names = !temp.includes(item) ? temp.push(item) : null;
        }
      }
    }
    dispatch(setTempAvailbleData(temp));
  };

  const _checkBothTrue = async data => {
    // let newconfigData = [...data];
    // for (var i = 0; i < newconfigData.length; i++) {
    //   for (var j = 0; j < newconfigData[i].rec.length; j++) {
    //     let innerData = newconfigData[i].rec[j];
    //     if (innerData.isBooked && innerData.isReserved) {
    //       innerData.isBooked = true;
    //       innerData.isReserved = false;
    //       innerData.reserved_id = 0;
    //     }
    //   }
    // }
    // return newconfigData;
    let newconfigData = [...data];
    for (var i = 0; i < newconfigData.length; i++) {
      for (var j = 0; j < newconfigData[i].rec.length; j++) {
        let innerData = newconfigData[i].rec[j];
        if (innerData.isBooked && innerData.isReserved) {
          innerData.isBooked = true;
          innerData.isReserved = false;
          innerData.reserved_id = 0;
        }
      }
    }
    return newconfigData;
  };
  const removeAllData = async () => {
    const selectedBookedLocation = AsyncStorage.removeItem(
      'selectedBookedLocation',
    );
    const bookLocationData = AsyncStorage.removeItem('bookLocationData');
    const locationString = await AsyncStorage.removeItem('locationSum');
    dispatch(setstoreFinalLocData([]));
    dispatch(setFinalPrice(''));
  };

  const loadAllData = async () => {
    await removeAllData();
    await loadBookedUmbrella();
    await _getPackageAddItemList('package');
    await _getPackageAddItemList('additional');
    Promise.all([loadViewConfigMapData(), loadSeasonsperiods()]).then(
      ([res1, res2, res3]) => {
        // setloading(true);
        return true;
      },
    );
  };
  useEffect(async () => {
    setloading(true);
    loadAllData();
  }, []);

  useEffect(() => {
    setBookingPeriod(language == 'it' ? 'Giornaliero' : 'FullDay');
  }, [language]);

  const returnImg = config => {
    if (config.isReserved) {
      return config.items.reservedItemImg;
    }
    if (config.isBooked) {
      return config.items.bookedItemImg;
    }
    if (!config.isReserved && !config.isBooked) {
      return config.empty_item_image;
    }
  };

  const checkIsBooked = async (config, data) => {
    if (config.isBooked) {
      toast.current.show(strings('loactionBooked'));
    } else {
      const passData = {
        selectedRec: config,
        parentData: data,
      };
      const packageDatalength = packageData.length;
      const addItemDatalength = addItemData.length;
      if (packageDatalength > 0 && addItemDatalength > 0) {
        const getPreviousSelectedLocation = await AsyncStorage.getItem(
          'selectedBookedLocation',
        );
        const getPreviousData = getPreviousSelectedLocation
          ? JSON.parse(getPreviousSelectedLocation)
          : {};

        let templocationArray = [];

        if (getPreviousData && getPreviousData.length > 0) {
          var finIndex = getPreviousData.some(
            item => item.name === config.name,
          );
          if (finIndex) {
            toast.current.show(strings('location_Selected'));
          } else {
            templocationArray.push(config);
            const finalData = getPreviousData.concat(templocationArray);

            const postData = {
              locationName: config.name,
              locationData: config,
              selectedBookedLocation: finalData,
            };
            AsyncStorage.setItem(
              'bookLocationData',
              JSON.stringify(postData),
            ).then(() => setBookingModal(true));
          }
        } else {
          templocationArray.push(config);
          const postData = {
            locationName: config.name,
            locationData: config,
            selectedBookedLocation: templocationArray,
          };
          AsyncStorage.setItem(
            'bookLocationData',
            JSON.stringify(postData),
          ).then(() => setBookingModal(true));
        }
      } else {
        toast.current.show(strings('please_wait'));
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const handleChange = index => {
    const data = enableHalfDayBook ? HalfDayBookOption : bookingOption;
    const selectIndex = data[index.row];
    const bookingPeriodName = selectIndex.title;
    setBookingPeriod(bookingPeriodName);
    dispatch(setModalBookingPeriod(bookingPeriodName));
  };

  function isScrollviewCloseToRight({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) {
    return layoutMeasurement.width + contentOffset.x >= contentSize.width - 20;
  }

  console.log('beachMapData', beachMapData);

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <SecondaryHeader title={strings('book')} />

      {loading ? (
        <View style={styles.center}>
          <Loader color="#253C7E" visible={loading} />
        </View>
      ) : (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <Layout
              level="1"
              style={[styles.container, {marginTop: themeConfig.margin}]}>
              <View
                style={[styles.boxStyle, {marginBottom: themeConfig.margin}]}>
                <PropertyCard
                  name={selectedProperty.bathouseName}
                  address={selectedProperty.address}
                  imageUrl={selectedProperty.mainPhoto}
                  showButton
                  showImage
                />

                <Availability
                  disable
                  range={searchDate}
                  seasonalReservation={
                    onlingBookingSetting &&
                    onlingBookingSetting.onlineBookingOptions &&
                    onlingBookingSetting.onlineBookingOptions.locationOptionObj
                      .seasonalReservation
                  }
                  bookingPeriod={bookingPeriod}
                  onlingBookingSetting={onlingBookingSetting}
                  seasonalCheckbox={seasonalCheckbox}
                  bookingOption={
                    enableHalfDayBook
                      ? language == 'it'
                        ? HalfDayITBookOption
                        : HalfDayBookOption
                      : language == 'it'
                      ? bookingItOption
                      : bookingOption
                  }
                  handleChange={selectedValueindex =>
                    handleChange(selectedValueindex)
                  }
                  handleCheckbox={() => {
                    dispatch(setSeasonalFlag(!seasonalCheckbox));
                    setSeasonalCheckbox(!seasonalCheckbox);
                  }}
                />
              </View>
              <ScrollView bounces={false}>
                <View style={{marginVertical: themeConfig.margin * 2}}>
                  <View
                    style={[
                      styles.boxStyle,
                      {marginVertical: themeConfig.margin},
                    ]}>
                    <Typography
                      category="h3"
                      style={{
                        marginHorizontal: themeConfig.margin * 2,
                      }}>
                      {strings('map')}
                    </Typography>
                  </View>
                  <ImageBackground
                    source={
                      templateImage ? {uri: templateImage} : backgroundTemp
                    }
                    style={{
                      width: WIDTH,
                      height: WIDTH,
                      padding: themeConfig.padding,
                      marginVertical: themeConfig.margin,
                    }}>
                    {imageLoading ? (
                      <Loader color="#253C7E" visible={imageLoading} />
                    ) : (
                      <>
                        <ScrollView
                          bounces={false}
                          showsHorizontalScrollIndicator={false}>
                          <ScrollView
                            horizontal={true}
                            contentContainerStyle={{
                              flexDirection: 'column',
                            }}
                            //   onMomentumScrollEnd={event => {
                            //     if (isScrollviewCloseToRight(event.nativeEvent)) {
                            //        console.log("hehe")
                            //        setPageSize(pageSize + 10)
                            //     }
                            //   }
                            // }
                          >
                            {beachMapData &&
                              beachMapData.length > 0 &&
                              beachMapData.map((item, index) => {
                                return (
                                  <>
                                    <View
                                      key={index}
                                      style={{
                                        // width: WIDTH / 3.2,
                                        marginVertical: themeConfig.margin,
                                        flexDirection: 'row',
                                        alignSelf: 'flex-start',
                                        justifyContent: 'space-between',
                                        margin: themeConfig.margin * 1,
                                      }}>
                                      {item &&
                                        item.rec.map((e, i) => {
                                          return (
                                            <View
                                              style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom:
                                                  themeConfig.margin,
                                                height: WIDTH / 4.8,
                                                flexDirection: 'row',
                                                margin: 2,
                                              }}
                                              key={i}
                                              // pointerEvents={
                                              //   location &&
                                              //   location.length > 0 &&
                                              //   location.includes(e.name)
                                              //     ? 'auto'
                                              //     : 'none'
                                              // }>
                                            >
                                              <TouchableOpacity
                                                onPress={() =>
                                                  checkIsBooked(e, item)
                                                }>
                                                <Image
                                                  source={{uri: returnImg(e)}}
                                                  style={{
                                                    // width: 35,
                                                    // height: 30,
                                                    height: 35,
                                                    maxWidth: 22,
                                                  }}
                                                />
                                                <Typography
                                                  category="s1"
                                                  style={{
                                                    fontWeight: '500',
                                                    marginHorizontal: 4,
                                                  }}>
                                                  {e.name}
                                                </Typography>
                                              </TouchableOpacity>
                                            </View>
                                          );
                                        })}
                                    </View>
                                  </>
                                );
                              })}
                          </ScrollView>
                        </ScrollView>
                      </>
                    )}
                  </ImageBackground>
                </View>
              </ScrollView>

              {availableItems && availableItems.Umbrella && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: themeConfig.margin,
                    marginHorizontal: themeConfig.margin * 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={umbrella}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontWeight: '400', fontSize: 10}}
                      status="basic">
                      {strings('free_umbrella')}
                    </Typography>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: bookedUmbrella}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontWeight: '400', fontSize: 10}}
                      status="basic">
                      {strings('booked_umbrella')}
                    </Typography>
                  </View>
                </View>
              )}

              {availableItems && availableItems.Tent && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: themeConfig.margin,
                    marginHorizontal: themeConfig.margin * 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: freeTent}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('free_tent')}
                    </Typography>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: bookedTent}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('booked_tent')}
                    </Typography>
                  </View>
                </View>
              )}

              {availableItems && availableItems.Parking && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: themeConfig.margin,
                    marginHorizontal: themeConfig.margin * 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: freeParking}}
                        style={{width: 15, height: 15}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('free_parking')}
                    </Typography>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: bookedParking}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('booked_parking')}
                    </Typography>
                  </View>
                </View>
              )}

              {availableItems && availableItems.Cabin && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: themeConfig.margin,
                    marginHorizontal: themeConfig.margin * 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: freeCabin}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('free_cabin')}
                    </Typography>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: bookedCabin}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('booked_cabin')}
                    </Typography>
                  </View>
                </View>
              )}

              {availableItems && availableItems.Sunbed && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: themeConfig.margin,
                    marginHorizontal: themeConfig.margin * 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image source={sunBed} style={{width: 20, height: 20}} />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('free_sunbed')}
                    </Typography>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={seatBooked}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('booked_sunbed')}
                    </Typography>
                  </View>
                </View>
              )}

              {availableItems && availableItems.SpecialCabin && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: themeConfig.margin,
                    marginHorizontal: themeConfig.margin * 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: freeSpecialCabin}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('free_special_cabin')}
                    </Typography>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: bookedSpecialCabin}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('book_special_cabin')}
                    </Typography>
                  </View>
                </View>
              )}

              {availableItems && availableItems.SpecialUmbrella1 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: themeConfig.margin,
                    justifyContent: 'space-between',
                    marginHorizontal: themeConfig.margin * 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: freeSpecialUmbrella1}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('free_special_umb_1')}
                    </Typography>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: bookedUmbrella}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('book_special_umb_1')}
                    </Typography>
                  </View>
                </View>
              )}

              {availableItems && availableItems.SpecialUmbrella2 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    margin: themeConfig.margin * 2,
                    marginHorizontal: themeConfig.margin * 2,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: freeSpecialUmbrella2}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('free_special_umb_2')}
                    </Typography>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <View style={{marginRight: themeConfig.margin}}>
                      <Image
                        source={{uri: bookedUmbrella}}
                        style={{width: 20, height: 20}}
                      />
                    </View>
                    <Typography
                      category="s1"
                      style={{fontSize: 10}}
                      status="basic">
                      {strings('book_special_umb_2')}
                    </Typography>
                  </View>
                </View>
              )}

              {fullInfo ? (
                <View
                  style={[styles.boxStyle, {margin: themeConfig.margin - 2}]}>
                  <Typography
                    category="h3"
                    style={{
                      fontWeight: '700',
                    }}>
                    {strings('useful_information')}
                  </Typography>
                  <Typography
                    status="basic"
                    category="s1"
                    style={{
                      fontWeight: '500',
                    }}>
                    {fullInfo ? fullInfo : ''}
                  </Typography>
                </View>
              ) : null}
            </Layout>
          </ScrollView>

          <Layout>
            <Divider />
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
                {getFinalPrice ? getFinalPrice : 0} €
              </Typography>
              <View style={{flex: 1}} />
            </View>
          </Layout>
        </>
      )}
      {bookingModal && (
        <BookNowFinalScreen
          navigation={navigation}
          visible={bookingModal}
          seasonalCheckbox={seasonalCheckbox}
          onClose={() => setBookingModal(false)}
        />
      )}

      <Loader color="#fff" visible={changeLaneg} />
      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={3000}
        positionValue={200}
      />
    </Layout>
  );
};
export default BookNowScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
  },
  dot: {
    width: themeConfig.radius,
    height: themeConfig.radius,
    borderRadius: themeConfig.radius,
    backgroundColor: themeConfig.colors.black,
    marginRight: themeConfig.margin + 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
});
