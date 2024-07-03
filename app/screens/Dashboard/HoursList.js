import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import Typography from 'components/Typography';
import {strings} from 'i18n/i18n';
import {Modal} from '@ui-kitten/components';
import {Icon} from '@ui-kitten/components';
import CalendarTime from './CalendarTime.component';
const HourSelect = ({open, onClose, selectedHourlyService}) => {
  return (
    <Modal
      visible={open}
      onRequestClose={() => {
        onClose;
      }}
      onBackdropPress={onClose}
      backdropStyle={styles.backdrop}>
      <View style={styles.modalContainer}>
        <CalendarTime
          isopenHousrlyPopup={open}
          onClose={onClose}
          selectedHourlyService={selectedHourlyService}
        />
      </View>
    </Modal>
  );
};

export default HourSelect;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 8 * 2,
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    width: '95%',
    alignSelf: 'center',
    padding: 8 * 2,
    top: 20,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
