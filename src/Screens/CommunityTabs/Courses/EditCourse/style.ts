import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, vs } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingBottom: vs(10),
    backgroundColor: COLORS.header,
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: ms(8),
    flex: 1,
  },
  headerTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  headerSubTitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: vs(2),
  },
  userIconButton: {
    padding: ms(8),
  },
  contentContainer: {
    padding: ms(20),
  },
  contentContainerStyle: {
    paddingBottom: vs(30),
  },
  courseTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(20),
  },
  courseTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  addChapter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    paddingVertical: vs(6),
    paddingHorizontal: ms(12),
    borderRadius: ms(20),
  },
  addChapterText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.white,
    marginLeft: ms(6),
  },
  emptyContainer: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    paddingVertical: vs(50),
    paddingHorizontal: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyIconContainer: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(12),
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  emptyText: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: vs(8),
  },
  emptyDescription: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
    textAlign: 'center',
    lineHeight: vs(22),
  },
  chapterContainer: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: vs(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  chapterTitleText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  chapterActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: ms(8),
    borderRadius: ms(8),
    marginLeft: ms(8),
  },
  chapterSubtitle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
    marginBottom: vs(4),
  },
  chapterDescriptionText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
    marginBottom: vs(16),
  },
  videoSection: {
    marginTop: vs(10),
  },
  videoListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  videoSectionTitle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
  },
  addVideoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addVideoText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.white,
    marginLeft: ms(4),
  },
  videoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.white,
  },
  videoSubtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    marginTop: vs(2),
  },
  // Confirmation Modal Styles
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainModalView: {
    backgroundColor: COLORS.cardBG,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingTop: ms(16),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingBottom: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  modalBody: {
    padding: ms(20),
  },
  modalMessage: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.white,
    lineHeight: ms(22),
  },
  boldName: {
    ...THEME.fontStyle.h4Bold,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: ms(20),
    gap: ms(16),
  },
  modalCancelText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
  },
  modalDeleteButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: ms(20),
    paddingVertical: ms(10),
    borderRadius: ms(8),
    minWidth: ms(80),
    alignItems: 'center',
  },
  modalDeleteText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
});
