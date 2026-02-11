import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, width } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const CARD_WIDTH = (width - 50) / 2;

const styles = StyleSheet.create({
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
});

export default styles;
