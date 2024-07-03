import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Alert,
  Text,
  Image,
  Keyboard,
} from 'react-native';
import {Autocomplete, AutocompleteItem, Icon} from '@ui-kitten/components';
import themeConfig from 'configurations/Theme.configuration';
import Typography from 'components/Typography';
//API
import Api from 'services/Api';
import {postDataToServer} from 'services/AuthApi';
import SVGIcon from 'components/Icon';

const AutoSuggestionInput = ({
  placeholder,
  leftIcon,
  rightIcon,
  status,
  caption,
  ChangeText,
  onBlur,
  setInput,
  disabled,
  ...props
}) => {
  const [value, setValue] = React.useState(null);
  const [data, setData] = React.useState([]);
  const onSelect = index => {
    setValue(data[index].location);
    setInput(data[index].location);
  };

  const locationImage = require('../../resources/images/location.png');
  const bathHouseImage = require('../../resources/images/bathHouse.png');
  const countryImage = require('../../resources/images/country.png');

  const _getFilterationData = async (setValue, data) => {
    let bathHousename = data && data.bathHousename ? data.bathHousename : [];
    let city = data && data.city ? data.city : [];
    let country = data && data.country ? data.country : [];
    let region = data && data.region ? data.region : [];

    let finalResult = [];

    (await bathHousename) &&
      bathHousename.length > 0 &&
      bathHousename.map(x => {
        let locAddress =
          (x.address ? x.address : '') +
          (x.city ? '-' + x.city : '') +
          (x.region ? '-' + x.region : '') +
          (x.country ? '-' + x.country : '');
        finalResult.push({
          location: x.bathouseName,
          locAddress: locAddress,
          image: 'bathHouse',
        });
      });

    (await city) &&
      city.length > 0 &&
      city.map(x => {
        let locAddress =
          (x.city ? x.city : '') +
          (x.region ? '-' + x.region : '') +
          (x.country ? '-' + x.country : '');
        finalResult.push({
          location: x.city,
          locAddress: locAddress,
          image: 'location',
        });
      });

    (await region) &&
      region.length > 0 &&
      region.map(x => {
        let locAddress =
          (x.region ? x.region : '') + (x.country ? '-' + x.country : '');
        finalResult.push({
          location: x.region,
          locAddress: locAddress,
          image: 'location',
        });
      });

    (await country) &&
      country.length > 0 &&
      country.map(x => {
        let locAddress = x.country ? x.country : '';
        finalResult.push({
          location: x.country,
          locAddress: locAddress,
          image: 'country',
        });
      });
    finalResult.filter((item, index) => finalResult.indexOf(item) === index);
    const filterData = await _selectDistinctRec(finalResult);
    setData(filterData);
  };

  const _selectDistinctRec = items => {
    const uniqueAddresses = Array.from(new Set(items.map(a => a.location))).map(
      location => {
        return items.find(a => a.location.trim() === location.trim());
      },
    );
    return uniqueAddresses;
  };

  const FindResult = async () => {
    let bathHousename = data && data.bathHousename ? data.bathHousename : [];
    let city = data && data.city ? data.city : [];
    let country = data && data.country ? data.country : [];
    let region = data && data.region ? data.region : [];

    let finalResult = [];

    (await bathHousename) &&
      bathHousename.length > 0 &&
      bathHousename.map(x => {
        let locAddress =
          (x.address ? x.address : '') +
          (x.city ? '-' + x.city : '') +
          (x.region ? '-' + x.region : '') +
          (x.country ? '-' + x.country : '');
        finalResult.push({
          location: x.bathouseName,
          locAddress: locAddress,
          image: 'bathHouse',
        });
      });

    (await city) &&
      city.length > 0 &&
      city.map(x => {
        let locAddress =
          (x.city ? x.city : '') +
          (x.region ? '-' + x.region : '') +
          (x.country ? '-' + x.country : '');
        finalResult.push({
          location: x.city,
          locAddress: locAddress,
          image: 'location',
        });
      });

    (await region) &&
      region.length > 0 &&
      region.map(x => {
        let locAddress =
          (x.region ? x.region : '') + (x.country ? '-' + x.country : '');
        finalResult.push({
          location: x.region,
          locAddress: locAddress,
          image: 'location',
        });
      });

    (await country) &&
      country.length > 0 &&
      country.map(x => {
        let locAddress = x.country ? x.country : '';
        finalResult.push({
          location: x.country,
          locAddress: locAddress,
          image: 'country',
        });
      });
    finalResult.filter((item, index) => finalResult.indexOf(item) === index);
    const filterData = await _selectDistinctRec(finalResult);
    setData(filterData);
  };

  const onChangeText = async query => {
    setValue(query);
    if (query.length == 3) {
      const postData = {
        searchData: query,
      };
      const {data, message, status} = await postDataToServer(
        `${Api.locationSearch}`,
        postData,
      );
      if (status) {
        ChangeText;
        _getFilterationData(query, data);
      } else {
        Alert.alert('Something Went Wrong :(', message, [{text: 'Okay'}]);
      }
    } else {
      ChangeText;
      setData(getSuggestions(query, data));
    }
  };

  const getSuggestions = (value, resData) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    var uniqueList = resData.filter(
      e =>
        e.location.toLowerCase().includes(inputValue.toLowerCase()) ||
        e.locAddress
          .toLowerCase()
          .includes(inputValue.toLowerCase())
          .toString()
          .toLowerCase()
          .includes(inputValue.toLowerCase()),
    );
    return inputLength === 0
      ? []
      : uniqueList.filter((item, index) => uniqueList.indexOf(item) === index);
  };

  const clearInput = () => {
    setValue('');
    setData([]);
  };
  const renderItem = (location, locAddress) => (
    <View>
      <Typography
        category="s1"
        status="basic"
        style={{fontWeight: '400', fontSize: 12}}>
        {location ? location : ''}
      </Typography>
      <Typography
        category="s1"
        status="basic"
        style={{fontWeight: '400', fontSize: 12}}>
        {locAddress ? locAddress : ''}
      </Typography>
    </View>
  );

  const RenderLocationItemImage = () => (
    <Image style={{width: 20, height: 20}} source={locationImage} />
  );

  const RenderBathItemImage = () => (
    <Image style={{width: 20, height: 20}} source={bathHouseImage} />
  );

  const RenderCountryImage = () => (
    <Image style={{width: 20, height: 20}} source={countryImage} />
  );

  const renderOption = (item, index) => (
    <AutocompleteItem
      key={index}
      title={renderItem(item.location, item.locAddress)}
      accessoryLeft={
        item.image === 'bathHouse'
          ? RenderBathItemImage
          : item.image === 'country'
          ? RenderCountryImage
          : RenderLocationItemImage
      }
    />
  );

  const renderCloseIcon = props => (
    <TouchableWithoutFeedback onPress={clearInput}>
      <SVGIcon {...props} type="Search" color={themeConfig.colors.primary} />
      {/* <Icon {...props} name={leftIcon} /> */}
    </TouchableWithoutFeedback>
  );

  return (
    <Autocomplete
      placeholder={placeholder}
      value={value}
      allowFontScaling={false}
      accessoryLeft={renderCloseIcon}
      onChangeText={onChangeText}
      onSelect={onSelect}
      status={status}
      size={themeConfig.inputHeight}
      style={[styles.inputContainer, props.style]}
      caption={caption}
      showSoftInputOnFocus={disabled ? false : true}
      disabled={disabled ? true : false}>
      {data && !disabled && data.map(renderOption)}
    </Autocomplete>
  );
};

export default AutoSuggestionInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: themeConfig.margin / 2,
    borderRadius: themeConfig.radius * 4,
  },
});
