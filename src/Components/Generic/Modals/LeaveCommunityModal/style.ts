import { StyleSheet } from 'react-native';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, vs } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainModalView: {
    backgroundColor: COLORS.cardBG,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingTop: vs(16),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingBottom: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  modalBody: {
    padding: ms(20),
    paddingVertical: vs(24),
  },
  modalMessage: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.white,
    lineHeight: vs(24),
    textAlign: 'left',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingBottom: vs(30),
    paddingTop: vs(10),
    gap: ms(16),
  },
  cancelButton: {
    paddingHorizontal: ms(20),
    paddingVertical: vs(10),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cancelText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  leaveButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: ms(20),
    paddingVertical: vs(10),
    borderRadius: ms(8),
    minWidth: ms(140),
    alignItems: 'center',
  },
  leaveButtonText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
});

export default styles;
