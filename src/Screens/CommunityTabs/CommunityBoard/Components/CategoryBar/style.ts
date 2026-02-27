import { StyleSheet } from 'react-native';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: ms(8),
    marginBottom: ms(12),
  },
  scrollContent: {
    alignItems: 'center',
    paddingRight: ms(8),
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
    marginRight: ms(8),
    backgroundColor: 'transparent',
  },
  pillActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  pillText: {
    ...THEME.fontStyle.h6Medium,
    color: COLORS.ctgColor,
  },
  pillTextActive: {
    color: COLORS.white,
  },
  settingsBtn: {
    paddingHorizontal: ms(8),
    paddingVertical: ms(6),
  },
});

export default styles;
