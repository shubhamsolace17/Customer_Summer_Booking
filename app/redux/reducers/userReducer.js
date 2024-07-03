import {USER_PROFILE, USER_LOGGED_IN_FLAG, LOG_OUT} from '../keys';

const initialState = {
  userProfile: {},
  isSignedIn: false,
};

export const userReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case USER_PROFILE: {
      return {...state, userProfile: payload};
    }

    case USER_LOGGED_IN_FLAG: {
      return {...state, isSignedIn: payload};
    }

    case LOG_OUT: {
      return state;
    }
    default:
      return state;
  }
};
