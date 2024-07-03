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
  SET_SERVICE_SURCHARGE,
  SET_LOCATION_SURCHARGE,
} from '../keys';

const initialState = {
  init: false,
  language: '',
  userfilterData: {},
  searchDate: {},
  propertyId: '',
  showBookingLogin: false,
  bathHouseId: '',
  bookFor: '',
  dynamicIns: {},
  searchData: {},
  editSearch: true,
  selectedProperty: {},
  getModalBookingPeriod: '',
  onlingBookingSetting: {},
  getRowSectorData: [],
  getLocationSurcharge: null,
  getServiceSurcharge: null,
};

export const globalReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case INIT_APP: {
      return {
        ...state,
        ...payload,
      };
    }
    case LANGUAGE_FLAG: {
      return {
        ...state,
        language: payload,
      };
    }

    case USER_SEARCH_DATE: {
      return {
        ...state,
        searchDate: payload,
      };
    }
    case User_FILTER_DATA: {
      return {
        ...state,
        userfilterData: {
          ...state.userfilterData,
          ...payload,
        },
      };
    }
    case User_PROPERTY_ID: {
      return {
        ...state,
        propertyId: payload,
      };
    }

    case SET_SHOW_BOOKING:
      return {
        ...state,
        showBookingLogin: payload,
      };

    case SET_BATHHOUSE_ID:
      return {
        ...state,
        bathHouseId: payload,
      };

    case SET_BOOK_FOR:
      return {
        ...state,
        bookFor: payload,
      };
    case SET_DYNAMIC_INS:
      return {
        ...state,
        dynamicIns: payload,
      };
    case SET_SEARCH_DATA:
      return {
        ...state,
        searchData: payload,
      };
    case EDIT_SEARCH:
      return {
        ...state,
        editSearch: payload,
      };
    case SET_SELECTED_PROPERTY:
      return {
        ...state,
        selectedProperty: payload,
      };
    case SET_MODAL_BOOKING_MODAL:
      return {
        ...state,
        getModalBookingPeriod: payload,
      };
    case SET_ONLING_BOOKING_SETTING:
      return {
        ...state,
        onlingBookingSetting: payload,
      };
    case SET_ROW_SECTOR_DATA:
      return {
        ...state,
        getRowSectorData: payload,
      };
    case SET_SERVICE_SURCHARGE:
      return {
        ...state,
        getServiceSurcharge: action.payload,
      };

    case SET_LOCATION_SURCHARGE:
      return {
        ...state,
        getLocationSurcharge: action.payload,
      };
    default:
      return state;
  }
};
