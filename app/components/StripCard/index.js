import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {CardField} from '@stripe/stripe-react-native';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';

const StripeComponent = ({
  value,
  onFinish = () => {},
  minusPress = () => {},
  isError,
}) => {
  return (
    <View style={{}}>
      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          borderColor: isError ? '#AD1325' : 'white',
          textColor: '#A3ADC1',
          borderRadius: 6,
          borderWidth: 1,
          fontSize: 15,
          fontFamily: 'Roboto-Medium',
          placeholderColor: '#A3ADC1',
        }}
        style={{
          height: 50,
          marginTop: 5,
        }}
        onCardChange={cardDetails => {
          if (cardDetails.complete) {
            onFinish(cardDetails);
          }
        }}
        // onFocus={focusedField => {
        //   console.log('focusField', focusedField);
        // }}
      />
    </View>
  );
};

export default StripeComponent;
