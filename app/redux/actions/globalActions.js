import {
  INIT_APP,
  LANGUAGE_FLAG,
  USER_SEARCH_DATE,
  User_FILTER_DATA,
  User_PROPERTY_ID,
  SET_SHOW_BOOKING,
  SET_BATHHOUSE_ID,
  SET_BOOK_FOR,
  SET_DYNAMIC_INS,
  SET_SEARCH_DATA,
  EDIT_SEARCH,
  SET_SELECTED_PROPERTY,
  SET_MODAL_BOOKING_MODAL,
  SET_ONLING_BOOKING_SETTING,
  SET_ROW_SECTOR_DATA,
  SET_LOCATION_SURCHARGE,
  SET_SERVICE_SURCHARGE,
} from '../keys';
export function initApp(data) {
  return {
    type: INIT_APP,
    payload: data,
  };
}

export function setLanguage(data) {
  return {
    type: LANGUAGE_FLAG,
    payload: data,
  };
}

export function setUserSearchDate(data) {
  return {
    type: USER_SEARCH_DATE,
    payload: data,
  };
}

export function setUserFilterData(data) {
  return {
    type: User_FILTER_DATA,
    payload: data,
  };
}
export function setPropertyId(data) {
  return {
    type: User_PROPERTY_ID,
    payload: data,
  };
}

export function setShowBooking(data) {
  return {
    type: SET_SHOW_BOOKING,
    payload: data,
  };
}

export function setBathHouseId(data) {
  return {
    type: SET_BATHHOUSE_ID,
    payload: data,
  };
}

export function setBookFor(data) {
  return {
    type: SET_BOOK_FOR,
    payload: data,
  };
}
export function setDynamicIns(data) {
  return {
    type: SET_DYNAMIC_INS,
    payload: data,
  };
}

export async function setSearchData(data) {
  return {
    type: SET_SEARCH_DATA,
    payload: data,
  };
}

export function setEditSearch(data) {
  return {
    type: EDIT_SEARCH,
    payload: data,
  };
}

export function setSelectProperty(data) {
  return {
    type: SET_SELECTED_PROPERTY,
    payload: data,
  };
}

export function setModalBookingPeriod(flag) {
  return {
    type: SET_MODAL_BOOKING_MODAL,
    payload: flag,
  };
}

export function setOnlineBookingSetting(data) {
  return {
    type: SET_ONLING_BOOKING_SETTING,
    payload: data,
  };
}

export function setRowSectorData(data) {
  return {
    type: SET_ROW_SECTOR_DATA,
    payload: data,
  };
}

export function _setServiceSurcharge(data) {
  return {
    type: SET_SERVICE_SURCHARGE,
    payload: data,
  };
}

export function _setLocationSurcharge(data) {
  return {
    type: SET_LOCATION_SURCHARGE,
    payload: data,
  };
}
