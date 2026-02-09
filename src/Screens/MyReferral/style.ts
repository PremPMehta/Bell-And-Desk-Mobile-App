import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { fontStyle, height, ms, mvs, sc, vs } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.header,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sc(20),
    paddingTop: vs(20),
    paddingBottom: vs(15),
  },
  headerTitle: {
    ...fontStyle.h3SemiBold,
    marginLeft: sc(10),
    color: COLORS.white,
  },

  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: sc(16),
    marginVertical: vs(16),
    paddingHorizontal: sc(20),
    paddingVertical: vs(15),
    borderRadius: ms(12),
    backgroundColor: COLORS.referral,
  },
  balanceInfo: {},
  balanceTitle: {
    ...fontStyle.h5Medium,
    color: COLORS.lightGray,
  },
  balanceValue: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
    marginVertical: vs(4),
  },
  totalEarnings: {
    ...fontStyle.h5Medium,
    color: COLORS.subText,
  },

  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: sc(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    paddingVertical: vs(12),
    paddingHorizontal: sc(15),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
    borderBottomColor: COLORS.white,
  },
  tabText: {
    ...fontStyle.h5Medium,
    color: COLORS.subText,
    marginLeft: sc(6),
  },
  activeTabText: {
    color: COLORS.white,
  },
  listContainer: {
    padding: sc(15),
    paddingBottom: vs(30),
  },
  card: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: sc(15),
    marginBottom: vs(15),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  communityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
  },
  avatarContainer: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: COLORS.innerCardBG,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    ...fontStyle.h6Bold,
    color: COLORS.white,
  },
  communityNameContainer: {
    marginLeft: sc(10),
  },
  communityName: {
    ...fontStyle.h5Medium,
    color: COLORS.white,
  },
  communityProgramContainer: {
    backgroundColor: COLORS.primaryLight,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(5),
    paddingHorizontal: sc(6),
    paddingVertical: vs(3),
    marginTop: vs(4),
  },
  communityProgram: {
    ...fontStyle.h6Regular,
    color: COLORS.white,
  },
  commissionBadge: {
    backgroundColor: COLORS.greenLight,
    paddingHorizontal: sc(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  commissionText: {
    ...fontStyle.h7Bold,
    color: COLORS.green,
    marginLeft: sc(4),
  },
  linkContainer: {
    backgroundColor: COLORS.black,
    borderRadius: ms(8),
    padding: sc(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.dashedBorder,
  },
  linkText: {
    ...fontStyle.h6Medium,
    color: COLORS.primary,
    flex: 1,
    marginRight: sc(10),
  },
  copyButton: {
    padding: sc(4),
  },
});

export default styles;
