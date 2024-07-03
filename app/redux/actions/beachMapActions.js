import {
  AVAILABLE_ITEMS,
  BEACHMAP_DATA,
  GLOBAL_REDUCER_DATA,
  SEASONAL_DATES,
  SEASONAL_PERIODS,
  PACKAGE_DATA,
  ADD_ITEM_DATA,
  RESERVATION_DATA,
  SELECTED_LOCATION,
  SELECTED_LOCATIONDATA,
  SELECTED_ROW_COL,
  SET_MAP_ONE_FOR_CONSUMER,
  SET_SEPARATE_DATA_LOC,
  SET_ROW_MATCHED_LOC_DATA,
  SET_CURR_LOC_DATA,
} from '../keys';

export function setAvailableItems(data) {
  return {
    type: AVAILABLE_ITEMS,
    payload: data,
  };
}

export function setBeachMapMainData(data) {
  return {
    type: BEACHMAP_DATA,
    payload: data,
  };
}

export function setglobalReducer(data) {
  return {
    type: GLOBAL_REDUCER_DATA,
    payload: data,
  };
}

export function SetSeasonalDates(data) {
  return {
    type: SEASONAL_DATES,
    payload: data,
  };
}

export function SetSeasonalPeriods(data) {
  return {
    type: SEASONAL_PERIODS,
    payload: data,
  };
}

export function SetPackageData(data) {
  return {
    type: PACKAGE_DATA,
    payload: data,
  };
}

export function SetAddItemData(data) {
  return {
    type: ADD_ITEM_DATA,
    payload: data,
  };
}

export function SetReservationData(data) {
  return {
    type: RESERVATION_DATA,
    payload: data,
  };
}

// export function Setlocation(data) {
//   console.warn('data', data);
//   return {
//     type: SELECTED_LOCATION,
//     payload: data,
//   };
// }

// export function SetlocationData(data) {
//   return {
//     type: SELECTED_LOCATIONDATA,
//     payload: data,
//   };
// }

export function SetSelectedRowCol(data) {
  return {
    type: SELECTED_ROW_COL,
    payload: data,
  };
}

export function setMapOneForConsumer(data) {
  return {
    type: SET_MAP_ONE_FOR_CONSUMER,
    payload: data,
  };
}

export function setSeparateDataLoc(data) {
  return {
    type: SET_SEPARATE_DATA_LOC,
    payload: data,
  };
}

export function setRowMatchedLocData(data) {
  return {
    type: SET_ROW_MATCHED_LOC_DATA,
    payload: data,
  };
}

export async function setCurrLocData(data) {
  return {
    type: SET_CURR_LOC_DATA,
    payload: data,
  };
}
