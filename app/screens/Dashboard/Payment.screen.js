import React from 'react';
import {CheckBox, Divider, Layout} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import HeaderComponent from 'components/Header';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
import ButtonComponent from 'components/Button';
import {ScrollView} from 'react-native-gesture-handler';
import SecondaryHeader from 'components/SecondaryHeader';
import InputComponent from 'components/Input';
import SelectComponent from 'components/Select';

const PaymentScreen = ({navigation}) => {
  return (
    <Layout style={{flex: 1}} level="1">
      <HeaderComponent showBackButton />
      <SecondaryHeader title="Finish Booking" />
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
              flexDirection: 'row',
            }}>
            <View style={{marginBottom: themeConfig.margin * 2}}>
              <Typography
                category="s2"
                style={{fontWeight: '600'}}
                status="basic">
                When do you prefer to pay?
              </Typography>
            </View>
          </View>
          <CheckBox
            checked={false}
            onChange={nextChecked => {}}
            style={{marginBottom: themeConfig.margin * 2}}>
            Pay now
          </CheckBox>
          <CheckBox
            checked={false}
            onChange={nextChecked => {}}
            style={{marginBottom: themeConfig.margin * 2}}>
            Pay at the property
          </CheckBox>
          <Divider />
          <View
            style={{
              marginTop: themeConfig.margin / 2,
              marginBottom: themeConfig.margin,
            }}>
            <Typography category="c1" status="basic">
              By paying at the property, your card details will be used as a
              guaranteed only To confirm the reservation. No amount will be
              taken - you will pay at the property.
            </Typography>
          </View>
          <View style={{flex: 1}}>
            <InputComponent placeholder="Cardholder's Name" />
            <InputComponent placeholder="Card Number" />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <SelectComponent
                  onSelect={() => {}}
                  label={
                    <Typography category="c1" status="basic">
                      Valid thru
                    </Typography>
                  }
                  placeholder="MM"
                  options={Array(12)
                    .fill()
                    .map((_, index) => ({title: index + 1}))}
                />
                <SelectComponent
                  style={{marginHorizontal: themeConfig.margin}}
                  label={<Typography category="c1" status="basic" />}
                  onSelect={() => {}}
                  placeholder="YY"
                  options={Array(20)
                    .fill()
                    .map((_, index) => ({title: index + 2021}))}
                />
              </View>
              <View style={{marginTop: themeConfig.margin + 3}}>
                <InputComponent
                  placeholder="CVV"
                  leftIcon={true}
                  iconType="Question"
                />
              </View>
            </View>
          </View>
        </Layout>
      </ScrollView>

      <Layout>
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
              onPress={() => navigation.navigate('BookingConfirm')}>
              <Typography
                status="control"
                category="h6"
                style={{fontWeight: '400'}}>
                Book Now
              </Typography>
            </ButtonComponent>
          </View>
        </View>
      </Layout>
    </Layout>
  );
};
export default PaymentScreen;

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
