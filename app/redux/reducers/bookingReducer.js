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
  SET_MAP_ONE_FOR_CONSUMER,
  SET_BOOKING_TYPE,
  SET_SEASOANAL_FLAG,
} from '../keys';

const initialState = {
  peopleCount: '',
  setAvailableLocation: [],
  getStoredLocData: [],
  getCombinedLocationObject: [],
  getFinalLocData: [],
  getAllLocationSum: 0,
  getBookingData: [],
  tempAvailbleData: [],
  AdditionalLocationData: [],
  AdditionalitemList: [],
  movedSelectedObj: null,
  getFinalPrice: 0,
  subTotal: 0,
  getMapOneForConsumer: [],
  bookingType: '',
  getSeasonalFlag: false,
};

export const bookingReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case FOR_PEOPLE_COUNT: {
      return {...state, peopleCount: payload};
    }
    case SET_ITEM_AVAILABILITY_FOR_PACKAGE:
      return {
        ...state,
        setAvailableLocation: payload,
      };
    case STORE_SELECTED_LOCATION_DATA:
      return {
        ...state,
        getStoredLocData: payload,
      };
    case SAVE_COMBINED_LOCATION_OBJECT:
      return {
        ...state,
        getCombinedLocationObject: payload,
      };

    case STORE_FINIAL_LOC_DATA:
      return {
        ...state,
        getFinalLocData: payload,
      };

    case SET_ALL_LOCATION_SUM:
      return {
        ...state,
        getAllLocationSum: payload,
      };

    case BOOKING_DATA:
      return {
        ...state,
        getBookingData: payload,
      };

    case TEMP_AVAILABLE_ITEMS_DATA:
      return {
        ...state,
        tempAvailbleData: payload,
      };

    case SET_LOCATION_DATA:
      return {
        ...state,
        AdditionalLocationData: payload,
      };

    case SET_ADDITIONAL_ITEMS:
      return {
        ...state,
        AdditionalitemList: payload,
      };

    case SET_MOVE_LOCATION:
      return {
        ...state,
        movedSelectedObj: payload,
      };
    case SET_PRICE:
      return {
        ...state,
        getFinalPrice: payload,
      };

    case SET_SUB_TOTAL:
      return {
        ...state,
        subTotal: payload,
      };
    case SET_MAP_ONE_FOR_CONSUMER:
      return {
        ...state,
        getMapOneForConsumer: payload,
      };
    case SET_BOOKING_TYPE:
      return {
        ...state,
        bookingType: payload,
      };
    case SET_SEASOANAL_FLAG:
      return {
        ...state,
        getSeasonalFlag: payload,
      };
    default:
      return state;
  }
};
