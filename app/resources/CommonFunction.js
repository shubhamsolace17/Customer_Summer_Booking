import moment from 'moment';
import CryptoJS from 'crypto-js';
import Global from './constant';
export const setBeachMapDataCusotm = async mainMapData => {
  let pushData = [];
  await mainMapData.map(data => {
    return (
      data.rec &&
      data.rec.map(async recData => {
        return pushData.push(recData);
      })
    );
  });

  return pushData;
};
export const returnOnlyFreeData = async locData => {
  let pushData = [];
  (await locData) &&
    locData.length > 0 &&
    locData.map(data => {
      if (
        !data.isBooked &&
        !data.isReserved &&
        data.name !== '' &&
        data.currentRow !== ''
      ) {
        return pushData.push(data);
      }
    });

  return pushData;
};

export const returnOnlyFreeDataConsumer = async (locData, freeLocation) => {
  let pushData = [];
  (await locData) &&
    locData.length > 0 &&
    locData.map(data => {
      if (freeLocation && freeLocation.length > 0) {
        if (
          !data.isBooked &&
          !data.isReserved &&
          data.name !== '' &&
          data.currentRow !== '' &&
          freeLocation.includes(data.name)
        ) {
          return pushData.push(data);
        }
      } else {
        if (
          !data.isBooked &&
          !data.isReserved &&
          data.name !== '' &&
          data.currentRow !== ''
        ) {
          return pushData.push(data);
        }
      }
    });
  return pushData;
};

export const _checkItemPresent = async data => {
  // let UmbrellaExist = await data.some(
  //   element => element && element.items && element.items.name === 'Umbrella',
  // );
  // let SunbedExist = await data.some(
  //   element => element && element.items && element.items.name === 'Sunbed',
  // );
  // let TentExist = await data.some(
  //   element => element && element.items && element.items.name === 'Tent',
  // );
  // let ParkingExist = await data.some(
  //   element => element && element.items && element.items.name === 'Parking',
  // );
  // let CabinExist = await data.some(
  //   element => element && element.items && element.items.name === 'Cabin',
  // );

  // let isPresentItem = {
  //   Umbrella: UmbrellaExist,
  //   Sunbed: SunbedExist,
  //   Tent: TentExist,
  //   Parking: ParkingExist,
  //   Cabin: CabinExist,
  // };

  // return isPresentItem;
  let newData = data && data.filter(x => x.name !== '' && x.currentRow !== '');
  let UmbrellaExist = await newData.some(
    element => element && element.items && element.items.name === 'Umbrella',
  );
  let SunbedExist = await newData.some(
    element => element && element.items && element.items.name === 'Sunbed',
  );
  let TentExist = await newData.some(
    element => element && element.items && element.items.name === 'Tent',
  );
  let ParkingExist = await newData.some(
    element => element && element.items && element.items.name === 'Parking',
  );
  let CabinExist = await newData.some(
    element => element && element.items && element.items.name === 'Cabin',
  );

  let SpecialCabinExist = await newData.some(
    element =>
      element && element.items && element.items.name === 'SpecialCabin',
  );

  let SpecialUmbrella1Exist = await newData.some(
    element =>
      element && element.items && element.items.name === 'SpecialUmbrella1',
  );

  let SpecialUmbrella2Exist = await newData.some(
    element =>
      element && element.items && element.items.name === 'SpecialUmbrella2',
  );

  let isPresentItem = {
    Umbrella: UmbrellaExist,
    Sunbed: SunbedExist,
    Tent: TentExist,
    Parking: ParkingExist,
    Cabin: CabinExist,
    SpecialCabin: SpecialCabinExist,
    SpecialUmbrella1: SpecialUmbrella1Exist,
    SpecialUmbrella2: SpecialUmbrella2Exist,
  };

  return isPresentItem;
};

export const convertStringify = async data => {
  return JSON.stringify(data);
};

const getMatchedPkgObj = async (mergeRowPeriodName, detailPrices) => {
  const getMatchedRecord =
    (await detailPrices) &&
    detailPrices.length > 0 &&
    detailPrices.filter(rec => {
      return rec.name.trimEnd() === mergeRowPeriodName.trimEnd();
    });
  return getMatchedRecord[0];
};

const setRowSeasonCombination = async (
  currentRow,
  getObj,
  getSeasonalPeriods,
  end_date,
) => {
  let periodName = false;
  (await getSeasonalPeriods) &&
    getSeasonalPeriods.length > 0 &&
    getSeasonalPeriods.map(async x1 => {
      let selectedRanges = x1.selectedRanges;

      for (let index = 0; index < selectedRanges.length; index++) {
        const element = selectedRanges[index];
        var a = moment(end_date).format('YYYY/MM/DD');
        var b = moment(element.startDate).format('YYYY/MM/DD');
        var c = moment(element.endDate).format('YYYY/MM/DD');
        if ((a >= b && a <= c) || a == c) {
          periodName = x1.name.trimEnd();
          break;
        }
      }
      return periodName;
    });

  if (periodName === false) {
    return false;
  } else {
    const mergeRowPeriodName = (await currentRow) + ' ' + periodName;
    return await getMatchedPkgObj(mergeRowPeriodName, getObj.detailPrices);
  }
};

export const getPackagePriceCalc = async (
  currentRow,
  getObj,
  HomePageDates,
  getSeasonalPeriods,
) => {
  let price;
  const packageMode = getObj.priceCalculation;
  const weekendSetting = getObj.weekendSetting;
  const start_date = HomePageDates.StartDate;
  const end_date = HomePageDates.EndDate;
  const day = await getNoOfDaysFunc(new Date(start_date), new Date(end_date));
  const combinationData = await setRowSeasonCombination(
    currentRow,
    getObj,
    getSeasonalPeriods,
    end_date,
  );

  if (combinationData === false) {
    return 0;
  } else {
    const daily_price =
      combinationData && combinationData.daily_price
        ? combinationData.daily_price
        : 0;
    const weekend_price =
      combinationData && combinationData.weekend_price
        ? combinationData.weekend_price
        : daily_price;
    const edit_price_data =
      combinationData && combinationData.edit_price_data
        ? combinationData.edit_price_data
        : [];

    if (day <= 6) {
      const satSunCount = await getWeekendsCount(
        new Date(start_date),
        new Date(end_date),
      );

      var noOfWeekendDays = 0;
      noOfWeekendDays = await checkWeekendMethod(weekendSetting, satSunCount);
      var noOfDaysWithoutWeekend = day - noOfWeekendDays;
      price =
        noOfDaysWithoutWeekend * daily_price + noOfWeekendDays * weekend_price;
      return price;
    }

    if (day > 6) {
      price = await getSelectedRecPrice(day, edit_price_data);
      return price;
    }
  }
};

function getNoOfDaysFunc(start_date, end_date) {
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = end_date.getTime() - start_date.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);
  return diffInDays + 1;
}

function checkWeekendMethod(weekendSetting, satSunCount) {
  if (weekendSetting == 'consider weekend only Sunday') {
    return satSunCount.sunCount;
  } else {
    return satSunCount.sunCount + satSunCount.satCount;
  }
}

function getWeekendsCount(start_date, end_date) {
  var dayMilliseconds = 1000 * 60 * 60 * 24;
  var sunday = 0;
  var saturday = 0;

  while (start_date <= end_date) {
    var day = start_date.getDay();
    if (day === 0) {
      sunday++;
    }
    if (day === 6) {
      saturday++;
    }
    start_date = new Date(+start_date + dayMilliseconds);
  }

  return {satCount: saturday, sunCount: sunday};
}

export const getSelectedRecPrice = async (day, edit_price_data) => {
  var getCalcRecPrice;
  (await edit_price_data) &&
    edit_price_data.length > 0 &&
    edit_price_data.filter(x => {
      if (x.day === day) {
        getCalcRecPrice = x.price;
        return getCalcRecPrice;
      }
    });
  return getCalcRecPrice;
};

export const _getDateGreaterToday = async startDate => {
  var ToDate = new Date();
  if (new Date(startDate).getTime() > ToDate.getTime()) {
    return true;
  } else {
    return false;
  }
};
export function _formatDate(date) {
  if (moment(date).isValid()) {
    return moment.utc(date).format('DD/MM/YYYY');
  } else {
    return '-';
  }
}
export const checkDateInSeason = async (
  customStartDate,
  customEndDate,
  seasonStartDate,
  seasonEndDate,
) => {
  var csdate = moment(customStartDate).format('YYYY/MM/DD');
  var cedate = moment(customEndDate).format('YYYY/MM/DD');
  var ssdate = moment(seasonStartDate).format('YYYY/MM/DD');
  var sedate = moment(seasonEndDate).format('YYYY/MM/DD');
  if (moment(sedate).isValid()) {
    if (cedate <= sedate && csdate >= ssdate) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const encryption = async data => {
  var ciphertext = CryptoJS.AES.encrypt(data, 'my-secret-key@123').toString();
  return ciphertext;
};

export const decryption = async ciphertext => {
  var bytes = CryptoJS.AES.decrypt(ciphertext, 'my-secret-key@123');
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
};

export const _returnMatchCancellation = (string, language) => {
  for (let i = 0; i < Global.COLLECTIONS.length; i++) {
    const element = Global.COLLECTIONS[i];
    if (element.name === string) {
      return language === 'en' ? element.name : element.it;
    }
  }
};

export const _returnMatchPetAllowed = (string, language) => {
  for (let i = 0; i < Global.PETS_ALLOWED.length; i++) {
    const element = Global.PETS_ALLOWED[i];
    if (element.name === string) {
      return language === 'en' ? element.name : element.it;
    }
  }
};

export function _returnOnlineBlockPayment(option) {
  let optionArray = [
    {name: '12_hour_before', value: 12},
    {name: '24_hour_before', value: 24},
    {name: '48_hour_before', value: 48},
  ];
  return optionArray.filter(opt => opt.name === option);
}
