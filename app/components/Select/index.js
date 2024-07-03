import React from 'react';
import {Select, SelectItem} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';

export default function SelectComponent({
  selectedIndex,
  onSelect,
  size,
  options = [],
  placeholder = '',
  value = '',
  ...props
}) {
  const renderOption = data => (
    <SelectItem
      title={
        <Typography category="s2" status="basic">
          {data.title}
        </Typography>
      }
    />
  );

  return (
    <Select
      {...props}
      size={size ? size : 'large'}
      value={value}
      placeholder={
        placeholder ? (
          <Typography category="s2" status="basic">
            {placeholder}
          </Typography>
        ) : null
      }
      selectedIndex={selectedIndex}
      onSelect={onSelect}>
      {options.map(renderOption)}
      {/* {options.map(({title}) => {
        console.log('tyitie',title)
        return (
          <SelectItem
            title={
              <Typography category="s2" status="basic">
                {title}
              </Typography>
            }
          />
        );
      })} */}
    </Select>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: themeConfig.margin / 2,
    borderRadius: themeConfig.radius * 4,
  },
});
