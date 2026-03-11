import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    alignItems: 'center',
  },
  searchInputStyle: {
    width: sc(210),
  },
  create: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: ms(10),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    padding: ms(10),
    marginTop: ms(16),
  },
  createTxt: {
    ...THEME.fontStyle.h6Regular,
  },
  contentContainer: {
    padding: ms(16),
    paddingBottom: ms(40),
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(20),
  },
  noCoursesTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: ms(12),
  },
  noCoursesSubtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: ms(24),
  },
  createFirstCourseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    paddingVertical: ms(12),
    paddingHorizontal: ms(24),
    borderRadius: ms(20),
    gap: ms(8),
  },
  createFirstCourseButtonText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
});

export default styles;
