import {USER_PROFILE, USER_LOGGED_IN_FLAG, LOG_OUT} from '../keys';

export function setUserProfile(data) {
  return {
    type: USER_PROFILE,
    payload: data,
  };
}

export function setUserLoggedIn(data) {
  return {
    type: USER_LOGGED_IN_FLAG,
    payload: data,
  };
}

export function logout() {
  return {
    type: LOG_OUT,
  };
}
