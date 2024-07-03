import React, {useState, useRef, useEffect} from 'react';
import {CheckBox, Layout, Radio} from '@ui-kitten/components';
import {StyleSheet, View, Image} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import {strings} from 'i18n/i18n';
import StripeComponent from 'components/StripCard';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';
import Loader from 'components/Loader';
import {useSelector} from 'react-redux';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import GLOBAL from 'resources/constant';
const paymentSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Too_short')
    .max(50, 'Too_long')
    .required('cardHolderVad'),
  email: Yup.string().email('email_error').required('emailVal'),
  paymemntData: Yup.object().required('Card_field_required'),
});

const PaymentProcessingScreen = ({navigation, route}) => {
  const {state, bookFor, booking_type, bathHouseId, paymentType, showObj} =
    route.params || {};
  const [loading, setloading] = useState(false);
  const [showCardSection, setShowCardSection] = useState(false);
  const [showFormSection, setShowFormSection] = useState(false);
  const [isCardPresent, setIsCardPresent] = useState(null);
  const [isCardSelected, setIsCardSelected] = useState(false);
  const [creditCards, setCreditCard] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [CardData, setCardData] = useState([]);
  const stripe = useStripe();
  const [userProfile, language, getFinalPrice] = useSelector(state => [
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
    state.BookingReducerData.getFinalPrice,
  ]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentData, setPaymentData] = useState();
  const [checkedSavePayment, setCheckedSavePayment] = useState(false);
  const [bookedData, setbookData] = useState(state && state ? state : '');

  // console.log("booked data",bookedData);

  const toast = useRef('');

  const loadCardData = async () => {
    setloading(true);
    const postData = {
      userId: userProfile.id,
    };
    const {data, error, message, status} = await postDataToServer(
      `${Api.getCardDeatils}`,
      postData,
    );
    if (status) {
      if (data && data.data && data.data.data && data.data.data.length > 0) {
        setCreditCard(data.data.data);
        setShowCardSection(true);
        setShowFormSection(false);
        setIsCardPresent(true);
      } else {
        setShowFormSection(true);
        setIsCardPresent(false);
        setShowCardSection(false);
      }
      setloading(false);
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
      setIsCardPresent(false);
      setShowFormSection(true);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCardData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const openCardSection = async () => {
    setShowCardSection(true);
    setShowFormSection(false);
  };

  const openAddCardSection = async e => {
    setShowCardSection(false);
    setShowFormSection(true);
  };

  const handlePayment = async values => {
    setloading(true);
    // const paymentMethodResult = await stripe.createToken(values.paymemntData);
    // console.log('values from payment', paymentMethodResult);

    const valuesPaymentData = values.paymemntData;
    const {token, error} = await stripe.createToken({
      valuesPaymentData,
      type: 'Card',
    });

    const paymentMethodResult = token;
    if (paymentMethodResult) {
      let payableAmount = '';
      if (bookFor === 'location') {
        payableAmount =
          bookedData &&
          bookedData.booking_payments &&
          bookedData.booking_payments.payableAmount
            ? bookedData.booking_payments.payableAmount
            : 0;
      }
      if (bookFor === 'service') {
        payableAmount =
          bookedData && bookedData.payments && bookedData.payments.payableAmount
            ? bookedData.payments.payableAmount
            : 0;
      }

      let booking_id = '';
      let reservation_id = '';
      if (bookFor === 'service') {
        reservation_id = bookedData.id;
      }
      if (bookFor === 'location') {
        booking_id = bookedData.id;
      }

      let postData = {};

      if (bookFor === 'location') {
        postData = {
          token: paymentMethodResult.id,
          amount: payableAmount,
          propertyId: bookedData.property_id,
          userId: bookedData.booking_agent,
          booking_id: booking_id,
          save_card_flag: checkedSavePayment,
          booking_type: booking_type,
          reservation_id: reservation_id,
          paymentType: paymentType,
          card_id: '',
          customer_id: '',
          isCard: false,
        };
      }
      if (bookFor === 'service') {
        postData = {
          token: paymentMethodResult.id,
          amount: payableAmount,
          propertyId: bookedData.propertyId,
          userId: bookedData.agent,
          booking_id: booking_id,
          save_card_flag: checkedSavePayment,
          booking_type: booking_type,
          reservation_id: reservation_id,
          paymentType: paymentType,
          card_id: '',
          customer_id: '',
          isCard: false,
        };
      }
      postPaymentData(postData);
    } else {
      let errorMessage = paymentMethodResult.error.message;
      toast.current.show(errorMessage);
    }
  };

  const postPaymentData = async postdata => {
    const {data, error, message, status} = await postDataToServer(
      `${Api.stripePayment}`,
      postdata,
    );
    setloading(true);
    if (status) {
      if (data.data && data.data && data.data.booking_id) {
        const booking_id = data.data && data.data && data.data.booking_id;
        navigation.navigate('BookingConfirm', {
          id: booking_id,
          fromPage: bookFor,
          bathHouseId: bathHouseId,
        });
        // await this.props.history.push('/booking-registration/'+booking_id+'/location/'+bathHouseId)
      }
      if (data.data && data.data && data.data.reservation_id) {
        const reservation_id =
          data.data && data.data && data.data.reservation_id;

        navigation.navigate('BookingConfirm', {
          id: reservation_id,
          fromPage: bookFor,
          bathHouseId: bathHouseId,
        });

        // await this.props.history.push('/booking-registration/'+reservation_id+'/service/'+bathHouseId)
      }

      // if (data && data.data && data.data.data && data.data.data.booking_id) {
      //   setCreditCard(data.data.data);
      //   setShowCardSection(true);
      //   setShowFormSection(false);
      //   setIsCardPresent(true);
      // } else {
      //   setShowFormSection(true);
      //   setIsCardPresent(false);
      //   setShowCardSection(false);
      // }
      setloading(false);
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };

  const submitCardDataPayment = async () => {
    setloading(true);
    let payableAmount = '';
    if (bookFor === 'location') {
      payableAmount =
        bookedData &&
        bookedData.booking_payments &&
        bookedData.booking_payments.payableAmount
          ? bookedData.booking_payments.payableAmount
          : 0;
    }
    if (bookFor === 'service') {
      payableAmount =
        bookedData && bookedData.payments && bookedData.payments.payableAmount
          ? bookedData.payments.payableAmount
          : 0;
    }

    let booking_id = '';
    let reservation_id = '';
    if (bookFor === 'service') {
      reservation_id = bookedData.id;
    }
    if (bookFor === 'location') {
      booking_id = bookedData.id;
    }

    let postData = {};

    if (bookFor === 'location') {
      postData = {
        token: '',
        amount: payableAmount,
        propertyId: bookedData.property_id,
        userId: bookedData.booking_agent,
        booking_id: booking_id,
        save_card_flag: false,
        booking_type: booking_type,
        reservation_id: reservation_id,
        paymentType: paymentType,
        card_id: CardData.id,
        customer_id: CardData.customer,
        isCard: true,
      };
    }
    if (bookFor === 'service') {
      postData = {
        token: '',
        amount: payableAmount,
        propertyId: bookedData.propertyId,
        userId: bookedData.booking_agent,
        booking_id: booking_id,
        save_card_flag: false,
        booking_type: booking_type,
        reservation_id: reservation_id,
        paymentType: paymentType,
        card_id: CardData.id,
        customer_id: CardData.customer,
        isCard: true,
      };
    }
    await postPaymentData(postData);
    //   await this._postPaymentData(postData);
  };

  const onchangeCard = async (id, card) => {
    setSelectedCard(id);
    setCardData(card);
    setIsCardSelected(true);
  };

  return (
    <StripeProvider publishableKey={GLOBAL.STRIPE_KEY}>
      <Layout style={{flex: 1}} level="1">
        <HeaderComponent showBackButton />
        <SecondaryHeader title={strings('end_reservation')} />
        {loading ? (
          <Loader color="#253C7E" visible={loading} />
        ) : (
          <>
            <ScrollView bounces={false}>
              <Layout
                level="1"
                style={[
                  styles.container,
                  {marginTop: themeConfig.margin},
                  styles.boxStyle,
                ]}>
                <Typography status="basic" category="s2">
                  {strings('selecte_payment_method')}
                </Typography>

                <View
                  style={[
                    styles.boxStyle,
                    {flexDirection: 'row', alignItems: 'center'},
                  ]}>
                  <Typography
                    category="s1"
                    style={{
                      marginHorizontal: themeConfig.margin * 2,
                      fontSize: 14,
                    }}>
                    {strings('total')} {getFinalPrice ? getFinalPrice : 0} €
                  </Typography>
                </View>
                {showCardSection && (
                  <>
                    {isCardPresent === false && (
                      <View style={styles.center}>
                        <Typography category="h6" style={{fontWeight: '400'}}>
                          {strings('no_paymet_method_select')}
                        </Typography>
                      </View>
                    )}

                    {creditCards &&
                      creditCards.map((card, i) => {
                        return (
                          <View
                            key={card.number}
                            style={styles.navigationButton}>
                            <Radio
                              checked={selectedCard === card.id}
                              onChange={nextChecked =>
                                onchangeCard(card.id, card)
                              }>
                              <Typography
                                status="basic"
                                category="s1"
                                style={{fontSize: 14}}>
                                {`xxxx xxxx xxxx ${card.last4}`}
                              </Typography>
                            </Radio>
                          </View>
                        );
                      })}

                    {isCardSelected && (
                      <React.Fragment>
                        <View style={styles.center}>
                          <ButtonComponent
                            size="small"
                            style={{
                              width: 150,
                              backgroundColor: '#343a40',
                              borderColor: '#343a40',
                            }}
                            onPress={() => submitCardDataPayment()}>
                            <Typography
                              status="control"
                              category="s2"
                              style={{fontWeight: '400'}}>
                              {strings('pay')}
                            </Typography>
                          </ButtonComponent>
                        </View>
                      </React.Fragment>
                    )}
                  </>
                )}

                {showFormSection && (
                  <>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: '#DADADA',
                        padding: themeConfig.padding * 2,
                        borderRadius: themeConfig.radius * 4,
                        margin: themeConfig.margin,
                      }}>
                      <Formik
                        validationSchema={paymentSchema}
                        initialValues={{}}
                        onSubmit={values => handlePayment(values)}>
                        {({
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          setFieldValue,
                          values,
                          errors,
                          dirty,
                          isValid,
                        }) => (
                          <>
                            <View
                              style={{
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                flex: 1,
                                justifyContent: 'flex-end',
                              }}>
                              <Image
                                source={require('resources/images/visa.png')}
                                style={{
                                  width: 32,
                                  height: 16,
                                  marginRight: themeConfig.margin,
                                }}
                              />
                              <Image
                                source={require('resources/images/americanexpress.png')}
                                style={{
                                  width: 32,
                                  height: 16,
                                  marginRight: themeConfig.margin,
                                }}
                              />
                              <Image
                                source={require('resources/images/mastercard.png')}
                                style={{
                                  width: 32,
                                  height: 16,
                                  marginRight: themeConfig.margin,
                                }}
                              />
                            </View>
                            <InputComponent
                              placeholder={strings('Cardholder_Name')}
                              caption={
                                errors.name ? strings(`${errors.name}`) : ''
                              }
                              label={strings('Cardholder_Name')}
                              value={values.name}
                              style={{
                                borderRadius: themeConfig.radius,
                                borderColor: 'white',
                              }}
                              onBlur={handleBlur('name')}
                              status={errors.name ? 'danger' : ''}
                              onChangeText={handleChange('name')}
                            />

                            <InputComponent
                              placeholder={strings('email')}
                              caption={
                                errors.email ? strings(`${errors.email}`) : ''
                              }
                              style={{
                                borderRadius: themeConfig.radius,
                                borderColor: 'white',
                              }}
                              label={strings('email')}
                              value={values.email}
                              onBlur={handleBlur('email')}
                              status={errors.email ? 'danger' : ''}
                              onChangeText={handleChange('email')}
                            />

                            <View
                              style={{
                                marginHorizontal: themeConfig.margin,
                                marginVertical: themeConfig.margin * 1.2,
                              }}>
                              <Typography
                                category="s1"
                                style={{fontWeight: '400', color: '#1c1c1c'}}
                                status="basic">
                                {strings('card_number')}
                              </Typography>
                            </View>
                            <StripeComponent
                              isError={errors.paymemntData ? true : false}
                              onFinish={data => {
                                if (data.complete) {
                                  setFieldValue('paymemntData', data);
                                }
                              }}
                            />
                            {errors.paymemntData ? (
                              <Typography
                                category="s2"
                                style={{fontWeight: '400'}}
                                status="danger">
                                {strings(errors.paymemntData)}
                              </Typography>
                            ) : null}

                            <CheckBox
                              checked={checkedSavePayment}
                              onChange={nextChecked => {
                                setCheckedSavePayment(nextChecked);
                              }}
                              style={{marginTop: themeConfig.margin * 2}}>
                              {strings('saved_this_method')}
                            </CheckBox>
                            <View style={styles.center}>
                              <ButtonComponent
                                size="small"
                                style={{
                                  width: 150,
                                  backgroundColor: '#343a40',
                                  borderColor: '#343a40',
                                }}
                                disabled={!(dirty && isValid)}
                                onPress={handleSubmit}>
                                <Typography
                                  status="control"
                                  category="s2"
                                  style={{fontWeight: '400'}}>
                                  {strings('pay')}
                                </Typography>
                              </ButtonComponent>
                            </View>
                          </>
                        )}
                      </Formik>
                    </View>
                  </>
                )}
              </Layout>
            </ScrollView>
            <Layout style={styles.boxStyle}>
              <View style={{marginTop: themeConfig.margin * 2}}>
                <ButtonComponent onPress={() => openCardSection()}>
                  <Typography
                    status="control"
                    category="s2"
                    style={{fontWeight: '400'}}>
                    {strings('my_Saved_Card')}
                  </Typography>
                </ButtonComponent>

                <ButtonComponent
                  style={{backgroundColor: 'transparent'}}
                  // status="warning"
                  appearance="outline"
                  onPress={() => openAddCardSection()}>
                  <Typography
                    status="control"
                    category="s2"
                    style={{fontWeight: '400'}}>
                    {strings('add_new_card')}
                  </Typography>
                </ButtonComponent>
              </View>
            </Layout>
          </>
        )}
        <Toast
          ref={toast} //eslint-disable-line
          position="bottom"
          defaultCloseDelay={8000}
          positionValue={200}
        />
      </Layout>
    </StripeProvider>
  );
};
export default PaymentProcessingScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
  },
  leftSection: {
    width: 100,
    marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    marginBottom: themeConfig.margin / 2,
  },
  center: {
    alignSelf: 'center',
    marginTop: themeConfig.margin * 2,
    marginBottom: themeConfig.margin,
  },
  navigationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: themeConfig.radius,
    borderWidth: themeConfig.borderWidth,
    borderColor: themeConfig.colors.borderColor,
    padding: themeConfig.padding + 4,
    marginBottom: themeConfig.margin,
    marginVertical: themeConfig.margin,
  },
});
