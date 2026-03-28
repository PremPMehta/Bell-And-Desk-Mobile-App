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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ms(16),
  },
  headerInnerRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  headerTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  sectionDescription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    width: sc(260),
    marginTop: ms(8),
  },
  card: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(16),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionMainContainer: {
    flexDirection: 'row',
  },
  sectionTitleContainer: {
    // width: sc(230),
  },
  sectionTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  stripeConnectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(16),
    marginBottom: ms(20),
  },
  connectedContainer: {
    marginTop: ms(10),
  },
  connectedText: {
    ...THEME.fontStyle.h5Bold, // Matches image medium/bold small text
    color: COLORS.white,
  },
  uIdText: {
    ...THEME.fontStyle.h5Regular, // Small caption
    color: COLORS.lightGray,
  },
  dashboardButton: {
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: ms(20),
    paddingHorizontal: ms(10),
    paddingVertical: ms(5),
  },
  dashboardButtonText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  unlinkButton: {
    borderColor: COLORS.red,
    borderWidth: 1,
    borderRadius: ms(20),
    paddingHorizontal: ms(10),
    paddingVertical: ms(5),
  },
  unlinkButtonText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.red,
  },
  balanceTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ms(5),
    marginBottom: ms(16),
  },
  balanceItem: {
    backgroundColor: COLORS.blackGray,
    paddingHorizontal: ms(10),
    paddingVertical: ms(4),
    borderRadius: ms(8),
  },
  balanceLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
  },
  balanceValue: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginTop: ms(4),
  },
  payoutSchedule: {
    backgroundColor: COLORS.blackGray,
    borderRadius: ms(8),
    padding: ms(12),
  },
  scheduleLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
    marginBottom: ms(4),
  },
  scheduleValue: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: ms(4),
  },
  nextPayout: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.green,
  },
  recentContainer: {
    marginTop: ms(10),
  },
  recentTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  recentPayoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.blackGray,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(8),
  },
  payoutAmount: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  payoutDate: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },
  paidBadge: {
    // backgroundColor: COLORS.whiteLight,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
    borderRadius: ms(12),
    // borderWidth: 1,
    // borderColor: COLORS.lightGray,
  },
  paidText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  withdrawRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  withdrawButton: {
    alignSelf: 'flex-start',
    paddingVertical: ms(6),
    paddingHorizontal: ms(12),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: ms(20),
    marginTop: ms(10),
  },
  withdrawButtonText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
  },
  infoCard: {
    backgroundColor: COLORS.newInnerCardBG, // Slightly lighter detailed bg
    borderRadius: ms(8),
    padding: ms(12),
    marginTop: ms(16),
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(8),
  },
  infoTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginLeft: ms(8),
  },
  infoText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  infoSubText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    fontSize: ms(11),
    lineHeight: ms(16),
  },
  redFiCard: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // backgroundColor: '#111',
  },
  redFiTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: ms(5),
  },
  redFiTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(2),
  },
  redFiText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    maxWidth: ms(250),
  },
  claimButton: {
    justifyContent: 'center',
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: ms(16),

    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
  },
  claimButtonText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  badge: {
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: ms(12),
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
    alignSelf: 'center',
  },
  badgeText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    fontSize: ms(10),
  },
  subSubtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    marginBottom: ms(16),
    width: sc(220),
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(10),
    marginBottom: ms(16),
  },
  switchLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginLeft: ms(12),
  },
  inputLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
    marginBottom: ms(8),
  },
  inputStyle: {
    height: ms(40),
    // backgroundColor: COLORS.innerCardBG,
  },
  textArea: {
    height: ms(100),
    textAlignVertical: 'top',
    // backgroundColor: COLORS.innerCardBG,
  },
  radioTitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ms(16),
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(5),
  },
  radioLabel: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.white,
  },
  feeText: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.gray,
    marginTop: ms(-10),
    marginBottom: ms(8),
  },
  saveButton: {
    marginTop: ms(16),
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
    alignSelf: 'flex-end',
    paddingVertical: ms(8),
    paddingHorizontal: ms(12),
  },
  saveButtonText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  connectButton: {
    marginTop: ms(16),
    backgroundColor: COLORS.primary,
    paddingVertical: ms(10),
    borderRadius: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  space: {
    marginBottom: ms(20),
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
    marginBottom: ms(16),
  },
  warningBox: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: ms(8),
    padding: ms(12),
    flexDirection: 'row',
    gap: ms(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.2)',
  },
  warningIconContainer: {
    marginTop: ms(2),
  },
  warningTextContainer: {
    flex: 1,
    gap: ms(4),
  },
  warningText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    lineHeight: ms(18),
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: ms(20),
    gap: ms(16),
  },
  modalCancelButton: {
    paddingHorizontal: ms(12),
  },
  modalCancelText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.placeholder,
  },
  modalUnlinkButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: ms(20),
    paddingVertical: ms(10),
    borderRadius: ms(8),
    minWidth: ms(120),
  },
  modalUnlinkText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
});

export default styles;
