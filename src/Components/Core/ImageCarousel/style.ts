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
    height: '100%',
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
  title: {
    ...THEME.fontStyle.h2Bold,
    width: '85%',
  },
  subtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: ms(6),
    width: '90%',
  },
  button: {
    borderWidth: 0.5,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    marginTop: ms(14),
    alignSelf: 'flex-start',
  },
  gradientButton: {
    paddingVertical: ms(6),
    paddingHorizontal: ms(10),
    borderRadius: ms(20),
    alignSelf: 'flex-start',
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
