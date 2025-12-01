import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { THEME } from '@/Assets/Theme';
import { useAtom } from 'jotai';
import styles from './style';
import { logoutVisibleAtom } from '@/Jotai/Atoms';

const LogoutModal = () => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] =
    useAtom(logoutVisibleAtom);

  const handleCancel = () => {
    // setIsLogoutModalVisible(false);
  };

  return (
    <Modal
      isVisible={isLogoutModalVisible} // isLogoutModalVisible
      onSwipeComplete={handleCancel}
      onBackdropPress={handleCancel}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropColor={THEME.COLORS.modalBackdropColor}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={1000}
      backdropTransitionOutTiming={1000}
      style={styles.modalContainer}
    >
      <View style={styles.mainModalView}>
        <View style={styles.modalPanDownToClose} />
        <Text style={styles.title}>Logout</Text>
        <Text style={styles.message}>Are you sure you want to logout?</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelWrapperStyle}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutWrapperStyle}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
