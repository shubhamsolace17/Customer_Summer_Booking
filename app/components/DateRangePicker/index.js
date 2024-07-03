import React from 'react';
import {RangeDatepicker, NativeDateService} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import themeConfig from 'configurations/Theme.configuration';
import SVGIcon from 'components/Icon';

const useDatepickerState = (initialDate = null) => {
  const [date, setDate] = React.useState(initialDate);
  return {date, onSelect: setDate};
};
const i18n = {
  dayNames: {
    short: ['S', 'l', 'm', 'm', 'g', 'V', 'S'],
    long: [
      'Domenica',
      'Lunedi',
      'Martedì',
      'Mercoledì',
      'Giovedì',
      'Venerdì',
      'Sabato',
    ],
  },
  monthNames: {
    short: [
      'gen',
      'febbraio',
      'Marzo',
      'aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'agosto',
      'sett',
      'ottobre',
      'nov',
      'dic',
    ],
    long: [
      'Gennaio',
      'febbraio',
      'Marzo',
      'aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'agosto',
      'settembre',
      'ottobre',
      'novembre',
      'Dicembre',
    ],
  },
};

const localeDateService = new NativeDateService('it', {
  i18n,
  startDayOfWeek: 1,
});
const formatDateService = new NativeDateService('en', {format: 'DD/MM/YYYY'});

export default function DateRangePickerComponent({leftIcon, locale, ...props}) {
  const renderIcon = iconProps => (
    <SVGIcon
      {...iconProps}
      type="Calender"
      color={themeConfig.colors.primary}
    />
  );
  const accessoryLeft = leftIcon ? {accessoryLeft: renderIcon} : {};

  return (
    <RangeDatepicker
      {...props}
      {...accessoryLeft}
      min={new Date()}
      controlStyle={{
        borderRadius: themeConfig.radius * 4,
        justifyContent: 'flex-start',
      }}
      size={themeConfig.inputHeight}
      dateService={locale === 'it' ? localeDateService : formatDateService}
      style={[styles.inputContainer, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: themeConfig.margin / 2,
    borderRadius: themeConfig.radius * 4,
  },
});
