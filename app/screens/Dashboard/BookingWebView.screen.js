import React from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';

const env = 'dev';
//API
const BookingWebViewScreen = ({route}) => {
  const {url} = route.params || {};
  return (
    <View style={{flex: 1}}>
      <WebView
        source={{
          uri:
            env === 'dev'
              ? `https://development.summerbooking.it/${url}?ismobile=true`
              : `https://summerbooking.it/${url}?ismobile=true`,
        }}
        style={{flex: 1}}
      />
    </View>
  );
};
export default React.memo(BookingWebViewScreen);
