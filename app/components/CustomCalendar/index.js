import React from 'react';
import {StyleSheet, Text} from 'react-native';
import themeConfig from 'configurations/Theme.configuration';
import {Calendar} from 'react-native-calendars';
import {Icon} from '@ui-kitten/components';

export default function CustomCalendar({
  leftIcon,
  minDate,
  maxDate,
  markDates,
  markingType,
  onDayPress = () => {},
  ...props
}) {
  const _renderArrow = direction => {
    if (direction === 'left') {
      return (
        <Icon
          style={styles.icon}
          fill={themeConfig.colors.primary}
          name="chevron-left"
        />
      );
    } else {
      return (
        <Icon
          style={styles.icon}
          fill={themeConfig.colors.primary}
          name="chevron-right"
        />
      );
    }
  };
  return (
    <Calendar
      minDate={minDate}
      current={minDate}
      maxDate={maxDate}
      markingType={'custom'}
      markedDates={markDates}
      onDayPress={day => onDayPress(day)}
      // Specify style for calendar container element. Default = {}
      // Specify theme properties to override specific styles for calendar parts. Default = {}
      theme={{
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        textSectionTitleColor: themeConfig.colors.primary,
        textSectionTitleDisabledColor: '#d9e1e8',
        selectedDayBackgroundColor: themeConfig.colors.primary,
        selectedDayTextColor: themeConfig.colors.white,
        todayTextColor: '#00adf5',
        dayTextColor: themeConfig.colors.grey,
        textDisabledColor: '#d9e1e8',
        dotColor: '#00adf5',
        selectedDotColor: themeConfig.colors.white,
        arrowColor: themeConfig.colors.primary,
        disabledArrowColor: '#d9e1e8',
        monthTextColor: themeConfig.colors.primary,
        indicatorColor: 'blue',
        textDayFontFamily: 'Roboto-Regular',
        textMonthFontFamily: 'Roboto-Black',
        textDayHeaderFontFamily: 'Roboto-Black',
        textDayFontWeight: '400',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '400',
        textDayFontSize: 11,
        textMonthFontSize: 15,
        textDayHeaderFontSize: 12,
      }}
      renderArrow={_renderArrow}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: themeConfig.margin / 2,
    borderRadius: themeConfig.radius * 4,
  },
  icon: {
    width: 40,
    height: 40,
  },
});
