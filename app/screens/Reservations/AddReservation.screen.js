import React, {useState, useRef} from 'react';
import {Layout, List} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
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
import CustomSkeletonList from 'components/CustomSkeleton';
import ReservationListItem from './ReservationListItem.component';

const Schema = Yup.object().shape({
  code: Yup.string()
    .min(1, 'Too_short')
    .max(50, 'Too_long')
    .required('require_field'),
});

const AddReservationScreen = ({navigation}) => {
  const [loading, setloading] = useState(false);
  const [reserveData, setreserveData] = useState([]);
  const [error, setError] = useState('');
  const toast = useRef('');
  // const {language} = useApplicationContext();
  const [language] = useSelector(state => [state.globalReducerData.language]);
  const onSubmitCode = async values => {
    setloading(true);
    const postData = {
      reservation_code: values.code,
    };
    const {data, message, error, status} = await postDataToServer(
      `${Api.getBookingByReservationCode}`,
      postData,
    );
    console.log('data', data.data);
    if (status) {
      if (data?.data.length > 0) {
        console.log(data?.data);
        setreserveData(data?.data);
        setloading(false);
      } else {
        setloading(false);
        toast.current.show(message);
      }
    } else {
      setloading(false);
      let errorMessage = error ? error : message;
      toast.current.show(errorMessage);
    }
  };

  const AddReservationCode = () => {
    return (
      <Formik
        validationSchema={Schema}
        initialValues={{}}
        onSubmit={values => onSubmitCode(values)}>
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
                  onBlur={handleBlur('code')}
                  label={strings('enter_booking_Code')}
                  caption={errors.code ? strings(`${errors.code}`) : ''}
                  status={errors.code ? 'danger' : ''}
                  onChangeText={handleChange('code')}
                />
              </Layout>
              <Layout>
                <View
                  style={[
                    styles.boxStyle,
                    {flexDirection: 'row', alignItems: 'center'},
                  ]}>
                  <View style={{flex: 1}}>
                    <ButtonComponent onPress={handleSubmit} size="small">
                      <Typography
                        status="control"
                        category="s2"
                        style={{fontWeight: '400'}}>
                        {strings('add_reservation')}
                      </Typography>
                    </ButtonComponent>
                  </View>
                </View>
              </Layout>
            </ScrollView>
          </>
        )}
      </Formik>
    );
  };

  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <SecondaryHeader title={strings('add_booking_code')} />
      {loading ? (
        <>
          <CustomSkeletonList />
          <CustomSkeletonList />
        </>
      ) : (
        <>
          <AddReservationCode />

          {reserveData && reserveData.length > 0 && (
            <List
              contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: themeConfig.colors.white,
                marginVertical: themeConfig.margin,
              }}
              style={{
                backgroundColor: themeConfig.colors.white,
              }}
              data={reserveData}
              renderItem={({item, index}) => {
                return (
                  <ReservationListItem
                    key={index}
                    item={item}
                    index={index}
                    plain
                    reservations
                    bookFor="location"
                  />
                );
              }}
            />
          )}
        </>
      )}
      <Toast
        ref={toast} //eslint-disable-line
        position="center"
        defaultCloseDelay={10000}
        positionValue={200}
      />
    </Layout>
  );
};
export default AddReservationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: themeConfig.margin,
  },
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
  headerText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
});
