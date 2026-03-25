import { StyleSheet } from 'react-native';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainModalView: {
    backgroundColor: COLORS.cardBG,
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    maxHeight: '92%',
    paddingBottom: ms(16),
  },
  dragIndicator: {
    width: ms(40),
    height: ms(4),
    backgroundColor: COLORS.border,
    borderRadius: ms(2),
    alignSelf: 'center',
    marginTop: ms(10),
    marginBottom: ms(4),
  },

  // ── Header ────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    paddingVertical: ms(14),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: ms(12),
  },
  communityName: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  subtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: ms(4),
  },
  closeButton: {
    padding: ms(4),
  },

  // ── Scroll content ────────────────────────────
  scrollContent: {
    paddingBottom: ms(8),
  },
  loader: {
    marginVertical: ms(40),
  },

  // ── Section ───────────────────────────────────
  section: {
    paddingHorizontal: ms(20),
    paddingTop: ms(18),
  },
  sectionTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: ms(12),
  },
  optionalLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
  },

  // ── Plan cards ────────────────────────────────
  plansRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(10),
  },
  planCard: {
    flex: 1,
    minWidth: sc(130),
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: ms(12),
    padding: ms(14),
    backgroundColor: COLORS.innerCardBG,
  },
  planCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  planRadioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    marginBottom: ms(8),
  },
  radioCircle: {
    width: ms(18),
    height: ms(18),
    borderRadius: ms(9),
    borderWidth: 2,
    borderColor: COLORS.outlineGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: COLORS.primary,
  },
  planInterval: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    textTransform: 'capitalize',
  },
  planPrice: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.lightGray,
  },
  planPriceSelected: {
    color: COLORS.primary,
  },
  originalPrice: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.subText,
    textDecorationLine: 'line-through',
    marginTop: ms(2),
  },

  // ── Info banner ─────────────────────────────
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    backgroundColor: COLORS.primaryLight,
    borderRadius: ms(10),
    padding: ms(12),
  },
  infoBannerText: {
    ...THEME.fontStyle.h6SemiBold,
    flex: 1,
  },

  // ── Coupon banner ─────────────────────────────
  couponBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ms(8),
    backgroundColor: COLORS.primaryLight,
    borderRadius: ms(10),
    marginHorizontal: ms(20),
    marginTop: ms(20),
    padding: ms(12),
  },
  couponBannerText: {
    ...THEME.fontStyle.h5SemiBold,
    flex: 1,
  },

  // ── Coupon input ──────────────────────────────
  couponRow: {
    flexDirection: 'row',
    gap: ms(10),
  },
  couponInput: {
    flex: 1,
    backgroundColor: COLORS.innerCardBG,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(10),
    paddingHorizontal: ms(14),
    paddingVertical: ms(10),
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: ms(10),
    paddingHorizontal: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: ms(72),
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  errorText: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.red,
    marginTop: ms(6),
  },

  // ── Applied coupon ────────────────────────────
  appliedCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appliedCouponBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    flex: 1,
  },
  appliedCouponCode: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.green,
    flex: 1,
  },
  removeButton: {
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: ms(8),
    marginLeft: ms(10),
  },
  removeButtonText: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.red,
  },

  // ── Referral ──────────────────────────────────
  referralInput: {
    backgroundColor: COLORS.innerCardBG,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(10),
    paddingHorizontal: ms(14),
    paddingVertical: ms(10),
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  referralHint: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.subText,
    marginTop: ms(6),
  },

  // ── Benefit rows ──────────────────────────────
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ms(12),
    paddingVertical: ms(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  benefitIconWrapper: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(8),
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ms(2),
  },
  benefitTextContainer: {
    flex: 1,
  },
  benefitTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  benefitSubtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: ms(2),
  },

  // ── Footer ────────────────────────────────────
  footer: {
    flexDirection: 'row',
    gap: ms(10),
    paddingHorizontal: ms(20),
    paddingTop: ms(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  maybeLaterButton: {
    flex: 1,
    paddingVertical: ms(14),
    borderRadius: ms(30),
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maybeLaterText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.subText,
  },
  subscribeButton: {
    flex: 2,
    paddingVertical: ms(14),
    borderRadius: ms(30),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonDisabled: {
    opacity: 0.5,
  },
  subscribeButtonText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  subscribePriceText: {
    color: COLORS.white,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: ms(20),
    marginTop: ms(16),
  },
});

export default styles;
