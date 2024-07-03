import React, {useState, useEffect, useRef} from 'react';
import {Divider, Layout, CheckBox} from '@ui-kitten/components';
import {StyleSheet, View, Dimensions} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import SelectComponent from 'components/Select';
import SVGIcon from 'components/Icon';
import SearchListItem from './SearchListItem.component';
import {_checkIsNumberFloat} from 'resources/ArithmaticService';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Loader from 'components/Loader';
import moment from 'moment';
import {strings} from 'i18n/i18n';
import Toast from 'react-native-easy-toast';
import {_formatDate} from 'resources/CommonFunction';
import {useDispatch, useSelector} from 'react-redux';
import {setShowBooking} from 'app/redux/actions/globalActions';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import SummaryComponent from './Summary.component';
import PropertyCard from './PropertyCard.component';
import GLOBAL from 'resources/constant';
import CustomSkeletonList from 'components/CustomSkeleton';
import DropShadow from 'react-native-drop-shadow';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const FinishBooking = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [propertyData, setPropertyData] = useState();
  const [loading, setloading] = useState(false);
  const [error, setError] = useState('');
  const [coupenCode, setCoupenCode] = useState('');
  const [finaltotalValue, setFinaltotalValue] = useState();
  const [VouchersData, setVouchersData] = useState();
  const [coupenError, setCoupenError] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [bookedObj, setBookedObj] = useState([]);
  const [payNowFlag, setPayNowFlag] = useState(false);
  const [payAtPropertyFlag, setPayAtPropertyFlag] = useState(false);
  const [payInstructureFlag, setPayInstructureFlag] = useState(false);
  const [advancedBalanceStrucFlag, setAdvancedBalanceStrucFlag] =
    useState(false);
  const [depositNowhalfFlag, setDepositnowHalfFlag] = useState(false);
  const [payAtPropertyNoCreditFlag, setpayAtPropertyNoCreditFlag] =
    useState(false);
  const stripe = useStripe();
  const nonRegistertedUser = route.params;
  const [showAdvancedBalanceInfo, setShowAdvancedBalanceInfo] = useState(0);
  const [showPayatPropertyInfo, setShowPayatPropertyInfo] = useState(0);
  const [showPayInStructureInfo, setShowPayInStructureInfo] = useState(0);
  const [depositNowhalf, setDepositnowHalf] = useState(0);
  const [payAtPropertyNoCredit, setpayAtPropertyNoCredit] = useState(0);
  const [showPayNowInfo, setShowPayNowInfo] = useState(0);
  const [showPayStep, setShowPayStep] = useState(false);

  const [
    bathHouseId,
    propertyId,
    searchDate,
    getFinalLocData,
    selectedBookedLocation,
    subTotal,
    bookFor,
    barServiceData,
    normalServiceData,
    hourServiceData,
    getCombinedLocationObject,
    userProfile,
    selectedProperty,
    getModalBookingPeriod,
    getSeasonalFlag,
  ] = useSelector(state => [
    state.globalReducerData.bathHouseId,
    state.globalReducerData.propertyId,
    state.globalReducerData.searchDate,
    state.BookingReducerData.getFinalLocData,
    state.locationReducer.selectedBookedLocation,
    state.BookingReducerData.subTotal,
    state.globalReducerData.bookFor,
    state.servicesReducerData.barServiceData,
    state.servicesReducerData.normalServiceData,
    state.servicesReducerData.hourServiceData,
    state.BookingReducerData.getCombinedLocationObject,
    state.UserReducerData.userProfile,
    state.globalReducerData.selectedProperty,
    state.globalReducerData.getModalBookingPeriod,
    state.BookingReducerData.getSeasonalFlag,
  ]);

  const toast = useRef('');
  const NewBarServiceData =
    barServiceData && barServiceData.filter(x => x.count > 0);
  const NewNormalServiceData =
    normalServiceData && normalServiceData.filter(x => x.count > 0);
  const NewHourServiceData = hourServiceData ? hourServiceData : [];
  const enabledBook =
    payNowFlag ||
    payAtPropertyFlag ||
    depositNowhalfFlag ||
    payAtPropertyNoCreditFlag;
  var barTotal = 0;
  var serviceTotal = 0;
  var hourlyTotal = 0;
  var additionalLocation = subTotal ? subTotal : 0;

  NewBarServiceData &&
    NewBarServiceData.forEach(data => {
      var td = parseInt(data.ServicePrice) * parseInt(data.count);
      barTotal = parseInt(barTotal) + parseInt(td);
    });

  NewNormalServiceData &&
    NewNormalServiceData.forEach(data => {
      var td = parseInt(data.ServicePrice) * parseInt(data.count);
      serviceTotal = parseInt(serviceTotal) + parseInt(td);
    });

  NewHourServiceData &&
    NewHourServiceData.forEach(data => {
      var td = data.totalPrice ? parseFloat(data.totalPrice) : 0;
      hourlyTotal = parseFloat(hourlyTotal) + parseFloat(td);
    });

  var subTotalPrice =
    barTotal + serviceTotal + hourlyTotal + additionalLocation;

  const loadPropertyDetails = async () => {
    setloading(true);
    // setShowBooking(false);
    dispatch(setShowBooking(false));
    const postData = {
      propertyId: propertyId,
      bathHouseId: bathHouseId,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.getPropertyWithBathHouseDetails}`,
      postData,
    );
    if (status) {
      setPropertyData(data.data);
      getPaymentOptions();
    } else {
      let errorMessage = error ? error : message;
      setError(errorMessage);
      setloading(false);
    }
  };

  const getPaymentOptions = async () => {
    setloading(true);
    dispatch(setShowBooking(false));
    const postData = {
      propertyId: propertyId,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.getPaymentOptions}`,
      postData,
    );
    if (status) {
      let showData = data.data;
      console.log(showData);
      let locationPaymentOptions = showData.locationPaymentOptions;
      let servicePaymentOptions = showData.servicePaymentOptions;
      console.log(locationPaymentOptions, servicePaymentOptions);
      if (bookFor == 'services') {
        setShowAdvancedBalanceInfo(
          servicePaymentOptions.advanced_balance_structure_info
            ? servicePaymentOptions.advanced_balance_structure_info
            : 0,
        );
        setShowPayInStructureInfo(
          servicePaymentOptions.pay_in_structure_info
            ? servicePaymentOptions.pay_in_structure_info
            : 0,
        );
        setDepositnowHalf(
          servicePaymentOptions.deposit_now_half_info
            ? servicePaymentOptions.deposit_now_half_info
            : 0,
        );
        setpayAtPropertyNoCredit(
          servicePaymentOptions.pay_at_property_no_credit_info
            ? servicePaymentOptions.pay_at_property_no_credit_info
            : 0,
        );
        setShowPayatPropertyInfo(
          servicePaymentOptions.pay_at_property_info
            ? servicePaymentOptions.pay_at_property_info
            : 0,
        );
        setShowPayNowInfo(
          servicePaymentOptions.pay_now_info
            ? servicePaymentOptions.pay_now_info
            : 0,
        );
        createSummery();
      } else {
        setShowAdvancedBalanceInfo(
          locationPaymentOptions.advanced_balance_structure_info
            ? locationPaymentOptions.advanced_balance_structure_info
            : 0,
        );
        setShowPayInStructureInfo(
          locationPaymentOptions.pay_in_structure_info
            ? locationPaymentOptions.pay_in_structure_info
            : 0,
        );
        setDepositnowHalf(
          locationPaymentOptions.deposit_now_half_info
            ? locationPaymentOptions.deposit_now_half_info
            : 0,
        );
        setpayAtPropertyNoCredit(
          locationPaymentOptions.pay_at_property_no_credit_info
            ? locationPaymentOptions.pay_at_property_no_credit_info
            : 0,
        );
        setShowPayatPropertyInfo(
          locationPaymentOptions.pay_at_property_info
            ? locationPaymentOptions.pay_at_property_info
            : 0,
        );
        setShowPayNowInfo(
          locationPaymentOptions.pay_now_info
            ? locationPaymentOptions.pay_now_info
            : 0,
        );
        createSummery();
      }

      // setShowAdvancedBalanceInfo(data.data.advanced_balance_structure_info);
      // setShowPayInStructureInfo(data.data.pay_in_structure_info);
      // setDepositnowHalf(data.data.deposit_now_half_info);
      // setpayAtPropertyNoCredit(data.data.pay_at_property_no_credit_info);
      // setShowPayatPropertyInfo(data.data.pay_at_property_info);
      // setShowPayNowInfo(data.data.pay_now_info);
      // createSummery();
    } else {
      let errorMessage = error ? error : message;
      setError(errorMessage);
      setloading(false);
    }
  };

  const nextStep = () => {
    if (showPayStep) {
      bookByTypes();
      // navigation.navigate('BookingConfirm');
    } else {
      setShowPayStep(true);
    }
  };

  const createSummery = disCountValue => {
    var discountedTotal = disCountValue;

    var finaltotal =
      VouchersData && VouchersData.value ? disCountValue : subTotalPrice;

    let summaryObject = {
      subTotal: subTotalPrice,
      payableAmount: discountedTotal ? discountedTotal : subTotalPrice,
      appliedPrice: 0,
      paymentMode: 0,
      expenseDataTotal: 0,
      remainingPayment: 0,
    };

    setPaymentDetails(summaryObject);

    let bookingPaymentObject = {
      subTotal: subTotalPrice,
      payableAmount: finaltotal,
      appliedPrice: null,
      toPay: 0,
      isPaidFlag: false,
      paymentMode: null,
      getCustExpenseData: [],
      expenseDataTotal: 0,
      remainingPayment: 0,
      deposit: 0,
      depositList: [],
    };

    const additionalList = [];

    selectedBookedLocation &&
      selectedBookedLocation.length > 0 &&
      selectedBookedLocation.map((item, index) => {
        item &&
          item.additem &&
          item.additem.map((e, i) => {
            additionalList.push({
              name: e.name,
              it: e.it,
              value: e.value,
              price: e.price,
            });
          });
      });

    const addItemLocationData =
      getCombinedLocationObject &&
      getCombinedLocationObject.length > 0 &&
      getCombinedLocationObject.filter(x => x.type == 'additional');
    const pkgItemLocationData =
      getCombinedLocationObject &&
      getCombinedLocationObject.length > 0 &&
      getCombinedLocationObject.filter(x => x.type == 'package');
    console.log('getCombinedLocationObject', getCombinedLocationObject);
    let bookingObject = {
      additionalList: additionalList,
      barServiceData: [],
      normalServiceData: [],
      getFinalLocData: getFinalLocData,
      HourServiceData: [],
      getPriceSectionData: [],
      addItemLocationData: addItemLocationData,
      pkgItemLocationData: pkgItemLocationData,
      getCombinedLocationObject: getCombinedLocationObject
        ? getCombinedLocationObject
        : [],
      subTotal: subTotalPrice,
      payableAmount: finaltotal,
      appliedPrice: 0,
      discountAndVouchersData: VouchersData ? VouchersData : {},
      bookingPaymentObject: bookingPaymentObject,
    };
    setBookedObj(bookingObject);

    setloading(false);
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPaymentOptions();
      // loaderUserData()
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const calculatePercentage = (num, per) => {
    return num - (num / 100) * per;
  };

  const getpayNowMode = () => {
    setPayNowFlag(!payNowFlag);
    setPayAtPropertyFlag(false);
    setDepositnowHalfFlag(false);
    setpayAtPropertyNoCreditFlag(false);
  };

  const getPayPropertyMode = () => {
    setPayNowFlag(false);
    setPayAtPropertyFlag(!payAtPropertyFlag);
    setpayAtPropertyNoCreditFlag(false);
    setDepositnowHalfFlag(false);
  };

  const DepositNowBalMode = () => {
    setDepositnowHalfFlag(!depositNowhalfFlag);
    setPayNowFlag(false);
    setPayAtPropertyFlag(false);
    setpayAtPropertyNoCreditFlag(false);
  };

  const payPropNoCreditCard = () => {
    setpayAtPropertyNoCreditFlag(!payAtPropertyNoCreditFlag);
    setDepositnowHalfFlag(false);
    setPayNowFlag(false);
    setPayAtPropertyFlag(false);
  };

  const bookByTypes = async () => {
    if (bookFor == 'services') {
      await submitServiceBooking();
    } else {
      await submitLocationBooking();
    }
  };

  const submitServiceBooking = async () => {
    let servicesData = {
      barServiceData: barServiceData ? barServiceData : [],
      normalServiceData: normalServiceData ? normalServiceData : [],
      hourlyServiceData: hourServiceData ? hourServiceData : [],
    };

    if (payNowFlag) {
      paymentDetails.remainingPayment = 0;
    }
    if (payAtPropertyFlag) {
      let tmpAmount = paymentDetails.payableAmount;
      paymentDetails.payableAmount = 0;
      paymentDetails.remainingPayment = tmpAmount;
    }
    if (payInstructureFlag) {
      paymentDetails.payableAmount = 0;
      paymentDetails.remainingPayment = paymentDetails.payableAmount;
    }
    if (advancedBalanceStrucFlag) {
      let payableAmount = parseFloat(paymentDetails.payableAmount);
      paymentDetails.payableAmount = parseFloat(payableAmount) / 2;
      paymentDetails.remainingPayment = parseFloat(payableAmount) / 2;
    }

    const finalObjectData = {
      customerData: {
        firstName: nonRegistertedUser
          ? nonRegistertedUser.firstName + ' ' + nonRegistertedUser.lastName
          : userProfile
          ? userProfile.firstname + ' ' + userProfile.lastname
          : '',
        mobile: nonRegistertedUser
          ? nonRegistertedUser.mobileNo
          : userProfile
          ? userProfile.mobile
          : '',
        email: nonRegistertedUser
          ? nonRegistertedUser.email
          : userProfile
          ? userProfile.email
          : '',
      },
      servicesData: servicesData,
      discountData: VouchersData ? VouchersData : {},
      payments: paymentDetails,
      propertyId: propertyId,
      agent: nonRegistertedUser ? nonRegistertedUser.id : userProfile.id,
      startDate: new Date(),
      note: '',
      payNow: payNowFlag,
      referenceUserId: 0,
      bookingType: 2,
      customerId: nonRegistertedUser ? nonRegistertedUser.id : userProfile.id,
      bookingBy: 2,
      bathHouseId: bathHouseId,
      payment_status: 2,
      booking_type: 2,
    };
    console.log(finalObjectData);
    setloading(true);
    const {data, message, error, sucess} = await postDataToServer(
      `${Api.servicesReservation}`,
      finalObjectData,
    );
    if (sucess) {
      setloading(false);
      // Pay now method
      if (payNowFlag) {
        const showObj = {
          payment_method: 'Pay Now',
          total_order_amount: paymentDetails.subTotal
            ? paymentDetails.subTotal
            : paymentDetails.subTotal,
          payable_amount: paymentDetails.payableAmount,
          remaining_amount: 0,
        };

        navigation.navigate('PaymentProcessing', {
          state: data.bookingDetails,
          bookFor: 'service',
          booking_type: 2,
          bathHouseId: bathHouseId,
          paymentType: 'pay_now',
          showObj: showObj,
        });

        // await this.props.history.push({
        //   pathname: '/payment-processing',
        //   state: response.data.bookingDetails,
        //   bookFor: 'service',
        //   booking_type: 2,
        //   bathHouseId: this.state.bathHouseId,
        //   paymentType: 'pay_now',
        //   showObj: showObj,
        // });
      }

      // Pay at property method
      if (payAtPropertyFlag) {
        await payAtPropSuccessForMail(
          [],
          data.bookingDetails,
          'service',
          bathHouseId,
        );
      }

      //  Pay in structure method

      if (payInstructureFlag) {
        const showObj = {
          payment_method: 'Pay In structure',
          total_order_amount: paymentDetails.subTotal
            ? paymentDetails.subTotal
            : paymentDetails.subTotal,
          payable_amount: paymentDetails.payableAmount,
          remaining_amount: paymentDetails.remainingPayment,
        };

        navigation.navigate('PaymentProcessing', {
          state: data.bookingDetails,
          bookFor: 'service',
          booking_type: 2,
          bathHouseId: bathHouseId,
          paymentType: 'pay_in_structure',
          showObj: showObj,
        });

        // await this.props.history.push({
        //   pathname: '/payment-processing',
        //   state: response.data.bookingDetails,
        //   bookFor: 'service',
        //   booking_type: 2,
        //   bathHouseId: this.state.bathHouseId,
        //   paymentType: 'pay_in_structure',
        //   showObj: showObj,
        // });
      }

      //  Advance balance structure method
      if (advancedBalanceStrucFlag) {
        const showObj = {
          payment_method: 'Advance & Balance in structure',
          total_order_amount: paymentDetails.subTotal
            ? paymentDetails.subTotal
            : paymentDetails.subTotal,
          payable_amount: paymentDetails.payableAmount,
          remaining_amount: parseFloat(paymentDetails.payableAmount) / 2,
        };

        navigation.navigate('PaymentProcessing', {
          state: data.bookingDetails,
          bookFor: 'service',
          booking_type: 2,
          bathHouseId: bathHouseId,
          paymentType: 'advance_balance',
          showObj: showObj,
        });

        // await this.props.history.push({
        //   pathname: '/payment-processing',
        //   state: response.data.bookingDetails,
        //   bookFor: 'service',
        //   booking_type: 2,
        //   bathHouseId: this.state.bathHouseId,
        //   paymentType: 'advance_balance',
        //   showObj: showObj,
        // });
      }
    } else {
      let errorMessage = error ? error : message;
      setError(errorMessage);
      setloading(false);
    }
  };

  const submitLocationBooking = async () => {
    // navigation.navigate('PaymentProcessing');
    const searchData = searchDate ? searchDate : [];
    const fromDate =
      searchData && searchData.startDate ? searchData.startDate : new Date();
    const endDate =
      searchData && searchData.endDate ? searchData.endDate : new Date();
    const bookingPaymentObject = bookedObj.bookingPaymentObject;
    let isPaidFlag = false;
    let payment_status = 2;
    if (payNowFlag) {
      bookingPaymentObject.deposit = 0;
      bookingPaymentObject.toPay = 0;
      bookingPaymentObject.isPaidFlag = true;
      bookingPaymentObject.remainingPayment = 0;
      isPaidFlag = true;
    }
    if (payAtPropertyNoCreditFlag) {
      bookingPaymentObject.deposit = 0;
      bookingPaymentObject.isPaidFlag = false;
      bookingPaymentObject.toPay = bookingPaymentObject.payableAmount;
      payment_status = 1;
    }
    if (payAtPropertyFlag) {
      let tmpAmount = bookingPaymentObject.payableAmount;
      bookingPaymentObject.payableAmount = 0;
      bookingPaymentObject.toPay = tmpAmount;
    }
    if (depositNowhalfFlag) {
      let payableAmount = _checkIsNumberFloat(
        parseFloat(bookingPaymentObject.payableAmount),
      );
      bookingPaymentObject.deposit =
        _checkIsNumberFloat(parseFloat(payableAmount)) / 2;
      bookingPaymentObject.toPay =
        _checkIsNumberFloat(parseFloat(payableAmount)) / 2;
    }

    // if (payNowFlag) {
    //   bookingPaymentObject.deposit = 0;
    //   bookingPaymentObject.toPay = 0;
    //   bookingPaymentObject.isPaidFlag = true;
    //   bookingPaymentObject.remainingPayment = 0;
    //   isPaidFlag = true;
    // }
    // if (payAtPropertyFlag) {
    //   bookingPaymentObject.deposit = 0;
    //   bookingPaymentObject.isPaidFlag = false;
    //   bookingPaymentObject.toPay = bookingPaymentObject.payableAmount;
    //   payment_status = 1;
    // }
    // if (payInstructureFlag) {
    //   let tmpAmount = bookingPaymentObject.payableAmount;
    //   bookingPaymentObject.payableAmount = 0;
    //   bookingPaymentObject.toPay = tmpAmount;
    // }
    // if (advancedBalanceStrucFlag) {
    //   let payableAmount = parseFloat(bookingPaymentObject.payableAmount);
    //   bookingPaymentObject.deposit = parseFloat(payableAmount) / 2;
    //   bookingPaymentObject.toPay = parseFloat(payableAmount) / 2;
    // }
    const locationWithPeriod =
      bookedObj.getCombinedLocationObject &&
      bookedObj.getCombinedLocationObject.length > 0 &&
      (await bookedObj.getCombinedLocationObject.map(itm => ({
        ...itm,
        booking_period: getModalBookingPeriod,
      })));
    console.log(
      'locationWithPeriod',
      locationWithPeriod,
      bookedObj.getCombinedLocationObject,
      bookedObj,
    );
    const finalObjectData = {
      packageSelectedData:
        bookedObj.getFinalLocData && bookedObj.getFinalLocData
          ? bookedObj.getFinalLocData
          : [],

      customerData: {
        name: nonRegistertedUser
          ? nonRegistertedUser.firstName + ' ' + nonRegistertedUser.lastName
          : userProfile
          ? userProfile.firstname + ' ' + userProfile.lastname
          : '',

        mobile: nonRegistertedUser
          ? nonRegistertedUser.mobileNo
          : userProfile
          ? userProfile.mobile
          : '',
        email: nonRegistertedUser
          ? nonRegistertedUser.email
          : userProfile
          ? userProfile.email
          : '',
        // mobile: nonRegistertedUser   userProfile ? userProfile.mobile : '',
        // email: userProfile ? userProfile.email : '',
      },
      bookingDates: {
        // startDate: fromDate,
        // endDate: endDate,
        startDate: moment(fromDate).startOf('day').toString(),
        endDate: moment(endDate).endOf('day').toString(),
      },
      locationData: locationWithPeriod,
      additionalItemLocData: bookedObj.addItemLocationData
        ? bookedObj.addItemLocationData
        : [],

      servicesData: {
        barServices: [],
        normalServices: [],
        houlryServices: [],
        HourServiceData: [],
      },
      // discountData:  {
      //   startDate: bookedObj.discountAndVouchersData.start,
      //   endDate: bookedObj.discountAndVouchersData.end,
      //   name: bookedObj.discountAndVouchersData.name,
      //   type: bookedObj.discountAndVouchersData.type,
      //   value: bookedObj.discountAndVouchersData.value,
      // },
      discountData: bookedObj.discountAndVouchersData,
      booking_map: locationWithPeriod,
      bathHouseId: bathHouseId,
      payments: {
        subTotal: bookedObj.subTotal ? bookedObj.subTotal : bookedObj.subTotal,
        payableAmount: bookedObj.payableAmount,
        appliedPrice: bookedObj.appliedPrice ? bookedObj.appliedPrice : 0,
        isPaidFlag: isPaidFlag,
        paymentMode: bookedObj.paymentMode ? bookedObj.paymentMode : '',
        getCustExpenseData: bookedObj.customerExpenseData
          ? bookedObj.customerExpenseData
          : [],
      },

      bookingPaymentData: bookedObj.bookingPaymentObject,
      propertyId: propertyId,
      agent: nonRegistertedUser ? nonRegistertedUser.id : userProfile.id,
      checkIn: '',
      note: '',
      additionalList: bookedObj.additionalList ? bookedObj.additionalList : [],
      id: null,
      reservation_code: Math.random().toString(36).slice(2),
      bookingBy: 2,
      payment_status: payment_status,
      booking_type: 1,
      booking_absences: [],
      hourlyBookingServiceData: [],
      booking_period: getModalBookingPeriod,
      customerId: nonRegistertedUser ? nonRegistertedUser.id : userProfile.id,
      seasonalPass: getSeasonalFlag,
    };

    console.log('sdskdjksd', finalObjectData);

    setloading(true);

    const {data, message, error, sucess} = await postDataToServer(
      `${Api.booking}`,
      finalObjectData,
    );
    if (sucess) {
      setloading(false);
      // Pay now method
      if (payNowFlag) {
        const showObj = {
          payment_method: 'Pay Now',
          total_order_amount: paymentDetails.subTotal
            ? paymentDetails.subTotal
            : paymentDetails.subTotal,
          payable_amount: paymentDetails.payableAmount,
          remaining_amount: 0,
        };

        navigation.navigate('PaymentProcessing', {
          state: data.bookingDetails,
          bookFor: 'location',
          booking_type: 1,
          bathHouseId: bathHouseId,
          paymentType: 'pay_now',
          showObj: showObj,
        });
        // await this.props.history.push({
        //   pathname: "/payment-processing",
        //   state: response.data.bookingDetails,
        //   bookFor: 'service',
        //   booking_type : 2,
        //   bathHouseId : this.state.bathHouseId,
        //   paymentType : 'pay_now',
        //   showObj : showObj
        // });
      }

      // Pay at property method

      // if (payAtPropertyNoCreditFlag) {
      // 	await this._payAtPropSuccessForMail(response.data.bookingDetails, [], 'location', bathHouseId);
      // }

      if (payAtPropertyNoCreditFlag) {
        await payAtPropSuccessForMail(
          data.bookingDetails,
          [],
          'location',
          bathHouseId,
        );
      }

      //  Pay in structure method
      if (payAtPropertyFlag) {
        const showObj = {
          payment_method: 'Pay In property',
          total_order_amount: bookedObj.subTotal
            ? bookedObj.subTotal
            : bookedObj.subTotal,
          payable_amount: bookingPaymentObject.payableAmount,
          remaining_amount: bookedObj.payableAmount,
        };
        // await this.props.history.push({
        // 	pathname: "/payment-processing",
        // 	state: response.data.bookingDetails,
        // 	bookFor: 'location',
        // 	booking_type: 2,
        // 	bathHouseId: this.state.bathHouseId,
        // 	paymentType: 'pay_in_structure',
        // 	showObj: showObj
        // });
        navigation.navigate('PaymentProcessing', {
          state: data.bookingDetails,
          bookFor: 'location',
          booking_type: 1,
          bathHouseId: bathHouseId,
          paymentType: 'pay_in_structure',
          showObj: showObj,
        });
      }

      //  Advance balance structure method
      if (depositNowhalfFlag) {
        const showObj = {
          payment_method: 'Advance & Balance in structure',
          total_order_amount: bookedObj.subTotal
            ? bookedObj.subTotal
            : bookedObj.subTotal,
          payable_amount: bookingPaymentObject.payableAmount,
          remaining_amount:
            _checkIsNumberFloat(parseFloat(bookedObj.payableAmount)) / 2,
        };

        navigation.navigate('PaymentProcessing', {
          state: data.bookingDetails,
          bookFor: 'location',
          booking_type: 1,
          bathHouseId: bathHouseId,
          paymentType: 'advance_balance',
          showObj: showObj,
        });
      }

      // //  Pay in structure method
      // if (payInstructureFlag) {
      //   const showObj = {
      //     payment_method: 'Pay In structure',
      //     total_order_amount: bookedObj.subTotal
      //       ? bookedObj.subTotal
      //       : bookedObj.subTotal,
      //     payable_amount: bookingPaymentObject.payableAmount,
      //     remaining_amount: bookedObj.payableAmount,
      //   };

      //   navigation.navigate('PaymentProcessing', {
      //     state: data.bookingDetails,
      //     bookFor: 'location',
      //     booking_type: 2,
      //     bathHouseId: bathHouseId,
      //     paymentType: 'pay_in_structure',
      //     showObj: showObj,
      //   });
      // }

      // //  Advance balance structure method
      // if (advancedBalanceStrucFlag) {
      //   const showObj = {
      //     payment_method: 'Advance & Balance in structure',
      //     total_order_amount: bookedObj.subTotal
      //       ? bookedObj.subTotal
      //       : bookedObj.subTotal,
      //     payable_amount: bookedObj.payableAmount,
      //     remaining_amount: parseFloat(bookedObj.payableAmount) / 2,
      //   };

      //   navigation.navigate('PaymentProcessing', {
      //     state: data.bookingDetails,
      //     bookFor: 'location',
      //     booking_type: 2,
      //     bathHouseId: bathHouseId,
      //     paymentType: 'advance_balance',
      //     showObj: showObj,
      //   });

      //   // await this.props.history.push({
      //   // 	pathname: "/payment-processing",
      //   // 	state: response.data.bookingDetails,
      //   // 	bookFor: 'location',
      //   // 	booking_type : 2,
      //   // 	bathHouseId : this.state.bathHouseId,
      //   // 	paymentType : 'advance_balance',
      //   // 	showObj : showObj
      //   // });
      // }
    } else {
      let errorMessage = error ? error : message;
      setError(errorMessage);
      setloading(false);
    }
  };

  const payAtPropSuccessForMail = async (
    postDataLoc,
    postDataService,
    bookFor,
    bathHouseId,
  ) => {
    let passURLId = null;
    let booking_id = '';
    let reservation_id = '';
    let pending_amount = 0;

    if (bookFor === 'location') {
      booking_id = postDataLoc.id;
      pending_amount = postDataLoc.booking_payments.toPay;
      passURLId = postDataLoc.id;
    }
    if (bookFor === 'service') {
      reservation_id = postDataService.id;
      pending_amount = postDataService.payments.remainingPayment;
      passURLId = postDataService.id;
    }
    const passData = {
      booking_id: booking_id,
      reservation_id: reservation_id,
      pending_amount: pending_amount,
    };

    const {data, message, error, sucess} = await postDataToServer(
      `${Api.TransactionEntryForPayAtProperty}`,
      passData,
    );
    if (sucess) {
      navigation.navigate('BookingConfirm', {
        id: passURLId,
        fromPage: bookFor,
        bathHouseId: bathHouseId,
      });
    } else {
      let errorMessage = error ? error : message;
      setError(errorMessage);
      setloading(false);
    }
  };

  const applyCode = async () => {
    if (coupenCode == '') {
      toast.current.show('Please Enter Coupen Code');
    } else {
      const postData = {
        propertyId: propertyId,
        code: coupenCode,
      };
      const {data, message, error, status} = await postDataToServer(
        `${Api.checkDiscount}`,
        postData,
      );
      if (status) {
        setVouchersData(data.data);
        setCoupenError(false);
        var discountedTotal =
          data.data.type === 'fixed'
            ? subTotalPrice - parseInt(data.data.value)
            : data.data.type === 'percentage'
            ? calculatePercentage(subTotalPrice, parseInt(data.data.value))
            : subTotalPrice;
        var finaltotal = data.data.value ? discountedTotal : subTotalPrice;
        setFinaltotalValue(finaltotal);
        createSummery(finaltotal);
      } else {
        setCoupenError(true);
      }
    }
  };
  return (
    <>
      <Layout style={{flex: 1}} level="1">
        <HeaderComponent showBackButton />
        <SecondaryHeader
          title={
            showPayStep
              ? strings('end_reservation')
              : strings('reservation_summary')
          }
        />
        {loading ? (
          <>
            <CustomSkeletonList />
            <CustomSkeletonList />
          </>
        ) : (
          <>
            {showPayStep ? (
              <ScrollView bounces={false}>
                <StripeProvider publishableKey={GLOBAL.STRIPE_KEY}>
                  <Layout
                    level="1"
                    style={[
                      styles.container,
                      {
                        marginTop: themeConfig.margin,
                        backgroundColor: '#F6F6F6',
                        width: windowWidth,
                        height: windowHeight,
                      },
                    ]}>
                    {/* <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View style={{marginBottom: themeConfig.margin * 2}}>
                        <Typography
                          category="s2"
                          style={{fontSize:12}}
                          status="basic">
                          {strings('when_pay')}
                        </Typography>
                      </View>
                    </View> */}
                    {showPayNowInfo == 1 && (
                      <CheckBox
                        checked={payNowFlag}
                        status="primary"
                        onChange={nextChecked => getpayNowMode()}
                        style={{
                          marginBottom: themeConfig.margin * 2,
                          marginHorizontal: themeConfig.margin * 2,
                        }}>
                        <Typography
                          category="s2"
                          style={{fontSize: 12}}
                          status="basic">
                          {strings('pay_now')}
                        </Typography>
                      </CheckBox>
                    )}

                    {showPayatPropertyInfo == 1 && (
                      <CheckBox
                        checked={payAtPropertyFlag}
                        status="primary"
                        onChange={nextChecked => getPayPropertyMode()}
                        style={{
                          marginBottom: themeConfig.margin * 2,
                          marginHorizontal: themeConfig.margin * 2,
                        }}>
                        <Typography
                          category="s2"
                          style={{fontSize: 12}}
                          status="basic">
                          {strings('pay_at_property')}
                        </Typography>
                      </CheckBox>
                    )}

                    {depositNowhalf == 1 && (
                      <CheckBox
                        status="primary"
                        checked={depositNowhalfFlag}
                        onChange={nextChecked => DepositNowBalMode()}
                        style={{
                          marginBottom: themeConfig.margin * 2,
                          marginHorizontal: themeConfig.margin * 2,
                        }}>
                        <Typography
                          category="s2"
                          style={{fontSize: 12}}
                          status="basic">
                          {strings('deposite_now_half')}
                        </Typography>
                      </CheckBox>
                    )}

                    {payAtPropertyNoCredit == 1 && (
                      <CheckBox
                        checked={payAtPropertyNoCreditFlag}
                        status="primary"
                        onChange={nextChecked => payPropNoCreditCard()}
                        style={{
                          marginBottom: themeConfig.margin * 2,
                          marginHorizontal: themeConfig.margin * 2,
                        }}>
                        <Typography
                          category="s2"
                          style={{fontSize: 12}}
                          status="basic">
                          {strings('pay_in_the_property_without_credit_card')}
                        </Typography>
                      </CheckBox>
                    )}
                    {payAtPropertyFlag && (
                      <>
                        <Divider />
                        <View
                          style={{
                            marginTop: themeConfig.margin / 2,
                            marginBottom: themeConfig.margin,
                            marginHorizontal: themeConfig.margin * 2,
                          }}>
                          <Typography
                            category="c1"
                            style={{fontSize: 10}}
                            status="basic">
                            {strings('pay_at_property_msg')}
                          </Typography>
                        </View>
                      </>
                    )}

                    <View style={{flex: 1}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      />
                    </View>
                  </Layout>
                </StripeProvider>
              </ScrollView>
            ) : (
              <ScrollView bounces={false}>
                <Layout style={{marginHorizontal: themeConfig.margin * 2}}>
                  <PropertyCard
                    name={selectedProperty.bathouseName}
                    address={selectedProperty.address}
                    imageUrl={selectedProperty.mainPhoto}
                    plain
                    showImage
                    showDate
                    date={searchDate}
                  />
                </Layout>

                {bookFor === 'location' && (
                  <>
                    <Layout level="1" style={styles.packageCardStyle}>
                      {getFinalLocData &&
                        getFinalLocData.length > 0 &&
                        getFinalLocData.map((item, index) => {
                          return (
                            <>
                              <View
                                style={{
                                  flexDirection: 'row',
                                }}>
                                <View style={styles.leftSection}>
                                  <Typography
                                    category="s1"
                                    style={{fontSize: 14}}
                                    status="basic">
                                    {strings('location')}
                                  </Typography>
                                </View>
                                <View style={styles.rightSection}>
                                  <Typography
                                    category="s2"
                                    style={{
                                      fontSize: 13,
                                      color: themeConfig.colors.primary,
                                    }}
                                    status="basic">
                                    {item.Location}
                                  </Typography>
                                </View>
                              </View>

                              <View
                                style={{
                                  flexDirection: 'row',
                                }}>
                                <View style={styles.leftSection}>
                                  <Typography
                                    category="s1"
                                    style={{fontSize: 14}}
                                    status="basic">
                                    {strings('package')}
                                  </Typography>
                                </View>
                                <View style={styles.rightSection}>
                                  <Typography
                                    category="s2"
                                    style={{
                                      fontSize: 13,
                                      color: themeConfig.colors.primary,
                                    }}
                                    status="basic">
                                    {item.PackageName}
                                  </Typography>
                                </View>
                              </View>

                              {selectedBookedLocation &&
                                selectedBookedLocation.length > 0 &&
                                selectedBookedLocation.map((element, index) => {
                                  return (
                                    <>
                                      {element.name === item.Location && (
                                        <>
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              marginVertical:
                                                themeConfig.margin,
                                            }}>
                                            <View style={styles.leftSection}>
                                              <Typography
                                                category="s1"
                                                style={{fontSize: 14}}
                                                status="basic">
                                                {strings('no_of_Person')}
                                              </Typography>
                                            </View>
                                            <View style={styles.rightSection}>
                                              <Typography
                                                category="s2"
                                                style={{
                                                  fontSize: 13,
                                                  color:
                                                    themeConfig.colors.primary,
                                                }}
                                                status="basic">
                                                {element.forPeopleCount}
                                              </Typography>
                                            </View>
                                          </View>

                                          {element &&
                                            element.additem &&
                                            element.additem.length > 0 &&
                                            element.additem.map((e, i) => {
                                              return (
                                                <>
                                                  {e && e.value > 0 && (
                                                    <>
                                                      <View
                                                        style={{
                                                          flexDirection: 'row',
                                                          marginVertical:
                                                            themeConfig.margin,
                                                        }}>
                                                        <View
                                                          style={
                                                            styles.leftSection
                                                          }>
                                                          <Typography
                                                            category="s1"
                                                            style={{
                                                              fontSize: 14,
                                                            }}
                                                            status="basic">
                                                            {strings(
                                                              'additional_items',
                                                            )}
                                                          </Typography>
                                                        </View>
                                                        <View
                                                          style={
                                                            styles.rightSection
                                                          }>
                                                          <Typography
                                                            category="s2"
                                                            style={{
                                                              fontSize: 13,
                                                              color:
                                                                themeConfig
                                                                  .colors
                                                                  .primary,
                                                            }}
                                                            status="basic">
                                                            {e.value +
                                                              ' ' +
                                                              e.name}
                                                          </Typography>
                                                        </View>
                                                      </View>
                                                      {/* <View>
                                                    <Typography
                                                      category="s1"
                                                      style={{
                                                        fontWeight: '500',
                                                        marginBottom:
                                                          themeConfig.margin,
                                                      }}>
                                                      {strings(
                                                        'additional_items',
                                                      )}
                                                    </Typography>
                                                  </View> */}

                                                      {/* <View
                                                    style={{
                                                      flexDirection: 'row',
                                                    }}>
                                                    <View
                                                      style={
                                                        styles.leftSection
                                                      }>
                                                      <Typography
                                                        category="s2"
                                                        style={{
                                                          fontWeight: '400',
                                                        }}
                                                        status="basic">
                                                        {e.name}
                                                      </Typography>
                                                    </View>
                                                    <View
                                                      style={
                                                        styles.rightSection
                                                      }>
                                                      <Typography
                                                        category="s2"
                                                        style={{
                                                          fontWeight: '600',
                                                        }}
                                                        status="basic">
                                                        X {e.value}
                                                      </Typography>
                                                    </View>
                                                    <View
                                                      style={
                                                        styles.rightSection
                                                      }>
                                                      <Typography
                                                        category="s2"
                                                        style={{
                                                          fontWeight: '600',
                                                        }}
                                                        status="basic">
                                                        {e.price} €
                                                      </Typography>
                                                    </View>
                                                  </View> */}
                                                    </>
                                                  )}
                                                </>
                                              );
                                            })}
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                              {/* <Divider /> */}
                              {index + 1 !== getFinalLocData.length && (
                                <Divider
                                  style={{
                                    backgroundColor: themeConfig.colors.primary,
                                    borderWidth: 1,
                                    borderColor: themeConfig.colors.primary,
                                  }}
                                />
                              )}

                              {bookFor === 'services' && (
                                <>
                                  <Typography
                                    category="s1"
                                    style={{fontSize: 14}}
                                    status="basic">
                                    {strings('additiona_services')}
                                  </Typography>
                                  {NewBarServiceData &&
                                    NewBarServiceData.map((data, index) => (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          marginVertical: themeConfig.margin,
                                        }}>
                                        <View style={styles.leftSection}>
                                          <Typography
                                            category="s1"
                                            style={{fontSize: 14}}
                                            status="basic">
                                            {strings('additiona_services')}
                                          </Typography>
                                        </View>
                                        <View style={styles.rightSection}>
                                          <Typography
                                            category="s2"
                                            style={{
                                              fontSize: 13,
                                              color: themeConfig.colors.primary,
                                            }}
                                            status="basic">
                                            {data.ServiceName}
                                          </Typography>
                                        </View>
                                      </View>
                                    ))}

                                  {NewNormalServiceData &&
                                    NewNormalServiceData.map((data, index) => (
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          marginVertical: themeConfig.margin,
                                        }}>
                                        <View style={styles.leftSection}>
                                          <Typography
                                            category="s1"
                                            style={{fontSize: 14}}
                                            status="basic">
                                            {strings('additiona_services')}
                                          </Typography>
                                        </View>
                                        <View style={styles.rightSection}>
                                          <Typography
                                            category="s2"
                                            style={{
                                              fontSize: 13,
                                              color: themeConfig.colors.primary,
                                            }}
                                            status="basic">
                                            {data.ServiceName}
                                          </Typography>
                                        </View>
                                      </View>
                                    ))}

                                  {NewHourServiceData &&
                                    NewHourServiceData.map(
                                      data =>
                                        data.selectedData &&
                                        data.selectedData.length > 0 &&
                                        data.selectedData.map((a, index) => (
                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              marginVertical:
                                                themeConfig.margin,
                                            }}>
                                            <View style={styles.leftSection}>
                                              <Typography
                                                category="s1"
                                                style={{fontSize: 14}}
                                                status="basic">
                                                {strings('additiona_services')}
                                              </Typography>
                                            </View>
                                            <View style={styles.rightSection}>
                                              <Typography
                                                category="s2"
                                                style={{
                                                  fontSize: 13,
                                                  color:
                                                    themeConfig.colors.primary,
                                                }}
                                                status="basic">
                                                {a.name}
                                              </Typography>
                                            </View>
                                          </View>
                                        )),
                                    )}
                                </>
                              )}
                            </>
                          );
                        })}
                    </Layout>
                  </>
                )}

                {bookFor == 'services' && (
                  <Layout level="1" style={styles.packageCardStyle}>
                    <>
                      {NewBarServiceData &&
                        NewBarServiceData.map((data, index) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: themeConfig.margin,
                            }}>
                            <View style={styles.leftSection}>
                              <Typography
                                category="s1"
                                style={{fontSize: 14}}
                                status="basic">
                                {strings('additiona_services')}
                              </Typography>
                            </View>
                            <View style={styles.rightSection}>
                              <Typography
                                category="s2"
                                style={{
                                  fontSize: 13,
                                  color: themeConfig.colors.primary,
                                }}
                                status="basic">
                                {data.ServiceName}
                              </Typography>
                            </View>
                          </View>
                        ))}

                      {NewNormalServiceData &&
                        NewNormalServiceData.map((data, index) => (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: themeConfig.margin,
                            }}>
                            <View style={styles.leftSection}>
                              <Typography
                                category="s1"
                                style={{fontSize: 14}}
                                status="basic">
                                {strings('additiona_services')}
                              </Typography>
                            </View>
                            <View style={styles.rightSection}>
                              <Typography
                                category="s2"
                                style={{
                                  fontSize: 13,
                                  color: themeConfig.colors.primary,
                                }}
                                status="basic">
                                {data.ServiceName}
                              </Typography>
                            </View>
                          </View>
                        ))}

                      {NewHourServiceData &&
                        NewHourServiceData.map(
                          data =>
                            data.selectedData &&
                            data.selectedData.length > 0 &&
                            data.selectedData.map((a, index) => (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginVertical: themeConfig.margin,
                                }}>
                                <View style={styles.leftSection}>
                                  <Typography
                                    category="s1"
                                    style={{fontSize: 14}}
                                    status="basic">
                                    {strings('additiona_services')}
                                  </Typography>
                                </View>
                                <View style={styles.rightSection}>
                                  <Typography
                                    category="s2"
                                    style={{
                                      fontSize: 13,
                                      color: themeConfig.colors.primary,
                                    }}
                                    status="basic">
                                    {a.name}
                                  </Typography>
                                </View>
                              </View>
                            )),
                        )}
                    </>
                  </Layout>
                )}

                <Layout
                  level="1"
                  style={[
                    styles.container,
                    {marginTop: themeConfig.margin},
                    styles.boxStyle,
                  ]}>
                  {VouchersData && (
                    <Layout level="1" style={styles.packageCardStyle}>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginVertical: themeConfig.margin,
                        }}>
                        <View style={styles.leftSection}>
                          <Typography
                            category="s1"
                            style={{fontSize: 14}}
                            status="basic">
                            {VouchersData.name}
                          </Typography>
                        </View>
                        <View style={styles.rightSection}>
                          <Typography
                            category="s2"
                            style={{
                              fontSize: 13,
                              color: themeConfig.colors.primary,
                            }}
                            status="basic">
                            {VouchersData.type === 'fixed' &&
                              VouchersData.value}
                            {VouchersData.type === 'percentage' &&
                              VouchersData.value + '%'}{' '}
                          </Typography>
                        </View>
                      </View>
                    </Layout>
                  )}

                  <Layout
                    level="3"
                    style={{
                      padding: themeConfig.padding * 2,
                      borderRadius: themeConfig.radius * 4,
                      marginTop: themeConfig.margin,
                      backgroundColor: themeConfig.colors.lightBule,
                      marginBottom: themeConfig.margin,
                    }}>
                    <Typography
                      category="s2"
                      style={{
                        fontSize: 16,
                        fontWeight: '500',
                        marginBottom: themeConfig.margin,
                      }}>
                      {strings('I_have_code')}
                    </Typography>
                    <View>
                      <View style={{flex: 1}}>
                        <InputComponent
                          size="medium"
                          placeholder=""
                          style={{backgroundColor: themeConfig.colors.white}}
                          onChangeText={nextValue => setCoupenCode(nextValue)}
                        />
                      </View>
                      <View style={{marginVertical: themeConfig.margin}}>
                        <ButtonComponent
                          size="small"
                          onPress={() => applyCode()}>
                          <Typography
                            status="control"
                            category="p1"
                            style={{fontWeight: '400'}}>
                            {strings('apply')}
                          </Typography>
                        </ButtonComponent>
                      </View>
                    </View>
                    {coupenError && (
                      <Typography category="p1" status="danger">
                        {strings('invalid_coupon_msg')}
                      </Typography>
                    )}
                  </Layout>
                </Layout>
              </ScrollView>
            )}

            <Layout>
              <Divider />
              <View
                style={[
                  styles.boxStyle,
                  {flexDirection: 'row', alignItems: 'center'},
                ]}>
                <View style={{flex: 4, flexDirection: 'row'}}>
                  <Typography
                    category="h6"
                    status="basic"
                    style={{
                      marginHorizontal: themeConfig.margin * 2,
                      fontSize: 14,
                    }}>
                    {strings('total')}{' '}
                  </Typography>
                  <Typography
                    category="s1"
                    style={{
                      right: themeConfig.margin,
                      fontSize: 14,
                    }}>
                    {finaltotalValue ? finaltotalValue : subTotalPrice} €
                  </Typography>
                </View>

                <View style={{flex: 3}}>
                  <DropShadow
                    style={{
                      shadowColor: '#0F379f',
                      shadowOffset: {
                        width: 0,
                        height: 3,
                      },
                      shadowOpacity: 1,
                      shadowRadius: 2,
                    }}>
                    <ButtonComponent
                      size="small"
                      disabled={showPayStep ? !enabledBook : enabledBook}
                      onPress={() => nextStep()}>
                      <Typography
                        status="control"
                        category="h6"
                        style={{fontWeight: '400'}}>
                        {strings('book')}
                      </Typography>
                    </ButtonComponent>
                  </DropShadow>
                </View>
              </View>
            </Layout>
          </>
        )}

        <Toast
          ref={toast} //eslint-disable-line
          position="bottom"
          defaultCloseDelay={8000}
        />
      </Layout>
    </>
  );
};
export default FinishBooking;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
  },
  leftSection: {
    // width: 120,
    // marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    // marginBottom: themeConfig.margin / 2,
  },
  packageCardStyle: {
    backgroundColor: themeConfig.colors.lightBule,
    padding: themeConfig.padding * 2,
    margin: themeConfig.margin * 2,
    marginVertical: themeConfig.margin * 2,
    borderRadius: themeConfig.radius * 2,
  },
});
