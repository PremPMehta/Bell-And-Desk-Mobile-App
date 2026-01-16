import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: ms(16),
    padding: ms(12),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
  },
  headerContainer: {
    marginBottom: ms(16),
  },
  title: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
    marginBottom: ms(4),
  },
  subtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },

  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // flexWrap: 'wrap',
  },
  row: {
    backgroundColor: COLORS.black,
    borderRadius: ms(8),
    paddingHorizontal: ms(7),
    paddingVertical: ms(8),
    marginBottom: ms(12),
  },
  label: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },
  value: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginTop: ms(4),
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: ms(8),
    backgroundColor: 'transparent',
    borderRadius: ms(20),
    paddingHorizontal: ms(10),
    paddingVertical: ms(6),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  addButtonText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },

  tableContainer: {
    marginTop: ms(16),
    // marginBottom: ms(16),
  },

  couponContainer: {
    backgroundColor: COLORS.black,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(12),
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(25),
    gap: ms(20),
  },
  couponCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    // marginBottom: ms(12),
  },
  couponCodeTxt: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  couponStatusContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: ms(12),
    paddingHorizontal: ms(8),
    paddingVertical: ms(1),
  },
  couponStatus: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },

  editDeleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
  },
  commonButton: {
    borderRadius: ms(20),
    padding: ms(8),
    backgroundColor: COLORS.blackGray,
  },

  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  couponFooterTxt: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },

  saveButton: {
    // marginTop: ms(16),
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
    alignSelf: 'flex-end',
    paddingVertical: ms(6),
    paddingHorizontal: ms(14),
  },
  saveButtonText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
});

export default styles;
