import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBG,
    marginTop: ms(16),
    padding: ms(12),
    paddingBottom: ms(40),
    borderRadius: ms(8),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.innerCardBG,
    padding: ms(12),
    borderRadius: ms(8),
    marginBottom: ms(16),
  },
  titleContainer: {
    // backgroundColor: 'red',
    width: '80%',
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
  sectionContainer: {
    backgroundColor: COLORS.innerCardBG,
    padding: ms(16),
    borderRadius: ms(8),
    marginBottom: ms(16),
  },
  sectionTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
    marginBottom: ms(16),
  },
  sectionSubHeader: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
    marginBottom: ms(12),
  },
  inputHelperText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.gray,
    marginTop: ms(-10),
    marginBottom: ms(16),
  },
  radioGroup: {},
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: ms(24),
  },
  radioLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginLeft: ms(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ms(12),
  },
  exceptionInputContainer: {
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
    gap: ms(8),
  },
  addButtonText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  emptyText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: ms(16),
  },
  exceptionListContainer: {
    marginTop: ms(16),
  },
  exceptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ms(12),
    backgroundColor: COLORS.black,
    borderRadius: ms(8),
    paddingHorizontal: ms(12),
    marginTop: ms(12),
  },
  exceptionUserIcon: {
    width: sc(32),
    height: sc(32),
    borderRadius: ms(32),
    backgroundColor: COLORS.newInnerCardBG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exceptionUserInfo: {
    marginRight: ms(40),
  },
  exceptionUser: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  exceptionValue: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.primary,
  },

  saveButtonContainer: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
    paddingVertical: ms(6),
    paddingHorizontal: ms(14),
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  saveButton: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
});

export default styles;
