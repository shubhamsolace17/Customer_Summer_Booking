import React from 'react';
import {Divider, Icon, Layout} from '@ui-kitten/components';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import * as Yup from 'yup';
import {Formik} from 'formik';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//Translation
import {strings} from 'i18n/i18n';
import {useSelector} from 'react-redux';

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
  email: Yup.string()
    .email('email_error')
    .required('require_field')
    .test('test-name', 'emailExist', async function (value) {
      if (value && value.length > 0) {
        const postData = {
          email: value,
        };
        const {status} = await postDataToServer(`${Api.checkEmail}`, postData);
        if (status) {
          return true;
        } else {
          return false;
        }
      }
    }),
  mobileNo: Yup.string()
    .matches(mobileNoRegExp, 'ValidmobileNo')
    .min(9, 'Too_short')
    .max(9, 'Too_long')
    .required('require_field'),
  password: Yup.string()
    .min(1, 'Too_short')
    .max(50, 'Too_long')
    .required('require_field'),
  confirmPassword: Yup.string()
    .required('require_field')
    .oneOf([Yup.ref('password')], 'PasswordNotMatch'),
});

const CreateAccountScreen = ({navigation}) => {
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [secureTextEntryConfirmPassword, setSecureTextEntryConfirmPassword] =
    React.useState(true);
  const [loading, setloading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [language, showBookingLogin] = useSelector(state => [
    state.globalReducerData.language,
    state.globalReducerData.showBookingLogin,
  ]);
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const toggleSecureEntryConfirmPassword = () => {
    setSecureTextEntryConfirmPassword(!secureTextEntryConfirmPassword);
  };
  const renderIcon = props => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );
  const renderIconConfirmPassword = props => (
    <TouchableWithoutFeedback onPress={toggleSecureEntryConfirmPassword}>
      <Icon
        {...props}
        name={secureTextEntryConfirmPassword ? 'eye-off' : 'eye'}
      />
    </TouchableWithoutFeedback>
  );
  const onSubmit = async values => {
    setloading(true);
    const postData = {
      username: values.email,
      email: values.email,
      password: values.password,
      firstname: values.firstName,
      lastname: values.lastName,
      mobile: values.mobileNo,
      roles: ['consumer'],
    };
    const {data, message, status} = await postDataToServer(
      `${Api.signUpUrl}`,
      postData,
    );
    if (status) {
      navigation.navigate('Login');
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      setError(errorMessage);
    }
  };
  const renderPlaceholder = label => {
    return (
      <>
        <Typography
          category="s2"
          style={{
            marginVertical: themeConfig.margin * 1.2,
            marginHorizontal: themeConfig.margin,
            color: '#1c1c1c',
            fontSize: 12,
          }}
          status="basic">
          {label}
        </Typography>
      </>
    );
  };

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <Formik
        validationSchema={SignupSchema}
        initialValues={{}}
        onSubmit={values => onSubmit(values)}>
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
                <InputComponent
                  placeholder={strings('FirstNamewithAstrick')}
                  caption={
                    errors.firstName ? strings(`${errors.firstName}`) : ''
                  }
                  label={strings('FirstNamewithAstrick')}
                  onBlur={handleBlur('firstName')}
                  status={errors.firstName ? 'danger' : ''}
                  onChangeText={handleChange('firstName')}
                  placeholderStyle={{
                    fontFamily: 'AnotherFont',
                    fontSize: 10,
                    borderWidth: 1,
                    borderColor: 'red',
                  }}
                />
                <InputComponent
                  placeholder={strings('LastNamewithAstrick')}
                  caption={errors.lastName ? strings(`${errors.lastName}`) : ''}
                  label={strings('LastNamewithAstrick')}
                  onBlur={handleBlur('lastName')}
                  status={errors.lastName ? 'danger' : ''}
                  onChangeText={handleChange('lastName')}
                />
                <InputComponent
                  placeholder={strings('EmailwithAstrick')}
                  caption={errors.email ? strings(`${errors.email}`) : ''}
                  onBlur={handleBlur('email')}
                  label={strings('EmailwithAstrick')}
                  status={errors.email ? 'danger' : ''}
                  onChangeText={handleChange('email')}
                  keyboardType="email-address"
                />
                <InputComponent
                  placeholder={strings('MobileNowithAstrick')}
                  caption={errors.mobileNo ? strings(`${errors.mobileNo}`) : ''}
                  status={errors.mobileNo ? 'danger' : ''}
                  onBlur={handleBlur('mobileNo')}
                  label={strings('MobileNowithAstrick')}
                  onChangeText={handleChange('mobileNo')}
                  keyboardType="phone-pad"
                />

                <InputComponent
                  placeholder={strings('PasswordwithAstrick')}
                  accessoryRight={renderIcon}
                  secureTextEntry={secureTextEntry}
                  label={strings('PasswordwithAstrick')}
                  caption={errors.password ? strings(`${errors.password}`) : ''}
                  status={errors.password ? 'danger' : ''}
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                />
                <InputComponent
                  placeholder={strings('ConfirmPasswordwithAstrick')}
                  accessoryRight={renderIconConfirmPassword}
                  secureTextEntry={secureTextEntryConfirmPassword}
                  label={strings('ConfirmPasswordwithAstrick')}
                  caption={
                    errors.confirmPassword
                      ? strings(`${errors.confirmPassword}`)
                      : ''
                  }
                  status={errors.confirmPassword ? 'danger' : ''}
                  onChangeText={handleChange('confirmPassword')}
                />
              </Layout>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Typography category="p1" status="danger">
                  {error}
                </Typography>
              </View>
            </ScrollView>
            <Layout>
              <Divider />
              <View
                style={[
                  styles.boxStyle,
                  {flexDirection: 'row', alignItems: 'center'},
                ]}>
                <View style={{flex: 1}}>
                  <ButtonComponent onPress={handleSubmit}>
                    {loading ? (
                      <ActivityIndicator
                        animating={loading}
                        style={{
                          alignSelf: 'center',
                          justifyContent: 'center',
                          flex: 1,
                        }}
                        size="large"
                        color="#fff"
                      />
                    ) : (
                      <>
                        <Typography
                          status="control"
                          category="s2"
                          style={{fontWeight: '400'}}>
                          {strings('sign_in')}
                        </Typography>
                      </>
                    )}
                  </ButtonComponent>
                </View>
              </View>
            </Layout>
          </>
        )}
      </Formik>
    </Layout>
  );
};
export default CreateAccountScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin * 2,
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
  },
});
