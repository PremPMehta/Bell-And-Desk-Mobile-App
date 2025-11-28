import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { height, ms, mvs, sc, vs } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  imgBgStyle: {
    flex: 1,
  },
  gradientStyle: {
    flex: 1,
  },
  kbContentStyle: {
    padding: ms(20),
  },
  middileViewStyle: {
    minHeight: vs(height * 0.7),
    justifyContent: 'center',
  },
  logoStyle: {
    width: sc(175),
    height: vs(35),
    alignSelf: 'center',
    marginBottom: ms(20),
  },
  wlcmHeaderViewStyle: {
    alignItems: 'center',
    marginBottom: ms(20),
  },
  wlcmTxtStyle: {
    ...THEME.fontStyle.h1Bold,
  },
  subTxtStyle: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.gray,
    marginTop: ms(5),
  },
  signInBtnStyle: {
    backgroundColor: COLORS.blue,
    padding: ms(13),
    borderRadius: ms(5),
    marginTop: ms(10),
    alignItems: 'center',
  },
  signInTxtStyle: {
    ...THEME.fontStyle.h4SemiBold,
  },
  commonContainer: {
    marginTop: ms(20),
    alignItems: 'center',
  },
  accTxtStyle: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.gray,
  },
  signUpTxtStyle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
  },
});

export default styles;
