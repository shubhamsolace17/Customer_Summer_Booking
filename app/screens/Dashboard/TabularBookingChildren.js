import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Typography from 'components/Typography';
import {strings} from 'i18n/i18n';
import {Layout} from '@ui-kitten/components';
import themeConfig from 'configurations/Theme.configuration';
import {useDispatch, useSelector} from 'react-redux';
import Loader from 'components/Loader';
import SelectRowSectorDD from './SelectRowSectorDD.component';
import SelectAddItemConsumer from './SelectAddItemConsumer.component';
import SelectPackagesDD from './SelectPackagesDD.component';
import ShowMaxPeopleCount from './ShowMaxPeopleCount.component';
// import {setRowMatchedLocData, setSeparateDataLoc} from 'redux/actions';
import {
  getSeasonalDatesPrices,
  _setBookedLocations,
} from 'resources/BookingCalcService';
import {
  setstoreFinalLocData,
  setPeopleCount,
  setItemsAvailabilityForPackage,
  setFinalPrice,
} from 'app/redux/actions/bookingActions';
import {
  setRowMatchedLocData,
  setSeparateDataLoc,
  setCurrLocData,
  setMapOneForConsumer,
} from 'app/redux/actions/beachMapActions';
import {
  getPackagePriceCalc,
  returnOnlyFreeData,
} from 'resources/CommonFunction';
import {
  _getCurrentSelectedLocation,
  _getItemNameCountOfPackage,
  _getItemNameCountOfPackageAdditional,
  _getPackageInfo,
  _removeDuplicate,
  _setCustomLocData,
  _setCustomLocDataConsumer,
  _splitLocationSeparate,
} from 'resources/ReservationServices';
import {setMultipleGridForReservation} from 'redux/actions';
import {_checkIsNumberFloat} from 'resources/ArithmaticService';
let itemPrice = 0;
let currentPackage = {};
let selectedBookedLocationDataState = [];
const TabularBookingChildren = ({
  sectorData,
  key,
  packageData,
  addItemData,
  seasonalCheckbox,
  addSurcharge,
  index,
  item,
  selectedIndex,
  loading,
  language,
  value,
  activeIndex,
  handleChange = () => {},
  handleModal = () => {},
  onSaveBookingValue = () => {},
}) => {
  const dispatch = useDispatch();

  const [
    getMapOneForConsumer,
    getFinalLocData,
    getRowMatchedLocData,
    getCurrLocData,
    searchDate,
    getModalBookingPeriod,
    seasonalPeriods,
    beachMapData,
    mainFreeDataState,
    getBookingData,
    setAvailableLocation,
    getFinalPrice,
    getLocationSurcharge,
  ] = useSelector(state => [
    state.BookingReducerData.getMapOneForConsumer,
    state.BookingReducerData.getFinalLocData,
    state.BeachMapReducerData.getRowMatchedLocData,
    state.BeachMapReducerData.getCurrLocData,
    state.globalReducerData.searchDate,
    state.globalReducerData.getModalBookingPeriod,
    state.BeachMapReducerData.seasonalPeriods,
    state.BeachMapReducerData.beachMapData,
    state.BeachMapReducerData.mainFreeDataState,
    state.BookingReducerData.getBookingData,
    state.BookingReducerData.setAvailableLocation,
    state.BookingReducerData.getFinalPrice,
    state.globalReducerData.getLocationSurcharge,
  ]);
  const [
    savecombinedLocationObjectState,
    setsetsavecombinedLocationObjectState,
  ] = useState();
  const [storeFinalLocData, setstoreFinalLocDataState] = useState([]);
  const [isSelectedRow, setIsSelectedRow] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedPackage, setselectedPackage] = useState('');
  const [forPeopleCount, setforPeopleCount] = useState(null);
  const [returnCurrPrice, setreturnCurrPrice] = useState(0);
  const [PkgSelError, setrPkgSelError] = useState(true);
  const [additionalItems, setadditionalItems] = useState([]);
  const [PackageError, setPackageError] = useState('');
  const [maxCount, setMaxCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [NoItemInPkgError, setNoItemInPkgError] = useState('');
  const [storePrice, setStorePrice] = useState(0);
  const [getStoredLoctionData, setStoredLocationData] = useState([]);
  const [AvailableItemsLocation, setAvailableItemsLocation] = useState();
  const [loader, setLoader] = useState(false);
  // const [currentPackage, setCurrentPackage] = useState({});
  const [packageId, setPackageId] = useState('');
  const handlechangeRow = async index => {
    setLoader(true);
    const selectIndex = sectorData[index.row];
    const rowName = selectIndex.title;
    if (rowName && rowName !== '') {
      setIsSelectedRow(false);
      setSelectedRow(rowName);
      await _matchRowMapData(rowName);
    } else {
      await _checkRowExist(getFinalLocData, key);
    }
  };

  const _matchRowMapData = async currentRow => {
    await _checkRowExist(getFinalLocData, key);
    // const filterByCurrentRow =
    //   (await getMapOneForConsumer) &&
    //   getMapOneForConsumer.length > 0 &&
    //   getMapOneForConsumer.filter(data => {
    //     return data.currentRow === currentRow;
    //   });

    const filterByCurrentRow =
      (await getMapOneForConsumer) &&
      getMapOneForConsumer.length > 0 &&
      getMapOneForConsumer.filter(data => {
        console.log('data from filterByCurrentRow', data);
        return data.currentRow === currentRow;
      });
    console.log('filterByCurrentRow', currentRow, filterByCurrentRow);
    dispatch(setRowMatchedLocData(filterByCurrentRow));
    const mainFreeDataState = await _setBookedLocations(filterByCurrentRow);
    dispatch(setSeparateDataLoc(mainFreeDataState));
    // setLoader(false);
  };
  const _checkRowExist = async (data, keyName) => {
    new Promise(async (resolve, reject) => {
      var exist = false;
      for (var i = 0; i < data.length; i++) {
        if (data[i].keyName === keyName) {
          exist = true;
          break;
        }
      }
      if (exist) {
        var index = data.findIndex(item => item.keyName === keyName);
        data.splice(index, 1);
        setselectedPackage('');
        setreturnCurrPrice(0);
        setforPeopleCount(0);
        setrPkgSelError(false);
        setadditionalItems([]);
        await this.setState({
          selectedPackage: '',
          returnCurrPrice: 0,
          forPeopleCount: 0,
          PkgSelError: false,
          additionalItems: [],
        });
        resolve(data);
      } else {
        setselectedPackage('');
        setreturnCurrPrice(0);
        setforPeopleCount(0);
        setrPkgSelError(false);
        setadditionalItems([]);
        resolve(data);
      }
    }).then(async data => {
      dispatch(setstoreFinalLocData(data));
    });
    setLoader(false);
  };

  const handlechangePackage = async index => {
    const selectIndex = packageData[index.row];
    const packageId = selectIndex.id;
    if (packageId && packageId !== '') {
      const PackageData = packageData ? packageData : [];
      const AddItemData = addItemData ? addItemData : [];
      let getObj = PackageData.find(o => o.id === parseInt(packageId));
      let forPeopleCount =
        getObj.details && getObj.details.MaxPeopleCount
          ? getObj.details.MaxPeopleCount
          : null;
      let getSelectedName =
        getObj.details && getObj.details.PackageName
          ? getObj.details.PackageName
          : '';
      getObj.displayName = getSelectedName;
      getObj.forPeopleCount = forPeopleCount;
      selectedBookedLocationDataState.push(getObj);
      dispatch(setPeopleCount(forPeopleCount));
      setLoader(true);
      const getData = await _setPricesForSelectedPackage(getObj, 'package');
      if (getData == 1) {
        await _setLocationByItem(getObj);
        let count =
          getObj.details && getObj.details.AdditionalItem
            ? getObj.details.AdditionalItem
            : 0;

        setPackageId(packageId);
        setPackageError('');
        setMaxCount(parseInt(count));
        setadditionalItems(
          AddItemData && AddItemData.length > 0
            ? AddItemData.map(usr => ({
                name: usr.details.name,
                value: 0,
                it: usr.details.it,
                price: 0,
              }))
            : [],
        );
        setselectedPackage(getSelectedName);
        setforPeopleCount(forPeopleCount);

        setTotal(0);
      }
    } else {
      setforPeopleCount(0);
      setreturnCurrPrice(0);
    }
  };
  const _getCurrRowFromFreeLoc = async getObj => {
    const nameArr = await getObj.details.PackageItemSelected.map(a => ({
      name: a.name,
    }));
    var result = await getRowMatchedLocData.filter(function (o1) {
      return nameArr.some(function (o2) {
        return o1.items.name === o2.name;
      });
    });
    console.log('result', result, getRowMatchedLocData);
    if (result && result.length > 0) {
      const data = result && result.length > 0 ? result[0] : '';
      currentPackage = data;
      // setCurrentPackage(data);
      dispatch(setCurrLocData(data));
      return data;
    } else {
      return 0;
    }
  };

  const _setPricesForSelectedPackage = async (getObj, type) => {
    let getDataPkg;
    if (type == 'package') {
      getDataPkg = await _getCurrRowFromFreeLoc(getObj);
    }

    if (getDataPkg !== 0) {
      setNoItemInPkgError('');
      const getCurrentLocData = getCurrLocData ? getCurrLocData.currentRow : '';
      const currentRow = getCurrentLocData
        ? getCurrentLocData
        : getDataPkg && getDataPkg.currentRow
        ? getDataPkg.currentRow
        : '';
      const searchData = searchData ? searchData : [];
      const getSeasonalPeriods = seasonalPeriods;
      const fromDate = searchDate?.startDate
        ? searchDate.startDate
        : new Date();
      const endDate = searchDate?.endDate ? searchDate.endDate : new Date();

      // const fromDate = searchData && searchData !== null && searchData.fromDate ? searchData.fromDate : new Date();
      // const endDate = searchData && searchData !== null && searchData.endDate ? searchData.endDate : new Date();
      const bookingPeriod = getModalBookingPeriod;
      const absenceDates = [];
      const HomePageDates = {
        StartDate: fromDate,
        EndDate: endDate,
      };
      let finalPrice;

      if (seasonalCheckbox) {
        finalPrice = await getSeasonalDatesPrices(currentRow, getObj);
      } else {
        finalPrice = await getPackagePriceCalc(
          currentRow,
          getObj,
          HomePageDates,
          getSeasonalPeriods,
          absenceDates,
          bookingPeriod,
        );
      }
      itemPrice = finalPrice;

      setStorePrice(finalPrice);
      // await this.setState({ storePrice: finalPrice });
      return 1;
    } else {
      setNoItemInPkgError('No location for this selected row');
      return 0;
    }
  };

  const getBookedLocation = async () => {
    var temp = [];
    beachMapData.map(data =>
      data.rec.map(record => (record.isBooked ? temp.push(record) : null)),
    );
    return temp;
  };

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

  const _setLocationByItem = async getObj => {
    console.log('currentPackage', currentPackage);
    const bookedData = await getBookedLocation();
    const getPackageName = await _getPackageInfo(getObj);
    const getItemNameCountOfPackage = await _getItemNameCountOfPackage(getObj);
    const getCurrentSelectedLocation = await _getCurrentSelectedLocation(
      currentPackage ? currentPackage : {},
    );
    if (mainFreeDataState) {
      const resData = mainFreeDataState ? mainFreeDataState : [];
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
      await _setLocationDataFunction(
        getItemNameCountOfPackage,
        getCurrentSelectedLocation,
        getPackageName,
        'package',
        null,
        null,
        dataPush,
      );
      setLoader(false);
    } else {
      await dispatch(setItemsAvailabilityForPackage([]));
    }
  };
  const _freePrevSelPackage = async (selectedRec, parentData) => {
    for (let i = 0; i < selectedRec.length; i++) {
      let item = selectedRec[i].item;
      let location = selectedRec[i].location;
      let resTemp = parentData[item];

      for (let j = 0; j < resTemp.length; j++) {
        let allResData = resTemp[j];
        if (allResData.name === location) {
          if (allResData.isUsed === true) {
            allResData.isUsed = false;
          }
        }
      }
    }
  };

  const _calcSumOfAllLocation = async data => {
    let locationPrice = 0;
    let totalPrice = 0;
    (await data) &&
      data.length > 0 &&
      data.map(item => (locationPrice += item.PackageItemPrice));

    // itemPrice = locationPrice;

    data &&
      data.length > 0 &&
      data.map(item => {
        totalPrice = totalPrice + item.TotalSumItem;
      });

    let subTotalValue = locationPrice;

    let TotalValue = '';
    selectedBookedLocationDataState &&
      selectedBookedLocationDataState.length > 0 &&
      selectedBookedLocationDataState.map((e, i) => {
        e.name = data[0].Location;
        e.additem = additionalItems ? additionalItems : [];
      });
    // selectedBookedLocationDataState.push(selectedBookedLocationDataState);
    dispatch(setMultipleGridForReservation(selectedBookedLocationDataState));

    // if (getPreviousSumValue) {
    //   TotalValue =
    //     getPreviousSumValue + locationPrice + parseFloat(additionalItemsTotal);
    // } else {
    //   TotalValue = locationPrice + parseFloat(additionalItemsTotal);
    // }

    dispatch(setFinalPrice(totalPrice));
    setreturnCurrPrice(totalPrice);

    // if (storeFinalLocData) {
    //   if (getFinalLocData.length > 0) {
    //     var exist = false;
    //     for (let i = 0; i < getFinalLocData.length; i++)
    //       if (getFinalLocData[i].keyName === key) {
    //         exist = true;
    //         break;
    //       }
    //     if (exist) {
    //       var index = getFinalLocData.findIndex(item => item.keyName === key)
    //       var price = getFinalLocData[index].TotalSumItem ? getFinalLocData[index].TotalSumItem : 0 ;
    //       setreturnCurrPrice(price);
    //       dispatch(setFinalPrice(price));
    //     }
    //   }
    // }else{
    //   dispatch(setFinalPrice(locationPrice));
    //   setreturnCurrPrice(itemPrice);
    // }
    // await this.props._setAllLocationSum(_checkIsNumberFloat(locationPrice))
  };

  const _updateDataByMatch = async (data, found) => {
    const resData = getMapOneForConsumer.map(data => {
      return {
        currentRow: data.currentRow,
        empty_item_image: data.empty_item_image,
        id: data.id,
        isBooked: data.isBooked,
        isReserved: data.isReserved,
        isSelected: data.isSelected,
        isUsed: data.isUsed,
        items: data.items,
        name: data.name,
      };
    });
    let index = resData.findIndex(obj => obj.id === found.id);
    resData[index].isBooked = true;
    resData[index].isUsed = true;
    const getFreeMapData = await returnOnlyFreeData(resData);
    dispatch(setMapOneForConsumer(getFreeMapData));
  };

  const _setLocationDataFunction = async (
    getItemNameCountOfPackage,
    getCurrentSelectedLocation,
    getPackageName,
    from,
    isAddOther,
    type,
    availableLocationItem,
  ) => {
    // const getStoredUserLocData = getStoredLoctionData
    //   ? getStoredLoctionData
    //   : currentPackage ? getStoredLoctionData : [];

    const getStoredUserLocData = getStoredLoctionData
      ? getStoredLoctionData
      : [];
    const selectedItemName = getCurrentSelectedLocation.item;
    const selectedItemLocation = getCurrentSelectedLocation.location;
    console.log('selectedItemLocation', selectedItemLocation);
    if (from === 'package') {
      const renderMatchedLocationObj =
        getStoredUserLocData[currentPackage.name];
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

      for (var k = 0; k < getItemNameCountOfPackage.length; k++) {
        if (
          selectedItemName === 'Sunbed' &&
          getItemNameCountOfPackage[k].item === 'Sunbed'
        ) {
        } else if (
          (selectedItemName !== 'Sunbed' &&
            getItemNameCountOfPackage[k].item === 'Sunbed') ||
          (selectedItemName !== 'sunbed' &&
            getItemNameCountOfPackage[k].item === 'Sunbed') ||
          (selectedItemName !== 'sun beds' &&
            getItemNameCountOfPackage[k].item === 'Sunbed')
        ) {
          getItemNameCountOfPackage.splice(k, 1);
        }
      }

      for (let i = 0; i < getItemNameCountOfPackage.length; i++) {
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
                getPrice = itemPrice ? itemPrice : 0;
                allResData.isUsed = true;
                dataObj.location = allResData.name;
                dataObj.item = item;
                dataObj.type = 'package';
                dataObj.price = getPrice ? getPrice : 0;
                dataObj.data = allResData;
                dataObj.packageName = getPackageName;
                dataObj.keyName = key;

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
                getPrice = itemPrice ? itemPrice : 0;
                allResData.isUsed = true;
                dataObj.location = allResData.name;
                dataObj.item = item;
                dataObj.type = 'package';
                dataObj.price = getPrice ? getPrice : 0;
                dataObj.data = allResData;
                dataObj.packageName = getPackageName;
                dataObj.keyName = key;
                counter++;
                getStoredUserLocData[selectedItemLocation].push(dataObj);
              }
            }
          }
        }
      }
      const getModifiedPkgData = await _setCustomLocDataConsumer(
        getStoredUserLocData,
        itemPrice,
        'package',
      );
      const removeDuplicateData = await _removeDuplicate(getModifiedPkgData);
      const splitLocationSeparate = await _splitLocationSeparate(
        removeDuplicateData,
      );
      console.log(
        'splitLocationSeparate',
        getStoredUserLocData,
        removeDuplicateData,
        splitLocationSeparate,
      );
      onSaveBookingValue(splitLocationSeparate, removeDuplicateData);
      setsetsavecombinedLocationObjectState(splitLocationSeparate);
      setstoreFinalLocDataState([...removeDuplicateData]);

      await _calcSumOfAllLocation(removeDuplicateData);
      setStoredLocationData(getStoredUserLocData);
      setAvailableItemsLocation(availableLocationItem);
      setLoader(false);
      // await this.props._storeSelectedLocData(getStoredLocData)
      // await this.props._setItemsAvailabilityForPackage(setAvailableLocation);
      // const createGlobalOBJ = {
      //   getModifiedPkgData: removeDuplicateData,
      //   splitLocationSeparate: splitLocationSeparate,
      //   getStoredLocData: getStoredLocData,
      //   additionalItems: this.state.additionalItems
      // };
      // await this._getCollectPkgData(createGlobalOBJ);
    } else {
      //additional item function

      for (let i = 0; i < getItemNameCountOfPackage.length; i++) {
        let item = getItemNameCountOfPackage[i].item;
        let quantity = getItemNameCountOfPackage[i].quantity;
        let counter = 1;

        if (item === selectedItemName) {
          quantity = quantity - 1;
        }
        let resTemp = availableLocationItem[item];
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
                // const getMapOneForConsumer = await getMapOneForConsumer ? getMapOneForConsumer : [];
                const check = await getMapOneForConsumer.filter(
                  e => e && e.items && e.items.name === type,
                );
                const found = await check.find(element => element);
                await this._updateDataByMatch(getMapOneForConsumer, found);
                getPrice = itemPrice ? itemPrice : 0;
                found.isUsed = true;
                dataObj.location = found.name;
                dataObj.item = item;
                dataObj.type = 'additional';
                dataObj.price = getPrice ? getPrice : 0;
                dataObj.data = found;
                dataObj.packageName = getPackageName;
                dataObj.isShow = true;
                dataObj.keyName = key;

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
                // const getMapOneForConsumer = await consumerReducer.getMapOneForConsumer ? consumerReducer.getMapOneForConsumer : [];
                const check = await getMapOneForConsumer.filter(
                  e => e && e.items && e.items.name === type,
                );
                const found = await check.find(element => element);
                await _updateDataByMatch(getMapOneForConsumer, found);

                getPrice = itemPrice ? itemPrice : 0;
                found.isUsed = true;
                dataObj.location = found.name;
                dataObj.item = item;
                dataObj.type = 'additional';
                dataObj.price = getPrice ? getPrice : 0;
                dataObj.data = found;
                dataObj.packageName = getPackageName;
                dataObj.isShow = true;
                dataObj.keyName = key;
                counter++;
                getStoredUserLocData[selectedItemLocation].push(dataObj);
              }
            }
          }
        } else {
          // const getMapOneForConsumer = consumerReducer.getMapOneForConsumer ? consumerReducer.getMapOneForConsumer : [];
          const check = await getMapOneForConsumer.filter(
            e => e && e.items && e.items.name === type,
          );
          const found = await check.find(element => element);
          let getPrice = '';
          let dataObj = {};

          getPrice = itemPrice;

          if (found == undefined) {
            dataObj.location = getCurrLocData.name;
            dataObj.item = item;
            dataObj.type = 'additional';
            dataObj.price = getPrice ? getPrice : 0;
            dataObj.data = getCurrLocData;
            dataObj.packageName = getPackageName;
            dataObj.isShow = false;
            dataObj.keyName = key;

            counter++;
            getStoredUserLocData[selectedItemLocation].push(dataObj);
          } else {
            await _updateDataByMatch(getMapOneForConsumer, found);
            found.isUsed = true;
            dataObj.location = found.name;
            dataObj.item = item;
            dataObj.type = 'additional';
            dataObj.price = getPrice ? getPrice : 0;
            dataObj.data = found;
            dataObj.packageName = getPackageName;
            dataObj.isShow = true;
            dataObj.keyName = key;
            counter++;
            getStoredUserLocData[selectedItemLocation].push(dataObj);
          }
        }
      }

      const getModifiedPkgData = await _setCustomLocDataConsumer(
        getStoredUserLocData,
        itemPrice,
        'additional',
      );
      const removeDuplicateData = await _removeDuplicate(getModifiedPkgData);
      const splitLocationSeparate = await _splitLocationSeparate(
        removeDuplicateData,
      );

      console.log('getModifiedPkgData', getStoredUserLocData);
      console.log('getModifiedPkgData', removeDuplicateData);
      console.log('getModifiedPkgData', splitLocationSeparate);
      console.log('getModifiedPkgData', getModifiedPkgData);

      onSaveBookingValue(splitLocationSeparate, removeDuplicateData);
      setsetsavecombinedLocationObjectState(splitLocationSeparate);
      setstoreFinalLocDataState([...removeDuplicateData]);
      await _calcSumOfAllLocation(removeDuplicateData);
      setStoredLocationData(getStoredUserLocData);
      setAvailableItemsLocation(availableLocationItem);
      setLoader(false);
      // await this.props._storeSelectedLocData(getStoredUserLocData);
      // await this.props._setItemsAvailabilityForPackage(setAvailableLocation);

      // const createGlobalOBJ = {
      //   getModifiedPkgData: removeDuplicateData,
      //   splitLocationSeparate: splitLocationSeparate,
      //   getStoredLocData: getStoredLocData,
      //   additionalItems: this.state.additionalItems,
      // };
      // await this._getCollectPkgData(createGlobalOBJ);
    }
  };

  const getAdditionalItemPrice = async getObj => {
    let finalPrice;
    const currentRow = getCurrLocData ? getCurrLocData.currentRow : '';
    const getSeasonalPeriods = seasonalPeriods;
    const fromDate = searchDate?.startDate ? searchDate.startDate : new Date();
    const endDate = searchDate?.endDate ? searchDate.endDate : new Date();
    const bookingPeriod = getModalBookingPeriod;
    const absenceDates = [];
    const HomePageDates = {
      StartDate: fromDate,
      EndDate: endDate,
    };
    if (seasonalCheckbox) {
      finalPrice = await getSeasonalDatesPrices(currentRow, getObj);
    } else {
      finalPrice = await getPackagePriceCalc(
        currentRow,
        getObj,
        HomePageDates,
        getSeasonalPeriods,
        absenceDates,
        bookingPeriod,
      );
    }
    // return finalPrice;
    console.log('getLocationSurcharge', addSurcharge);
    if (addSurcharge !== null && addSurcharge > 0) {
      let newSurcharge = _checkIsNumberFloat(addSurcharge);
      newSurcharge = finalPrice + finalPrice * (newSurcharge / 100);
      console.log('newSurcharge', newSurcharge, finalPrice);
      return newSurcharge;
    } else {
      return finalPrice;
    }
  };

  const removeFromReducer = async name => {
    const selectedObj = getCurrLocData.name;

    // const selectedObj = getStoredLoctionData.name;
    // const getStoredLocData = globalReducerData.getStoredLocData;
    // const setAvailableLocation = globalReducerData.setAvailableLocation;
    var idx = getStoredLoctionData[selectedObj].findIndex(
      p => p.item === name && p.type === 'additional',
    );
    var removed = getStoredLoctionData[selectedObj].splice(idx, 1);

    const getModifiedPkgData = await _setCustomLocData(getStoredLoctionData);

    const splitLocationSeparate = await _splitLocationSeparate(
      getModifiedPkgData,
    );

    setsetsavecombinedLocationObjectState(splitLocationSeparate);
    setstoreFinalLocDataState(getModifiedPkgData);

    await _calcSumOfAllLocation(getModifiedPkgData);
    setStoredLocationData(getStoredLoctionData);

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
    // let checkFinalData = getFinalLocData.concat(getModifiedPkgData);

    // let checkName = removed[0].location
    // let type = removed[0].item
    // var getIndex = setAvailableLocation[type] && setAvailableLocation[type].findIndex((obj => obj.name === checkName));
    // if (getIndex && setAvailableLocation[type] && setAvailableLocation[type][getIndex]) {
    //   setAvailableLocation[type][getIndex].isUsed = false
    // }

    // const createGlobalOBJ = {
    //   getModifiedPkgData: getModifiedPkgData,
    //   additionalItems: this.state.additionalItems
    // };
    // await this._getCollectPkgData(createGlobalOBJ);
  };

  const _setLocationByAddItemName = async (getObj, value, isAddOther, type) => {
    await _setPricesForSelectedPackage(getObj, 'additional');
    const getItemNameCountOfPackage =
      await _getItemNameCountOfPackageAdditional(getObj, value);
    const getCurrentSelectedLocation = await _getCurrentSelectedLocation(
      getCurrLocData,
    );
    await _setLocationDataFunction(
      getItemNameCountOfPackage,
      getCurrentSelectedLocation,
      selectedPackage,
      'additional',
      isAddOther,
      type,
      setAvailableLocation,
    );
  };

  const updateCounter = async (type, action, data, sel) => {
    const check = getRowMatchedLocData.filter(e => e.items.name !== 'Sunbed');
    const filterdCheck = check.map(e => e.items.name);
    if (packageId !== '' || sel) {
      if (maxCount > total || action === 0) {
        var getIndex = additionalItems.findIndex(obj => obj.name === type);
        if (getIndex === -1) {
          let priceCal = await getAdditionalItemPrice(data);
          var tempObj = {
            name: type,
            it: data.details.it,
            price: priceCal,
            value: action === 0 ? 0 : 1,
          };
          var joined = additionalItems.concat(tempObj);
          setadditionalItems(joined);
          setTotal(1);
          setStorePrice(priceCal);
        } else {
          if (action === 0) {
            if (additionalItems[getIndex].value !== 0) {
              let priceCal = await getAdditionalItemPrice(data);
              additionalItems[getIndex].value =
                additionalItems[getIndex].value - 1;
              additionalItems[getIndex].price = priceCal;
              setadditionalItems(additionalItems);
              setTotal(total - 1);
              setStorePrice(priceCal);
              await removeFromReducer(type);
            } else {
              additionalItems[getIndex].value = 0;
              setadditionalItems(additionalItems);
            }
          } else {
            let priceCal = await getAdditionalItemPrice(data);
            if (type !== 'Sunbed') {
              additionalItems[getIndex].price = priceCal;
              additionalItems[getIndex].value =
                additionalItems[getIndex].value + 1;
              setadditionalItems(additionalItems);
              setTotal(total + 1);
              filterdCheck.includes(type) &&
                (await _setLocationByAddItemName(data, 1, 1, type));
              !filterdCheck.includes(type) &&
                (await _setLocationByAddItemName(data, 1, 0, type));
            }
            if (type === 'Sunbed') {
              let priceCal = await getAdditionalItemPrice(data);
              additionalItems[getIndex].price = priceCal;
              additionalItems[getIndex].value =
                additionalItems[getIndex].value + 1;

              setadditionalItems(additionalItems);
              setTotal(total + 1);
              // await this.setState({ additionalItems: additionalItems, total: total + 1 });
              await _setLocationByAddItemName(data, 1, 0, 'sunbed');
            }
          }
        }
      }
    } else {
      setPackageError('Please select package');
    }
  };
  return (
    <Layout style={styles.layoutContainer}>
      <Typography
        category="h3"
        style={{
          fontWeight: '700',
          padding: themeConfig.padding * 2,
        }}>
        {strings('select_your_package')}
      </Typography>
      <View
        style={[
          styles.boxStyle,
          {
            flexDirection: 'row',
            marginVertical: themeConfig.margin,
            marginTop: themeConfig.margin,
            padding: themeConfig.padding * 2,
          },
        ]}>
        <View style={[styles.leftSection, {justifyContent: 'center'}]}>
          <Typography category="s1" style={{fontWeight: '400'}} status="basic">
            {strings('row')}
          </Typography>
        </View>
        <View style={[styles.rightSection, {justifyContent: 'flex-end'}]}>
          <SelectRowSectorDD
            data={sectorData}
            selectedRow={selectedRow}
            handleChange={selectedValueindex =>
              handlechangeRow(selectedValueindex)
            }
          />
        </View>
      </View>
      <Loader color="#253C7E" visible={loader} />
      <View
        style={[
          styles.boxStyle,
          {
            flexDirection: 'row',
            marginVertical: themeConfig.margin,
            marginTop: themeConfig.margin,
          },
        ]}>
        <View style={[styles.leftSection, {justifyContent: 'center'}]}>
          <Typography category="s1" style={{fontWeight: '400'}} status="basic">
            {strings('no_of_Person')}
          </Typography>
        </View>
        <View style={[styles.rightSection, {alignItems: 'center'}]}>
          <ShowMaxPeopleCount count={forPeopleCount} />
        </View>
      </View>

      <View
        style={[
          styles.boxStyle,
          {
            flexDirection: 'row',
            marginVertical: themeConfig.margin,
            marginTop: themeConfig.margin,
          },
        ]}>
        <View style={[styles.leftSection, {justifyContent: 'center'}]}>
          <Typography category="s1" style={{fontWeight: '400'}} status="basic">
            {strings('package')}
          </Typography>
        </View>
        <View style={[styles.rightSection]}>
          <SelectPackagesDD
            data={packageData}
            value={selectedPackage}
            disabled={isSelectedRow}
            handleChange={selectedValueindex =>
              handlechangePackage(selectedValueindex)
            }
          />
        </View>
      </View>

      <View
        style={[
          styles.boxStyle,
          {
            flexDirection: 'row',
            marginVertical: themeConfig.margin,
            marginTop: themeConfig.margin,
          },
        ]}>
        <View style={[styles.leftSection, {justifyContent: 'center'}]}>
          <Typography category="s1" style={{fontWeight: '400'}} status="basic">
            {strings('price')}
          </Typography>
        </View>
        <View style={[styles.rightSection, {alignItems: 'center'}]}>
          <Typography category="s1" style={{fontWeight: '400'}} status="basic">
            {returnCurrPrice ? returnCurrPrice : 0} €
          </Typography>
        </View>
      </View>

      <View style={{marginTop: themeConfig.margin}}>
        <Typography
          category="h3"
          style={{
            fontWeight: '700',
            padding: themeConfig.padding * 2,
          }}>
          {strings('additional_items')}
        </Typography>

        {addItemData && addItemData.length > 0 && (
          <SelectAddItemConsumer
            data={addItemData}
            updateCounter={(type, action, data, sel, index, item) =>
              updateCounter(type, action, data, sel, index, item)
            }
            additionalItems={additionalItems}
          />
        )}
      </View>
    </Layout>
  );
};

export default React.memo(TabularBookingChildren);

const styles = StyleSheet.create({
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
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
});
