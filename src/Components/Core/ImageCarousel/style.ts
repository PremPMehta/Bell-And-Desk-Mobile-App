import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, vs } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    position: 'relative',
    marginTop: ms(16),
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
  middleMainContainer: {
    padding: ms(20),
  },
  title: {
    ...THEME.fontStyle.h2Bold,
    width: '85%',
  },
  subtitle: {
    ...THEME.fontStyle.h5Regular,
    // color: COLORS.subText,
    marginTop: ms(6),
    width: '90%',
  },
  button: {
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingVertical: ms(5),
    paddingHorizontal: ms(14),
    borderRadius: ms(20),
    marginTop: ms(14),
    alignSelf: 'flex-start',
  },
  buttonText: {
    ...THEME.fontStyle.h5Regular,
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
