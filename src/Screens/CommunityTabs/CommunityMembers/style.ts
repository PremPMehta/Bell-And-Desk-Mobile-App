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
});

export default styles;
