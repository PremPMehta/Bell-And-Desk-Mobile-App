import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollContent: {
    paddingHorizontal: ms(20),
    paddingBottom: ms(100), // More padding for bottom logout button if needed
  },
  section: {
    marginTop: ms(24),
    marginBottom: ms(8),
  },
  sectionTitle: {
    ...THEME.fontStyle.h5Bold,
    color: '#8E8E93', // Grayish color for headers
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: ms(12),
    marginLeft: ms(4),
  },
  itemsCard: {
    backgroundColor: '#1C1C1E', // Slightly lighter than black for depth
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(14),
    paddingHorizontal: ms(16),
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
  },
  iconBackground: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    ...THEME.fontStyle.h4Medium,
    color: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: '#38383A',
    marginLeft: ms(60), // Align with text
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ms(40),
    paddingVertical: ms(16),
    backgroundColor: 'rgba(255, 69, 58, 0.1)', // Light red background
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#FF453A',
    gap: ms(10),
  },
  logoutText: {
    ...THEME.fontStyle.h4Bold,
    color: '#FF453A',
  },
});

export default styles;
