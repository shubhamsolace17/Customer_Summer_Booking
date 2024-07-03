import {
  AVAILABLE_ITEMS,
  BEACHMAP_DATA,
  GLOBAL_REDUCER_DATA,
  SEASONAL_DATES,
  SEASONAL_PERIODS,
  PACKAGE_DATA,
  ADD_ITEM_DATA,
  RESERVATION_DATA,
  SELECTED_ROW_COL,
  SET_SEPARATE_DATA_LOC,
  SET_ROW_MATCHED_LOC_DATA,
  SET_CURR_LOC_DATA,
} from '../keys';

const initialState = {
  availableItems: [],
  beachMapData: [],
  globalReducerData: [],
  seasonalDate: [],
  seasonalPeriods: [],
  packageData: [],
  addItemData: [],
  bookreservationData: [],
  selectedRowCol: [],
  mainFreeDataState: [],
  getRowMatchedLocData: [],
  getCurrLocData: [],
};

export const beachMapReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case AVAILABLE_ITEMS: {
      return {...state, availableItems: payload};
    }
    case BEACHMAP_DATA: {
      return {...state, beachMapData: payload};
    }
    case GLOBAL_REDUCER_DATA: {
      return {...state, globalReducerData: payload};
    }
    case SEASONAL_DATES: {
      return {...state, seasonalDate: payload};
    }
    case SEASONAL_PERIODS: {
      return {...state, seasonalPeriods: payload};
    }
    case PACKAGE_DATA: {
      return {...state, packageData: payload};
    }
    case ADD_ITEM_DATA: {
      return {...state, addItemData: payload};
    }
    case RESERVATION_DATA: {
      return {...state, bookreservationData: payload};
    }
    case SELECTED_ROW_COL: {
      return {...state, selectedRowCol: payload};
    }
    case SET_SEPARATE_DATA_LOC:
      return {
        ...state,
        mainFreeDataState: payload,
      };
    case SET_ROW_MATCHED_LOC_DATA:
      return {
        ...state,
        getRowMatchedLocData: payload,
      };
    case SET_CURR_LOC_DATA:
      return {
        ...state,
        getCurrLocData: payload,
      };
    default:
      return state;
  }
};
