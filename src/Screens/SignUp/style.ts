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
  subTxtStyle: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: ms(10),
  },
  accBtnStyle: {
    backgroundColor: COLORS.lightGray,
    padding: ms(13),
    borderRadius: ms(5),
    marginTop: ms(10),
    alignItems: 'center',
  },
  accTxtStyle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.black,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: ms(20),
  },
  termsTxtStyle: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.gray,
  },
  termsClickTxtStyle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
  },
  alreadyContainer: {
    marginTop: ms(20),
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default styles;
