import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  container: {
    padding: ms(20),
  },
  h1: {
    ...THEME.fontStyle.h1Bold,
    marginBottom: ms(10),
  },
  h2: {
    ...THEME.fontStyle.h2Bold,
    marginTop: ms(20),
    marginBottom: ms(8),
  },
  h3: {
    ...THEME.fontStyle.h3Bold,
    marginTop: ms(10),
    marginBottom: ms(5),
  },
  p: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.termsColor,
    marginBottom: ms(10),
    lineHeight: ms(18),
  },
  strong: {
    ...THEME.fontStyle.h4Bold,
  },
  dateText: {
    ...THEME.fontStyle.h4Regular,
    marginBottom: ms(20),
  },
  ul: {
    marginVertical: ms(8),
  },
  liRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: ms(6),
  },
  bullet: {
    ...THEME.fontStyle.h4Regular,
    marginRight: ms(6),
  },
  li: {
    ...THEME.fontStyle.h4Regular,
    flex: 1,
  },
});

export default styles;
