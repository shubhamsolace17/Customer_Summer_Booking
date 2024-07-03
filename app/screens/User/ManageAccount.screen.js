import React, {useState, useEffect, useRef} from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import SVGIcon from 'components/Icon';
import CustomSkeletonList from 'components/CustomSkeleton';

//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import Toast from 'react-native-easy-toast';
import * as Yup from 'yup';
import {Formik} from 'formik';

//Translation
import {strings} from 'i18n/i18n';

import {useSelector} from 'react-redux';
const windowHeight = Dimensions.get('window').height;

const mobileNoRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const EditSchema = Yup.object().shape({
  firstName: Yup.string().min(1, 'Too_short').max(50, 'Too_long'),
  lastName: Yup.string().min(1, 'Too_short').max(50, 'Too_long'),
  email: Yup.string()
    .email('email_error')
    .test('test-name', 'emailExist', async function (value) {
      if (value && value.length > 0) {
        const postData = {
          email: value,
        };
        const {success} = await postDataToServer(`${Api.checkEmail}`, postData);
        if (success) {
          return false;
        } else {
          return true;
        }
      }
    }),
  mobileNo: Yup.string()
    .matches(mobileNoRegExp, 'ValidmobileNo')
    .min(10, 'Too_short')
    .max(10, 'Too_long'),
});

const ManageAccountScreen = ({navigation}) => {
  const [userProfile, language] = useSelector(state => [
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
  ]);
  const [creditCards, setCreditCard] = useState([]);
  // const [notificationActive, setNotificationActive] = useState(false);
  const [userData, setuserData] = useState({});
  // const [error, setError] = useState();
  const [loading, setloading] = useState(false);
  const toast = useRef('');

  const loadData = async () => {
    setloading(true);
    const postData = {
      userid: userProfile.id,
    };

    const {data, error, message, status} = await postDataToServer(
      `${Api.getUserDetails}`,
      postData,
    );
    if (status) {
      if (data && data.data && data.data.length > 0) {
        let tempUser = {};
        tempUser.firstName = data.data[0].firstname
          ? data.data[0].firstname
          : '';
        tempUser.lastName = data.data[0].lastname ? data.data[0].lastname : '';
        tempUser.email = data.data[0].email ? data.data[0].email : '';
        tempUser.mobileNo = data.data[0].mobile ? data.data[0].mobile : '';
        tempUser.disableNotification = data.data[0].disableNotification;
        setuserData(tempUser);
        setloading(false);
      }
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  const loadCardData = async () => {
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
      }
      setloading(false);
    } else {
      setloading(false);
      if (error) {
        let errorMessage = error ? error : message;
        toast.current.show(errorMessage);
      }
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return () => {
      unsubscribe;
    };
  }, [navigation]);

  const NotificationActiveInactive = async () => {
    const postData = {
      userid: userProfile.id,
      notificationStatus: userData.disableNotification == 0 ? '1' : '0',
    };
    const {error, message, sucess} = await postDataToServer(
      `${Api.disableNotification}`,
      postData,
    );
    if (sucess) {
      loadData();
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  const UpdateUserProfile = async values => {
    const postData = {
      userid: userProfile.id,
      firstname: values.firstName,
      lastname: values.lastName,
      email: values.email,
      mobile: values.mobileNo,
    };
    // setloading(false);
    const {error, message, data, sucess} = await postDataToServer(
      `${Api.updateUserProfile}`,
      postData,
    );
    if (sucess) {
      loadData();
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  const confirmRemoveCards = card => {
    const postData = {
      stripeCustomerId: card.customer,
      stripeCardId: card.id,
    };

    Alert.alert(strings('deleteCards'), strings('removePopUp'), [
      // The "Yes" button
      {
        text: strings('yes'),
        onPress: () => {
          removeCards(postData);
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: strings('no'),
      },
    ]);
  };

  const removeCards = async postData => {
    setloading(true);
    const {error, message, data, status, sucess} = await postDataToServer(
      `${Api.removeCard}`,
      postData,
    );
    if (status) {
      loadData();
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  return (
    <Layout style={{flex: 1, backgroundColor: '#F6F6F6'}} level="1">
      <HeaderComponent showBackButton />
      {loading && (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      )}

      {!loading && Object.keys(userData).length > 0 && (
        <ScrollView
          bounces={false}
          contentContainerStyle={{paddingBottom: windowHeight / 8}}>
          <Layout
            level="1"
            style={[
              styles.container,
              // {marginTop: themeConfig.margin},
              styles.boxStyle,
            ]}>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: themeConfig.margin * 2,
                margin: themeConfig.margin,
                alignItems: 'center',
              }}>
              {userProfile && userProfile.profilePic ? (
                <Image
                  style={styles.profile}
                  source={{
                    uri: userProfile.profilePic,
                  }}
                />
              ) : (
                <SVGIcon
                  type="ProfileUser"
                  color={themeConfig.colors.primary}
                  width={40}
                  height={40}
                />
              )}
              <Typography
                status="basic"
                category="h3"
                style={{
                  fontWeight: '500',
                  // marginTop: themeConfig.margin,
                  color: themeConfig.colors.primary,
                  fontSize: 14,
                  marginHorizontal: themeConfig.margin,
                }}>
                {strings('hello')} {userProfile.firstname || 'User'}
              </Typography>
            </View>
          </Layout>

          <View
            style={{
              backgroundColor: '#F6F6F6',
              padding: themeConfig.margin * 3,
            }}>
            {loading ? (
              <>
                <CustomSkeletonList />
                <CustomSkeletonList />
              </>
            ) : (
              <Formik
                validationSchema={EditSchema}
                initialValues={userData}
                onSubmit={values => UpdateUserProfile(values)}>
                {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                  <>
                    <InputComponent
                      placeholder={strings('fst_name')}
                      caption={
                        errors.firstName ? strings(`${errors.firstName}`) : ''
                      }
                      label={strings('fst_name')}
                      value={values.firstName}
                      onBlur={handleBlur('firstName')}
                      style={{
                        borderColor: 'black',
                        marginBottom: themeConfig.margin,
                      }}
                      status={errors.firstName ? 'danger' : ''}
                      onChangeText={handleChange('firstName')}
                    />

                    <InputComponent
                      placeholder={strings('lst_name')}
                      caption={
                        errors.lastName ? strings(`${errors.lastName}`) : ''
                      }
                      label={strings('lst_name')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                      style={{
                        borderColor: 'black',
                        marginBottom: themeConfig.margin,
                      }}
                      status={errors.lastName ? 'danger' : ''}
                      onChangeText={handleChange('lastName')}
                    />

                    <InputComponent
                      placeholder={strings('email')}
                      caption={errors.email ? strings(`${errors.email}`) : ''}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      label={strings('email')}
                      style={{
                        borderColor: 'black',
                        marginBottom: themeConfig.margin,
                      }}
                      status={errors.email ? 'danger' : ''}
                      onChangeText={handleChange('email')}
                      keyboardType="email-address"
                    />
                    <InputComponent
                      placeholder={strings('mobile_number')}
                      caption={
                        errors.mobileNo ? strings(`${errors.mobileNo}`) : ''
                      }
                      status={errors.mobileNo ? 'danger' : ''}
                      label={strings('mobile_number')}
                      style={{
                        borderColor: 'black',
                        marginBottom: themeConfig.margin,
                      }}
                      onBlur={handleBlur('mobileNo')}
                      value={values.mobileNo}
                      onChangeText={handleChange('mobileNo')}
                      keyboardType="phone-pad"
                    />

                    {/* <Typography
             category="p1"
             status="basic"
             style={{ marginVertical: themeConfig.margin }}>
             {strings('credit_card')}
           </Typography>

           {creditCards &&
             creditCards.map((card, i) => {
               return (
                 <View
                   key={card.number}
                   style={styles.navigationButton}
                   key={i}>
                   <Typography
                     status="basic"
                     category="s2"
                     style={{ fontWeight: '400' }}>
                     {`xxxx xxxx xxxx ${card.last4}`}
                   </Typography>
                   <TouchableOpacity
                     onPress={() => confirmRemoveCards(card)}>
                     <SVGIcon type="Delete" width={16} height={16} />
                   </TouchableOpacity>
                 </View>
               )
             })} */}

                    {/* <TouchableOpacity
               style={styles.navigationButton}
               onPress={() => navigation.navigate('CardDetails')}>
               <Typography category="s2" style={{fontWeight: '400'}}>
                 + Add New Card
               </Typography>
               <SVGIcon type="RightArrow" width={16} height={16} />
             </TouchableOpacity> */}
                    {/* <TouchableOpacity
             style={styles.navigationButton}
             onPress={
               () => NotificationActiveInactive()
               // setNotificationActive(!notificationActive)
             }>
             <Typography
               status="basic"
               category="s2"
               style={{ fontWeight: '400' }}>
               {strings('notification')}
             </Typography>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <Typography
                 category="s2"
                 style={{
                   fontWeight: '400',
                   marginRight: themeConfig.margin / 2,
                 }}>
                 {userData.disableNotification === 0
                   ? 'Active'
                   : 'Not Active'}
               </Typography>
               <SVGIcon type="RightArrow" width={16} height={16} />
             </View>
           </TouchableOpacity> */}

                    <Layout style={{backgroundColor: '#F6F6F6'}}>
                      <Divider />
                      <View
                        style={[
                          styles.boxStyle,
                          {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                        ]}>
                        <ButtonComponent
                          onPress={() => navigation.goBack()}
                          style={{
                            marginRight: themeConfig.margin,
                            borderRadius: themeConfig.radius * 4,
                            flex: 1,
                          }}
                          size="small">
                          <Typography
                            status="control"
                            category="s2"
                            style={{fontWeight: '400'}}>
                            {strings('cancel')}
                          </Typography>
                        </ButtonComponent>

                        <ButtonComponent
                          onPress={() => handleSubmit()}
                          style={{
                            marginRight: themeConfig.margin,
                            borderRadius: themeConfig.radius * 4,
                            flex: 1,
                          }}
                          size="small">
                          <Typography
                            status="control"
                            category="s2"
                            style={{fontWeight: '400'}}>
                            {strings('save')}
                          </Typography>
                        </ButtonComponent>
                      </View>
                    </Layout>
                  </>
                )}
              </Formik>
            )}
          </View>
        </ScrollView>
      )}

      <Toast
        ref={toast} //eslint-disable-line
        position="bottom"
        defaultCloseDelay={8000}
        positionValue={200}
      />
    </Layout>
  );
};
export default ManageAccountScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    // marginHorizontal: themeConfig.margin,
    backgroundColor: '#F6F6F6',
  },
  navigationButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: themeConfig.radius * 4,
    borderWidth: themeConfig.borderWidth,
    borderColor: themeConfig.colors.borderColor,
    padding: themeConfig.padding + 4,
    marginBottom: themeConfig.margin,
    marginVertical: themeConfig.margin,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: themeConfig.margin,
  },
});
