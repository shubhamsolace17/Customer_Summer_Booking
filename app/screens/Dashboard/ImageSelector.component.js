import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Typography from 'components/Typography';
import {strings} from 'i18n/i18n';
import {Modal} from '@ui-kitten/components';

const ImageSelectorComponent = ({
  open,
  onClose,
  onPhotoSelect,
  onGallerySelect,
}) => {
  return (
    <Modal
      visible={open}
      onRequestClose={() => {
        onClose;
      }}
      onBackdropPress={onClose}
      backdropStyle={styles.backdrop}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalInnerContainer]}>
          <TouchableOpacity
            style={[styles.button, styles.titleContainer]}
            onPress={onPhotoSelect}>
            <Typography category="s2">{strings('camera')}</Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onGallerySelect}>
            <Typography category="s2">{strings('gallery')}</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImageSelectorComponent;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    padding: 8 * 2,
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    padding: 8 * 2,
    borderBottomWidth: 1,
    borderBottomColor: '#253C7E',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 2,
    minWidth: '80%',
  },
});
