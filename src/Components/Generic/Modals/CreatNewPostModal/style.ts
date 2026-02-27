import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
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
    paddingHorizontal: ms(16),
    paddingVertical: ms(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.innerCardBG,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: COLORS.newModalBG,
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
    marginVertical: ms(12),
  },
  multipleAnswersLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginLeft: ms(8),
  },
  // Categories & Visibility
  sectionTitle: {
    ...THEME.fontStyle.h5SemiBold,
    color: COLORS.white,
    marginBottom: ms(12),
  },
  categoryScroll: {
    marginBottom: ms(20),
  },
  categoryChip: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    borderRadius: ms(20),
    backgroundColor: COLORS.innerCardBG,
    marginRight: ms(8),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
  },
  categoryChipTextActive: {
    color: COLORS.primary,
  },
  visibilityContainer: {
    marginTop: ms(12),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ms(8),
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.innerCardBG,
    marginVertical: ms(10),
  },
  titleInputContainer: {
    marginBottom: ms(20),
  },
  charCount: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    textAlign: 'right',
    // marginTop: ms(5),
  },
  videoLinksContainer: {
    marginTop: ms(20),
    // marginBottom: ms(20),
  },
  videoLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: ms(10),
  },
  videoInput: {
    flex: 1,
    marginRight: ms(10),
    width: sc(265),
    // height: ms(45),
  },
  addLinkButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: ms(15),
    paddingVertical: ms(10),
    borderRadius: ms(8),
    marginBottom: ms(14),
    justifyContent: 'center',
  },
  addLinkText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  addedLinksList: {
    marginTop: ms(10),
  },
  addedLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    padding: ms(10),
    borderRadius: ms(8),
    marginBottom: ms(5),
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
  },
  addedLinkText: {
    flex: 1,
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginRight: ms(10),
  },
});

export default styles;
