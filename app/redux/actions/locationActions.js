import {
  SELECTED_LOCATION,
  SELECTED_LOCATIONDATA,
  SET_MULTIPLE_GRID_FOR_RESERVATION,
} from '../keys';

export function Setlocation(data) {
  return {
    type: SELECTED_LOCATION,
    payload: data,
  };
}

export function SetlocationData(data) {
  return {
    type: SELECTED_LOCATIONDATA,
    payload: data,
  };
}

export function setMultipleGridForReservation(data) {
  return {
    type: SET_MULTIPLE_GRID_FOR_RESERVATION,
    payload: data,
  };
}
