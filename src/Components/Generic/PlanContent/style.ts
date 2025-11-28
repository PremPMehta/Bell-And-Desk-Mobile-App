import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cardTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.black,
  },
  cardPrice: {
    ...THEME.fontStyle.h1Bold,
    color: COLORS.black,
    marginTop: ms(4),
  },
  month: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.black,
  },

  startBtn: {
    marginTop: ms(14),
    paddingVertical: ms(12),
    borderRadius: ms(40),
    alignItems: 'center',
  },
  bgWhite: {
    backgroundColor: COLORS.white,
  },
  bgBlack: {
    backgroundColor: COLORS.black,
  },
  startBtnText: {
    ...THEME.fontStyle.h5Bold,
  },

  includedText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.black,
    marginTop: ms(16),
    marginBottom: ms(8),
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: ms(5),
  },
  featureText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.black,
    marginLeft: 8,
  },
  commonColor: {
    color: COLORS.white,
  },
  commonColor2: {
    color: COLORS.black,
  },
});

export default styles;
