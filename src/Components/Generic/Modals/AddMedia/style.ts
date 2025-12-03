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
    ...THEME.fontStyle.h4Regular,
    alignSelf: 'center',
  },
  uploadContainer: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(20),
  },
  orText: {
    ...THEME.fontStyle.h5Regular,
    alignSelf: 'center',
  },
  inputStyle: {
    backgroundColor: COLORS.cardBG,
    marginTop: ms(20),
  },
  addLink: {
    alignSelf: 'flex-start',
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(6),
  },
  addLinkText: {
    ...THEME.fontStyle.h5Regular,
  },
  spaceDivider: {
    marginTop: ms(20),
  },

  add: {
    alignSelf: 'flex-end',
    paddingHorizontal: ms(26),
    paddingVertical: ms(10),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
  },
  addText: {
    ...THEME.fontStyle.h5Regular,
  },
});

export default styles;
