import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';

interface LeaveCommunityModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const LeaveCommunityModal: React.FC<LeaveCommunityModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modalContainer}
      backdropOpacity={0.5}
      avoidKeyboard
    >
      <View style={styles.mainModalView}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Leave Community</Text>
          <TouchableOpacity onPress={onClose} disabled={isLoading}>
            <Icon name="X" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalBody}>
          <Text style={styles.modalMessage}>
            Are you sure you want to leave this community? You will be
            immediately removed from the community.
          </Text>
        </View>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.leaveButtonText}>Leave Community</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LeaveCommunityModal;
