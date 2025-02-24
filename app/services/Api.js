const enviroment = 'dev';
let BASE_URL = '';
if (enviroment === 'dev') {
  BASE_URL = 'https://development.summerbooking.it/api';
} else {
  BASE_URL = 'https://api.summerbooking.it/api';
}

const Api = {
  usersList: `${BASE_URL}/users`,
  signUpUrl: `${BASE_URL}/auth/signup`,
  signInUrl: `${BASE_URL}/auth/signin`,
  checkEmail: `${BASE_URL}/auth/checkemail`,
  locationSearch: `${BASE_URL}/sb/locationAutosuggestion`,
  socialLogin: `${BASE_URL}/auth/socialsign`,
  propertySearch: `${BASE_URL}/sb/property/search`,
  like: `${BASE_URL}/sb/property/likes`,
  getPropertyIdAndBathhouseFromSlug: `${BASE_URL}/sb/getPropertyIdAndBathhouseFromSlug`,
  getPropertyWithBathHouseDetails: `${BASE_URL}/sb/getPropertyWithBathHouseDetails`,
  getpropertiesByRegionForHomePage: `${BASE_URL}/sb/propertyListOnHomePage`,
  getFilter: `${BASE_URL}/sb/getServiceFilter`,
  getMyfavourite: `${BASE_URL}/sb/myfavourite`,
  likeProperty: `${BASE_URL}/sb/property/likeLogs`,
  getUserDetails: `${BASE_URL}/sb/getpersonalDetails`,
  disableNotification: `${BASE_URL}/sb/disableNotification`,
  updateUserProfile: `${BASE_URL}/sb/updatePersonalDetails`,
  resetPassword: `${BASE_URL}/auth/resetPassword`,
  forgotpassword: `${BASE_URL}/auth/forgotpassword`,
  registerProperty: `${BASE_URL}/public/property`,
  viewconfimaps: `${BASE_URL}/sb/viewconfimaps`,
  viewconfiguration: `${BASE_URL}/sb/viewconfiguration`,
  viewseasonsperiods: `${BASE_URL}/sb/viewseasonsperiods`,
  allpricelist: `${BASE_URL}/sb/allpricelist`,
  locationBooking: `${BASE_URL}/sb/check/location/booking`,
  getBookedUmbrella: `${BASE_URL}/sb/confImage`,
  locationAvailability: `${BASE_URL}/sb/location/availability`,
  getCardDeatils: `${BASE_URL}/sb/getCardDetails`,
  removeCard: `${BASE_URL}/sb/stripe/removeCardDetails`,
  viewServices: `${BASE_URL}/sb/viewservicetypes`,
  checkDiscount: `${BASE_URL}/sb/checkdiscount`,
  getPaymentOptions: `${BASE_URL}/sb/getPaymentOptions`,
  booking: `${BASE_URL}/sb/booking`,
  TransactionEntryForPayAtProperty: `${BASE_URL}/sb/TransactionEntryForPayAtProperty`,
  servicesReservation: `${BASE_URL}/sb/service/reservation`,
  stripePayment: `${BASE_URL}/sb/payment`,
  getBookedLocationData: `${BASE_URL}/sb/booking/getBookingDetailsByBookingId`,
  getServiceResData: `${BASE_URL}/sb/service/reservation/single`,
  deleteBooking: `${BASE_URL}/sb/booking/deleteBooking`,
  myBooking: `${BASE_URL}/sb/mybookingsByUserId`,
  deleteAccount: `${BASE_URL}/sb/deleteAccount`,
  getOnlineBookingSettings: `${BASE_URL}/sb/getOnlineBookingSettings`,
  getSectorList: `${BASE_URL}/sb/viewsectors`,
  getOnlineReservationStatusByAdmin: `${BASE_URL}/sb/getOnlineReservationStatusByAdmin`,
  createSubscribe: `${BASE_URL}/sb/createSubscribe`,
  getBookingAccountSummary: `${BASE_URL}/sb/bookingSummaryById`,
  getCardTransactionDetailsByBookingId: `${BASE_URL}/sb/getCardTransactionDetailsByBookingId`,
  getBookingByReservationCode: `${BASE_URL}/sb/getBookingByReservationCode`,
  createSharing: `${BASE_URL}/sb/createSharing`,
  getSharedLocationsByDate: `${BASE_URL}/sb/getSharedLocationsByDate`,
  getCreditsEarnedByBookingId: `${BASE_URL}/sb/getCreditsEarnedByBookingId`,
  getServiceBookingCount: `${BASE_URL}/sb/service/getServiceBookingCount`,
  getSharingDates: `${BASE_URL}/sb/getSharingDates`,
  getAbsenceDates: `${BASE_URL}/sb/getAbsenceDates`,
};

export default Api;
