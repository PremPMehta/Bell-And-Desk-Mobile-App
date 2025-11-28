import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: ms(20),
    backgroundColor: COLORS.black,
  },
  scrollContent: {
    paddingBottom: ms(40),
  },
  title: {
    ...THEME.fontStyle.h1Bold,
    marginBottom: ms(10),
  },
  date: {
    ...THEME.fontStyle.h4Regular,
    marginBottom: ms(20),
  },
  bold: {
    ...THEME.fontStyle.h4Bold,
  },
  h2: {
    ...THEME.fontStyle.h2Bold,
    marginTop: ms(25),
    marginBottom: ms(8),
  },
  p: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.termsColor,
    marginBottom: ms(15),
    lineHeight: ms(18),
  },
  ul: {
    marginLeft: ms(15),
    marginBottom: ms(15),
  },
  listItem: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.termsColor,
    marginBottom: ms(6),
  },
});

export default styles;
