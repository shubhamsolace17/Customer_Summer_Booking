import React from 'react';
import {StyleSheet} from 'react-native';
import themeConfig from 'configurations/Theme.configuration';
import SelectComponent from 'components/Select';

const SelectRowSectorDD = ({data, selectedRow, handleChange = () => {}}) => {
  return (
    <SelectComponent
      options={data}
      value={selectedRow}
      onSelect={index => handleChange(index)}
    />
  );
};

export default SelectRowSectorDD;

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
