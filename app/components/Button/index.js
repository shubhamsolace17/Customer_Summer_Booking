import React from 'react';
import {Button} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'app/components/Typography';
export default function ButtonComponent({
  leftIcon,
  onPress,
  children,
  ...props
}) {
  return (
    <Button
      {...props}
      size={props.size || themeConfig.inputHeight}
      onPress={onPress}
      style={[styles.inputContainer, props.style]}>
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: themeConfig.margin / 2,
    borderRadius: themeConfig.radius * 6,
  },
});
