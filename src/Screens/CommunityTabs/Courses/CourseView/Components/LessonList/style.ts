import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, vs } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

export default StyleSheet.create({
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
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
  },
  activeLesson: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: ms(8),
    paddingHorizontal: ms(8),
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
  lessonThumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: ms(8),
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
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.white,
  },
  activeLessonTitle: {
    color: COLORS.primary,
  },
  lessonDuration: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: vs(4),
  },
  checkmarkContainer: {
    marginLeft: 6,
    alignSelf: 'center',
  },
});
