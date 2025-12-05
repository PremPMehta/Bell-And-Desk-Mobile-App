import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    paddingVertical: ms(10),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(12),
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(8),
  },
  activeStepCircle: {
    backgroundColor: COLORS.white,
  },
  completedStepCircle: {
    backgroundColor: COLORS.primary,
  },
  stepNumber: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
  },
  activeStepNumber: {
    color: COLORS.black,
  },
  stepLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
  },
  activeStepLabel: {
    color: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    padding: ms(16),
  },
  sectionContainer: {
    marginBottom: ms(16),
  },
  sectionTitle: {
    ...THEME.fontStyle.h2Bold,
  },
  sectionDescription: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
  },

  courseTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseTitle: {
    ...THEME.fontStyle.h2Bold,
  },
  addChapter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingHorizontal: ms(10),
    paddingVertical: ms(8),
  },
  addChapterText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },

  //   Empty container style
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    paddingVertical: ms(50),
    borderRadius: ms(8),
    marginTop: ms(20),
  },
  emptyText: {
    ...THEME.fontStyle.h3Bold,
  },
  emptyDescription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    textAlign: 'center',
  },

  // Review & Publish Container
  publishContainer: {},
  publishText: {
    ...THEME.fontStyle.h3Bold,
  },

  inputStyle: {
    backgroundColor: COLORS.cardBG,
  },
  descriptionStyle: {
    height: 100,
  },
  stepOnefooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: ms(16),
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ms(16),
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(24),
    paddingVertical: ms(10),
    borderRadius: ms(24),
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  backButtonText: {
    ...THEME.fontStyle.h4Regular,
    marginLeft: ms(8),
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(24),
    paddingVertical: ms(10),
    borderRadius: ms(24),
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  nextButtonText: {
    ...THEME.fontStyle.h4Regular,
    marginRight: ms(8),
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    paddingHorizontal: ms(24),
    paddingVertical: ms(10),
    borderRadius: ms(24),
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  publishButtonText: {
    ...THEME.fontStyle.h4Regular,
  },

  // Chapter Card Styles
  chapterContainer: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    padding: ms(16),
    marginBottom: ms(16),
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  chapterTitleText: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  chapterActionButtons: {
    flexDirection: 'row',
    gap: ms(10),
  },
  iconButton: {
    padding: ms(8),
    backgroundColor: '#333',
    borderRadius: ms(20),
  },
  chapterSubtitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
    marginBottom: ms(4),
  },
  chapterDescriptionText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    lineHeight: ms(20),
  },
  videoSection: {
    marginTop: ms(16),
    paddingTop: ms(16),
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  videoListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  videoSectionTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  addVideoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
  },
  addVideoText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  videoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginBottom: ms(2),
  },
  videoSubtitle: {
    ...THEME.fontStyle.h6Regular,
    color: '#666',
  },

  // Review & Publish Styles
  reviewContainer: {
    gap: ms(20),
    marginBottom: ms(20),
  },
  reviewCard: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    padding: ms(20),
  },
  reviewCardTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
    marginBottom: ms(16),
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: ms(16),
  },
  reviewSection: {
    marginBottom: ms(16),
  },
  reviewLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
    marginBottom: ms(8),
  },
  reviewValueTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  reviewValueDescription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    lineHeight: ms(22),
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ms(10),
  },
  reviewColumn: {
    flex: 1,
  },
  reviewChip: {
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    borderRadius: ms(20),
    paddingVertical: ms(6),
    paddingHorizontal: ms(12),
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewChipText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    fontSize: ms(10),
  },
  structureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  structureLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
  },
  structureValue: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
});

export default styles;
