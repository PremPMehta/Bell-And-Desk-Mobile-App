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
    borderBottomColor: COLORS.border,
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
    color: COLORS.placeholder,
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

export default styles;
