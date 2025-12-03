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
  contentContainer: {
    padding: ms(16),
    paddingBottom: ms(40),
  },
});

export default styles;
