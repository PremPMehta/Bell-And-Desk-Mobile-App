import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc, vs } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    position: 'relative',
    marginTop: ms(16),
  },
  gradientBorder: {
    flex: 1,
    padding: 1.5, // 👈 border thickness
    borderRadius: ms(7),
  },
  carouselContainer: {
    flex: 1,
    borderRadius: ms(7),
    overflow: 'hidden',
  },
  carouselImg: {
    width: '100%',
    // height: '100%',
    height: vs(145),
    resizeMode: 'contain',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: ms(7),
  },
  middleMainContainer: {
    padding: ms(20),
  },
  tagContainer: {
    backgroundColor: COLORS.newPrimaryLight,
    borderRadius: ms(20),
    paddingVertical: ms(6),
    paddingHorizontal: ms(10),
    alignSelf: 'center',
  },
  tag: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  title: {
    ...THEME.fontStyle.h2Bold,
    width: '86%',
    marginTop: ms(10),
  },
  subtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: ms(6),
    width: '90%',
  },

  /* BUTTON STYLES */
  primaryButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: ms(20),
    gap: ms(16),
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: sc(20),
    justifyContent: 'center',
    alignItems: 'center',
    height: vs(20),
    width: sc(80),
    gap: ms(8),
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    // marginTop: ms(80),
  },
  buttonShadow: {
    alignSelf: 'center',
    backgroundColor: COLORS.transparent,
    borderRadius: sc(20),
    borderWidth: 1,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    height: vs(20),
    width: sc(90),
  },

  communityButton: {
    height: vs(20),
    width: sc(110),
    borderRadius: sc(20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: COLORS.pageDots,
  },

  buttonText: {
    ...THEME.fontStyle.h7Regular,
  },

  paginationWrapper: {
    position: 'absolute',
    bottom: ms(10),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    height: vs(6),
    borderRadius: ms(6),
    marginHorizontal: ms(4),
  },
});

export default styles;
