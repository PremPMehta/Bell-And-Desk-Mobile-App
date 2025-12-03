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

  searchContainer: {
    paddingHorizontal: ms(16),
  },

  /* --- Category Tabs --- */
  categoryScroll: {
    marginBottom: ms(10),
  },
  categoryContentContainer: {
    paddingRight: ms(12),
  },
  categoryBtn: {
    // alignItems: 'center',
    marginRight: ms(10),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: COLORS.ctgColor,
    paddingVertical: ms(4),
    paddingHorizontal: ms(12),
    left: ms(16),
  },
  categoryBtnText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.ctgColor,
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
