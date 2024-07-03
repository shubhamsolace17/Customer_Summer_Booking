import React from 'react';
import SelectComponent from 'components/Select';

const SelectPackagesDD = ({data, disabled, value, handleChange = () => {}}) => {
  return (
    <SelectComponent
      options={data}
      disabled={disabled}
      value={value}
      onSelect={index => handleChange(index)}
    />
  );
};

export default SelectPackagesDD;
