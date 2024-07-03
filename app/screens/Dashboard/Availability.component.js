import {Layout, CheckBox} from '@ui-kitten/components';
import Typography from 'components/Typography';
import themeConfig from 'configurations/Theme.configuration';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import DateRangePickerComponent from 'components/DateRangePicker';
import SelectComponent from 'components/Select';
import {strings} from 'i18n/i18n';

const Availability = ({
  range,
  bookingOption,
  bookingPeriod,
  seasonalCheckbox,
  disable,
  locale,
  seasonalReservation,
  onDateSelect = () => {},
  handleChange = () => {},
  handleCheckbox = () => {},
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarRange, setCalendarRange] = useState(range);
  return (
    <Layout style={styles.layoutContainer}>
      <Typography
        category="h3"
        style={{
          fontWeight: '700',
          marginBottom: themeConfig.margin * 2,
        }}>
        {strings('select_date')}
      </Typography>
      <DateRangePickerComponent
        leftIcon="calendar-outline"
        // placeholder={strings('SelectDate')}
        date={'01/09/2021'}
        defaultValue={'01/09/2021'}
        range={range}
        disabled={disable}
        placement="bottom"
        onPress={() => setShowCalendar(true)}
        onSelect={nextRange => {
          onDateSelect(nextRange);
        }}
      />
      {seasonalReservation == 'true' && (
        <View style={styles.checkboxContainer}>
          <CheckBox
            status={'primary'}
            checked={seasonalCheckbox}
            onChange={() => handleCheckbox()}
          />
          <Typography category="s2" style={styles.checkboxText}>
            {strings('seasonal')}
          </Typography>
        </View>
      )}

      <SelectComponent
        selectedIndex={0}
        style={{
          backgroundColor: 'transparent',
          padding: themeConfig.padding,
          marginTop: themeConfig.margin,
        }}
        value={bookingPeriod}
        onSelect={index => handleChange(index)}
        options={bookingOption}
      />
    </Layout>
  );
};

export default Availability;

const styles = StyleSheet.create({
  layoutContainer: {
    backgroundColor: themeConfig.colors.lightBule,
    padding: themeConfig.padding * 2,
    marginTop: themeConfig.margin,
  },
  checkboxContainer: {
    marginHorizontal: themeConfig.margin,
    flexDirection: 'row',
    margin: themeConfig.margin,
  },
  checkboxText: {
    fontWeight: '500',
    color: themeConfig.colors.primary,
    marginHorizontal: themeConfig.margin * 2,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
