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

  // ── Header ──
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

  // ── Loading ──
  loadingContainer: {
    paddingVertical: ms(40),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Active subscription card ──
  subscriptionContainer: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(16),
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  subscriptionContent: {
    flexDirection: 'row',
    gap: ms(12),
    marginTop: ms(12),
  },
  subscriptionLabel: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.gray,
  },
  subscriptionValue: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    flexShrink: 1,
  },
  manageSubscriptionContainer: {
    alignItems: 'center',
    marginTop: ms(12),
  },
  manageSubscription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  contactSupport: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
  },
  cancelSubscriptionContainer: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
    paddingVertical: ms(6),
    paddingHorizontal: ms(14),
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  cancelSubscription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },

  // ── Empty / No Active Subscription ──
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: ms(32),
    paddingHorizontal: ms(16),
  },
  emptyIconCircle: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    backgroundColor: COLORS.innerCardBG,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ms(16),
  },
  emptyTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: ms(8),
  },
  emptySubtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: ms(20),
    marginBottom: ms(20),
  },
  subscribeButton: {
    backgroundColor: COLORS.white,
    borderRadius: ms(24),
    paddingVertical: ms(8),
    paddingHorizontal: ms(24),
    marginBottom: ms(12),
  },
  subscribeButtonText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.cardBG,
  },
  refreshLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    marginTop: ms(4),
  },
  refreshLink: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },
});

export default styles;
