import React from 'react';
import {Input} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import themeConfig from 'configurations/Theme.configuration';
import SVGIcon from 'components/Icon';
import Typography from 'components/Typography';

export default function InputComponent({
  leftIcon,
  size = themeConfig.inputHeight,
  iconType = 'Search',
  ...props
}) {
  const renderIcon = iconProps => (
    <SVGIcon {...iconProps} type={iconType} color={themeConfig.colors.grey} />
  );
  const accessoryRight = leftIcon ? {accessoryRight: renderIcon} : {};
  const renderLabel = label => {
    return (
      <>
        <Typography
          category="s2"
          style={{
            marginVertical: themeConfig.margin * 1.2,
            marginHorizontal: themeConfig.margin,
            color: '#1c1c1c',
          }}
          status="basic">
          {label}
        </Typography>
      </>
    );
  };
  return (
    <Input
      {...props}
      {...accessoryRight}
      size={size}
      allowFontScaling={false}
      label={props.label ? renderLabel(props.label) : null}
      style={[styles.inputContainer, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: themeConfig.margin / 2,
    borderRadius: themeConfig.radius * 4,
    borderColor: '#919191',
    backgroundColor: themeConfig.colors.white,
  },
});
