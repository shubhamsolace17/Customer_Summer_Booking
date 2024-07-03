import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Modal} from '@ui-kitten/components';
import CalendarTime from './CalendarTime.component';
const screenHeight = Math.round(Dimensions.get('window').height);
const HourSelectPopup = ({
  open,
  onClose,
  selectedHourlyService,
  wrapSelectedDatesFunc,
  setHourlyService = () => {},
  hourServiceData,
  language,
  addSurcharge,
}) => {
  const setDta = data => {
    setHourlyService(data);
  };

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
          language={language}
          onClose={onClose}
          selectedHourlyService={selectedHourlyService}
          wrapSelectedDatesFunc={wrapSelectedDatesFunc}
          hourServiceData={hourServiceData}
          setHourlyService={data => setDta(data)}
          addSurcharge={addSurcharge}
        />
      </View>
    </Modal>
  );
};

export default HourSelectPopup;

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
    justifyContent: 'center',
    width: '95%',
    alignSelf: 'center',
    padding: 8 * 2,
    height: '98%',
    maxHeight: screenHeight / 1.5,
  },
  icon: {
    width: 32,
    height: 32,
  },
});
