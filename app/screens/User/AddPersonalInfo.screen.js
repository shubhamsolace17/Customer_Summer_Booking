import React, {useState} from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import SVGIcon from 'components/Icon';
import {setShowBooking} from 'app/redux/actions/globalActions';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {strings} from 'i18n/i18n';

const mobileNoRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(1, 'Too_short')
    .max(50, 'Too_long')
    .required('require_field'),
  lastName: Yup.string()
    .min(1, 'Too_short')
    .max(50, 'Too_long')
    .required('require_field'),
  email: Yup.string().email('email_error').required('emailVal'),
  mobileNo: Yup.string()
    .matches(mobileNoRegExp, 'ValidmobileNo')
    .min(9, 'Too_short')
    .max(9, 'Too_long')
    .required('require_field'),
});
const AddPersonalInfo = ({navigation}) => {
  const dispatch = useDispatch();
  // const {setShowBooking} = applicationController();
  const [changeLaneg, setchangeLaneg] = useState(false);
  const [language] = useSelector(state => [state.globalReducerData.language]);
  const bookFatser = () => {
    dispatch(setShowBooking(true));
    navigation.navigate('User', {screen: 'UserHome'});
  };

  const nonRegistertedUser = values => {
    const nonRegistertedUser = {
      firstName: values.firstName,
      lastName: values.firstName,
      email: values.email,
      mobileNo: values.mobileNo,
      id: '',
    };
    navigation.navigate('FinishBooking', nonRegistertedUser);
  };
  React.useEffect(() => {
    setchangeLaneg(true);
    setTimeout(() => {
      setchangeLaneg(false);
    }, 1000);
  }, [language]);

  return (
    <Layout style={{flex: 1, backgroundColor: '#F6F6F6'}} level="1">
      <HeaderComponent showBackButton />
      <Formik
        validationSchema={SignupSchema}
        initialValues={{}}
        onSubmit={values => nonRegistertedUser(values)}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <ScrollView bounces={false}>
              <Layout
                level="1"
                style={[
                  styles.container,
                  {marginTop: themeConfig.margin},
                  styles.boxStyle,
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    bookFatser();
                  }}
                  style={styles.button}>
                  <View style={styles.icon}>
                    <SVGIcon
                      type="User"
                      color={themeConfig.colors.primary}
                      width={themeConfig.radius * 5}
                      height={themeConfig.radius * 5}
                    />
                  </View>
                  <Typography category="p1" style={styles.text} status="basic">
                    {strings('not_Account_Login')}
                  </Typography>
                </TouchableOpacity>

                <View
                  style={{
                    backgroundColor: '#F6F6F6',
                  }}>
                  <InputComponent
                    placeholder={strings('FirstNamewithAstrick')}
                    caption={
                      errors.firstName ? strings(`${errors.firstName}`) : ''
                    }
                    label={strings('FirstNamewithAstrick')}
                    onBlur={handleBlur('firstName')}
                    status={errors.firstName ? 'danger' : ''}
                    onChangeText={handleChange('firstName')}
                  />

                  <InputComponent
                    placeholder={strings('surnamewithAstrick')}
                    caption={
                      errors.lastName ? strings(`${errors.lastName}`) : ''
                    }
                    onBlur={handleBlur('lastName')}
                    label={strings('surnamewithAstrick')}
                    status={errors.lastName ? 'danger' : ''}
                    onChangeText={handleChange('lastName')}
                  />

                  <InputComponent
                    placeholder={strings('EmailwithAstrick')}
                    caption={errors.email ? strings(`${errors.email}`) : ''}
                    onBlur={handleBlur('email')}
                    status={errors.email ? 'danger' : ''}
                    label={strings('EmailwithAstrick')}
                    onChangeText={handleChange('email')}
                    keyboardType="email-address"
                  />
                  <InputComponent
                    placeholder={strings('MobileNowithAstrick')}
                    caption={
                      errors.mobileNo ? strings(`${errors.mobileNo}`) : ''
                    }
                    status={errors.mobileNo ? 'danger' : ''}
                    onBlur={handleBlur('mobileNo')}
                    label={strings('MobileNowithAstrick')}
                    onChangeText={handleChange('mobileNo')}
                    keyboardType="phone-pad"
                  />
                </View>
                <View
                  style={[
                    styles.boxStyle,
                    {justifyContent: 'center', alignItems: 'center'},
                  ]}>
                  <ButtonComponent
                    onPress={handleSubmit}
                    style={{
                      marginRight: themeConfig.margin,
                      borderRadius: themeConfig.radius * 4,
                      width: '60%',
                    }}
                    size="small">
                    <Typography
                      status="control"
                      category="s2"
                      style={{fontWeight: '400'}}>
                      {strings('continue')}
                    </Typography>
                  </ButtonComponent>
                </View>
              </Layout>
              <Layout>
                <Divider />
              </Layout>
            </ScrollView>
          </>
        )}
      </Formik>

      {/* <InputComponent placeholder="First Name *" />
          <InputComponent placeholder="Last Name *" />
          <InputComponent placeholder="Email *" />
          <InputComponent placeholder="Mobile Number *" />
        </Layout>
      </ScrollView> */}

      {/* <Layout>
        <Divider />
        <View
          style={[
            styles.boxStyle,
            {flexDirection: 'row', alignItems: 'center'},
          ]}>
          <Typography
            category="h5"
            style={{
              marginHorizontal: themeConfig.margin * 2,
              fontWeight: '700',
            }}>
            30 €
          </Typography>
          <View style={{flex: 1}}>
            <ButtonComponent
              onPress={() => navigation.navigate('FinishBooking')}>
              <Typography
                status="control"
                category="h6"
                style={{fontWeight: '400'}}>
                Next Step
              </Typography>
            </ButtonComponent>
          </View>
        </View>
      </Layout> */}
    </Layout>
  );
};
export default AddPersonalInfo;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
    backgroundColor: '#F6F6F6',
  },
  button: {
    marginTop: themeConfig.margin,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeConfig.colors.lightBule,
    borderRadius: themeConfig.radius * 4,
    padding: themeConfig.padding * 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: themeConfig.colors.primary,
    marginHorizontal: themeConfig.margin,
  },
});
