import React from 'react';
import {StyleSheet} from 'react-native';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';

const ShowMaxPeopleCount = ({count}) => {
  return (
    <Typography category="s1" style={{fontWeight: '400'}} status="basic">
      {count}
    </Typography>
  );
};

export default ShowMaxPeopleCount;

const styles = StyleSheet.create({
  leftSection: {
    // flex: 1,
    width: 100,
  },
  rightSection: {
    flex: 1,
  },
  layoutContainer: {
    backgroundColor: themeConfig.colors.lightBule,
    padding: themeConfig.padding * 2,
    marginTop: themeConfig.margin,
  },
  boxStyle: {
    marginHorizontal: themeConfig.margin,
  },
});
