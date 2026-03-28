import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },

  searchContainer: {
    paddingHorizontal: ms(16),
  },

  /* --- Category Tabs --- */
  scrollContainer: {
    overflow: 'hidden',
    marginTop: ms(-8),
  },

  categoryContentContainer: {
    paddingHorizontal: ms(16),
    alignItems: 'center',
  },

  categoryBtn: {
    marginRight: ms(10),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: COLORS.ctgColor,
    paddingVertical: ms(2),
    paddingHorizontal: ms(10),
  },

  categoryBtnActive: {
    backgroundColor: COLORS.blue,
    // borderColor: COLORS.primary,
  },

  categoryBtnText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.ctgColor,
  },

  categoryBtnTextActive: {
    color: COLORS.white,
  },

  communitiesContainer: {
    marginTop: ms(12),
  },
  contentContainer: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(20),
  },

  /* --- Empty List FlatList contentContainer fill --- */
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  /* --- Empty State --- */
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: ms(32),
  },

  emptyIconCircle: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(20),
  },

  emptyTitle: {
    ...THEME.fontStyle.h3Bold,
    marginBottom: ms(10),
    textAlign: 'center',
  },

  emptySubtitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.placeholder,
    textAlign: 'center',
    lineHeight: ms(20),
    marginBottom: ms(28),
  },

  emptyButtonRow: {
    flexDirection: 'row',
    gap: ms(12),
  },

  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: ms(26),
    paddingVertical: ms(12),
    paddingHorizontal: ms(18),
  },

  createBtnText: {
    ...THEME.fontStyle.h5Bold,
  },

  discoverBtn: {
    backgroundColor: COLORS.modalBG,
    borderRadius: ms(26),
    paddingVertical: ms(12),
    paddingHorizontal: ms(18),
  },

  discoverBtnText: {
    ...THEME.fontStyle.h5Bold,
  },

  /* --- Create New Community Banner --- */
  createBannerCard: {
    marginVertical: ms(12),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.newModalBG,
    padding: ms(16),
    overflow: 'hidden',
  },

  createBannerTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.primary,
    marginBottom: ms(6),
  },

  createBannerSubtitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    lineHeight: ms(20),
    marginBottom: ms(24),
  },

  createBannerHighlight: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },

  createBannerBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: ms(26),
    paddingVertical: ms(10),
    alignItems: 'center',
  },

  createBannerBtnText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },

  /* --- Payment Pending Card --- */
  paymentPendingCard: {
    marginVertical: ms(12),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#FFB800',
    backgroundColor: COLORS.newModalBG,
    padding: ms(16),
    overflow: 'hidden',
  },

  paymentPendingTitle: {
    ...THEME.fontStyle.h4Bold,
    color: '#FFB800',
    marginBottom: ms(8),
  },

  paymentPendingSubtitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    lineHeight: ms(20),
    marginBottom: ms(24),
    opacity: 0.9,
  },

  paymentPendingHighlight: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },

  completePaymentBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: ms(26),
    paddingVertical: ms(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(8),
  },

  completePaymentBtnText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
});

export default styles;
