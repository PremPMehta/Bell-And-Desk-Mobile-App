import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Modal Specific
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  mainModalView: {
    backgroundColor: COLORS.newModalBG,
    borderTopLeftRadius: ms(16),
    borderTopRightRadius: ms(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.modalBG,
  },
  title: {
    ...THEME.fontStyle.h3Bold,
  },
  messageContainer: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(20),
  },
  message: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
    alignSelf: 'center',
    lineHeight: ms(22),
  },
  subMessage: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.subText,
    alignSelf: 'center',
    lineHeight: ms(22),
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ms(20),
  },
  cancelWrapperStyle: {
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingHorizontal: ms(14),
    paddingVertical: ms(5),
    borderRadius: ms(40),
  },
  cancelText: {
    ...THEME.fontStyle.h5Regular,
  },
  logoutWrapperStyle: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: ms(14),
    paddingVertical: ms(5),
    borderRadius: ms(40),
  },
  logoutText: {
    ...THEME.fontStyle.h5Regular,
  },
});

export default styles;
