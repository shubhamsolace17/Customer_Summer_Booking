import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const Loader = ({color, visible, ...props}) => {
  return (
    <View>
      <ActivityIndicator
        animating={visible}
        size="large"
        color={color}
        style={[props.style]}
      />
    </View>
  );
};

export default Loader;
