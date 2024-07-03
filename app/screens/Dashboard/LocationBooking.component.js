import React, {useEffect, useState, useRef} from 'react';
import {Divider, IndexPath, Layout, Modal} from '@ui-kitten/components';
import {StyleSheet, View, FlatList} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import {strings} from 'i18n/i18n';
import Loader from 'components/Loader';
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import SummaryComponent from './Summary.component';
import {getPackagePriceCalc} from 'resources/BookingCalcService';
import BookFinalComponent from './BookingFinal.component';
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
} from 'app/redux/actions/bookingActions';
import {SetAddItemData} from 'app/redux/actions/beachMapActions';
import {setBookFor, setShowBooking} from 'app/redux/actions/globalActions';
import {setMultipleGridForReservation} from 'app/redux/actions/locationActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LocationBooking = ({navigation, visible}) => {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [maxCount, setMaxCount] = useState(0);
  const [additionalItems, setadditionalItems] = useState([]);
  const [selectedPackage, setselectedPackage] = useState('');
  const [selectedPackageName, setselectedPackageName] = useState('');
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [returnCurrPrice, setReturnCurrPrice] = useState(0);
  const [PackageID, setPackageID] = useState('');
  const [error, seterror] = useState('');
  const [displayValue, setDisplayValue] = useState();
  const [loading, setloading] = useState(false);
  const [allPackageData, setallPackageData] = useState(false);
  const [storePrice, setstorePrice] = useState();
  const [combinedLocation, setcombinedLocation] = useState([]);
  const [additionalList, setadditionalList] = useState([]);
  const [getStoredLoctionData, setStoredLocationData] = useState([]);
  const [items, setItems] = useState([{row: 1}]);
  const [locationName, setLocationName] = useState();
  const [activeIndex, setActiveIndex] = useState();
  const [changeLaneg, setchangeLaneg] = React.useState(false);
  const [selectedBookedLocationData, setSelectedBookedLocationData] =
    useState();
  const [selectedBookedLocationDataState, setSelectedBookedLocationDataState] =
    useState();
  const [
    savecombinedLocationObjectState,
    setsetsavecombinedLocationObjectState,
  ] = useState();
  const [storeFinalLocData, setstoreFinalLocDataState] = useState([]);
  const [AvailableItemsLocation, setAvailableItemsLocation] = useState();
  const [selectedLocation, setselectedLocation] = useState();
  const [selectedLocationData, setselectedLocationData] = useState();
  const [summaryData, setSummaryData] = useState([]);
  const [totalSum, SetTotal] = useState();
  const [finalLoading, setFinalLoading] = useState(false);
  const toast = useRef('');
  const [
    // selectedLocation,
    // selectedLocationData,
    selectedRowCol,
    packageData,
    addItemData,
    peopleCount,
    searchDate,
    seasonalPeriods,
    availableItems,
    language,
    propertyId,
    beachMapData,
    setAvailableLocation,
    getStoredLocData,
    getCombinedLocationObject,
    getFinalLocData,
    getAllLocationSum,
    getBookingData,
    tempAvailbleData,
    selectedBookedLocation,
    getFinalPrice,
    userProfile,
    dynamicIns,
  ] = useSelector(state => [
    state.BeachMapReducerData.selectedRowCol,
    state.BeachMapReducerData.packageData,
    state.BeachMapReducerData.addItemData,
    state.BookingReducerData.peopleCount,
    state.globalReducerData.searchDate,
    state.BeachMapReducerData.seasonalPeriods,
    state.BeachMapReducerData.availableItems,
    state.globalReducerData.language,
    state.globalReducerData.propertyId,
    state.BeachMapReducerData.beachMapData,
    state.BookingReducerData.setAvailableLocation,
    state.BookingReducerData.getStoredLocData,
    state.BookingReducerData.getCombinedLocationObject,
    state.BookingReducerData.getFinalLocData,
    state.BookingReducerData.getAllLocationSum,
    state.BookingReducerData.getBookingData,
    state.BookingReducerData.tempAvailbleData,
    state.locationReducer.selectedBookedLocation,
    state.BookingReducerData.getFinalPrice,
    state.UserReducerData.userProfile,
    state.globalReducerData.dynamicIns,
  ]);

  let itemPrice = 0;

  const loadPackageData = async () => {
    setloading(true);
    const bookLocationData = await AsyncStorage.getItem('bookLocationData');
    const getlocationData = JSON.parse(bookLocationData);
    const getPreviousSumData = await AsyncStorage.getItem('locationSum');
    const getPreviousSumValue = JSON.parse(getPreviousSumData);
    let locationData = getlocationData.selectedBookedLocation;

    SetTotal(getPreviousSumValue ? getPreviousSumValue : 0);
    setselectedLocationData(getlocationData.locationData);
    setselectedLocation(getlocationData.locationName);

    packageData &&
      packageData.length > 0 &&
      packageData.map(element => {
        if (element && element.details && element.details.PackageName) {
          element.title = element.details.PackageName
            ? element.details.PackageName
            : '';
        }
      });
    setallPackageData(packageData);
    setDisplayValue(allPackageData[selectedIndex.row]);
    let tempArray = [];
    addItemData &&
      addItemData.map(usr => {
        let addItemda = {
          name: usr.details.name,
          it: usr.details.it,
          value: 0,
          price: 0,
          detailPrices: usr.detailPrices,
          createdAt: usr.createdAt,
          createdBy: usr.createdBy,
          details: usr.details,
          id: usr.id,
          mainPrices: usr.mainPrices,
          monthlySetting: usr.monthlySetting,
          priceCalculation: usr.priceCalculation,
          propertyId: usr.propertyId,
          type: usr.type,
          updatedAt: usr.updatedAt,
          weekendSetting: usr.weekendSetting,
        };
        tempArray.push(addItemda);
      });
    setadditionalItems(
      addItemData && addItemData.length > 0
        ? addItemData.map(usr => ({
            name: usr.details.name,
            it: usr.details.it,
            value: 0,
            price: 0,
          }))
        : [],
    );

    // locationData &&
    //   locationData.map(e => {
    //       e.additem = tempArray;
    //   });

    locationData &&
      locationData.map(e => {
        if (e && e.additem && e.additem.length > 0) {
          e.additem = e.additem;
        } else {
          e.additem = tempArray;
        }
      });

    setSelectedBookedLocationDataState(locationData);

    setSummaryData(getFinalLocData);

    // let checkFinalData =  [...getFinalLocData,...storeFinalLocData]
    // setSummaryData(checkFinalData)

    // dispatch(setMultipleGridForReservation(selectedBookedLocation));

    // setMultipleGridForReservation(selectedBookedLocation);

    setloading(false);
  };

  const updateAdditionalItem = async locData => {
    let locationName = locData.name;
    const newState = await additionalItems.map(obj =>
      obj.location === locationName ? {...obj, value: 0} : obj,
    );
    setadditionalItems(newState);
    getAdditionalItems(additionalItems, locationName);
  };

  useEffect(async () => {
    setloading(true);
    const bookLocationData = await AsyncStorage.getItem('bookLocationData');
    const getlocationData = JSON.parse(bookLocationData);
    const getPreviousSumData = await AsyncStorage.getItem('locationSum');
    const getPreviousSumValue = JSON.parse(getPreviousSumData);
    let locationData = getlocationData.selectedBookedLocation;

    SetTotal(getPreviousSumValue ? getPreviousSumValue : 0);
    setselectedLocationData(getlocationData.locationData);
    setselectedLocation(getlocationData.locationName);

    packageData &&
      packageData.length > 0 &&
      packageData.map(element => {
        if (element && element.details && element.details.PackageName) {
          element.title = element.details.PackageName
            ? element.details.PackageName
            : '';
        }
      });
    setallPackageData(packageData);
    setDisplayValue(allPackageData[selectedIndex.row]);
    let tempArray = [];
    addItemData &&
      addItemData.map(usr => {
        let addItemda = {
          name: usr.details.name,
          it: usr.details.it,
          value: 0,
          price: 0,
          detailPrices: usr.detailPrices,
          createdAt: usr.createdAt,
          createdBy: usr.createdBy,
          details: usr.details,
          id: usr.id,
          mainPrices: usr.mainPrices,
          monthlySetting: usr.monthlySetting,
          priceCalculation: usr.priceCalculation,
          propertyId: usr.propertyId,
          type: usr.type,
          updatedAt: usr.updatedAt,
          weekendSetting: usr.weekendSetting,
        };
        tempArray.push(addItemda);
      });
    setadditionalItems(
      addItemData && addItemData.length > 0
        ? addItemData.map(usr => ({
            name: usr.details.name,
            it: usr.details.it,
            value: 0,
            price: 0,
          }))
        : [],
    );

    // locationData &&
    //   locationData.map(e => {
    //       e.additem = tempArray;
    //   });

    locationData &&
      locationData.map(e => {
        if (e && e.additem && e.additem.length > 0) {
          e.additem = e.additem;
        } else {
          e.additem = tempArray;
        }
      });

    setSelectedBookedLocationDataState(locationData);

    setSummaryData(getFinalLocData);

    // let checkFinalData =  [...getFinalLocData,...storeFinalLocData]
    // setSummaryData(checkFinalData)

    // dispatch(setMultipleGridForReservation(selectedBookedLocation));

    // setMultipleGridForReservation(selectedBookedLocation);

    setloading(false);
  }, [visible]);

  //   const handleChange = async (index, i, locData) => {
  //     setSelectedIndex(index);
  //     setActiveIndex(i);
  //     setDisplayValue(allPackageData[index.row]);
  //     setselectedPackageName(allPackageData[index.row].title);
  //     setSelectedBookedLocationData(locData);
  //     let setValue = allPackageData[index.row].id;

  //     if (PackageID !== setValue) {
  //       updateAdditionalItem(locData);
  //     }

  //     if (setValue !== '') {
  //       setloading(true);
  //       const PackageData = packageData ? packageData : [];
  //       const AddItemData = addItemData ? addItemData : [];
  //       let getObj = PackageData.find(o => o.id === parseInt(setValue));

  //       let forPeopleCount =
  //         getObj.details && getObj.details.MaxPeopleCount
  //           ? getObj.details.MaxPeopleCount
  //           : null;

  //       let count =
  //         getObj.details && getObj.details.AdditionalItem
  //           ? getObj.details.AdditionalItem
  //           : 0;

  //       let getSelectedName =
  //         getObj.details && getObj.details.PackageName
  //           ? getObj.details.PackageName
  //           : '';

  //       // dispatch(setPeopleCount(forPeopleCount));

  //       // setPeopleCount(forPeopleCount);

  //       setMaxCount(parseInt(count));

  //       setselectedPackage(getSelectedName);

  //       setPackageID(allPackageData[index.row].id);

  //       selectedBookedLocationDataState[i].displayName = getSelectedName;
  //       selectedBookedLocationDataState[i].forPeopleCount = forPeopleCount;

  //       setSelectedBookedLocationDataState(selectedBookedLocationDataState);

  //       // dispatch(setMultipleGridForReservation(selectedBookedLocation));

  //       // setMultipleGridForReservation(selectedBookedLocation);

  //       await _setLocationByItem(getObj, locData);
  //     } else {
  //       dispatch(setPeopleCount(0));
  //       // setPeopleCount(0);
  //       setReturnCurrPrice(0);
  //     }
  //   };

  const compareAvilableData = (name, booked) => {
    var result = booked.some(data => {
      return name === data.name;
    });
    if (getBookingData && getBookingData.booking_locations) {
      let arr = getBookingData.booking_locations.map(itm => itm.Location);
      if (arr.includes(name)) {
        result = false;
      }
    }
    return result;
  };

  const _setLocationByItem = async (getObj, locData) => {
    await _setPricesForSelectedPackage(getObj);
    const bookedData = await getBookedLocation();
    const getPackagesPositionPrice = await _getPackagePricesByPosition(getObj);
    const getPackageName = await _getPackageInfo(getObj);

    const getItemNameCountOfPackage = await _getItemNameCountOfPackage(getObj);
    const getCurrentSelectedLocation = await _getCurrentSelectedLocation(
      selectedLocationData,
    );

    const DateDetails = searchDate;

    const postData = {
      propertyId: propertyId,
      startDate: DateDetails.startDate,
      endDate: DateDetails.endDate,
    };

    if (
      setAvailableLocation === undefined ||
      setAvailableLocation.length === 0
    ) {
      const {data, message, status, error} = await postDataToServer(
        `${Api.locationAvailability}`,
        postData,
      );
      if (status) {
        const resData = data.data ? data.data : [];
        const UmbrellaData = resData.Umbrella ? resData.Umbrella : [];
        const CabinData = resData.Cabin ? resData.Cabin : [];
        const ParkingData = resData.Parking ? resData.Parking : [];
        const TentData = resData.Tent ? resData.Tent : [];
        const SunbedData = resData.Sunbed ? resData.Sunbed : [];

        const Umbrella = await UmbrellaData.map(v => ({
          ...v,
          isUsed: false,
          isBooked: compareAvilableData(v.name, bookedData),
        }));
        const Cabin = await CabinData.map(v => ({
          ...v,
          isUsed: false,
          isBooked: compareAvilableData(v.name, bookedData),
        }));
        const Parking = await ParkingData.map(v => ({
          ...v,
          isUsed: false,
          isBooked: compareAvilableData(v.name, bookedData),
        }));
        const Tent = await TentData.map(v => ({
          ...v,
          isUsed: false,
          isBooked: compareAvilableData(v.name, bookedData),
        }));
        const Sunbed = await SunbedData.map(v => ({
          ...v,
          isUsed: false,
          isBooked: compareAvilableData(v.name, bookedData),
        }));

        const dataPush = {
          Umbrella: Umbrella,
          Cabin: Cabin,
          Parking: Parking,
          Tent: Tent,
          Sunbed: Sunbed,
        };
        await dispatch(setItemsAvailabilityForPackage(dataPush));

        // await    setItemsAvailabilityForPackage(dataPush);

        await _setLocationDataFunction(
          getPackagesPositionPrice,
          getItemNameCountOfPackage,
          getCurrentSelectedLocation,
          getPackageName,
          'package',
          '',
          dataPush,
          locData,
        );

        setloading(false);
      } else {
        let errorMessage = error ? error : message;
        setloading(false);
      }
    } else {
      await _setLocationDataFunction(
        getPackagesPositionPrice,
        getItemNameCountOfPackage,
        getCurrentSelectedLocation,
        getPackageName,
        'package',
        '',
        setAvailableLocation,
        locData,
      );
    }
  };

  const getAdditionalItemPrice = async (getObj, e) => {
    let finalPrice;
    const currentRow = e ? e.currentRow : '';
    const HomePageDates = searchDate;
    const getSeasonalPeriods = seasonalPeriods;

    finalPrice = await getPackagePriceCalc(
      currentRow,
      getObj,
      HomePageDates,
      getSeasonalPeriods,
    );
    return finalPrice;
  };

  const _setPricesForSelectedPackage = async getObj => {
    let finalPrice;
    const currentRow = selectedLocationData
      ? selectedLocationData.currentRow
      : '';
    const HomePageDates = searchDate;
    const getSeasonalPeriods = seasonalPeriods;

    finalPrice = await getPackagePriceCalc(
      currentRow,
      getObj,
      HomePageDates,
      getSeasonalPeriods,
    );

    itemPrice = finalPrice;

    // await dispatch(setFinalPrice(finalPrice));

    // await setFinalPrice(finalPrice);

    await setstorePrice(finalPrice);
  };

  const updateReducer = async data => {
    var getIndex = combinedLocation.findIndex(
      obj => obj.location === data.location,
    );
    if (getIndex > -1) {
      combinedLocation[getIndex] = data;
      await setcombinedLocation(combinedLocation);
    } else {
      var joined = this.state.combinedLocation.concat(data);
      await setcombinedLocation(joined);
    }
    await dispatch(setAdditionalLocationData(combinedLocation));

    // setAdditionalLocationData(combinedLocation);
  };

  const removeFromReducer = async name => {
    const selectedObj = selectedLocationData.name;

    var idx = getStoredLoctionData[selectedObj].findIndex(
      p => p.item === name && p.type === 'additional',
    );
    var removed = getStoredLoctionData[selectedObj].splice(idx, 1);

    const getModifiedPkgData = await _setCustomLocData(
      getStoredLoctionData,
      storePrice,
      name,
    );

    const splitLocationSeparate = await _splitLocationSeparate(
      getModifiedPkgData,
    );

    setsetsavecombinedLocationObjectState(splitLocationSeparate);
    setstoreFinalLocDataState(getModifiedPkgData);
    await _calcSumOfAllLocation(getModifiedPkgData);
    setStoredLocationData(getStoredLoctionData);

    // await dispatch(setsavecombinedLocationObject(splitLocationSeparate));

    // await setsavecombinedLocationObject(splitLocationSeparate);

    // await _calcSumOfAllLocation(getModifiedPkgData);

    // await dispatch(setstoreFinalLocData(getModifiedPkgData));

    // await dispatch(setstoreSelectedLocData(getStoredLocData));

    // await setstoreFinalLocData(getModifiedPkgData);

    // await setstoreSelectedLocData(getStoredLocData);

    let checkName = removed[0].location;
    let type = removed[0].item;
    var getIndex =
      setAvailableLocation[type] &&
      setAvailableLocation[type].findIndex(obj => obj.name === checkName);
    if (
      getIndex &&
      setAvailableLocation[type] &&
      setAvailableLocation[type][getIndex]
    ) {
      setAvailableLocation[type][getIndex].isUsed = false;
    }
    let checkFinalData = getFinalLocData.concat(getModifiedPkgData);
    setSummaryData(checkFinalData);

    // let checkFinalData =  [...getStoredLoctionData,...getFinalLocData]
    // setSummaryData(checkFinalData)
  };

  const getBookedLocation = () => {
    var temp = [];
    beachMapData.map(data =>
      data.rec.map(record => (record.isBooked ? temp.push(record) : null)),
    );
    return temp;
  };

  const _calcSumOfAllLocation = async data => {
    let locationPrice = 0;
    let additionalItemsTotal = 0;
    (await data) &&
      data.length > 0 &&
      data.map(item => (locationPrice += item.PackageItemPrice));

    // await  setAllLocationSum(locationPrice);

    // await dispatch(setAllLocationSum(locationPrice));

    selectedBookedLocationDataState &&
      selectedBookedLocationDataState.length > 0 &&
      selectedBookedLocationDataState.forEach(data => {
        data &&
          data.additem.map((e, i) => {
            var td = parseFloat(e.price) * parseFloat(e.value);
            additionalItemsTotal =
              parseFloat(additionalItemsTotal) + parseFloat(td);
          });
      });

    let subTotalValue = locationPrice;

    let TotalValue = '';

    const getPreviousSumData = await AsyncStorage.getItem('locationSum');
    const getPreviousSumValue = JSON.parse(getPreviousSumData);

    if (getPreviousSumValue) {
      TotalValue =
        getPreviousSumValue + locationPrice + parseFloat(additionalItemsTotal);
    } else {
      TotalValue = locationPrice + parseFloat(additionalItemsTotal);
    }
    setSubTotal(subTotalValue);
    SetTotal(TotalValue);

    // await dispatch(setSubTotalValue(subTotalValue));

    // setSubTotalValue(subTotalValue)
  };

  const getValuePrice = (name, type, index) => {
    if (type == 'value') {
      var getIndex = selectedBookedLocationDataState[index].additem.findIndex(
        obj => obj.name === name,
      );
      let value =
        selectedBookedLocationDataState[index].additem[getIndex].value;
      return value;
    } else {
      var getIndex = selectedBookedLocationDataState[index].additem.findIndex(
        obj => obj.name === name,
      );
      let value =
        selectedBookedLocationDataState[index].additem[getIndex].price;
      return value;
    }
  };

  const getAdditionalItems = async (additionalItems, locationName) => {
    const removeOld =
      addItemData && addItemData.length > 0
        ? addItemData.filter(data => data.location !== locationName)
        : [];
    additionalItems.forEach(element => {
      element.location = locationName;
    });
    const temp = removeOld.concat(additionalItems);
    // SetAddItemData(temp);
    await dispatch(setAdditionalItemsList(temp));

    // setAdditionalItemsList(temp);
  };

  const AddAnotherReservation = async () => {
    const locationString = await AsyncStorage.setItem(
      'locationSum',
      JSON.stringify(totalSum),
    );
    const selectedLocationString = await AsyncStorage.setItem(
      'selectedBookedLocation',
      JSON.stringify(selectedBookedLocationDataState),
    );
    dispatch(setstoreFinalLocData(storeFinalLocData));
    navigation.navigate('BookNow');
  };

  const updateCounter = async (type, action, data, sel, index, e) => {
    // const { PackageID, maxCount, additionalItems, total } = this.state;

    // const { globalReducerData, availableItem, locData, viewMode } = this.props;
    let locationName = selectedLocationData.name;

    const AddItemData = addItemData;
    let availableItemsArray = [];
    availableItemsArray.push(tempAvailbleData);
    const check = tempAvailbleData.filter(e => e !== 'Sunbed');
    let tempArray = [];
    let macthTempArray = [];

    addItemData &&
      addItemData.map(usr => {
        let addItemda = {
          name: usr.details.name,
          it: usr.details.it,
          value: 0,
          price: 0,
          detailPrices: usr.detailPrices,
          createdAt: usr.createdAt,
          createdBy: usr.createdBy,
          details: usr.details,
          id: usr.id,
          mainPrices: usr.mainPrices,
          monthlySetting: usr.monthlySetting,
          priceCalculation: usr.priceCalculation,
          propertyId: usr.propertyId,
          type: usr.type,
          updatedAt: usr.updatedAt,
          weekendSetting: usr.weekendSetting,
        };
        tempArray.push(addItemda);
      });

    if (PackageID !== '' && activeIndex == index) {
      if (maxCount > total || action === 0) {
        var getIndex = selectedBookedLocationDataState[index].additem.findIndex(
          obj => obj.name === type,
        );

        let value =
          selectedBookedLocationDataState[index].additem[getIndex].value;

        if (getIndex === -1) {
          var tempObj = {
            name: type,
            it: data.details.it,
            price: await getAdditionalItemPrice(data, e),
            value: action === 0 ? 0 : 1,
          };
          var joined = additionalItems.concat(tempObj);
          setadditionalItems(joined);
          setTotal(1);
        } else {
          if (action === 0) {
            if (
              selectedBookedLocationDataState[index].additem[getIndex].value !==
              0
            ) {
              let priceCal = await getAdditionalItemPrice(data, e);
              // selectedBookedLocation[index].additem[getIndex].value =
              //   selectedBookedLocation[index].additem[getIndex].value - 1;
              // selectedBookedLocation[index].additem[getIndex].price = priceCal;
              addItemData &&
                addItemData.map(usr => {
                  let addItemda = {
                    name: usr.details.name,
                    it: usr.details.it,
                    value:
                      usr.details.name === type
                        ? selectedBookedLocationDataState[index].additem[
                            getIndex
                          ].value - 1
                        : getValuePrice(usr.details.name, 'value', index),
                    price:
                      usr.details.name === type
                        ? priceCal
                        : getValuePrice(usr.details.name, 'price', index),
                    detailPrices: usr.detailPrices,
                    createdAt: usr.createdAt,
                    createdBy: usr.createdBy,
                    details: usr.details,
                    id: usr.id,
                    mainPrices: usr.mainPrices,
                    monthlySetting: usr.monthlySetting,
                    priceCalculation: usr.priceCalculation,
                    propertyId: usr.propertyId,
                    type: usr.type,
                    updatedAt: usr.updatedAt,
                    weekendSetting: usr.weekendSetting,
                  };
                  macthTempArray.push(addItemda);
                });

              selectedBookedLocationDataState.forEach((element, i) => {
                if (element.id == e.id) {
                  e.additem = macthTempArray;
                } else {
                  e.additem = tempArray;
                }
              });
              setsetsavecombinedLocationObjectState(
                selectedBookedLocationDataState,
              );
              // dispatch(setMultipleGridForReservation(selectedBookedLocation));

              // setMultipleGridForReservation(selectedBookedLocation);
              setadditionalItems(additionalItems);
              setTotal(total - 1);
              removeFromReducer(type);
            } else {
              selectedBookedLocationDataState.forEach((element, i) => {
                e.additem = tempArray;
              });
              setsetsavecombinedLocationObjectState(
                selectedBookedLocationDataState,
              );
              // selectedBookedLocation[index].additem[getIndex].value = 0;
              // await dispatch(
              //   setMultipleGridForReservation(selectedBookedLocation),
              // );
              // setMultipleGridForReservation(selectedBookedLocation);
              setadditionalItems(additionalItems);
            }
          } else {
            let priceCal = await getAdditionalItemPrice(data, e);

            // selectedBookedLocationDataState[index].additem[getIndex].value =  selectedBookedLocationDataState[index].additem[getIndex].value  + 1;
            // selectedBookedLocationDataState[index].additem[getIndex].price =  priceCal;

            addItemData &&
              addItemData.map(usr => {
                let addItemda = {
                  name: usr.details.name,
                  it: usr.details.it,
                  value:
                    usr.details.name === type
                      ? selectedBookedLocationDataState[index].additem[getIndex]
                          .value + 1
                      : getValuePrice(usr.details.name, 'value', index),
                  price:
                    usr.details.name === type
                      ? priceCal
                      : getValuePrice(usr.details.name, 'price', index),
                  detailPrices: usr.detailPrices,
                  createdAt: usr.createdAt,
                  createdBy: usr.createdBy,
                  details: usr.details,
                  id: usr.id,
                  mainPrices: usr.mainPrices,
                  monthlySetting: usr.monthlySetting,
                  priceCalculation: usr.priceCalculation,
                  propertyId: usr.propertyId,
                  type: usr.type,
                  updatedAt: usr.updatedAt,
                  weekendSetting: usr.weekendSetting,
                };
                macthTempArray.push(addItemda);
              });
            selectedBookedLocationDataState.forEach((element, i) => {
              if (element.id == e.id) {
                e.additem = macthTempArray;
              } else {
                e.additem = tempArray;
              }
            });

            setsetsavecombinedLocationObjectState(
              selectedBookedLocationDataState,
            );

            setadditionalItems(additionalItems);
            setTotal(total + 1);
            check.includes(type) &&
              (await _setLocationByAddItemName(data, 1, 1, e));
            !check.includes(type) &&
              (await _setLocationByAddItemName(data, 1, 0, e));
          }
        }
      }

      // check.includes(type) && setReducerForAdditional();

      // getAdditionalItems(additionalItems, locationName);
    } else {
      seterror('Please select package');
      toast.current.show('Please select package');
    }
  };

  const setReducerForAdditional = () => {
    const reducerArr = {
      location: selectedLocationData.name,
      packageID: PackageID,
      packageName: selectedPackage,
      data: addItemData,
    };
    updateReducer(reducerArr);
  };

  const _setLocationByAddItemName = async (
    getObj,
    value,
    isAddOther,
    locData,
  ) => {
    await _setPricesForSelectedPackage(getObj);

    const getPackagesPositionPrice = await _getPackagePricesByPosition(getObj);
    const getPackageName = await _getPackageInfoAdditional(getObj);
    const getItemNameCountOfPackage =
      await _getItemNameCountOfPackageAdditional(getObj, value);
    const getCurrentSelectedLocation = await _getCurrentSelectedLocation(
      selectedLocationData,
    );

    await _setLocationDataFunction(
      getPackagesPositionPrice,
      getItemNameCountOfPackage,
      getCurrentSelectedLocation,
      selectedPackage,
      'additional',
      isAddOther,
      setAvailableLocation,
      locData,
    );
  };

  const _setLocationDataFunction = async (
    getPackagesPositionPrice,
    getItemNameCountOfPackage,
    getCurrentSelectedLocation,
    getPackageName,
    from,
    isAddOther,
    availableLocationItem,
    locData,
  ) => {
    // const { globalReducerData, locData } = this.props;
    const selectedType = getPackageName;

    const getStoredUserLocData = getStoredLoctionData
      ? getStoredLoctionData
      : [];
    const selectedItemName = getCurrentSelectedLocation.item;
    const selectedItemLocation = getCurrentSelectedLocation.location;
    const selectedItemPosition = getCurrentSelectedLocation.position;

    if (from === 'package') {
      const renderMatchedLocationObj = getStoredUserLocData[locData.name];
      if (
        renderMatchedLocationObj === undefined ||
        renderMatchedLocationObj.length === 0
      ) {
      } else {
        await _freePrevSelPackage(
          renderMatchedLocationObj,
          availableLocationItem,
        );
      }

      getStoredUserLocData[selectedItemLocation] = [];

      const NewItemCountOfPackage = getItemNameCountOfPackage.filter(
        (val, i) => {
          if (
            selectedItemName === 'Sunbed' &&
            getItemNameCountOfPackage[i].item === 'Sunbed'
          ) {
          } else if (
            (selectedItemName !== 'Sunbed' &&
              getItemNameCountOfPackage[i].item === 'Sunbed') ||
            (selectedItemName !== 'sunbed' &&
              getItemNameCountOfPackage[i].item === 'Sunbed') ||
            (selectedItemName !== 'sun beds' &&
              getItemNameCountOfPackage[i].item === 'Sunbed')
          ) {
            getItemNameCountOfPackage.splice(i, 1);
          }
        },
      );
      getItemNameCountOfPackage &&
        getItemNameCountOfPackage.map((e, i) => {
          let item = getItemNameCountOfPackage[i].item;
          let quantity = getItemNameCountOfPackage[i].quantity;
          let counter = 1;
          if (item === selectedItemName) {
            quantity = quantity - 1;
          }

          let resTemp = availableLocationItem[item];

          if (resTemp) {
            for (let j = 0; j < resTemp.length; j++) {
              let getPrice = '';
              let dataObj = {};
              let allResData = resTemp[j];
              if (allResData.name === selectedItemLocation) {
                if (
                  allResData.isUsed === false &&
                  allResData.isBooked === false
                ) {
                  // getPrice = await getPriceFunction(allResData.currentRow, getPackagesPositionPrice);
                  getPrice = itemPrice ? itemPrice : 0;

                  allResData.isUsed = true;
                  dataObj.location = allResData.name;
                  dataObj.item = item;
                  dataObj.type = 'package';
                  dataObj.price = getPrice ? getPrice : 0;
                  dataObj.data = allResData;
                  dataObj.packageName = getPackageName;

                  // getStoredLocData[selectedItemLocation][getPackageName].push(dataObj);
                  getStoredUserLocData[selectedItemLocation].push(dataObj);
                } else {
                  quantity = quantity + 1;
                }
              } else {
                if (
                  allResData.isUsed === false &&
                  allResData.isBooked === false &&
                  counter <= quantity
                ) {
                  // getPrice = await getPriceFunction(allResData.currentRow, getPackagesPositionPrice);
                  getPrice = itemPrice ? itemPrice : 0;
                  allResData.isUsed = true;
                  dataObj.location = allResData.name;
                  dataObj.item = item;
                  dataObj.type = 'package';
                  dataObj.price = getPrice ? getPrice : 0;
                  dataObj.data = allResData;
                  dataObj.packageName = getPackageName;

                  counter++;
                  getStoredUserLocData[selectedItemLocation].push(dataObj);
                } else {
                }
              }
            }
          }
        });
      const getModifiedPkgData = await _setCustomLocData(
        getStoredUserLocData,
        itemPrice,
        'package',
      );
      const splitLocationSeparate = await _splitLocationSeparate(
        getModifiedPkgData,
      );
      setsetsavecombinedLocationObjectState(splitLocationSeparate);
      setstoreFinalLocDataState(getModifiedPkgData);
      await _calcSumOfAllLocation(getModifiedPkgData);
      setStoredLocationData(getStoredUserLocData);
      setAvailableItemsLocation(availableLocationItem);
      let checkFinalData = getFinalLocData.concat(getModifiedPkgData);
      setSummaryData(checkFinalData);
      setloading(false);
    } else {
      getItemNameCountOfPackage &&
        getItemNameCountOfPackage.map(async (e, i) => {
          let item = getItemNameCountOfPackage[i].item;
          let quantity = getItemNameCountOfPackage[i].quantity;
          let counter = 1;

          if (item === selectedItemName) {
            quantity = quantity - 1;
          }

          let resTemp = await availableLocationItem[item];

          if (isAddOther == 1) {
            for (let j = 0; j < resTemp.length; j++) {
              let getPrice = '';
              let dataObj = {};
              let allResData = resTemp[j];
              if (allResData.name === selectedItemLocation) {
                if (
                  allResData.isUsed === false &&
                  allResData.isBooked === false
                ) {
                  // getPrice = await getPriceFunction(allResData.currentRow, getPackagesPositionPrice);
                  getPrice = itemPrice ? itemPrice : 0;
                  allResData.isUsed = true;
                  dataObj.location = allResData.name;
                  dataObj.item = item;
                  dataObj.type = 'additional';
                  dataObj.price = getPrice ? getPrice : 0;
                  dataObj.data = allResData;
                  dataObj.packageName = getPackageName;
                  dataObj.isShow = true;

                  getStoredUserLocData[selectedItemLocation].push(dataObj);
                } else {
                  quantity = quantity + 1;
                }
              } else {
                if (
                  allResData.isUsed === false &&
                  allResData.isBooked === false &&
                  counter <= quantity
                ) {
                  // getPrice = await getPriceFunction(allResData.currentRow, getPackagesPositionPrice);
                  getPrice = itemPrice ? itemPrice : 0;
                  allResData.isUsed = true;
                  dataObj.location = allResData.name;
                  dataObj.item = item;
                  dataObj.type = 'additional';
                  dataObj.price = getPrice ? getPrice : 0;
                  dataObj.data = allResData;
                  dataObj.packageName = getPackageName;
                  dataObj.isShow = true;

                  counter++;

                  getStoredUserLocData[selectedItemLocation].push(dataObj);
                }
              }
            }
          } else {
            let getPrice = '';
            let dataObj = {};

            // let allResData = resTemp[j];

            // getPrice = this.state.storePrice;
            dataObj.location = selectedLocationData.name;
            dataObj.item = item;
            dataObj.type = 'additional';
            dataObj.price = getPrice ? getPrice : 0;
            dataObj.data = selectedLocationData;
            dataObj.packageName = getPackageName;
            dataObj.isShow = false;

            counter++;

            getStoredUserLocData[selectedItemLocation].push(dataObj);
          }
        });

      const getModifiedPkgData = await _setCustomLocData(
        getStoredUserLocData,
        itemPrice,
        'additional',
      );

      const splitLocationSeparate = await _splitLocationSeparate(
        getModifiedPkgData,
      );

      setsetsavecombinedLocationObjectState(splitLocationSeparate);
      setstoreFinalLocDataState(getModifiedPkgData);
      await _calcSumOfAllLocation(getModifiedPkgData);
      setStoredLocationData(getStoredUserLocData);
      setAvailableItemsLocation(availableLocationItem);
      let checkFinalData = getFinalLocData.concat(getModifiedPkgData);
      setSummaryData(checkFinalData);
    }
  };

  const _freePrevSelPackage = async (selectedRec, parentData) => {
    for (let i = 0; i < selectedRec.length; i++) {
      let item = await selectedRec[i].item;
      let location = await selectedRec[i].location;
      let resTemp = await parentData[item];
      for (let j = 0; j < resTemp.length; j++) {
        let dataObj = {};
        let allResData = resTemp[j];
        if (allResData.name.toString() === location.toString()) {
          if (allResData.isUsed === true) {
            allResData.isUsed = false;
          }
        }
      }
    }
  };

  const onBookNowClick = async () => {
    setFinalLoading(true);
    let checkFinalData = getFinalLocData.concat(storeFinalLocData);

    await dispatch(setBookFor('location'));
    await dispatch(setShowBooking(true));
    await dispatch(
      setMultipleGridForReservation(selectedBookedLocationDataState),
    );
    await dispatch(
      setsavecombinedLocationObject(savecombinedLocationObjectState),
    );
    await dispatch(setstoreFinalLocData(checkFinalData));
    await dispatch(setSubTotalValue(totalSum));

    // setBookFor('location');
    // setShowBooking(true);
    // setFinalLoading(false);
    if (userProfile && userProfile.id) {
      navigation.navigate('FinishBooking');
    } else {
      navigation.navigate('AddPersonalInfo');
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <>
        <BookFinalComponent
          item={item}
          index={index}
          selectedIndex={selectedIndex}
          activeIndex={activeIndex}
          loading={loading}
          language={language}
          allPackageData={allPackageData}
          //   handleChange={(selectedValueindex, index, item) =>
          //     handleChange(selectedValueindex, index, item)
          //   }
          //   updateCounter={(type, action, data, sel, index, item) =>
          //     updateCounter(type, action, data, sel, index, item)
          //   }
        />
      </>
    );
  };

  const keyExtractor = React.useCallback((item, index) => index, []);

  const backAction = async () => {
    await AsyncStorage.removeItem('locationSum');
    await AsyncStorage.removeItem('selectedBookedLocation');
    dispatch(setstoreFinalLocData([]));
    navigation.goBack();
  };
  return (
    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setVisible(false)}
      style={{width: '100%', height: 200}}>
      <Layout style={{flex: 1}} level="1">
        {finalLoading ? (
          <Loader color="#253C7E" visible={finalLoading} />
        ) : (
          <>
            <ScrollView bounces={false}>
              {selectedBookedLocationDataState &&
                selectedBookedLocationDataState.length > 0 && (
                  <FlatList
                    data={selectedBookedLocationDataState}
                    renderItem={renderItem}
                    removeClippedSubviews
                    initialNumToRender={1}
                    keyExtractor={keyExtractor}
                    maxToRenderPerBatch={12}
                  />
                )}

              <View style={styles.boxStyle}>
                <ButtonComponent
                  style={{backgroundColor: 'transparent'}}
                  // status="warning"
                  appearance="outline"
                  onPress={() => AddAnotherReservation()}>
                  <Typography
                    status="control"
                    category="h6"
                    style={{fontWeight: '400'}}>
                    + {strings('add_another_reservation')}
                  </Typography>
                </ButtonComponent>
              </View>
              <Divider />
              <View
                style={[
                  styles.boxStyle,
                  {
                    marginTop: themeConfig.margin,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}>
                <Typography
                  category="s2"
                  style={{fontWeight: '400'}}
                  status="basic">
                  {strings('price_from')}{' '}
                  {`${moment(searchDate.startDate).format('Do MMM')} - ${moment(
                    searchDate.endDate,
                  ).format('Do MMM')}`}
                </Typography>
                <Typography
                  category="h5"
                  style={{marginLeft: themeConfig.margin, fontWeight: '700'}}>
                  {totalSum}€
                </Typography>
              </View>

              <View style={styles.boxStyle}>
                <Typography category="s1" style={{fontWeight: '500'}}>
                  {strings('summary')}
                </Typography>

                <SummaryComponent
                  finalLocDataState={summaryData}
                  selectedBookedLocationDataState={
                    selectedBookedLocationDataState
                  }
                  selectedLocation={selectedLocation}
                />
              </View>
            </ScrollView>

            <Layout>
              <Divider />
              <View
                style={[
                  styles.boxStyle,
                  {paddingTop: themeConfig.padding / 2},
                ]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.dot} />
                  <Typography category="c1" status="basic">
                    {strings('no_registration')}
                  </Typography>
                </View>
                {dynamicIns &&
                  Object.keys(dynamicIns).length > 0 &&
                  dynamicIns.cancellation && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={styles.dot} />
                      <Typography category="c1" status="basic">
                        {strings('cancellation') +
                          ' ' +
                          `${dynamicIns.cancellation}`}
                      </Typography>
                    </View>
                  )}
                {dynamicIns &&
                  Object.keys(dynamicIns).length > 0 &&
                  dynamicIns.patAtproperty && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View style={styles.dot} />
                      <Typography category="c1" status="basic">
                        {strings('no_repayment')}
                      </Typography>
                    </View>
                  )}
              </View>
              <View style={styles.boxStyle}>
                <ButtonComponent onPress={() => onBookNowClick()}>
                  <Typography
                    status="control"
                    category="h6"
                    style={{fontWeight: '400'}}>
                    {strings('book_now')}
                  </Typography>
                </ButtonComponent>
              </View>
            </Layout>
          </>
        )}

        <Loader color="#fff" visible={changeLaneg} />

        <Toast
          ref={toast} //eslint-disable-line
          position="bottom"
          defaultCloseDelay={3000}
          positionValue={200}
        />
      </Layout>
    </Modal>
  );
};
export default LocationBooking;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  dot: {
    width: themeConfig.radius,
    height: themeConfig.radius,
    borderRadius: themeConfig.radius,
    backgroundColor: themeConfig.colors.black,
    marginRight: themeConfig.margin + 4,
  },
  leftSection: {
    width: 100,
  },
  rightSection: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
