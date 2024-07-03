import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {Icon} from '@ui-kitten/components';
import pure from 'recompose/pure';

const PlusMinusComponent = ({
  value,
  plusPress = () => {},
  minusPress = () => {},
  ...props
}) => {
  return (
    <View style={{}}>
      <View style={[styles.container, props.style]}>
        <TouchableOpacity
          style={styles.iconButtonContainer}
          onPress={minusPress}>
          <Icon
            style={styles.icon}
            fill={themeConfig.colors.white}
            name="minus-outline"
          />
        </TouchableOpacity>
        <View
          style={{
            width: 30,
            justifyContent: 'center',
            alignContent: 'center',
          }}>
          <Typography
            category="s2"
            style={{fontWeight: '400', textAlign: 'center'}}>
            {value}
          </Typography>
        </View>
        <TouchableOpacity
          style={styles.iconButtonContainer}
          onPress={plusPress}>
          <Icon
            style={styles.icon}
            fill={themeConfig.colors.white}
            name="plus-outline"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default pure(PlusMinusComponent);

const styles = StyleSheet.create({
  icon: {
    height: 20,
    width: 20,
  },
  container: {
    padding: themeConfig.padding,
    borderRadius: themeConfig.radius * 4,
    borderColor: themeConfig.colors.lightBule,
    borderWidth: themeConfig.borderWidth,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeConfig.colors.lightBule,
  },
  iconButtonContainer: {
    backgroundColor: themeConfig.colors.primary,
    borderWidth: themeConfig.borderWidth,
    borderRadius: themeConfig.radius * 2,
    borderColor: themeConfig.colors.primary,
  },
});
