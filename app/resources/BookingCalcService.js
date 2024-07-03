// import moment from 'moment';
// import { CommaToDot } from "./ArithmaticService";

// export const getSeasonalDatesPrices = async (currentRow, getObj) => {
//     var selectedData = getObj.mainPrices && getObj.mainPrices[getObj.mainPrices && getObj.mainPrices.map(function (item) { return item.name; }) .indexOf(currentRow)];
//     return selectedData ? parseFloat(selectedData.value) : 0;
// };

// // const getMatchedPkgObj = async (mergeRowPeriodName, detailPrices) => {
// //   const getMatchedRecord =
// //     (await detailPrices) &&
// //     detailPrices.length > 0 &&
// //     detailPrices.filter(rec => {
// //       return rec.name.trimEnd() === mergeRowPeriodName.trimEnd();
// //     });
// //   return getMatchedRecord[0];
// // };
// const getMatchedPkgObj = async (
//     mergeRowPeriodName,
//     detailPrices,
//     start_date,
//     end_date,
// ) => {
//     const getMatchedRecord =
//         (await detailPrices) &&
//         detailPrices.length > 0 &&
//         detailPrices.filter(rec => {
//             return rec.name.trimEnd() === mergeRowPeriodName.trimEnd();
//         });
//     return getMatchedRecord[0];
// };

// const setRowSeasonCombination = async (
//     currentRow,
//     getObj,
//     getSeasonalPeriods,
//     end_date,
//     start_date,
// ) => {
//     // let periodName = false;
//     // (await getSeasonalPeriods) &&
//     //   getSeasonalPeriods.length > 0 &&
//     //   getSeasonalPeriods.map(async x1 => {
//     //     let selectedRanges = x1.selectedRanges;

//     //     for (let index = 0; index < selectedRanges.length; index++) {
//     //       const element = selectedRanges[index];
//     //       var a = moment(end_date).format('YYYY/MM/DD');
//     //       var b = moment(element.startDate).format('YYYY/MM/DD');
//     //       var c = moment(element.endDate).format('YYYY/MM/DD');
//     //       if ((a >= b && a <= c) || a == c) {
//     //         periodName = x1.name.trimEnd();
//     //         break;
//     //       }
//     //     }
//     //     return periodName;
//     //   });

//     // if (periodName === false) {
//     //   return false;
//     // } else {
//     //   const mergeRowPeriodName = (await currentRow) + ' ' + periodName;
//     //   return await getMatchedPkgObj(mergeRowPeriodName, getObj.detailPrices);
//     // }

//     var periodName = [];
//     const returnDates = await sortByDate(getSeasonalPeriods);
//     let booking_start_date = start_date;
//     let booking_end_date = end_date;
//     for (let index = 0; index < returnDates.length; index++) {
//         const element = returnDates[index];
//         var a = moment(booking_end_date).format('YYYY/MM/DD');
//         var b = moment(element.startDate).format('YYYY/MM/DD');
//         var c = moment(element.endDate).format('YYYY/MM/DD');
//         var d = moment(booking_start_date).format('YYYY/MM/DD');

//         // if booking dates is out of the seasonal dates
//         // if ((a < c && d < b) || (a > c && d > b)) {
//         //     console.log('if block 11');
//         //     periodName = [];
//         //     break;
//         // }

//         if (d >= b && d <= c) {
//             if (a > c && d >= b) {
//                 periodName.push({
//                     periodName: element.name.trimEnd(),
//                     start_date: d,
//                     end_date: c,
//                 });
//                 const date = new Date(c);
//                 booking_start_date = date.setDate(date.getDate() + 1);
//             }
//             if (a <= c && d >= b) {
//                 periodName.push({
//                     periodName: element.name.trimEnd(),
//                     start_date: d,
//                     end_date: a,
//                 });
//             }
//         }
//     }

//     if (periodName.length === 0) {
//         return false;
//     } else {
//         var mergeRowPeriodName = '';
//         var returnData = [];
//         for (let index = 0; index < periodName.length; index++) {
//             mergeRowPeriodName = currentRow + ' ' + periodName[index].periodName;
//             returnData.push({
//                 matchData: await getMatchedPkgObj(
//                     mergeRowPeriodName,
//                     getObj.detailPrices,
//                 ),
//                 start_date: periodName[index].start_date,
//                 end_date:
//                     index === periodName.length - 1
//                         ? booking_end_date
//                         : periodName[index].end_date,
//             });
//         }

//         return returnData;
//     }
// };

// const sortByDate = async array => {
//     var tempData = [];
//     await array.map(x => {
//         return x.selectedRanges.map(x1 => {
//             tempData.push({
//                 name: x.name,
//                 startDate: x1.startDate,
//                 endDate: x1.endDate,
//             });
//         });
//     });

//     const newSortData = await tempData.sort(function (a, b) {
//         return new Date(a.startDate) - new Date(b.startDate);
//     });

//     return newSortData;
// };

// const convertDateIntoYMD = (date) => {
//     const [day, month, year] = date.split('/');
//     return year + '/' + month + '/' + day;
// }

// const getAbsenseDays = async (comb_start_date, comb_end_date, data) => {
//     var absenseCountDays = 0;
//     for (let index = 0; index < data.length; index++) {
//         const element = data[index];
//         if (element >= comb_start_date && element <= comb_end_date) {
//             absenseCountDays = absenseCountDays + 1;
//         }
//     }
//     return absenseCountDays;
// }

// export const getPackagePriceCalc = async (currentRow, getObj, HomePageDates, getSeasonalPeriods, absenceDates, bookingPeriod) => {

//     let newAbsenseDates = await absenceDates.map(x => convertDateIntoYMD(x));
//     let price = 0;
//     const weekendSetting = getObj.weekendSetting;
//     var start_date = HomePageDates.startDate;
//     var end_date = HomePageDates.endDate;
//     const combinationData = await setRowSeasonCombination(currentRow, getObj, getSeasonalPeriods, end_date, start_date);

//     if (combinationData === false) {
//         return 0;
//     } else {
//         for (let index = 0; index < combinationData.length; index++) {
//             const element = combinationData[index];
//             const combMatchData = combinationData[index].matchData;
//             const half_day_price = combMatchData && combMatchData.half_day_price ? CommaToDot(combMatchData.half_day_price) : 0;

//             const daily_price = combMatchData && combMatchData.daily_price ? CommaToDot(combMatchData.daily_price) : 0;
//             // const weekend_price = combMatchData && combMatchData.weekend_price ? CommaToDot(combMatchData.weekend_price) : CommaToDot(daily_price);
//             const weekend_price = combMatchData && combMatchData.weekend_price ? CommaToDot(combMatchData.weekend_price) : 0;

//             const edit_price_data = combMatchData && combMatchData.edit_price_data ? combMatchData.edit_price_data : [];
//             var comb_start_date = element.start_date;
//             var comb_end_date = element.end_date;
//             var day = await getNoOfDaysFunc(new Date(comb_start_date), new Date(comb_end_date));

//             const getAbsenseDay = await getAbsenseDays(comb_start_date, comb_end_date, newAbsenseDates);

//             day = day - getAbsenseDay;

//             if (day <= 6) {
//                 if (bookingPeriod == "Morning" || bookingPeriod == "Afternoon") {
//                     // get half day price for a particular season combination
//                     var temp_half_day_price = day * half_day_price;
//                     price = price + temp_half_day_price;
//                 } else {
//                     var noOfWeekendDays = 0;
//                     if (weekend_price > 0) {
//                         const satSunCount = await getWeekendsCount(new Date(comb_start_date), new Date(comb_end_date), newAbsenseDates);

//                         noOfWeekendDays = await checkWeekendMethod(weekendSetting, satSunCount);
//                     }

//                     var noOfDaysWithoutWeekend = day - noOfWeekendDays;

//                     var noOfDaysWithoutWeekendPrice = await getSelectedRecPrice(noOfDaysWithoutWeekend, edit_price_data);

//                     var temp_price = (noOfDaysWithoutWeekendPrice) + (noOfWeekendDays * weekend_price);
//                     price = price + temp_price;

//                     //  price = (noOfDaysWithoutWeekend * daily_price) + (noOfWeekendDays * weekend_price);
//                     // return price;
//                 }
//             }

//             if (day > 6) {
//                 if (bookingPeriod == "Morning" || bookingPeriod == "Afternoon") {
//                     // get half day price for a particular season combination
//                     var temp_half_day_price = day * half_day_price;
//                     price = price + temp_half_day_price;
//                 } else {
//                     var temp_price = await getSelectedRecPrice(day, edit_price_data);
//                     price = price + temp_price;
//                 }
//             }
//         }
//         return price;
//     }
// }

// // export const getPackagePriceCalc = async (
// //     currentRow,
// //     getObj,
// //     HomePageDates,
// //     getSeasonalPeriods,
// // ) => {
// //     let price;
// //     const packageMode = getObj.priceCalculation;
// //     const weekendSetting = getObj.weekendSetting;
// //     const start_date = HomePageDates.startDate;
// //     const end_date = HomePageDates.endDate;
// //     const day = await getNoOfDaysFunc(new Date(start_date), new Date(end_date));
// //     const combinationData = await setRowSeasonCombination(
// //         currentRow,
// //         getObj,
// //         getSeasonalPeriods,
// //         end_date,
// //     );

// //     if (combinationData === false) {
// //         return 0;
// //     } else {
// //         const daily_price =
// //             combinationData && combinationData.daily_price
// //                 ? combinationData.daily_price
// //                 : 0;
// //         const weekend_price =
// //             combinationData && combinationData.weekend_price
// //                 ? combinationData.weekend_price
// //                 : daily_price;
// //         const edit_price_data =
// //             combinationData && combinationData.edit_price_data
// //                 ? combinationData.edit_price_data
// //                 : [];

// //         if (day <= 6) {
// //             const satSunCount = await getWeekendsCount(
// //                 new Date(start_date),
// //                 new Date(end_date),
// //             );

// //             var noOfWeekendDays = 0;
// //             noOfWeekendDays = await checkWeekendMethod(weekendSetting, satSunCount);

// //             var noOfDaysWithoutWeekend = day - noOfWeekendDays;

// //             price =
// //                 noOfDaysWithoutWeekend * daily_price + noOfWeekendDays * weekend_price;

// //             return price;
// //         }

// //         if (day > 6) {
// //             price = await getSelectedRecPrice(day, edit_price_data);
// //             return price;
// //         }
// //     }
// // };

// function getNoOfDaysFunc(start_date, end_date) {
//     var dateB = moment(start_date, 'YYYY-DD-MM');
//     var dateC = moment(end_date, 'YYYY-DD-MM');
//     var days = dateC.diff(dateB, 'days');
//     return days + 1;
// }

// function checkWeekendMethod(weekendSetting, satSunCount) {
//     if (weekendSetting == 'consider weekend only Sunday') {
//         return satSunCount.sunCount;
//     } else {
//         return satSunCount.sunCount + satSunCount.satCount;
//     }
// }

// // function getNoOfDaysFunc(start_date, end_date) {
// //     const oneDay = 1000 * 60 * 60 * 24;
// //     const diffInTime = end_date.getTime() - start_date.getTime();
// //     const diffInDays = Math.round(diffInTime / oneDay);
// //     return diffInDays + 1;
// // }

// // function checkWeekendMethod(weekendSetting, satSunCount) {
// //     if (weekendSetting == 'consider weekend only Sunday') {
// //         return satSunCount.sunCount;
// //     } else {
// //         return satSunCount.sunCount + satSunCount.satCount;
// //     }
// // }

// function getWeekendsCount(start_date, end_date, absenceDates) {
//     var dayMilliseconds = 1000 * 60 * 60 * 24;
//     var sunday = 0;
//     var saturday = 0;

//     while (start_date <= end_date) {
//         if (!absenceDates.includes(start_date)) {
//             var day = start_date.getDay()
//             if (day === 0) {
//                 sunday++;
//             }
//             if (day === 6) {
//                 saturday++;
//             }
//             start_date = new Date(+start_date + dayMilliseconds);
//         }
//     }
//     return { satCount: saturday, sunCount: sunday };
// }

// // function getWeekendsCount(start_date, end_date) {
// //     var dayMilliseconds = 1000 * 60 * 60 * 24;
// //     var sunday = 0;
// //     var saturday = 0;

// //     while (start_date <= end_date) {
// //         var day = start_date.getDay();
// //         if (day === 0) {
// //             sunday++;
// //         }
// //         if (day === 6) {
// //             saturday++;
// //         }
// //         start_date = new Date(+start_date + dayMilliseconds);
// //     }

// //     return { satCount: saturday, sunCount: sunday };
// // }

// // const getSelectedRecPrice = async (day, edit_price_data) => {
// //     var getCalcRecPrice;
// //     (await edit_price_data) &&
// //         edit_price_data.length > 0 &&
// //         edit_price_data.filter(x => {
// //             if (x.day === day) {
// //                 getCalcRecPrice = x.price;
// //                 return getCalcRecPrice;
// //             }
// //         });
// //     return getCalcRecPrice;
// // };

// const getSelectedRecPrice = async (day, edit_price_data) => {
//     var getCalcRecPrice = 0;
//     await edit_price_data && edit_price_data.length
//         > 0 && edit_price_data.filter(x => {
//             if (x.day === day) {
//                 getCalcRecPrice = x.price;
//                 return getCalcRecPrice;
//             };
//         });
//     return getCalcRecPrice;
// }

// export const _setBookedLocations = async (getBeachMapMainData) => {

//     let UmbrellaData = [];
//     let CabinData = [];
//     let ParkingData = [];
//     let TentData = [];
//     let SunbedData = [];

//     let wordCabin = 'Cabin';
//     let wordParking = 'Parking';
//     let wordSunbed = 'Sunbed';
//     let wordTent = 'Tent';
//     let wordUmbrella = 'Umbrella';

//     await getBeachMapMainData && getBeachMapMainData.map(async recData => {

//         if (recData.items.name === wordCabin) {
//             await CabinData.push(recData);
//         }
//         if (recData.items.name === wordParking) {
//             await ParkingData.push(recData);
//         }
//         if (recData.items.name === wordSunbed) {
//             await SunbedData.push(recData);
//         }
//         if (recData.items.name === wordTent) {
//             await TentData.push(recData);
//         }
//         if (recData.items.name === wordUmbrella) {
//             await UmbrellaData.push(recData);
//         }
//     });

//     const tempPushData = {
//         Umbrella: UmbrellaData,
//         Cabin: CabinData,
//         Parking: ParkingData,
//         Tent: TentData,
//         Sunbed: SunbedData,
//     }
//     return tempPushData;
// }

import moment from 'moment';
import {_formatDate} from './DateFormat';
import {CommaToDot} from './ArithmaticService';

// export const getSeasonalDatesPrices = async (currentRow, getObj) => {
//     var selectedData = getObj.mainPrices && getObj.mainPrices[getObj.mainPrices && getObj.mainPrices.map(function (item) { return item.name; }) .indexOf(currentRow)];
//     return selectedData ? parseFloat(selectedData.value) : 0;
// };
export const getSeasonalDatesPrices = async (currentRow, getObj) => {
  var selectedData =
    getObj.mainPrices &&
    getObj.mainPrices[
      getObj.mainPrices &&
        getObj.mainPrices
          .map(function (item) {
            return item.name;
          })
          .indexOf(currentRow)
    ];
  return selectedData ? parseFloat(selectedData.value) : 0;
};

// // const getMatchedPkgObj = async (mergeRowPeriodName, detailPrices) => {
// //   const getMatchedRecord =
// //     (await detailPrices) &&
// //     detailPrices.length > 0 &&
// //     detailPrices.filter(rec => {
// //       return rec.name.trimEnd() === mergeRowPeriodName.trimEnd();
// //     });
// //   return getMatchedRecord[0];
// // };

// const getMatchedPkgObj = async (
//     mergeRowPeriodName,
//     detailPrices,
//     start_date,
//     end_date,
// ) => {
//     const getMatchedRecord =
//         (await detailPrices) &&
//         detailPrices.length > 0 &&
//         detailPrices.filter(rec => {
//             return rec.name.trimEnd() === mergeRowPeriodName.trimEnd();
//         });
//     return getMatchedRecord[0];
// };

const getMatchedPkgObj = async (
  mergeRowPeriodName,
  detailPrices,
  start_date,
  end_date,
) => {
  const getMatchedRecord =
    (await detailPrices) &&
    detailPrices.length > 0 &&
    detailPrices.filter(rec => {
      return rec.name.trimEnd() === mergeRowPeriodName.trimEnd();
    });
  return getMatchedRecord[0];
};

// const setRowSeasonCombination = async (currentRow, getObj, getSeasonalPeriods, end_date, start_date) => {
//     let periodName = false;
//     let periodArr = [];

//     await getSeasonalPeriods && getSeasonalPeriods.length > 0 && getSeasonalPeriods.map(async x1 => {
//         let selectedRanges = x1.selectedRanges;
//         for (let index = 0; index < selectedRanges.length; index++) {
//             const element = selectedRanges[index];
//             var a = moment(end_date).format('YYYY/MM/DD');
//             var b = moment(element.startDate).format('YYYY/MM/DD');
//             var c = moment(element.endDate).format('YYYY/MM/DD');
//             var d = moment(start_date).format('YYYY/MM/DD');

//             if (((a >= b) && (a <= c)) || (a == c)) {
//                 periodName = x1.name.trimEnd();
//                 break;
//             }
//         }
//         return periodName;
//         // return periodArr;
//     });

//     if (periodName === false) {
//         return false;
//     } else {
//         const mergeRowPeriodName = await currentRow + ' ' + periodName;
//         return await getMatchedPkgObj(mergeRowPeriodName, getObj.detailPrices);
//     }
// }

const sortByDate = async array => {
  var tempData = [];
  await array.map(x => {
    return x.selectedRanges.map(x1 => {
      tempData.push({
        name: x.name,
        startDate: x1.startDate,
        endDate: x1.endDate,
      });
    });
  });

  const newSortData = await tempData.sort(function (a, b) {
    return new Date(a.startDate) - new Date(b.startDate);
  });

  return newSortData;
};

const setRowSeasonCombination = async (
  currentRow,
  getObj,
  getSeasonalPeriods,
  end_date,
  start_date,
) => {
  var periodName = [];
  const returnDates = await sortByDate(getSeasonalPeriods);
  let booking_start_date = start_date;
  let booking_end_date = end_date;
  for (let index = 0; index < returnDates.length; index++) {
    const element = returnDates[index];
    var a = moment(booking_end_date).format('YYYY/MM/DD');
    var b = moment(element.startDate).format('YYYY/MM/DD');
    var c = moment(element.endDate).format('YYYY/MM/DD');
    var d = moment(booking_start_date).format('YYYY/MM/DD');

    // if booking dates is out of the seasonal dates
    // if ((a < c && d < b) || (a > c && d > b)) {
    //     console.log('if block 11');
    //     periodName = [];
    //     break;
    // }

    if (d >= b && d <= c) {
      if (a > c && d >= b) {
        periodName.push({
          periodName: element.name.trimEnd(),
          start_date: d,
          end_date: c,
        });
        const date = new Date(c);
        booking_start_date = date.setDate(date.getDate() + 1);
      }
      if (a <= c && d >= b) {
        periodName.push({
          periodName: element.name.trimEnd(),
          start_date: d,
          end_date: a,
        });
      }
    }
  }

  // console.log("periodName", periodName);

  if (periodName.length === 0) {
    return false;
  } else {
    var mergeRowPeriodName = '';
    var returnData = [];
    for (let index = 0; index < periodName.length; index++) {
      mergeRowPeriodName = currentRow + ' ' + periodName[index].periodName;
      returnData.push({
        matchData: await getMatchedPkgObj(
          mergeRowPeriodName,
          getObj.detailPrices,
        ),
        start_date: periodName[index].start_date,
        end_date:
          index === periodName.length - 1
            ? booking_end_date
            : periodName[index].end_date,
      });
    }

    return returnData;
  }
};

const convertDateIntoYMD = date => {
  const [day, month, year] = date.split('/');
  return year + '/' + month + '/' + day;
};

const getAbsenseDays = async (comb_start_date, comb_end_date, data) => {
  var absenseCountDays = 0;
  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (element >= comb_start_date && element <= comb_end_date) {
      absenseCountDays = absenseCountDays + 1;
    }
  }
  return absenseCountDays;
};

export const getPackagePriceCalc = async (
  currentRow,
  getObj,
  HomePageDates,
  getSeasonalPeriods,
  absenceDates,
  bookingPeriod,
) => {
  console.log('currentRow', currentRow);
  console.log('getObj', getObj);
  console.log('HomePageDates in functionnn', HomePageDates);
  console.log('getSeasonalPeriods', getSeasonalPeriods);
  console.log('absenceDates', absenceDates);
  console.log('bookingPeriod', bookingPeriod);

  let newAbsenseDates = await absenceDates.map(x => convertDateIntoYMD(x));
  let price = 0;
  const weekendSetting = getObj.weekendSetting;
  var start_date = HomePageDates.startDate;
  var end_date = HomePageDates.endDate;
  const combinationData = await setRowSeasonCombination(
    currentRow,
    getObj,
    getSeasonalPeriods,
    end_date,
    start_date,
  );

  console.log('combinationData', combinationData);

  if (combinationData === false) {
    return 0;
  } else {
    for (let index = 0; index < combinationData.length; index++) {
      const element = combinationData[index];
      const combMatchData = combinationData[index].matchData;
      const half_day_price =
        combMatchData && combMatchData.half_day_price
          ? CommaToDot(combMatchData.half_day_price)
          : 0;

      const daily_price =
        combMatchData && combMatchData.daily_price
          ? CommaToDot(combMatchData.daily_price)
          : 0;
      // const weekend_price = combMatchData && combMatchData.weekend_price ? CommaToDot(combMatchData.weekend_price) : CommaToDot(daily_price);
      const weekend_price =
        combMatchData && combMatchData.weekend_price
          ? CommaToDot(combMatchData.weekend_price)
          : 0;

      const edit_price_data =
        combMatchData && combMatchData.edit_price_data
          ? combMatchData.edit_price_data
          : [];
      var comb_start_date = element.start_date;
      var comb_end_date = element.end_date;
      var day = await getNoOfDaysFunc(
        new Date(comb_start_date),
        new Date(comb_end_date),
      );

      // ticket numer 165 - accordingly it commented
      // const getAbsenseDay = await getAbsenseDays(comb_start_date, comb_end_date, newAbsenseDates);

      // console.log("getAbsenseDay", getAbsenseDay);
      // day = day - getAbsenseDay;

      // console.log("day in upper if", day);

      console.log('weekend_price', weekend_price);

      if (day <= 6) {
        console.log('days less than 6');
        if (bookingPeriod == 'Morning' || bookingPeriod == 'Afternoon') {
          // console.log('the booking period is', bookingPeriod);
          // get half day price for a particular season combination

          // console.log("half_day_price is now", half_day_price);
          // console.log("day is now", day);

          var temp_half_day_price = day * half_day_price;
          price = price + temp_half_day_price;

          // console.log("price is now becone", price);
        } else {
          var noOfWeekendDays = 0;

          //as share by client-- if booking is only for 3 or less than 3 day
          if (weekend_price > 0 && day <= 3) {
            const satSunCount = await getWeekendsCount(
              new Date(comb_start_date),
              new Date(comb_end_date),
              newAbsenseDates,
            );

            noOfWeekendDays = await checkWeekendMethod(
              weekendSetting,
              satSunCount,
            );
          }

          var noOfDaysWithoutWeekend = day - noOfWeekendDays;

          console.log('noOfDaysWithoutWeekend', noOfDaysWithoutWeekend);

          var noOfDaysWithoutWeekendPrice = await getSelectedRecPrice(
            noOfDaysWithoutWeekend,
            edit_price_data,
          );

          console.log(
            'noOfDaysWithoutWeekendPrice',
            noOfDaysWithoutWeekendPrice,
          );

          var temp_price =
            noOfDaysWithoutWeekendPrice + noOfWeekendDays * weekend_price;
          // console.log("temp_price", temp_price);
          price = price + temp_price;
          // console.log("final price is", price);

          //  price = (noOfDaysWithoutWeekend * daily_price) + (noOfWeekendDays * weekend_price);
          // return price;
        }
      }

      if (day > 6) {
        if (bookingPeriod == 'Morning' || bookingPeriod == 'Afternoon') {
          // get half day price for a particular season combination
          var temp_half_day_price = day * half_day_price;
          price = price + temp_half_day_price;
        } else {
          var temp_price = await getSelectedRecPrice(day, edit_price_data);
          price = price + temp_price;
        }
      }
    }
    return price;
  }
};

function getNoOfDaysFunc(start_date, end_date) {
  var dateB = moment(start_date, 'YYYY-DD-MM');
  var dateC = moment(end_date, 'YYYY-DD-MM');
  var days = dateC.diff(dateB, 'days');
  return days + 1;
}

function checkWeekendMethod(weekendSetting, satSunCount) {
  if (weekendSetting == 'Consider weekend only Sunday') {
    return satSunCount.sunCount;
  } else {
    return satSunCount.sunCount + satSunCount.satCount;
  }
}

function isInArray(array, value) {
  return (
    (
      array.find(item => {
        return item == value;
      }) || []
    ).length > 0
  );
}

function getWeekendsCount(start_date, end_date, absenceDates) {
  var dayMilliseconds = 1000 * 60 * 60 * 24;
  var sunday = 0;
  var saturday = 0;

  while (start_date <= end_date) {
    if (!absenceDates.includes(start_date)) {
      var day = start_date.getDay();
      if (day === 0) {
        sunday++;
      }
      if (day === 6) {
        saturday++;
      }
      start_date = new Date(+start_date + dayMilliseconds);
    }
  }
  return {satCount: saturday, sunCount: sunday};
}

const getSelectedRecPrice = async (day, edit_price_data) => {
  var getCalcRecPrice = 0;
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

export const _setBookedLocations = async getBeachMapMainData => {
  let UmbrellaData = [];
  let CabinData = [];
  let ParkingData = [];
  let TentData = [];
  let SunbedData = [];

  let wordCabin = 'Cabin';
  let wordParking = 'Parking';
  let wordSunbed = 'Sunbed';
  let wordTent = 'Tent';
  let wordUmbrella = 'Umbrella';

  (await getBeachMapMainData) &&
    getBeachMapMainData.map(async recData => {
      if (recData.items.name === wordCabin) {
        await CabinData.push(recData);
      }
      if (recData.items.name === wordParking) {
        await ParkingData.push(recData);
      }
      if (recData.items.name === wordSunbed) {
        await SunbedData.push(recData);
      }
      if (recData.items.name === wordTent) {
        await TentData.push(recData);
      }
      if (recData.items.name === wordUmbrella) {
        await UmbrellaData.push(recData);
      }
    });

  const tempPushData = {
    Umbrella: UmbrellaData,
    Cabin: CabinData,
    Parking: ParkingData,
    Tent: TentData,
    Sunbed: SunbedData,
  };
  return tempPushData;
};
