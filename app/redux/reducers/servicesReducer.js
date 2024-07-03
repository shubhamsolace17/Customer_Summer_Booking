import {
  SET_ADD_BAR_DATA,
  SET_ADD_NORMAL_DATA,
  SET_ADD_HOUR_DATA,
} from '../keys';

const initialState = {
  barServiceData: [],
  normalServiceData: [],
  hourServiceData: [],
};

export const servicesReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_ADD_BAR_DATA:
      return {
        ...state,
        barServiceData: payload,
      };

    case SET_ADD_NORMAL_DATA:
      return {
        ...state,
        normalServiceData: payload,
      };

    case SET_ADD_HOUR_DATA:
      return {
        ...state,
        hourServiceData: payload,
      };

    default:
      return state;
  }
};
