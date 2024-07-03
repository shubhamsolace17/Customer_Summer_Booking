import React from 'react';
import {Divider, Layout} from '@ui-kitten/components';
import {StyleSheet, View, ImageBackground, Dimensions} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SVGIcon from 'components/Icon';
import {strings} from 'i18n/i18n';
import {useSelector} from 'react-redux';

const BookingCancel = ({navigation}) => {
  const [searchDate, getFinalLocData, selectedBookedLocation] = useSelector(
    state => [
      state.globalReducerData.searchDate,
      state.BookingReducerData.getFinalLocData,
      state.locationReducer.selectedBookedLocation,
    ],
  );
  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent />
      <ScrollView bounces={false}>
        <Layout
          level="1"
          style={[
            styles.container,
            {marginTop: themeConfig.margin},
            styles.boxStyle,
          ]}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: themeConfig.margin,
            }}>
            <Typography category="h6" style={{fontWeight: '400'}}>
              {strings('cancel_reservationDta')}
            </Typography>
          </View>
          <Divider />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: themeConfig.margin,
            }}>
            <SVGIcon type="Checked" width={50} height={50} />
            <Typography
              category="h6"
              style={{
                fontWeight: '400',
                marginBottom: themeConfig.margin,
              }}>
              {strings('booking_cancel')}
            </Typography>
          </View>
          <Typography category="s2" style={{fontWeight: '400'}} status="basic">
            {strings('booking_cancel_msg')}
          </Typography>
          <ButtonComponent
            status="basic"
            onPress={() =>
              navigation.navigate('Search', {screen: 'SearchHome'})
            }>
            <Typography category="s2" style={{fontWeight: '400'}}>
              {strings('ok_Got_It')}
            </Typography>
          </ButtonComponent>
        </Layout>
      </ScrollView>
    </Layout>
  );
};
export default BookingCancel;

const styles = StyleSheet.create({
  container: {flex: 1},
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
  leftSection: {
    width: 100,
    marginBottom: themeConfig.margin / 2,
  },
  rightSection: {
    flex: 1,
    marginBottom: themeConfig.margin / 2,
  },
});
