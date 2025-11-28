import { Dimensions } from 'react-native';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import { COLORS } from './colors';

export const height = Dimensions.get('window').height;
export const width = Dimensions.get('window').width;

export const sc = (size: number) => {
  return scale(size); // width
};

export const vs = (size: number) => {
  return verticalScale(size); // height
};

export const ms = (size: number, factor?: number) => {
  return moderateScale(size, factor); // padding, margin, fonts
};

export const mvs = (size: number, factor?: number) => {
  return moderateVerticalScale(size, factor);
};

export const fontStyle = {
  // BOLD
  h1Bold: {
    fontFamily: 'Roboto-Bold',
    fontSize: ms(20),
    color: COLORS.white,
  },
  h2Bold: {
    fontFamily: 'Roboto-Bold',
    fontSize: ms(18),
    color: COLORS.white,
  },
  h3Bold: {
    fontFamily: 'Roboto-Bold',
    fontSize: ms(16),
    color: COLORS.white,
  },
  h4Bold: {
    fontFamily: 'Roboto-Bold',
    fontSize: ms(14),
    color: COLORS.white,
  },
  h5Bold: {
    fontFamily: 'Roboto-Bold',
    fontSize: ms(12),
    color: COLORS.white,
  },
  h6Bold: {
    fontFamily: 'Roboto-Bold',
    fontSize: ms(10),
    color: COLORS.white,
  },
  h7Bold: {
    fontFamily: 'Roboto-Bold',
    fontSize: ms(8),
    color: COLORS.white,
  },

  // SEMIBOLD
  h1SemiBold: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: ms(20),
    color: COLORS.white,
  },
  h2SemiBold: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: ms(18),
    color: COLORS.white,
  },
  h3SemiBold: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: ms(16),
    color: COLORS.white,
  },
  h4SemiBold: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: ms(14),
    color: COLORS.white,
  },
  h5SemiBold: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: ms(12),
    color: COLORS.white,
  },
  h6SemiBold: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: ms(10),
    color: COLORS.white,
  },
  h7SemiBold: {
    fontFamily: 'Roboto-SemiBold',
    fontSize: ms(8),
    color: COLORS.white,
  },

  // MEDIUM
  h1Medium: {
    fontFamily: 'Roboto-Medium',
    fontSize: ms(20),
    color: COLORS.white,
  },
  h2Medium: {
    fontFamily: 'Roboto-Medium',
    fontSize: ms(18),
    color: COLORS.white,
  },
  h3Medium: {
    fontFamily: 'Roboto-Medium',
    fontSize: ms(16),
    color: COLORS.white,
  },
  h4Medium: {
    fontFamily: 'Roboto-Medium',
    fontSize: ms(14),
    color: COLORS.white,
  },
  h5Medium: {
    fontFamily: 'Roboto-Medium',
    fontSize: ms(12),
    color: COLORS.white,
  },
  h6Medium: {
    fontFamily: 'Roboto-Medium',
    fontSize: ms(10),
    color: COLORS.white,
  },
  h7Medium: {
    fontFamily: 'Roboto-Medium',
    fontSize: ms(8),
    color: COLORS.white,
  },

  // REGULAR
  h1Regular: {
    fontFamily: 'Roboto-Regular',
    fontSize: ms(20),
    color: COLORS.white,
  },
  h2Regular: {
    fontFamily: 'Roboto-Regular',
    fontSize: ms(18),
    color: COLORS.white,
  },
  h3Regular: {
    fontFamily: 'Roboto-Regular',
    fontSize: ms(16),
    color: COLORS.white,
  },
  h4Regular: {
    fontFamily: 'Roboto-Regular',
    fontSize: ms(14),
    color: COLORS.white,
  },
  h5Regular: {
    fontFamily: 'Roboto-Regular',
    fontSize: ms(12),
    color: COLORS.white,
  },
  h6Regular: {
    fontFamily: 'Roboto-Regular',
    fontSize: ms(10),
    color: COLORS.white,
  },
  h7Regular: {
    fontFamily: 'Roboto-Regular',
    fontSize: ms(8),
    color: COLORS.white,
  },

  // LIGHT
  h1Light: {
    fontFamily: 'Roboto-Light',
    fontSize: ms(20),
    color: COLORS.white,
  },
  h2Light: {
    fontFamily: 'Roboto-Light',
    fontSize: ms(18),
    color: COLORS.white,
  },
  h3Light: {
    fontFamily: 'Roboto-Light',
    fontSize: ms(16),
    color: COLORS.white,
  },
  h4Light: {
    fontFamily: 'Roboto-Light',
    fontSize: ms(14),
    color: COLORS.white,
  },
  h5Light: {
    fontFamily: 'Roboto-Light',
    fontSize: ms(12),
    color: COLORS.white,
  },
  h6Light: {
    fontFamily: 'Roboto-Light',
    fontSize: ms(10),
    color: COLORS.white,
  },
  h7Light: {
    fontFamily: 'Roboto-Light',
    fontSize: ms(8),
    color: COLORS.white,
  },
};
