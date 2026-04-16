import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.cardBG,
  },
  scrollContent: {
    paddingBottom: ms(40),
  },
  container: {
    backgroundColor: COLORS.cardBG,
    marginTop: ms(16),
    padding: ms(12),
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
    width: sc(28),
    height: sc(28),
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
  exceptionSubUser: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
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
  // Member Dashboard Styles
  loaderContainer: {
    padding: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Wallet Balance Card (Per Image)
  walletBalanceCard: {
    backgroundColor: COLORS.walletLight,
    borderRadius: ms(20),
    padding: ms(24),
    marginBottom: ms(24),
    borderWidth: 1,
    borderColor: COLORS.walletBorder,
    position: 'relative',
    overflow: 'hidden',
  },
  walletWatermark: {
    position: 'absolute',
    right: ms(2),
    top: ms(20),
    opacity: 0.1,
  },
  walletTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
    marginBottom: ms(24),
  },
  availableBalanceLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
    marginBottom: ms(4),
  },
  availableBalanceValue: {
    ...THEME.fontStyle.h1Bold,
    fontSize: ms(48),
    color: COLORS.white,
    marginBottom: ms(24),
  },
  statsInlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(24),
    gap: ms(32),
  },
  inlineStatItem: {
    flex: 0,
  },
  inlineStatLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    marginBottom: ms(4),
  },
  inlineStatValue: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  pendingValue: {
    ...THEME.fontStyle.h4Bold,
    color: '#ffcc00', // Yellow for pending
  },
  minWithdrawalText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  // Referral Info Section
  promoSection: {
    flexDirection: 'row',
    gap: ms(12),
    marginBottom: ms(20),
  },
  promoCard: {
    flex: 1,
    backgroundColor: COLORS.innerCardBG,
    padding: ms(16),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
  },
  commissionCard: {
    backgroundColor: COLORS.walletLight,
    borderColor: COLORS.walletBorder,
  },
  promoLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    marginBottom: ms(4),
  },
  promoValue: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  referralLinkSection: {
    backgroundColor: COLORS.innerCardBG,
    padding: ms(16),
    borderRadius: ms(12),
    marginBottom: ms(20),
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
  },
  referralLinkHeader: {
    flexDirection: 'row',
    gap: ms(10),
  },
  referralLinkTitle: {
    ...THEME.fontStyle.h5Bold,
    lineHeight: ms(18),
    marginBottom: ms(8),
  },
  referralLinkSubTitle: {
    ...THEME.fontStyle.h6Medium,
    color: COLORS.subText,
    marginBottom: ms(12),
  },
  linkContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.black,
    borderRadius: ms(8),
    padding: ms(12),
    alignItems: 'center',
  },
  referralLinkText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    flex: 1,
    marginRight: ms(10),
  },
  copyButton: {
    padding: ms(4),
  },
  // Transaction History Styles
  transactionSection: {
    marginTop: ms(8),
  },
  transactionTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
    marginBottom: ms(16),
  },
  transactionList: {
    gap: ms(12),
  },
  transactionItem: {
    backgroundColor: COLORS.innerCardBG,
    padding: ms(16),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  transactionDate: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },
  transactionType: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  transactionDescription: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(4),
  },
  transactionAmount: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  statusBadge: {
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
    borderRadius: ms(4),
    backgroundColor: '#34c75920',
  },
  statusText: {
    ...THEME.fontStyle.h6Bold,
    color: '#34c759',
    textTransform: 'capitalize',
  },
  pendingStatusBadge: {
    backgroundColor: '#ffcc0020',
  },
  pendingStatusText: {
    color: '#ffcc00',
  },
  emptyTransactionContainer: {
    padding: ms(40),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(12),
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
  },
  emptyTransactionText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
});

export default styles;
