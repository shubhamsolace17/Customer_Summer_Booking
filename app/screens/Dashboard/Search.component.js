import {useNavigation} from '@react-navigation/native';
import {Layout} from '@ui-kitten/components';
import ButtonComponent from 'components/Button';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import React, {useState} from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Image,
  Text,
  View,
} from 'react-native';
import {strings} from 'i18n/i18n';
import AutoSuggestionInput from 'components/AutoSuggestion/autoSuggestion';
import DateRangePickerComponent from 'components/DateRangePicker';
import SVGIcon from 'components/Icon';

const SearchComponent = ({
  onSearchSumbit,
  setInputValue = () => {},
  onDateSelect = () => {},
  dateStatus,
  dateCaption,
  inputStatus,
  inputCaption,
  range,
  showDatePicker,
  data,
  showSearch,
  date,
  locale,
}) => {
  const showEditSearch = () => {
    onSearchSumbit();
  };
  return (
    <Layout level="3" style={styles.container}>
      <Layout id="Search" style={styles.boxStyle}>
        <Typography
          category="h3"
          style={showSearch ? styles.EditsearchText : styles.serachText}>
          {showSearch ? strings('search_Bathhouse') : strings('edit_Search')}
        </Typography>
        {data && !showDatePicker ? (
          <>
            <TouchableOpacity
              style={styles.searchButton}
              activeOpacity={0.5}
              onPress={() => showEditSearch()}>
              <SVGIcon
                type="Search"
                color={themeConfig.colors.primary}
                style={{marginHorizontal: themeConfig.margin}}
                width={20}
                height={20}
              />
              <Typography
                style={{fontSize: 12, marginHorizontal: themeConfig.margin}}
                status="basic"
                category="s1">
                {data.searchKey + ',' + date}
              </Typography>
            </TouchableOpacity>
          </>
        ) : (
          <AutoSuggestionInput
            leftIcon="search-outline"
            disabled={data && data.searchKey && showSearch ? true : false}
            placeholder={data ? data.searchKey : strings('where_you_going')}
            caption={inputCaption}
            value={data && showSearch ? data.searchKey : ''}
            setInput={data => {
              setInputValue(data);
            }}
            status={inputStatus}
          />
        )}

        {showDatePicker && (
          <DateRangePickerComponent
            leftIcon="calendar-outline"
            placeholder={strings('SelectDate')}
            caption={dateCaption}
            date={'01/09/2021'}
            defaultValue={'01/09/2021'}
            range={data && showSearch ? data.range : range}
            status={dateStatus}
            disabled={data && data.range && showSearch ? true : false}
            onSelect={nextRange => {
              onDateSelect(nextRange);
            }}
            locale={locale}
          />
        )}
        {showDatePicker && (
          <ButtonComponent
            style={{
              borderRadius: themeConfig.radius * 6,
            }}
            onPress={() => {
              data && showSearch ? showEditSearch() : onSearchSumbit();
            }}>
            <Typography status="control" category="s2" style={{fontSize: 18}}>
              {data && showSearch ? strings('edit_Search') : strings('search')}
            </Typography>
          </ButtonComponent>
        )}
      </Layout>
    </Layout>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxStyle: {
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding * 2,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: themeConfig.margin,
    paddingVertical: themeConfig.padding / 2,
    marginLeft: themeConfig.margin * 4,
  },
  imageContainer: {
    width: 120,
    height: '100%',
    minHeight: 120,
    padding: 10,
  },
  imageStyle: {
    borderRadius: themeConfig.radius * 2,
    width: '100%',
    borderRadius: 10,
  },
  itemContainer: {
    borderRadius: themeConfig.radius * 3,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: themeConfig.margin * 2,
    position: 'relative',
    flex: 1,
    backgroundColor: '#D8E2FF',
    padding: themeConfig.padding,
    margin: themeConfig.margin,
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleBorder: {
    width: 1,
    borderColor: themeConfig.colors.borderColor,
    borderWidth: 0.7,
    height: themeConfig.boxHeightUnit / 2,
  },
  filterSortChild: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: themeConfig.boxHeightUnit,
    flexDirection: 'row',
  },
  EditsearchText: {
    fontSize: 15,
    marginVertical: themeConfig.margin,
    marginHorizontal: themeConfig.margin / 2,
  },
  serachText: {
    fontSize: 15,
    marginVertical: themeConfig.margin,
    marginHorizontal: themeConfig.margin / 2,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeConfig.colors.white,
    marginVertical: themeConfig.margin / 2,
    borderRadius: themeConfig.radius * 4,
    borderWidth: themeConfig.borderWidth,
    padding: themeConfig.padding * 1.5,
    borderColor: themeConfig.colors.white,
  },
  buttonIconSeparatorStyle: {
    backgroundColor: '#fff',
    width: 1,
    height: 40,
  },
});
