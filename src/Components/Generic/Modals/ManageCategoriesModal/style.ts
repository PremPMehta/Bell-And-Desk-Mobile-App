import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    backgroundColor: COLORS.cardBG,
    borderTopLeftRadius: ms(16),
    borderTopRightRadius: ms(16),
    maxHeight: '85%',
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
  headerTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(8),
  },
  sectionTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
    marginBottom: ms(14),
  },
  input: {
    backgroundColor: COLORS.newModalBG,
    borderRadius: ms(8),
    paddingHorizontal: ms(14),
    paddingVertical: ms(14),
    // color: COLORS.white,
    ...THEME.fontStyle.h5Regular,
    marginBottom: ms(12),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputField: {
    width: sc(260),
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: ms(20),
    paddingVertical: ms(8),
    paddingHorizontal: ms(10),
    marginBottom: ms(14),
  },
  createBtnText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: ms(20),
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.newModalBG,
    borderRadius: ms(8),
    paddingHorizontal: ms(14),
    paddingVertical: ms(14),
    marginBottom: ms(10),
  },
  catNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  catName: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginRight: ms(8),
  },
  defaultBadge: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(4),
    paddingHorizontal: ms(6),
    paddingVertical: ms(2),
  },
  defaultBadgeText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    fontSize: ms(11),
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
  },
  iconBtn: {
    padding: ms(2),
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    // backgroundColor: 'red',
  },
  editInput: {
    flex: 1,
    marginBottom: 0,
  },
  confirmEditBtn: {
    // backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: ms(6),
    padding: ms(4),
  },
  closeEditBtn: {
    // backgroundColor: COLORS.ctgColor,
    borderWidth: 1,
    borderColor: COLORS.ctgColor,
    borderRadius: ms(6),
    padding: ms(4),
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginRight: ms(16),
    marginBottom: ms(16),
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
  },
  closeBtnText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
});

export default styles;
