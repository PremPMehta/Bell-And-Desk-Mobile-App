import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { fontStyle, ms, mvs } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
  /* ─── layout ─────────────────────────── */
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: ms(20),
  },
  listContent: {
    paddingBottom: mvs(40),
  },

  /* ─── header ─────────────────────────── */
  headerRoot: {
    zIndex: 100,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: mvs(20),
    marginBottom: mvs(4),
  },
  headerTitle: {
    ...fontStyle.h2Bold,
    color: COLORS.white,
  },

  /* ─── filter row ─────────────────────── */
  filterRow: {
    flexDirection: 'row',
    gap: ms(12),
    marginBottom: mvs(20),
    zIndex: 110,
  },
  dropdownWrapper: {
    flex: 1,
    zIndex: 120,
  },
  filterLabel: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
    lineHeight: mvs(18),
    marginBottom: mvs(6),
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: ms(12),
    paddingVertical: mvs(9),
  },
  dropdownBtnText: {
    ...fontStyle.h6Regular,
    color: COLORS.white,
    flex: 1,
    marginRight: ms(4),
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: mvs(4),
    zIndex: 2000,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(12),
    paddingVertical: mvs(10),
  },
  dropdownItemActive: {
    backgroundColor: COLORS.innerCardBG,
  },
  dropdownItemText: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
    flex: 1,
  },
  dropdownItemTextActive: {
    color: COLORS.white,
  },

  /* ─── video card ─────────────────────── */
  card: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    marginBottom: mvs(14),
    overflow: 'visible',
    zIndex: 1,
  },
  activeCard: {
    zIndex: 10,
    elevation: 10,
  },
  thumbContainer: {
    width: '100%',
    height: mvs(190),
    borderTopLeftRadius: ms(12),
    borderTopRightRadius: ms(12),
    overflow: 'hidden',
    backgroundColor: COLORS.innerCardBG,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: ms(8),
    right: ms(8),
    backgroundColor: 'rgba(0,0,0,0.72)',
    paddingHorizontal: ms(7),
    paddingVertical: mvs(2),
    borderRadius: ms(4),
  },
  durationText: {
    ...fontStyle.h7Regular,
    color: COLORS.white,
  },

  /* card body */
  cardBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: ms(14),
    paddingVertical: mvs(12),
  },
  cardInfo: {
    flex: 1,
    marginRight: ms(8),
  },
  cardTitle: {
    ...fontStyle.h5Medium,
    color: COLORS.white,
    marginBottom: mvs(5),
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  cardMetaText: {
    ...fontStyle.h7Regular,
    color: COLORS.gray,
  },

  /* ─── card action menu ───────────────── */
  menuTrigger: {
    padding: ms(4),
  },
  cardMenu: {
    position: 'absolute',
    right: 0,
    top: ms(28),
    backgroundColor: COLORS.modalBG,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: ms(120),
    zIndex: 200,
    elevation: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  cardMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    paddingHorizontal: ms(14),
    paddingVertical: mvs(10),
  },
  cardMenuItemText: {
    ...fontStyle.h6Regular,
    color: COLORS.white,
  },
  cardMenuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  /* ─── empty state ────────────────────── */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: mvs(80),
    paddingHorizontal: ms(30),
  },
  emptyTitle: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
    marginTop: mvs(16),
    textAlign: 'center',
  },
  emptySubtitle: {
    ...fontStyle.h5Regular,
    color: COLORS.gray,
    marginTop: mvs(8),
    textAlign: 'center',
  },

  /* ─── skeleton ───────────────────────── */
  skeletonCard: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    marginBottom: mvs(14),
    overflow: 'hidden',
  },
  skeletonThumb: {
    width: '100%',
    height: mvs(190),
    backgroundColor: COLORS.innerCardBG,
  },
  skeletonBody: {
    padding: ms(14),
    gap: mvs(8),
  },
  skeletonLine: {
    height: mvs(12),
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(6),
    width: '80%',
  },

  /* ─── floating action button ─────────── */
  fab: {
    position: 'absolute',
    right: ms(20),
    bottom: mvs(30),
    width: ms(40),
    height: ms(40),
    borderRadius: ms(28),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 100,
  },

  /* ─── modal base ─────────────────────── */
  mainModalView: {
    backgroundColor: COLORS.newModalBG,
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    maxHeight: '90%',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    paddingVertical: mvs(18),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
  },
  modalContent: {
    paddingHorizontal: ms(20),
    paddingTop: mvs(20),
    paddingBottom: mvs(30),
  },

  /* ─── add video modal ────────────────── */
  modalSection: {
    marginBottom: mvs(20),
  },
  modalSectionTitle: {
    ...fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: mvs(12),
  },
  uploadFieldLabel: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
    marginBottom: mvs(8),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBG,
    paddingHorizontal: ms(16),
    paddingVertical: mvs(14),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleInfo: {
    flex: 1,
    marginRight: ms(20),
  },
  toggleTitle: {
    ...fontStyle.h5Medium,
    color: COLORS.white,
  },
  toggleSubtitle: {
    ...fontStyle.h7Regular,
    color: COLORS.gray,
    marginTop: mvs(2),
  },

  /* ─── delete modal refined ───────────── */
  modalBody: {
    paddingHorizontal: ms(24),
    paddingVertical: mvs(30),
    alignItems: 'center',
  },
  modalIconWrap: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: mvs(20),
  },
  modalMessage: {
    ...fontStyle.h5Regular,
    color: COLORS.subText,
    textAlign: 'center',
    lineHeight: mvs(22),
  },
  boldName: {
    ...fontStyle.h5Bold,
    color: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: ms(12),
    paddingHorizontal: ms(20),
    paddingVertical: mvs(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalCancelText: {
    ...fontStyle.h5Medium,
    color: COLORS.gray,
    paddingHorizontal: ms(12),
  },
  modalRemoveButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: ms(24),
    paddingVertical: mvs(10),
    borderRadius: ms(8),
  },
  modalRemoveText: {
    ...fontStyle.h5Bold,
    color: COLORS.white,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: mvs(14),
    borderRadius: ms(12),
    alignItems: 'center',
  },
  saveButtonText: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
  },
  modalFooterFixed: {
    paddingHorizontal: ms(20),
    paddingVertical: mvs(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});

export default styles;
