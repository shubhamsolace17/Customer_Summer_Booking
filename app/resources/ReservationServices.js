import moment from 'moment';
import {_checkIsNumberFloat} from './ArithmaticService';
import {_returnOnlineBlockPayment} from './CommonFunction';
import store from '../redux/store';

export const _getPackagePricesByPosition = async data => {
  const mainPrices = data.mainPrices;
  const getPrice = await mainPrices.map(price => {
    return {
      position: price.name,
      price: parseFloat(price.value),
    };
  });
  return getPrice;
};

export const _getPackageInfo = async data => {
  const PackageName = data.details.PackageName;
  return PackageName;
};

export const _getPackageInfoAdditional = async data => {
  const PackageName = data.details.name;
  return PackageName;
};

export const _getItemNameCountOfPackage = async data => {
  const PackageItemSelected = data.details.PackageItemSelected;
  const getSelectedItems =
    (await PackageItemSelected) &&
    PackageItemSelected.map(price => {
      return {
        item: price.name,
        quantity: parseFloat(price.quantity),
      };
    });
  return getSelectedItems;
};

export const _getItemNameCountOfPackageAdditional = async (data, count) => {
  let pushData = [];
  let tempObj = {
    item: data.details.name,
    quantity: parseFloat(count),
  };
  pushData.push(tempObj);
  return pushData;
};

export const _getCurrentSelectedLocation = async data => {
  return {
    position: data && data.currentRow ? data.currentRow : '',
    gray_image: data && data.gray_image ? data.gray_image : '',
    id: data && data.id ? data.id : '',
    location: data && data.name ? data.name : '',
    item: data && data.items && data.items.name ? data.items.name : '',
  };
};

export const getPriceFunction = (currentRow, getPackagesPositionPrice) => {
  var exist = false;
  for (var i = 0; i < getPackagesPositionPrice.length; i++) {
    if (getPackagesPositionPrice[i].position === currentRow) {
      exist = true;
      break;
    }
  }
  if (exist) {
    return getPackagesPositionPrice[i].price;
  } else {
    return null;
  }
};

export const _setCustomLocData = async (data, storePrice, type) => {
  console.log('data', data);
  return new Promise((resolve, reject) => {
    const newResData = Object.entries(data).map(([key, value], i) => {
      return {
        Location: key,
        PkgData: value,
        PackageName: value && value[0] ? value[0].packageName : '',
      };
    });
    resolve(newResData);
  }).then(newResData => {
    const packageOnly = newResData.map(locData => {
      return {
        Location: locData.Location,
        PkgData: locData.PkgData,
        PackageName: locData.PackageName,
        AdditionalItem: locData.PkgData.filter(
          rec => rec.type === 'additional',
        ),
        PackageItem: locData.PkgData.filter(rec => rec.type === 'package'),
        PackageItemPrice: _calcPkgPrice(
          locData.PkgData.filter(rec => rec.type === 'package'),
        ),
        AdditionalItemPrice: _calcAdditionalPkgPrice(
          locData.PkgData.filter(rec => rec.type === 'additional'),
        ),
        TotalSumItem:
          _calcPkgPrice(locData.PkgData.filter(rec => rec.type === 'package')) +
          _calcAdditionalPkgPrice(
            locData.PkgData.filter(rec => rec.type === 'additional'),
          ),

        // PackageItemPrice : type == 'package' ? storePrice : locData.PackageItemPrice,
        // AdditionalItemPrice :  type == 'additional' ? storePrice : locData.AdditionalItemPrice,
        // TotalSumItem : storePrice,// _calcPkgPrice(locData.PkgData.filter(rec =>  rec.type === "package")) + _calcPkgPrice(locData.PkgData.filter(rec =>  rec.type === "additional"))
      };
    });

    return packageOnly;
  });
};

const _calcAdditionalPkgPrice = newResData => {
  let surcharge = getSurcharge();
  if (surcharge !== null && surcharge > 0) {
    let result = newResData
      .map(a => a.price)
      .reduce((a, b) => {
        return a + b;
      }, 0);

    let newSurcharge = _checkIsNumberFloat(surcharge);
    newSurcharge = result ? result + result * (newSurcharge / 100) : 0;
    return _checkIsNumberFloat(newSurcharge);
  } else {
    let result = newResData
      .map(a => a.price)
      .reduce((a, b) => {
        return a + b;
      }, 0);
    return result;
  }
};
function getLocationSurcharge(state) {
  let onlingBookingSetting = state.globalReducerData?.onlingBookingSetting;
  if (onlingBookingSetting) {
    let tempSurcharge =
      onlingBookingSetting?.onlineBookingOptions?.locationOptionObj
        ?.addSurcharge;
    return tempSurcharge;
  }
}

function getSurcharge() {
  let pData = getLocationSurcharge(store.getState());
  return pData;
}
const _calcPkgPrice = (newResData, storePrice) => {
  // let result =  newResData.map(a => a.price).reduce((a, b)=>{return a + b;},0);
  // let result = newResData.map(a => a.price);

  // return result[0] ? result[0] : 0;

  let surcharge = getSurcharge();
  if (surcharge !== null && surcharge > 0) {
    let result = newResData.map(a => a.price);
    let newSurcharge = _checkIsNumberFloat(surcharge);
    newSurcharge = result[0] ? result[0] + result[0] * (newSurcharge / 100) : 0;
    return newSurcharge ? _checkIsNumberFloat(newSurcharge) : 0;
  } else {
    let result = newResData.map(a => a.price);
    return result[0] ? result[0] : 0;
  }
};

export const _setCustomLocDataConsumer = async data => {
  return new Promise((resolve, reject) => {
    const newResData = Object.entries(data).map(([key, value], i) => {
      return {
        Location: key,
        PkgData: value,
        PackageName: value && value[0] ? value[0].packageName : '',
        keyName: value && value[0] ? value[0].keyName : '',
      };
    });
    resolve(newResData);
  }).then(newResData => {
    const packageOnly = newResData.map(locData => {
      return {
        Location: locData.Location,
        keyName: locData.keyName,
        PkgData: locData.PkgData,
        PackageName: locData.PackageName,
        AdditionalItem: locData.PkgData.filter(
          rec => rec.type === 'additional',
        ),
        PackageItem: locData.PkgData.filter(rec => rec.type === 'package'),
        PackageItemPrice: _calcPkgPrice(
          locData.PkgData.filter(rec => rec.type === 'package'),
        ),
        AdditionalItemPrice: _calcAdditionalPkgPrice(
          locData.PkgData.filter(rec => rec.type === 'additional'),
        ),
        TotalSumItem:
          _calcPkgPrice(locData.PkgData.filter(rec => rec.type === 'package')) +
          _calcAdditionalPkgPrice(
            locData.PkgData.filter(rec => rec.type === 'additional'),
          ),
      };
    });

    return packageOnly;
  });
};

export const _splitLocationSeparate = async data => {
  const newRec = await data.map(x => x.PkgData);
  let wantedArray = [];
  for (let v of newRec) {
    for (let b of v) {
      await wantedArray.push({
        Location: b.location,
        isBooked: true,
        isReserved: false,
        itemName: b.item,
        type: b.type,
        packageDetails: b.packageDetails,
      });
    }
  }
  return wantedArray;
};

export const _removeDuplicate = async data => {
  const ids = await data.map(o => o.keyName);
  const filtered = await data.filter(
    ({keyName}, index) => !ids.includes(keyName, index + 1),
  );
  return filtered;
};

export const _checkItemPresent = async data => {
  let UmbrellaExist = await data.some(
    element => element && element.items && element.items.name === 'Umbrella',
  );
  let SunbedExist = await data.some(
    element => element && element.items && element.items.name === 'Sunbed',
  );
  let TentExist = await data.some(
    element => element && element.items && element.items.name === 'Tent',
  );
  let ParkingExist = await data.some(
    element => element && element.items && element.items.name === 'Parking',
  );
  let CabinExist = await data.some(
    element => element && element.items && element.items.name === 'Cabin',
  );

  let isPresentItem = {
    Umbrella: UmbrellaExist,
    Sunbed: SunbedExist,
    Tent: TentExist,
    Parking: ParkingExist,
    Cabin: CabinExist,
  };

  return isPresentItem;
};

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const _getIfReservationValid = async (number, endDate) => {
  if (number === 0) {
    return true;
  } else {
    var today = new Date();
    const next_n_date = await addDays(today, parseInt(number));
    var future_Date = moment(next_n_date).format('YYYY/MM/DD');
    var booking_end_date = moment(endDate).format('YYYY/MM/DD');
    return booking_end_date <= future_Date;
  }
};
export const _getPeriodRangeValid = async (
  period,
  booking_start,
  booking_end,
  isEnablePeriod,
) => {
  if (isEnablePeriod) {
    let period_start_date = moment(period[0].start).format('YYYY/MM/DD');
    let period_end_date = moment(period[0].end).format('YYYY/MM/DD');
    let booking_start_date = moment(booking_start).format('YYYY/MM/DD');
    let booking_end_date = moment(booking_end).format('YYYY/MM/DD');
    return (
      booking_start_date >= period_start_date &&
      booking_end_date <= period_end_date
    );
  } else {
    return true;
  }
};
export const _getCurrentDayBookable = async (
  currentDayBookable,
  booking_start,
) => {
  if (currentDayBookable == 'true') {
    return true;
  } else {
    var today = new Date();
    var current_Date = moment(today).format('YYYY/MM/DD');
    var booking_start_date = moment(booking_start).format('YYYY/MM/DD');
    return booking_start_date !== current_Date;
  }
};
export const _checkBlockOnlineBooking = async (
  blockOnlinePayment,
  booking_start,
) => {
  if (blockOnlinePayment === 'disable' || blockOnlinePayment === undefined) {
    return true;
  } else {
    let returnData = _returnOnlineBlockPayment(blockOnlinePayment);
    let countNumber = returnData[0].value;
    let start_date = new Date(booking_start);
    start_date.setHours(0, 0, 0, 0);
    let today = new Date();
    let getHours = timeDiffCalc(start_date, today);
    return getHours > countNumber;
  }
};

function timeDiffCalc(start_date, today) {
  let diffTime = start_date.getTime() - today.getTime();
  let hoursDiff = diffTime / (1000 * 3600);
  return ~~hoursDiff;
}

export const _returnPkgString = (packageSelectedData, location, itemName) => {
  let pkgString = null;
  packageSelectedData &&
    packageSelectedData.length > 0 &&
    packageSelectedData.map(x => {
      return (
        x &&
        x.PackageItem &&
        x.PackageItem.length > 0 &&
        x.PackageItem.filter(y => {
          if (y.location === location) {
            if (x.packageItemString !== undefined) {
              pkgString = _extractMatchedPackageString(
                x.packageItemString,
                itemName,
              );
            }
          }
        })
      );
    });
  return pkgString;
};

const _extractMatchedPackageString = (packageString, itemName) => {
  let returnNewString = {
    english_initial: '',
    italian_initial: '',
  };

  if (
    packageString !== undefined &&
    packageString !== null &&
    packageString.english_initial !== undefined &&
    packageString.english_initial !== null
  ) {
    //split string for english version
    let splitPkgStringEn = packageString.english_initial.split('+');
    returnNewString.english_initial = returnStringByLanguage(
      splitPkgStringEn,
      itemName,
      packageString,
      'english_initial',
      'eng_initial',
    );

    //split string for Italian version
    let splitPkgStringIt = packageString.italian_initial.split('+');
    returnNewString.italian_initial = returnStringByLanguage(
      splitPkgStringIt,
      itemName,
      packageString,
      'italian_initial',
      'ita_initial',
    );
    return returnNewString;
  } else {
    return packageString;
  }
};
