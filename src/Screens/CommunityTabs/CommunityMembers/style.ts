import { THEME } from '@/Assets/Theme';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  animatedScroll: {
    flex: 1,
    backgroundColor: COLORS.grDark,
  },
  container: {
    paddingHorizontal: ms(16),
  },
  header: {
    marginTop: ms(10),
  },
  title: {
    ...THEME.fontStyle.h2Bold,
    color: COLORS.white,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  searchBarContainer: {
    flex: 1,
    marginRight: ms(12),
    marginVertical: 0, // Override default margin
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: ms(14),
    paddingHorizontal: ms(16),
    height: ms(35), // Match search bar height
  },
  exportText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.white,
    marginLeft: ms(8),
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: ms(16),
    paddingBottom: ms(40),
  },
  emptyStateCard: {
    padding: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ms(60),
  },
  emptyStateTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
    marginTop: ms(24),
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.placeholder,
    marginTop: ms(12),
    textAlign: 'center',
    lineHeight: ms(20),
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
    paddingBottom: ms(20),
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
  },
  boldName: {
    ...THEME.fontStyle.h4Bold,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: ms(20),
    gap: ms(16),
  },
  modalCancelText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.placeholder,
  },
  modalActionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: ms(20),
    paddingVertical: ms(10),
    borderRadius: ms(8),
    minWidth: ms(100),
    alignItems: 'center',
  },
  modalActionText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  modalRejectButton: {
    backgroundColor: COLORS.red,
  },
});

export default styles;
