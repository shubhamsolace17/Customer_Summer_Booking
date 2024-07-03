import {
  SET_ADD_BAR_DATA,
  SET_ADD_NORMAL_DATA,
  SET_ADD_HOUR_DATA,
} from '../keys';

export function setBarServiceData(data) {
  return {
    type: SET_ADD_BAR_DATA,
    payload: data,
  };
}

export function setNormalServiceData(data) {
  return {
    type: SET_ADD_NORMAL_DATA,
    payload: data,
  };
}

export function setHourlyServiceData(data) {
  return {
    type: SET_ADD_HOUR_DATA,
    payload: data,
  };
}
