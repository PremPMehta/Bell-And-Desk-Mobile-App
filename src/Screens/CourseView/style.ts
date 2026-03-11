import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, vs, mvs, width } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    paddingBottom: vs(100),
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(16),
  },
  backButton: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...THEME.fontStyle.h4Bold,
    marginLeft: ms(12),
  },
  headerSubTitle: {
    ...THEME.fontStyle.h5Bold,
    marginLeft: ms(12),
    marginTop: vs(4),
  },
  videoSection: {
    width: width,
    height: vs(220),
    backgroundColor: COLORS.black,
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  videoInfoSection: {
    padding: ms(16),
  },
  videoTitle: {
    ...THEME.fontStyle.h2Bold,
    marginBottom: vs(8),
  },
  videoDescription: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.subText,
    lineHeight: vs(20),
  },
  tabSection: {
    marginTop: vs(16),
  },
  tabContent: {
    paddingHorizontal: ms(16),
    marginTop: vs(16),
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.border,
  },
  lessonThumbnail: {
    width: ms(80),
    height: vs(40),
    borderRadius: ms(8),
    backgroundColor: COLORS.cardBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    ...THEME.fontStyle.h5Medium,
  },
  lessonDuration: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: vs(4),
  },
  activeLesson: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: ms(8),
    paddingHorizontal: ms(8),
  },
  commentSection: {
    paddingVertical: vs(10),
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(24),
    paddingHorizontal: ms(16),
    marginBottom: vs(20),
  },
  commentInput: {
    ...THEME.fontStyle.h5Regular,
    flex: 1,
    height: vs(35),
  },
  sendButton: {
    marginLeft: ms(8),
  },
  commentItem: {
    marginBottom: vs(16),
  },
  commentUser: {
    ...THEME.fontStyle.h4Bold,
  },
  commentText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.subText,
    marginTop: vs(4),
  },
  summarySection: {
    marginTop: vs(24),
    paddingHorizontal: ms(16),
    paddingVertical: vs(16),
    backgroundColor: COLORS.cardBG,
    marginHorizontal: ms(16),
    borderRadius: ms(12),
  },
  summaryTitle: {
    ...THEME.fontStyle.h2Bold,
    // marginBottom: vs(12),
  },
  summarySubTitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.subText,
    marginTop: vs(4),
    marginBottom: vs(30),
  },
  summaryText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.termsColor,
    lineHeight: vs(22),
  },
  chapterContainer: {
    marginBottom: vs(16),
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(12),
    paddingHorizontal: ms(12),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    marginBottom: vs(8),
  },
  chapterTitleText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  lessonsContainer: {
    paddingLeft: ms(8),
  },
  playIconOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: ms(8),
  },
  completeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(12),
    gap: ms(8),
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    paddingVertical: vs(5),
    paddingHorizontal: ms(10),
    borderRadius: ms(20),
  },
  completeText: {
    ...THEME.fontStyle.h6Bold,
    marginLeft: ms(8),
  },
  sessionTypeText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.white,
    backgroundColor: COLORS.innerCardBG,
    paddingVertical: vs(4),
    paddingHorizontal: ms(12),
    borderRadius: ms(12),
    textTransform: 'capitalize',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: vs(20),
    right: ms(20),
    width: ms(40),
    height: ms(40),
    borderRadius: ms(25),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 999,
  },
});
