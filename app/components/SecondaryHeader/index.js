import React from 'react';
import {View} from 'react-native';
import {
  Divider,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import Typography from 'components/Typography';
import {useNavigation} from '@react-navigation/native';
import SVGIcon from 'components/Icon';
import themeConfig from 'configurations/Theme.configuration';

const BackIcon = props => (
  <SVGIcon type={'LeftArrow'} width={20} height={28} {...props} />
);

export default function TopNavigationDividerShowcase({
  title = '',
  actionIcon = '',
  heartIcon = '',
  heartIconClick = () => {},
  hideNavigator = false,
  customNaviagtion = false,
  showBackButton,
  NaviagtionAction = () => {},
  onActionClick = () => {},
}) {
  const navigation = useNavigation();
  const RightAction = props =>
    actionIcon ? (
      <SVGIcon type={actionIcon} width={25} height={28} {...props} />
    ) : null;
  const heartRightAction = props =>
    actionIcon ? (
      <SVGIcon type={heartIcon} width={25} height={28} {...props} />
    ) : null;
  const renderSettingsAction = () => (
    <>
      <TopNavigationAction icon={heartRightAction} onPress={heartIconClick} />
      <TopNavigationAction icon={RightAction} onPress={onActionClick} />
    </>
  );

  const navigateBack = () => {
    if (customNaviagtion) {
      NaviagtionAction();
    } else {
      navigation.goBack();
    }
  };

  const renderBackAction = () =>
    hideNavigator ? null : (
      <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    );

  return (
    <>
      <TopNavigation
        title={() => (
          <Typography
            category="h2"
            style={{
              fontWeight: '900',
              marginHorizontal: themeConfig.margin / 2,
              fontFamily: 'Roboto-Black',
            }}>
            {title}
          </Typography>
        )}
        accessoryLeft={showBackButton ? renderBackAction : null}
        accessoryRight={actionIcon ? renderSettingsAction : ''}
      />
      {/* <Divider /> */}
    </>
  );
}
