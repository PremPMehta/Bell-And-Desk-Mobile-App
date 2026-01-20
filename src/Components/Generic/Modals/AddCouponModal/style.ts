import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  mainModalView: {
    backgroundColor: COLORS.cardBG,
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
  formContainer: {
    marginTop: ms(20),
    marginBottom: ms(20),
    paddingHorizontal: ms(16),
    flexShrink: 1,
    flexGrow: 0,
  },
  radioContainer: {
    marginBottom: ms(18),
  },
  radioLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    marginBottom: ms(12),
  },
  radioGroup: {
    flexDirection: 'row',
    gap: ms(24),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  radioCircle: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    borderWidth: 2,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterCircle: {
    borderColor: COLORS.primary,
  },
  radioCircleSelected: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: COLORS.primary,
  },
  radioText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  dateInputContainer: {
    marginBottom: ms(18),
  },
  dateLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    marginBottom: ms(8),
  },
  dateInput: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    borderRadius: ms(4),
    paddingHorizontal: ms(14),
    paddingVertical: ms(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  dateInputPlaceholder: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ms(16),
    marginHorizontal: ms(16),
    marginBottom: ms(16),
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
    paddingVertical: ms(10),
    paddingHorizontal: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  createButton: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
    paddingVertical: ms(10),
    paddingHorizontal: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  // New Styles
  selectedUserContainer: {
    marginBottom: ms(18),
  },
  selectUserButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    borderRadius: ms(4),
    paddingHorizontal: ms(14),
    paddingVertical: ms(16),
    backgroundColor: 'transparent',
  },
  selectUserText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
  },
  selectUserTextActive: {
    color: COLORS.white,
  },
  errorText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.red,
    marginTop: ms(5),
  },
  helperText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    marginTop: ms(5),
    fontSize: ms(12),
  },
  visibilityContainer: {
    marginBottom: ms(18),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: ms(18),
    gap: ms(12),
  },
  checkbox: {
    width: ms(20),
    height: ms(20),
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    borderRadius: ms(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    flex: 1,
  },
  newUserEligibilityContainer: {
    marginBottom: ms(18),
  },
  eligibilityTitle: {
    ...THEME.fontStyle.h5Regular,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: ms(8),
  },
  eligibilityDescription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    marginBottom: ms(16),
  },
  showMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.innerCardBG,
    padding: ms(16),
    borderRadius: ms(8),
    gap: ms(12),
    marginBottom: ms(18),
  },
  showMemberTextContainer: {
    flex: 1,
    gap: ms(4),
  },
  showMemberTitle: {
    ...THEME.fontStyle.h5Regular,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  showMemberDescription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    fontSize: ms(12),
  },
});

export default styles;
