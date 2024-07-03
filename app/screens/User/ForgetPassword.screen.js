import React, {useState, useRef} from 'react';
import {Layout} from '@ui-kitten/components';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
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
import Toast from 'react-native-easy-toast';
import {useSelector} from 'react-redux';

const ForgetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('email_error').required('emailVal'),
});

const ForgetPasswordScreen = ({navigation}) => {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState('');
  const toast = useRef('');
  // const {language} = useApplicationContext();
  const [language] = useSelector(state => [state.globalReducerData.language]);
  const ForgetPasswordHandler = async values => {
    setloading(true);
    const postData = {
      email: values.email,
      languageCode: language == 'en' ? 1 : 2,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.forgotpassword}`,
      postData,
    );
    if (status && data) {
      setloading(false);
      toast.current.show(message);
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      setError(errorMessage);
    }
  };

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <Formik
        validationSchema={ForgetPasswordSchema}
        initialValues={{}}
        onSubmit={values => ForgetPasswordHandler(values)}>
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
                <Typography category="p1" status="basic">
                  {}
                </Typography>
                <InputComponent
                  placeholder={strings('EmailwithAstrick')}
                  onBlur={handleBlur('email')}
                  label={strings('EmailwithAstrick')}
                  caption={errors.email ? strings(`${errors.email}`) : ''}
                  status={errors.email ? 'danger' : ''}
                  onChangeText={handleChange('email')}
                  keyboardType="email-address"
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
                            category="s2"
                            style={{fontWeight: '400'}}>
                            {strings('submit')}
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
        defaultCloseDelay={10000}
        positionValue={200}
      />
    </Layout>
  );
};
export default ForgetPasswordScreen;

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
