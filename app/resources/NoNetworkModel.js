import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert, Modal} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Typography from 'components/Typography';
import {strings} from 'i18n/i18n';
const NoNetworkModal = () => {
  const [modalIsVisible, setModalVisibility] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state =>
      handleConnectionStateChange(state),
    );
    return () => unsubscribe();
  }, []);

  const handleConnectionStateChange = state => {
    setModalVisibility(state.isInternetReachable === false);
  };

  return (
    <Modal
      animationIn={'fadeIn'}
      animationInTiming={600}
      animationOut={'fadeOut'}
      animationOutTiming={600}
      animationType="slide"
      visible={modalIsVisible}
      onRequestClose={() => {
        setModalVisibility(!modalIsVisible);
      }}
      style={styles.modal}>
      <View style={styles.container}>
        <Typography category="h6" style={{fontWeight: '400'}}>
          {strings('no_Internet')}
        </Typography>
      </View>
    </Modal>
  );
};

export default NoNetworkModal;

const styles = StyleSheet.create({
  modal: {margin: 0},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
