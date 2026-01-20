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

  planMainContainer: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    marginBottom: ms(16),
    marginTop: ms(16),
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ms(12),
    paddingBottom: ms(16),
    backgroundColor: COLORS.uploadBG,
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.outlineGrey,
    borderTopLeftRadius: ms(8),
    borderTopRightRadius: ms(8),
  },
  planTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  planDescription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingHorizontal: ms(14),
    paddingVertical: ms(4),
  },

  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ms(12),
  },
  dueContainer: {},
  dueTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  activeStyle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.green,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    marginTop: ms(8),
  },
  manageStyle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingHorizontal: ms(14),
    paddingVertical: ms(4),
  },

  usageContainer: {
    backgroundColor: COLORS.black,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(16),
  },
  usageTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: ms(12),
  },
  usageRow: {
    marginBottom: ms(16),
  },
  usageTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ms(6),
  },
  usageValue: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  usagePercentage: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  progressBarBG: {
    height: ms(8),
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(4),
    marginBottom: ms(6),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: ms(4),
  },
  usageLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },

  paymentContainer: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
  },
  paymentTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: ms(12),
  },
  paymentRow: {
    backgroundColor: COLORS.border,
    borderRadius: ms(8),
    padding: ms(12),
    // marginBottom: ms(12),
  },
  paymentTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ms(6),
    alignItems: 'center',
  },
  paymentValue: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  boldText: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
  },
  paidStyle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.green,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.green,
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    marginTop: ms(8),
  },
  paymentDate: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },

  cardContainer: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    marginVertical: ms(12),
  },
  cardNumber: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.white,
    marginTop: ms(6),
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(6),
  },
  cardName: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  cardDate: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },

  managePaymentContainer: {
    borderWidth: 1,
    borderColor: COLORS.dashedBorder,
    borderRadius: ms(8),
    borderStyle: 'dashed',
    height: ms(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageContainer: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    paddingVertical: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  managePayment: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },

  RecentMemberContainer: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    marginVertical: ms(12),
  },
  space: {
    marginTop: ms(10),
  },

  saveChangesContainer: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  saveChanges: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
});

export default styles;
