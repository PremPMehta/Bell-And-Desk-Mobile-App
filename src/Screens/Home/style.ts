import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, width } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const CARD_WIDTH = (width - 50) / 2;
const BANNER_HEIGHT = ms(200);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  contentContainerStyle: {
    paddingBottom: ms(40),
  },

  /* --- Video Banner --- */
  videoContainer: {
    position: 'relative',
    height: BANNER_HEIGHT,
    backgroundColor: 'red',
  },
  bottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30, // Adjust height of shadow
  },
  videoBanner: {
    width: '100%',
    height: ms(200),
    // borderRadius: ms(10),
    // marginVertical: ms(16),
  },

  container: {
    paddingHorizontal: ms(16),
  },

  /* --- Header --- */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: ms(20),
  },
  headerText: {
    ...THEME.fontStyle.h2Regular,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    ...THEME.fontStyle.h5Regular,
    marginRight: ms(5),
  },

  /* --- Category Tabs --- */
  categoryScroll: {
    marginTop: ms(12),
  },
  categoryContentContainer: {
    paddingRight: ms(10),
  },
  categoryBtn: {
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.ctgColor,
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  categoryBtnText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.ctgColor,
  },
  activeCategoryBtn: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.whiteLight,
  },
  activeCategoryBtnText: {
    color: COLORS.white,
  },

  /* --- Cards Grid --- */
  gradientBorder: {
    padding: 2, // This will create the border effect
    borderRadius: 10, // Rounded corners for the border
    marginBottom: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#08111D',
    // backgroundColor: '#00133180',
    // borderColor: '#00426D',
    borderWidth: 1,
    borderRadius: 5,
    // marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '94%',
    height: 130,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'center',
  },
  categoryContainer: {
    // backgroundColor: '#0D1625',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 5,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 8,
  },
  title: {
    color: 'white',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionTitle: {
    ...THEME.fontStyle.h2Regular,
    marginTop: ms(16),
  },

  /* --- Empty State --- */
  emptyContainer: {
    paddingVertical: ms(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...THEME.fontStyle.h3Regular,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: ms(8),
  },
  emptySubtitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.ctgColor,
    textAlign: 'center',
    paddingHorizontal: ms(40),
  },
});

export default styles;
