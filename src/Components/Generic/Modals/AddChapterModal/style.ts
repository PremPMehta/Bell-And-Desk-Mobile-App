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
    marginBottom: ms(16),
  },
  title: {
    ...THEME.fontStyle.h3Bold,
    alignSelf: 'center',
  },

  inputStyle: {
    backgroundColor: COLORS.cardBG,
    marginHorizontal: ms(16),
  },
  descriptionStyle: {
    height: 100,
  },

  //   Button container

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.modalBG,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingHorizontal: ms(10),
    paddingVertical: ms(8),
  },
  cancelButtonText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  addChapterButton: {
    borderRadius: ms(20),
    paddingHorizontal: ms(10),
    paddingVertical: ms(8),
    backgroundColor: COLORS.primary,
  },
  addChapterButtonText: {
    ...THEME.fontStyle.h6Regular,
  },
});

export default styles;
