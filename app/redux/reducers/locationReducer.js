import {
  SELECTED_LOCATION,
  SELECTED_LOCATIONDATA,
  SET_MULTIPLE_GRID_FOR_RESERVATION,
} from '../keys';

const initialState = {
  selectedLocationData: [],
  selectedLocation: '',
  selectedBookedLocation: [],
};

export const locationReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case SELECTED_LOCATIONDATA: {
      return {...state, selectedLocationData: payload};
    }
    case SELECTED_LOCATION: {
      return {...state, selectedLocation: payload};
    }

    case SET_MULTIPLE_GRID_FOR_RESERVATION:
      return {
        ...state,
        selectedBookedLocation: payload,
      };

    default:
      return state;
  }
};
