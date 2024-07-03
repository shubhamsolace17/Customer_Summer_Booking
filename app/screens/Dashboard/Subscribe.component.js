import React from 'react';
import {Layout} from '@ui-kitten/components';
import {StyleSheet, ScrollView, LogBox} from 'react-native';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
//API

import {strings} from 'i18n/i18n';
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed,
  'Non-serializable values were found in the navigation state',
]);

import * as Yup from 'yup';
import {Formik} from 'formik';
import InputComponent from 'components/Input';
import ButtonComponent from 'components/Button';

const Schema = Yup.object().shape({
  email: Yup.string().email('email_error').required('emailVal'),
});

const SubscribeComponent = ({onSumbit = () => {}}) => {
  return (
    <Formik
      validationSchema={Schema}
      initialValues={{}}
      onSubmit={values => onSumbit(values)}>
      {({handleChange, handleBlur, handleSubmit, values, errors}) => (
        <ScrollView bounces={false}>
          <Layout id="Search" style={styles.subscibeBoxStyle}>
            <InputComponent
              placeholder={strings('your_email')}
              style={{borderColor: 'white'}}
              onBlur={handleBlur('email')}
              caption={errors.email ? strings(`${errors.email}`) : ''}
              status={errors.email ? 'danger' : ''}
              onChangeText={handleChange('email')}
              keyboardType="email-address"
            />
            <ButtonComponent
              size="large"
              style={{
                color: themeConfig.colors.white,
                backgroundColor: themeConfig.colors.primary,
                marginVertical: themeConfig.margin,
                borderRadius: themeConfig.radius * 6,
              }}
              onPress={handleSubmit}>
              <Typography
                status="control"
                category="s2"
                style={{color: 'white'}}>
                {strings('Subscibe')}
              </Typography>
            </ButtonComponent>
          </Layout>
        </ScrollView>
      )}
    </Formik>
  );
};
export default SubscribeComponent;

const styles = StyleSheet.create({
  subscibeBoxStyle: {
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding * 2,
    // justifyContent:"center"
  },
});
