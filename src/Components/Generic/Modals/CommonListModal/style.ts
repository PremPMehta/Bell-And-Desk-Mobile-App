import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { height, ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Dropdown
  mainContainer: {
    marginBottom: ms(18),
  },
  errorTxtStyle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.red,
    marginTop: ms(5),
  },
  inputStyle: {
    backgroundColor: COLORS.cardBG,
  },

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
    alignSelf: 'center',
  },
  modalMessage: {
    ...THEME.fontStyle.h3Regular,
    alignSelf: 'center',
    marginVertical: ms(20),
  },

  modalList: {
    maxHeight: height * 0.5,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ms(12),
    marginHorizontal: ms(16),
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  modalItemText: {
    ...THEME.fontStyle.h4Medium,
  },
});

export default styles;
