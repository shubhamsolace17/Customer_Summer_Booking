import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise';
import {
  userReducer,
  beachMapReducer,
  bookingReducer,
  globalReducer,
  servicesReducer,
  locationReducer,
} from './reducers/index';
// import reducer from './reducers'

const rootReducer = combineReducers({
  UserReducerData: userReducer,
  BeachMapReducerData: beachMapReducer,
  BookingReducerData: bookingReducer,
  servicesReducerData: servicesReducer,
  globalReducerData: globalReducer,
  locationReducer: locationReducer,
});

// const store = createStore(reducer)

const initialState = {};
const middleware = [thunk];
const store = createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(...middleware, promiseMiddleware)),
);

export default store;
