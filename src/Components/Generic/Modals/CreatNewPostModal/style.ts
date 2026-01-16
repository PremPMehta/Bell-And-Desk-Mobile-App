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
    paddingBottom: ms(30),
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.innerCardBG,
  },
  title: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.white,
  },
  contentContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(24),
  },
  toggleLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginLeft: ms(12),
  },
  inputLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginBottom: ms(8),
  },
  descriptionInput: {
    ...THEME.fontStyle.h5Regular,
    backgroundColor: '#2A2A2A',
    borderRadius: ms(8),
    padding: ms(12),
    height: ms(120),
    color: COLORS.white,
    textAlignVertical: 'top',
  },
  inputStyle: {
    backgroundColor: COLORS.cardBG,
  },
  descriptionStyle: {
    height: ms(100),
    // textAlignVertical: 'top',
  },
  mediaActionsRow: {
    flexDirection: 'row',
    // marginTop: ms(16),
    gap: ms(12),
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(4),
    paddingVertical: ms(8),
    paddingHorizontal: ms(12),
  },
  mediaButtonText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginLeft: ms(6),
  },
  footer: {
    marginTop: ms(24),
    paddingHorizontal: ms(16),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  postButton: {
    paddingHorizontal: ms(32),
    paddingVertical: ms(10),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
  },
  postText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  mediaListContainer: {
    marginTop: ms(16),
  },
  mediaItem: {
    width: ms(100),
    height: ms(100),
    marginRight: ms(12),
    borderRadius: ms(8),
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.black,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: ms(4),
    right: ms(4),
    backgroundColor: COLORS.modalBackdropColor,
    borderRadius: ms(12),
    padding: ms(4),
    zIndex: 1,
  },
  videoIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  // Poll Specific Styles
  pollQuestionInput: {
    ...THEME.fontStyle.h5Regular,
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    height: ms(100),
    color: COLORS.white,
    textAlignVertical: 'top',
    marginBottom: ms(16),
  },
  optionLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginBottom: ms(8),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  optionInput: {
    ...THEME.fontStyle.h5Regular,
    flex: 1,
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    paddingHorizontal: ms(12),
    paddingVertical: ms(10),
    color: COLORS.white,
  },
  removeOptionButton: {
    marginLeft: ms(8),
    padding: ms(4),
  },
  addOptionButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    marginTop: ms(4),
    marginBottom: ms(16),
  },
  addOptionText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  multipleAnswersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: ms(8),
  },
  multipleAnswersLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginLeft: ms(8),
  },
});

export default styles;
