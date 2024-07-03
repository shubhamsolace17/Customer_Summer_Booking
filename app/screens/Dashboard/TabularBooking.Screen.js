import React, {useEffect, useState, useRef} from 'react';
import {
  Divider,
  IndexPath,
  Layout,
  CheckBox,
  Icon,
} from '@ui-kitten/components';
import {StyleSheet, View, FlatList, ScrollView} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import SecondaryHeader from 'components/SecondaryHeader';
import {strings} from 'i18n/i18n';
import DateRangePickerComponent from 'components/DateRangePicker';
import Loader from 'components/Loader';
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import SummaryComponent from './Summary.component';
import {getPackagePriceCalc} from 'resources/BookingCalcService';
import BookFinalComponent from './BookingFinal.component';
import SelectComponent from 'components/Select';
import PlusMinusComponent from 'components/PlusMinus';
import {
  setBeachMapDataCusotm,
  _checkItemPresent,
  returnOnlyFreeData,
  returnOnlyFreeDataConsumer,
} from 'resources/CommonFunction';
import {
  _setCustomLocData,
  _splitLocationSeparate,
  _getPackagePricesByPosition,
  _getPackageInfoAdditional,
  _getItemNameCountOfPackageAdditional,
  _getCurrentSelectedLocation,
  _getPackageInfo,
  _getItemNameCountOfPackage,
} from 'resources/ReservationServices';
import moment from 'moment';
import Toast from 'react-native-easy-toast';
import {useDispatch, useSelector} from 'react-redux';
import {
  setPeopleCount,
  setItemsAvailabilityForPackage,
  setstoreSelectedLocData,
  setsavecombinedLocationObject,
  setstoreFinalLocData,
  setAllLocationSum,
  setAdditionalLocationData,
  setAdditionalItemsList,
  setFinalPrice,
  setSubTotalValue,
  setTempAvailbleData,
  setBookingType,
} from 'app/redux/actions/bookingActions';
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
  setRowSectorData,
  setShowBooking,
  setModalBookingPeriod,
  setBookFor,
  setUserSearchDate,
  _setLocationSurcharge,
  _setServiceSurcharge,
} from 'app/redux/actions/globalActions';
import {setMultipleGridForReservation} from 'app/redux/actions/locationActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropertyCard from './PropertyCard.component';
import Availability from './Availability.component';
import TabularBookingChildren from './TabularBookingChildren';
import DropShadow from 'react-native-drop-shadow';
import {_checkIsNumberFloat} from 'resources/ArithmaticService';

const bookingOption = [
  {
    id: 1,
    title: 'Daliy',
    value: 'FullDay',
  },
];

const HalfDayBookOption = [
  {
    id: 1,
    title: 'Daliy',
    value: 'FullDay',
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
    value: 'FullDay',
  },
];

const HalfDayITBookOption = [
  {
    id: 1,
    title: 'Giornaliero',
    value: 'FullDay',
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

const TabularBookingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [seasonalCheckbox, setSeasonalCheckbox] = useState(false);
  const [
    selectedProperty,
    searchDate,
    onlingBookingSetting,
    propertyId,
    getRowSectorData,
    packageData,
    addItemData,
    getMapOneForConsumer,
    getFinalLocData,
    getFinalPrice,
    userProfile,
    language,
  ] = useSelector(state => [
    state.globalReducerData.selectedProperty,
    state.globalReducerData.searchDate,
    state.globalReducerData.onlingBookingSetting,
    state.globalReducerData.propertyId,
    state.globalReducerData.getRowSectorData,
    state.BeachMapReducerData.packageData,
    state.BeachMapReducerData.addItemData,
    state.BookingReducerData.getMapOneForConsumer,
    state.BookingReducerData.getFinalLocData,
    state.BookingReducerData.getFinalPrice,
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
  ]);
  const [previouslng, setpreviouslng] = useState(language);
  const [bookingPeriod, setBookingPeriod] = useState(
    language == 'it' ? 'Giornaliero' : 'FullDay',
  );
  const [enableHalfDayBook, setEnableHalfDayBook] = useState(false);
  const [seasonalReservation, setSeasonalReservation] = useState(false);
  const [range, setRange] = React.useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [fullInfo, setfullInfo] = useState('');
  const [loading, setloading] = useState(false);
  const [items, setItems] = useState([{row: 1}]);
  const [savecombinedLocation, setsavecombinedLocation] = useState();
  const [storeFinalLocData, setstoreFinalLocDataState] = useState();
  const [addSurcharge, setAddSurcharge] = useState(null);
  const backAction = async () => {
    await AsyncStorage.removeItem('locationSum');
    await AsyncStorage.removeItem('selectedBookedLocation');
    dispatch(setstoreFinalLocData([]));
    navigation.goBack();
  };

  //load Sector data

  const loadSectorData = async () => {
    // setloading(true);
    const postData = {
      propertyId: propertyId,
    };
    const {data, message, status, error} = await postDataToServer(
      `${Api.getSectorList}`,
      postData,
    );
    if (status) {
      const resData = data.data.sectors;
      if (resData && resData.length > 0) {
        resData.map((e, i) => {
          e.title = e.name ? e.name : '';
        });
        dispatch(setRowSectorData(resData ? resData : []));
      } else {
        dispatch(setRowSectorData([]));
      }
    } else {
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
      resData.map((e, i) => {
        e.title =
          e.type === 'additional' ? e.details.name : e.details.PackageName;
      });
      if (type == 'package') {
        //set package data reducer
        dispatch(SetPackageData(getOnlineResPkg ? getOnlineResPkg : []));
      } else {
        //set additional item data reducer
        dispatch(SetAddItemData(getOnlineResPkg ? getOnlineResPkg : []));
      }
      // setloading(false);
    } else {
      dispatch(SetPackageData([]));
      dispatch(SetAddItemData([]));
      // SetPackageData([]);
      // SetAddItemData([]);
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };
  //Call Booked and reserved location API

  const loadBookedLocationList = async image => {
    let startDate = searchDate.startDate;
    let endDate = searchDate.endDate;
    const postData = {
      fromDate: startDate.toISOString(),
      propertyId: propertyId,
      toDate: endDate.toISOString(),
    };
    const {data, message, sucess, error} = await postDataToServer(
      `${Api.locationBooking}`,
      postData,
    );
    if (sucess) {
      await dispatch(SetReservationData(data.data));
      loadViewconfiguration(data.data, image);
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
      // const result = JSON.stringify(data.data.beachMapData);
      const result = data.data.beachMapData;
      console.log('result', result);
      if (result.length > 0) {
        await _concatConfigWithBookedReserved(result, bookingData, image);
      }
    } else {
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };
  const newFilterconfigData = data =>
    newconfigData.find(data => data.rec.some(item => item.name === data));

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
    const checkLocationdata = async (item, mergeData) =>
      newconfigData.reduce((matches, entry, index) => {
        if (entry) {
          const checkLocationValueExist = entry.rec.filter(
            e => e.name === item,
          );
          if (checkLocationValueExist && checkLocationValueExist.length > 0) {
            if (mergeData.isBooked) {
              entry.isBooked = true;
              entry.booking_id = mergeData.booking_id;
              entry.toPay = mergeData.toPay;
              entry.paymentMethod = mergeData.paymentMethod;
              entry.booking_user = mergeData.booking_user;
            }
            if (mergeData.isReserved) {
              entry.isReserved = true;
              entry.reserved_id = mergeData.reserved_id;
              entry.booking_user = mergeData.booking_user;
            }

            const checkUmbrella =
              entry.rec &&
              entry.rec.length > 0 &&
              entry.rec.filter((e, i) => {
                if (
                  e.items &&
                  Object.keys(e.items).length > 0 &&
                  e.items.name === 'Umbrella'
                ) {
                  entry.rec[i].items.bookedItemImg = bookedUmbrellaimage;
                }
                if (
                  e.items &&
                  Object.keys(e.items).length > 0 &&
                  e.items.name === 'SpecialUmbrella1'
                ) {
                  entry.rec[i].items.bookedItemImg = bookedUmbrellaimage;
                }
                if (
                  e.items &&
                  Object.keys(e.items).length > 0 &&
                  e.items.name === 'SpecialUmbrella2'
                ) {
                  entry.rec[i].items.bookedItemImg = bookedUmbrellaimage;
                }
              });
            return entry;
          }
        }
      }, []);

    const newFilterconfigData =
      mergedArray &&
      mergedArray.filter(async merge => {
        const checkValueExist = await checkLocationdata(merge.Location, merge);
      });
    // const newFilterconfigData = newconfigData.filter(data => {
    //   if (data.rec) {
    //     data.rec.filter((recData) => {
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
    //         })
    //     })
    //   }
    // })
    // console.log("newFilterconfigData",newFilterconfigData)

    // newconfigData.forEach(data => {
    //   data.rec &&
    //     data.rec.forEach(async recData => {
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

    // for (var j = 0; j < newFilterconfigData.length; j++) {
    //   for (var k = 0; k < newFilterconfigData[j].rec.length; k++) {
    //     if (
    //       newFilterconfigData[j].rec[k] &&
    //       newFilterconfigData[j].rec[k].items &&
    //       newFilterconfigData[j].rec[k].items.name === 'Umbrella'
    //     ) {
    //       newFilterconfigData[j].rec[k].items.bookedItemImg = bookedUmbrellaimage;
    //     }
    //     if (
    //       newFilterconfigData[j].rec[k] &&
    //       newFilterconfigData[j].rec[k].items &&
    //       newFilterconfigData[j].rec[k].items.name === 'SpecialUmbrella1'
    //     ) {
    //       newFilterconfigData[j].rec[k].items.bookedItemImg = bookedUmbrellaimage;
    //     }
    //     if (
    //       newFilterconfigData[j].rec[k] &&
    //       newFilterconfigData[j].rec[k].items &&
    //       newFilterconfigData[j].rec[k].items.name === 'SpecialUmbrella2'
    //     ) {
    //       newFilterconfigData[j].rec[k].items.bookedItemImg = bookedUmbrellaimage;
    //     }
    //   }
    // }
    const newResData = await _checkBothTrue(newconfigData);
    const getSplitLocations = await setBeachMapDataCusotm(newResData);
    let mapSelectedLocations = [];
    if (
      onlingBookingSetting.onlineBookingOptions &&
      onlingBookingSetting.onlineBookingOptions.locations &&
      onlingBookingSetting.onlineBookingOptions.locations.length > 0
    ) {
      onlingBookingSetting.onlineBookingOptions.locations.map((item, i) => {
        mapSelectedLocations.push(item);
      });
    }
    const getFreeMapData = await returnOnlyFreeDataConsumer(
      getSplitLocations,
      mapSelectedLocations,
    );
    console.log(
      'getFreeMapData',
      getFreeMapData,
      getSplitLocations,
      mapSelectedLocations,
    );
    const getPresentItem = await _checkItemPresent(getSplitLocations);
    dispatch(setAvailableItems(getPresentItem));
    dispatch(setBeachMapMainData(newResData));
    dispatch(setMapOneForConsumer(getFreeMapData));
    setloading(false);
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

  const loadBookedUmbrella = async () => {
    dispatch(setModalBookingPeriod(bookingPeriod));
    if (
      onlingBookingSetting.onlineBookingOptions &&
      onlingBookingSetting.onlineBookingOptions.locationOptionObj &&
      onlingBookingSetting.onlineBookingOptions.locationOptionObj
        .enableHalfDayBook
    ) {
      setEnableHalfDayBook(true);
    } else {
      setEnableHalfDayBook(false);
    }

    let tempSurcharge =
      onlingBookingSetting?.onlineBookingOptions?.locationOptionObj
        ?.addSurcharge;

    console.log('tempSurcharge', tempSurcharge);

    if (tempSurcharge !== null && tempSurcharge > 0) {
      let newSurcharge = _checkIsNumberFloat(tempSurcharge);
      setAddSurcharge(newSurcharge);
      _setLocationSurcharge(newSurcharge);
      _setServiceSurcharge(newSurcharge);
    } else {
      _setLocationSurcharge(null);
      _setServiceSurcharge(null);
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
      await loadBookedLocationList(umbrellaImg);
    } else {
      dispatch(SetReservationData([]));
      // SetReservationData([]);
      let errorMessage = error ? error : message;
      setloading(false);
    }
  };

  const loadAllData = async () => {
    setloading(true);
    if (
      onlingBookingSetting.onlineBookingOptions &&
      onlingBookingSetting.onlineBookingOptions.locationOptionObj &&
      onlingBookingSetting.onlineBookingOptions.locationOptionObj
        .locationOptionObj
    ) {
      setfullInfo(
        onlingBookingSetting.onlineBookingOptions.locationOptionObj.useFulInfo,
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
    dispatch(setstoreFinalLocData([]));
    dispatch(setFinalPrice(0));
    await _getPackageAddItemList('package');
    await _getPackageAddItemList('additional');
    Promise.all([loadSectorData(), loadBookedUmbrella()]).then(
      ([res1, res2, res3]) => {
        // setloading(true);
        return true;
      },
    );
  };
  useEffect(async () => {
    loadAllData();
  }, [navigation]);

  useEffect(() => {
    console.log('slkds', previouslng);
    setBookingPeriod(language == 'it' ? 'Giornaliero' : 'FullDay');
  }, [language]);

  // const loadAllData = async () => {
  //   setloading(true);
  //   dispatch(setstoreFinalLocData([]));
  //   if (
  //     onlingBookingSetting &&
  //     onlingBookingSetting.onlineBookingOptions &&
  //     onlingBookingSetting.onlineBookingOptions.locationOptionObj &&
  //     onlingBookingSetting.onlineBookingOptions.locationOptionObj
  //       .enableHalfDayBook
  //   ) {
  //     setEnableHalfDayBook(true);
  //   } else {
  //     setEnableHalfDayBook(false);
  //   }
  //   await loadBookedLocationList();
  //   await _getPackageAddItemList('package');
  //   await _getPackageAddItemList('additional');
  //   await loadSectorData();
  // };

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     loadAllData();
  //   });
  //   return () => {
  //     unsubscribe;
  //   };
  // }, [navigation]);

  const saveBookingValue = async (
    savecombinedLocationObjectState,
    FinalData,
    totalSum,
  ) => {
    if (savecombinedLocationObjectState) {
      setsavecombinedLocation(savecombinedLocationObjectState);
    }
    if (FinalData) {
      setstoreFinalLocDataState(FinalData);
    }
    if (totalSum) {
      await dispatch(setSubTotalValue(totalSum));
    }
  };

  const onBookNowClick = async () => {
    setloading(true);
    await dispatch(setBookingType('tabular'));
    await dispatch(setBookFor('location'));
    await dispatch(setShowBooking(true));
    await dispatch(setsavecombinedLocationObject(savecombinedLocation));
    await dispatch(setstoreFinalLocData(storeFinalLocData));
    await dispatch(setSubTotalValue(getFinalPrice));

    if (userProfile && userProfile.id) {
      navigation.navigate('FinishBooking');
    } else {
      navigation.navigate('AddPersonalInfo');
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <TabularBookingChildren
          sectorData={getRowSectorData}
          key={index}
          packageData={packageData}
          addItemData={addItemData}
          seasonalCheckbox={seasonalCheckbox}
          addSurcharge={addSurcharge}
          onSaveBookingValue={async (
            savecombinedLocationObjectState,
            checkFinalData,
            totalSum,
          ) => {
            saveBookingValue(
              savecombinedLocationObjectState,
              checkFinalData,
              totalSum,
            );
          }}
        />
      </>
    );
  };

  const AddAnotherReservation = async () => {
    items.push({row: items.length + 1});
    setItems([...items]);
  };
  const handleChange = index => {
    console.log('index', index.row);
    const data = enableHalfDayBook
      ? language == 'it'
        ? HalfDayITBookOption
        : HalfDayBookOption
      : language == 'it'
      ? bookingItOption
      : bookingOption;
    console.log(data);
    const selectIndex = data[index.row];
    const bookingPeriodName =
      language == 'it' ? selectIndex.title : selectIndex.title;
    console.log(bookingPeriodName);
    setBookingPeriod(bookingPeriodName);
    dispatch(setModalBookingPeriod(bookingPeriodName));
  };
  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <SecondaryHeader
        customNaviagtion
        NaviagtionAction={() => backAction()}
        title={strings('book')}
      />
      {loading ? (
        <View style={styles.center}>
          <Loader color="#253C7E" visible={loading} />
        </View>
      ) : (
        <>
          <ScrollView bounces={false}>
            <Layout level="1" style={[styles.container, styles.boxStyle]}>
              <View style={{marginHorizontal: themeConfig.margin - 2}}>
                <PropertyCard
                  name={selectedProperty.bathouseName}
                  address={selectedProperty.address}
                  imageUrl={selectedProperty.mainPhoto}
                  showButton
                  showImage
                />

                <Availability
                  range={searchDate}
                  // seasonalReservation={seasonalReservation}
                  bookingPeriod={bookingPeriod}
                  seasonalCheckbox={seasonalCheckbox}
                  seasonalReservation={
                    onlingBookingSetting &&
                    onlingBookingSetting.onlineBookingOptions &&
                    onlingBookingSetting.onlineBookingOptions.locationOptionObj
                      .seasonalReservation
                  }
                  disable={true}
                  bookingOption={
                    enableHalfDayBook
                      ? language == 'it'
                        ? HalfDayITBookOption
                        : HalfDayBookOption
                      : language == 'it'
                      ? bookingItOption
                      : bookingOption
                  }
                  onDateSelect={nextRange => {
                    setRange(nextRange);
                    dispatch(setUserSearchDate(nextRange));
                  }}
                  handleChange={selectedValueindex =>
                    handleChange(selectedValueindex)
                  }
                  locale={language}
                  handleCheckbox={() => setSeasonalCheckbox(!seasonalCheckbox)}
                />
                {!loading && items && items.length > 0 && (
                  <FlatList
                    data={items}
                    renderItem={renderItem}
                    removeClippedSubviews
                    initialNumToRender={1}
                    maxToRenderPerBatch={12}
                  />
                )}
                {/* <ButtonComponent
                  size="medium"
                  onPress={() => AddAnotherReservation()}>
                  <Typography
                    status="control"
                    category="h6"
                    style={{fontWeight: '400'}}>
                    {strings('add_another_seat')}
                  </Typography>
                </ButtonComponent> */}
                {fullInfo ? (
                  <View style={{margin: themeConfig.margin - 2}}>
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
              </View>
            </Layout>
          </ScrollView>
          <Layout>
            <View
              style={[
                styles.boxStyle,
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
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
                    {getFinalPrice ? getFinalPrice : 0} €
                  </Typography>
                </View>

                <View style={{flex: 3}}>
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
              {/*
              <View
                style={[
                  styles.boxStyle,
                  {flexDirection: 'row', alignItems: 'center'},
                ]}>
                <Typography
                  category="h6"
                  status="basic"
                  style={{
                    marginHorizontal: themeConfig.margin * 2,
                    fontWeight: '600',
                    fontSize: 16,
                  }}>
                  {strings('total')}
                </Typography>
                <Typography
                  category="s1"
                  style={{
                    fontSize: 16,
                  }}>
                  {getFinalPrice ? getFinalPrice : 0} €
                </Typography>
                <View style={{flex: 1}}>
                  <DropShadow
                    style={{
                      shadowColor: '#0f379fb5',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 6,
                      shadowRadius: 2,
                    }}>
                    <ButtonComponent
                      size="medium"
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
              </View> */}
            </View>
          </Layout>
        </>
      )}
    </Layout>
  );
};
export default React.memo(TabularBookingScreen);

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: themeConfig.radius,
    height: themeConfig.radius,
    borderRadius: themeConfig.radius,
    backgroundColor: themeConfig.colors.black,
    marginRight: themeConfig.margin + 4,
  },
  leftSection: {
    // flex: 1,
    width: 100,
  },
  rightSection: {
    flex: 1,
  },
  layoutContainer: {
    backgroundColor: themeConfig.colors.lightBule,
    padding: themeConfig.padding * 2,
    marginTop: themeConfig.margin,
  },
  checkboxContainer: {
    marginHorizontal: themeConfig.margin,
    flexDirection: 'row',
    margin: themeConfig.margin,
  },
  checkboxText: {
    fontWeight: '500',
    color: themeConfig.colors.primary,
    marginHorizontal: themeConfig.margin * 2,
  },
  icon: {
    height: 20,
    width: 20,
  },
});
