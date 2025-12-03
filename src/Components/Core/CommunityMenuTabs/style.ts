import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabsWrapper: {
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    right: 0,
    top: 2,
    bottom: 2,
    width: ms(40),
    zIndex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
    paddingHorizontal: ms(16),
    paddingRight: ms(40), // Add padding to avoid content being hidden by gradient
  },
  tabItem: {
    paddingVertical: ms(12),
    marginRight: ms(24),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: COLORS.white,
  },
  tabText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
  },
  activeTabText: {
    ...THEME.fontStyle.h5Bold,
  },
});

export default styles;
