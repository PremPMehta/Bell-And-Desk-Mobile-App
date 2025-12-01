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
    backgroundColor: COLORS.modalBG,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    padding: ms(20),
  },
  modalPanDownToClose: {
    width: 25,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    ...THEME.fontStyle.h3Bold,
    marginBottom: ms(8),
    alignSelf: 'center',
    lineHeight: ms(22),
  },
  message: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.white,
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
