import React, {useState, useRef, useEffect} from 'react';
import {Icon, Layout} from '@ui-kitten/components';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import {Formik} from 'formik';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//Translation
import {strings} from 'i18n/i18n';
import Toast from 'react-native-easy-toast';
import {useDispatch, useSelector} from 'react-redux';
import {setUserLoggedIn} from 'app/redux/actions/userActions';
import {useNavigation, useRoute} from '@react-navigation/native';

const ResetPasswordSchema = Yup.object().shape({
  //   oldPassword: Yup.string()
  //     .min(1, 'Too_short')
  //     .max(50, 'Too_long')
  //     .required('old_PasswordVad'),
  newPassword: Yup.string()
    .min(1, 'Too_short')
    .max(50, 'Too_long')
    .required('new_PasswordVad'),
  confirmPassword: Yup.string()
    .required('ConfigPasswordRequired')
    .oneOf([Yup.ref('newPassword')], 'PasswordNotMatch'),
});

const ResetPasswordUrlScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntryNewPassword, setsecureTextEntryNewPassword] =
    useState(true);
  const [secureTextEntryConfirmPassword, setSecureTextEntryConfirmPassword] =
    useState(true);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState('');
  const toast = useRef('');
  const [userProfile, language] = useSelector(state => [
    state.UserReducerData.userProfile,
    state.globalReducerData.language,
  ]);
  const route = useRoute();

  const signInHandler = async values => {
    setloading(true);
    let emailToken = route.params.email;
    const postData = {
      email: emailToken,
      password: values.confirmPassword,
      emailType: 'encrypted',
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.resetPassword}`,
      postData,
    );
    if (status) {
      AsyncStorage.clear();
      // setUserLoggedIn(false);
      dispatch(setUserLoggedIn(false));
      setloading(false);
      navigation.navigate('LogInWithEmail');
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      setError(errorMessage);
    }
  };

  function backButtonHandler() {
    navigation.navigate('Search', {screen: 'SearchHome'});
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', function () {
      backButtonHandler;
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, [backButtonHandler]);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };
  const toggleSecureEntryConfirmPassword = () => {
    setSecureTextEntryConfirmPassword(!secureTextEntryConfirmPassword);
  };
  const toggleSecureEntryNewPassword = () => {
    setsecureTextEntryNewPassword(!secureTextEntryConfirmPassword);
  };
  

  const renderIcon = props => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const renderIconNewPassword = props => (
    <TouchableWithoutFeedback onPress={toggleSecureEntryNewPassword}>
      <Icon {...props} name={secureTextEntryNewPassword ? 'eye-off' : 'eye'} />
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

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent />
      <SecondaryHeader title={strings('reset_your_password')} hideNavigator />
      <Formik
        validationSchema={ResetPasswordSchema}
        initialValues={{}}
        onSubmit={values => signInHandler(values)}>
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
                  placeholder={strings('new_Password')}
                  accessoryRight={renderIconNewPassword}
                  secureTextEntry={secureTextEntryNewPassword}
                  caption={
                    errors.newPassword ? strings(`${errors.newPassword}`) : ''
                  }
                  status={errors.newPassword ? 'danger' : ''}
                  onBlur={handleBlur('newPassword')}
                  onChangeText={handleChange('newPassword')}
                />
                <InputComponent
                  placeholder={strings('confirm_passworrd')}
                  accessoryRight={renderIconConfirmPassword}
                  secureTextEntry={secureTextEntryConfirmPassword}
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
              <Layout>
                <View
                  style={[
                    styles.boxStyle,
                    {flexDirection: 'row', alignItems: 'center'},
                  ]}>
                  <View style={{flex: 1}}>
                    <ButtonComponent
                      icon={loading ? () => <ActivityIndicator /> : null}
                      onPress={handleSubmit}>
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
                            category="h6"
                            style={{fontWeight: '400'}}>
                            {strings('reset_password')}
                          </Typography>
                        </>
                      )}
                    </ButtonComponent>
                  </View>
                </View>
              </Layout>
            </ScrollView>
          </>
        )}
      </Formik>
      <Toast
        ref={toast} //eslint-disable-line
        position="center"
        defaultCloseDelay={8000}
        style={{backgroundColor: 'red'}}
        positionValue={200}
        textStyle={{color: 'white'}}
      />
    </Layout>
  );
};
export default ResetPasswordUrlScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
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
