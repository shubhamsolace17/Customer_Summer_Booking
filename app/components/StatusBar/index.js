import React from 'react';
import {StyleSheet, View, StatusBar, SafeAreaView} from 'react-native';
import {useTheme} from '@ui-kitten/components';
import {useThemeContext} from 'themes/Theme.context';
import constanceConfig from 'configurations/Constance.configuration';
export default function StatusBarComponent() {
  const theme = useTheme();
  const {themeName} = useThemeContext();
  const backgroundColor =
    themeName === constanceConfig.LIGHT_THEME_KEY
      ? theme[constanceConfig.THEME_DEFAULT_COLOR_KEY]
      : constanceConfig.DARK_THEME_COLOR;
  return (
    <View style={[styles.statusBar, {backgroundColor}]}>
      <SafeAreaView>
        <StatusBar
          translucent
          backgroundColor={backgroundColor}
          barStyle={'light-content'}
        />
      </SafeAreaView>
    </View>
  );
}
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});
