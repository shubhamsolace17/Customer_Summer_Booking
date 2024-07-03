import {
  FOR_PEOPLE_COUNT,
  SET_ITEM_AVAILABILITY_FOR_PACKAGE,
  STORE_SELECTED_LOCATION_DATA,
  SAVE_COMBINED_LOCATION_OBJECT,
  STORE_FINIAL_LOC_DATA,
  SET_ALL_LOCATION_SUM,
  BOOKING_DATA,
  TEMP_AVAILABLE_ITEMS_DATA,
  SET_LOCATION_DATA,
  SET_ADDITIONAL_ITEMS,
  SET_MULTIPLE_GRID_FOR_RESERVATION,
  SET_MOVE_LOCATION,
  SET_PRICE,
  SET_SUB_TOTAL,
  SET_BOOKING_TYPE,
  SET_SEASOANAL_FLAG,
} from '../keys';

export function setPeopleCount(data) {
  return {
    type: FOR_PEOPLE_COUNT,
    payload: data,
  };
}

export function setItemsAvailabilityForPackage(data) {
  return {
    type: SET_ITEM_AVAILABILITY_FOR_PACKAGE,
    payload: data,
  };
}

export function setstoreSelectedLocData(data) {
  return {
    type: STORE_SELECTED_LOCATION_DATA,
    payload: data,
  };
}

export function setsavecombinedLocationObject(data) {
  return {
    type: SAVE_COMBINED_LOCATION_OBJECT,
    payload: data,
  };
}

export function setstoreFinalLocData(data) {
  return {
    type: STORE_FINIAL_LOC_DATA,
    payload: data,
  };
}

export function setAllLocationSum(data) {
  return {
    type: SET_ALL_LOCATION_SUM,
    payload: data,
  };
}

export function setBookingData(data) {
  return {
    type: BOOKING_DATA,
    payload: data,
  };
}

export function setTempAvailbleData(data) {
  return {
    type: TEMP_AVAILABLE_ITEMS_DATA,
    payload: data,
  };
}

export function setAdditionalLocationData(data) {
  return {
    type: SET_LOCATION_DATA,
    payload: data,
  };
}

export function setAdditionalItemsList(data) {
  return {
    type: SET_ADDITIONAL_ITEMS,
    payload: data,
  };
}

// export function setMultipleGridForReservation(data) {
//   return {
//     type: SET_MULTIPLE_GRID_FOR_RESERVATION,
//     payload: data,
//   };
// }

export function setMoveLocationObject(data) {
  return {
    type: SET_MOVE_LOCATION,
    payload: data,
  };
}

export function setFinalPrice(data) {
  return {
    type: SET_PRICE,
    payload: data,
  };
}

export function setSubTotalValue(data) {
  return {
    type: SET_SUB_TOTAL,
    payload: data,
  };
}

export function setBookingType(data) {
  return {
    type: SET_BOOKING_TYPE,
    payload: data,
  };
}

export function setSeasonalFlag(flag) {
  return {
    type: SET_SEASOANAL_FLAG,
    payload: flag,
  };
}
