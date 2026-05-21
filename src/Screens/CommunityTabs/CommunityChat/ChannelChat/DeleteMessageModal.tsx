import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import { ms, mvs } from '@/Assets/Theme/fontStyle';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  isDeleting?: boolean;
}

const DeleteMessageModal = ({
  isVisible,
  onClose,
  onConfirmDelete,
  isDeleting = false,
}: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={350}
      animationOutTiming={300}
      backdropTransitionInTiming={350}
      backdropTransitionOutTiming={0}
      hideModalContentWhileAnimating
      useNativeDriver
      useNativeDriverForBackdrop
      statusBarTranslucent
    >
      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, ms(20)) },
        ]}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Delete Message</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
            disabled={isDeleting}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="X" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.message}>
            Are you sure you want to delete this message? This action cannot be
            undone.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} disabled={isDeleting}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.deleteText}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.cardBG,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingTop: ms(8),
  },
  handle: {
    width: ms(40),
    height: mvs(4),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: ms(2),
    alignSelf: 'center',
    marginBottom: mvs(8),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingBottom: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  closeBtn: {
    padding: ms(4),
  },
  body: {
    paddingHorizontal: ms(20),
    paddingVertical: ms(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  message: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.white,
    lineHeight: ms(22),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingTop: ms(16),
    gap: ms(16),
  },
  cancelText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.placeholder,
    paddingHorizontal: ms(8),
    paddingVertical: ms(10),
  },
  deleteBtn: {
    backgroundColor: COLORS.red,
    paddingHorizontal: ms(20),
    paddingVertical: ms(10),
    borderRadius: ms(8),
    minWidth: ms(100),
    alignItems: 'center',
  },
  deleteText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
});

export default DeleteMessageModal;
