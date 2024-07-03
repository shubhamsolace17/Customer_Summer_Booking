import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  Icon,
  useTheme,
  Text,
  Avatar,
  OverflowMenu,
  MenuItem,
} from '@ui-kitten/components';
import {useNavigation} from '@react-navigation/native';
import assign from 'lodash/assign';
import {useThemeContext} from 'themes/Theme.context';
import constanceConfig from 'configurations/Constance.configuration';
import SVGIcon from 'components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from 'react-native-i18n';
import {useDispatch, useSelector} from 'react-redux';
import {setLanguage} from 'app/redux/actions/globalActions';
import themeConfig from 'configurations/Theme.configuration';

const BackIcon = props => (
  <Icon
    {...props}
    style={{height: 40, width: 40}}
    name="arrow-ios-back-outline"
    fill="white"
  />
);

const HeaderComponent = ({
  title = '',
  alignment = 'start',
  showBackButton = false,
  customNaviagtion = false,
  NaviagtionAction = () => {},
  subtitle = '',
  ...reestProps
}) => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [language] = useSelector(state => [state.globalReducerData.language]);
  const {themeName} = useThemeContext();
  const [visible, setVisible] = React.useState(false);
  const dispatch = useDispatch();
  const navigateBack = () => {
    if (customNaviagtion) {
      NaviagtionAction();
    } else {
      navigation.goBack();
    }
  };
  const backgroundColor =
    themeName === constanceConfig.LIGHT_THEME_KEY
      ? theme[constanceConfig.THEME_DEFAULT_COLOR_KEY]
      : constanceConfig.DARK_THEME_COLOR;

  const BackAction = () => (
    <TopNavigationAction
      style={{right: themeConfig.margin / 2}}
      icon={BackIcon}
      onPress={navigateBack}
    />
  );
  const renderToggleButton = () => (
    <Text
      onPress={() => setVisible(true)}
      style={[styles.title, {fontSize: 14}]}>
      {language == 'en' ? 'English' : 'Italiano'}
    </Text>
  );

  const SettingsIcon = props => (
    <View style={{flexDirection: 'row'}}>
      <Icon
        style={{height: 20, width: 20, marginRight: 5}}
        name="globe-outline"
        fill="white"
      />
      <OverflowMenu
        visible={visible}
        anchor={renderToggleButton}
        onBackdropPress={() => setVisible(false)}>
        <MenuItem title="English" onPress={() => onValueChange('en')} />
        <MenuItem title="Italiano" onPress={() => onValueChange('it')} />
      </OverflowMenu>
    </View>
  );

  const onValueChange = async value => {
    await AsyncStorage.setItem('selectedLocale', value);
    // setLanguage(value);
    setVisible(false);
    I18n.locale = value;
    dispatch(setLanguage(value));
  };

  const renderSettingsAction = () => (
    <TopNavigationAction icon={SettingsIcon} />
  );
  let inheritProps = {};
  if (showBackButton) {
    assign(inheritProps, {accessoryLeft: BackAction});
  }
  const renderTitle = props => {
    return (
      <View
        style={
          showBackButton ? styles.titleContainer : styles.titlewithoutBackButton
        }>
        <SVGIcon type="Logo" style={styles.logo} />
        <Text {...props} style={[props.style, styles.title]}>
          {title}
        </Text>
      </View>
    );
  };
  return (
    <TopNavigation
      title={renderTitle}
      alignment={alignment}
      accessoryRight={renderSettingsAction}
      accessoryLeft={showBackButton ? BackAction : null}
      {...inheritProps}
      style={{
        backgroundColor: backgroundColor,
        paddingVertical: 0,
      }}
      {...reestProps}
    />
  );
};

export default HeaderComponent;

const styles = StyleSheet.create({
  title: {
    color: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  titlewithoutBackButton: {
    flexDirection: 'row',
    flex: 1,
  },
  logo: {
    width: 70,
    height: 70,
    marginHorizontal: themeConfig.margin * 2,
  },
});
