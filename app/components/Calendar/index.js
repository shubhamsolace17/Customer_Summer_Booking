import React from 'react';
import {RangeDatepicker} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import themeConfig from 'configurations/Theme.configuration';
import SVGIcon from 'components/Icon';

export default function CalendarComponent({leftIcon, ...props}) {
  const renderIcon = iconProps => (
    <SVGIcon
      {...iconProps}
      type="Calender"
      color={themeConfig.colors.primary}
    />
  );
  const accessoryLeft = leftIcon ? {accessoryLeft: renderIcon} : {};

  return (
    <RangeDatepicker
      {...props}
      {...accessoryLeft}
      controlStyle={{
        borderRadius: themeConfig.radius * 4,
        justifyContent: 'flex-start',
      }}
      size={themeConfig.inputHeight}
      style={[styles.inputContainer, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: themeConfig.margin / 2,
    borderRadius: themeConfig.radius * 4,
  },
});
