import React, {useState, useRef} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import {Formik} from 'formik';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
//Translation
import {strings} from 'i18n/i18n';
import Toast from 'react-native-easy-toast';

import {setUserLoggedIn, setUserProfile} from 'app/redux/actions/userActions';
import {useDispatch, useSelector} from 'react-redux';

const SigninSchema = Yup.object().shape({
  email: Yup.string().email('email_error').required('emailVal'),
  password: Yup.string()
    .min(1, 'Too_short')
    .max(50, 'Too_long')
    .required('PasswordRequired'),
});

const LoginWithEmailScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState('');
  const toast = useRef('');
  const [language, showBookingLogin] = useSelector(state => [
    state.globalReducerData.language,
    state.globalReducerData.showBookingLogin,
  ]);

  const signInHandler = async values => {
    setloading(true);
    const postData = {
      username: values.email,
      password: values.password,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.signInUrl}`,
      postData,
    );
    if (status && data) {
      await AsyncStorage.setItem('isSignedIn', 'true');
      await AsyncStorage.setItem('userProfile', JSON.stringify(data));
      await AsyncStorage.setItem(
        'auth-token',
        JSON.stringify(data.accessToken),
      );
      dispatch(setUserLoggedIn(true));
      dispatch(setUserProfile(data));
      setloading(false);
      if (showBookingLogin) {
        navigation.navigate('FinishBooking');
      } else {
        navigation.navigate('User', {screen: 'UserHome'});
      }
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      setError(errorMessage);
    }
  };
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = props => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <Formik
        validationSchema={SigninSchema}
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
                  placeholder="Email *"
                  onBlur={handleBlur('email')}
                  label="Email *"
                  caption={errors.email ? strings(`${errors.email}`) : ''}
                  status={errors.email ? 'danger' : ''}
                  onChangeText={handleChange('email')}
                  keyboardType="email-address"
                />
                <InputComponent
                  placeholder="Password *"
                  label="Password *"
                  accessoryRight={renderIcon}
                  secureTextEntry={secureTextEntry}
                  caption={errors.password ? strings(`${errors.password}`) : ''}
                  status={errors.password ? 'danger' : ''}
                  onBlur={handleBlur('password')}
                  onChangeText={handleChange('password')}
                />
              </Layout>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Typography
                  category="s1"
                  onPress={() => navigation.navigate('ForgetPassword')}>
                  {' '}
                  {strings('forgot_pass')}
                </Typography>
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
export default LoginWithEmailScreen;

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
