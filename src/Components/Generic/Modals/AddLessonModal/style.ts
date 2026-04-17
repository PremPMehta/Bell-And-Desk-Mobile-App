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
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.modalBG,
    marginBottom: ms(8),
  },
  title: {
    ...THEME.fontStyle.h3Bold,
    alignSelf: 'center',
  },

  // ── Lesson Type Tabs ──
  lessonTypeSwitcher: {
    flexDirection: 'row',
    marginHorizontal: ms(16),
    marginBottom: ms(16),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(10),
    padding: ms(3),
  },
  lessonTypeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(6),
    paddingVertical: ms(9),
    borderRadius: ms(8),
  },
  lessonTypeTabActive: {
    backgroundColor: COLORS.primary,
  },
  lessonTypeTabText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
  },
  lessonTypeTabTextActive: {
    color: COLORS.white,
    ...THEME.fontStyle.h6Bold,
  },

  inputStyle: {
    backgroundColor: COLORS.cardBG,
    marginHorizontal: ms(16),
  },
  descriptionStyle: {
    height: 100,
  },
  scrollContent: {
    flex: 1,
  },

  //   Lesson Content
  lessonContentContainer: {
    paddingHorizontal: ms(16),
  },

  // Video Source
  videoSourceContainer: {
    paddingHorizontal: ms(16),
    marginTop: ms(16),
  },
  videoSourceLabel: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: ms(12),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: ms(12),
  },
  videoSourceCard: {
    width: '48%',
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    padding: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBG,
    height: ms(120),
  },
  selectedCard: {
    borderColor: COLORS.primary,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
    marginTop: ms(12),
    textAlign: 'center',
  },
  cardSubtext: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.outlineGrey,
    marginTop: ms(4),
    textAlign: 'center',
  },

  // ── PDF Section ──
  pdfSection: {
    marginTop: ms(16),
  },

  // Document Picker
  documentPickerContainer: {
    marginHorizontal: ms(16),
    marginTop: ms(16),
  },
  documentPickerLabel: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  documentPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    borderStyle: 'dashed',
    paddingHorizontal: ms(14),
    paddingVertical: ms(14),
  },
  documentPickerButtonText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    flex: 1,
  },
  documentPickerHint: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.primary,
    marginTop: ms(6),
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
