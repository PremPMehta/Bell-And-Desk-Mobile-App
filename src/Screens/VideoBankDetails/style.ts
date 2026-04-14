import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { fontStyle, ms, mvs } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.cardBG,
  },
  content: {
    padding: ms(20),
  },
  title: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
    marginBottom: mvs(16),
  },
  detailsCard: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    padding: ms(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: mvs(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    ...fontStyle.h5Regular,
    color: COLORS.gray,
    flex: 1,
  },
  value: {
    ...fontStyle.h5Medium,
    color: COLORS.white,
    flex: 2,
    textAlign: 'right',
  },
  /* ─── header actions ─────────────────── */
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
    marginRight: ms(16),
  },
  actionIcon: {
    padding: ms(4),
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
  modalSection: {
    marginBottom: mvs(20),
  },
  modalSectionTitle: {
    ...fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: mvs(12),
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
  /* ─── delete modal ───────────── */
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
