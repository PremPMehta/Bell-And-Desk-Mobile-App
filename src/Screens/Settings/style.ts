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
    paddingBottom: ms(100),
  },
  section: {
    marginTop: ms(24),
    marginBottom: ms(8),
  },
  sectionTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.outlineGrey,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: ms(12),
    marginLeft: ms(4),
  },
  itemsCard: {
    backgroundColor: COLORS.newModalBG,
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
    backgroundColor: COLORS.arrow,
    marginLeft: ms(60),
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ms(40),
    paddingVertical: ms(16),
    backgroundColor: COLORS.redLight,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.red,
    gap: ms(10),
  },
  logoutText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.red,
  },
});

export default styles;
