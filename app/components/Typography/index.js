import themeConfig from 'configurations/Theme.configuration';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from '@ui-kitten/components';

export default function Typography({
  children,
  status = 'primary',
  category = themeConfig.textSize,
  ...props
}) {
  return (
    <Text
      status={status}
      {...props}
      category={category}
      allowFontScaling={false}
      style={[styles.textContainer, props.style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    marginVertical: themeConfig.margin / 3,
  },
});
