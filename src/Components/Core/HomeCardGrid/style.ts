import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, vs, width } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const CARD_WIDTH = (width - 50) / 2;

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: ms(5),
    marginBottom: ms(10),
  },
  cardContainer: {
    padding: ms(1.5),
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.cardGridBG,
    borderWidth: ms(1),
    borderRadius: ms(6),
  },
  image: {
    width: '94%',
    height: vs(100),
    borderRadius: ms(5),
    marginTop: ms(5),
    alignSelf: 'center',
  },
  categoryContainer: {
    borderColor: COLORS.white,
    borderWidth: ms(1),
    borderRadius: ms(20),
    paddingVertical: ms(3),
    paddingHorizontal: ms(8),
    alignSelf: 'flex-start',
    marginTop: ms(10),
    marginLeft: ms(5),
  },
  categoryText: {
    ...THEME.fontStyle.h7Regular,
  },
  title: {
    ...THEME.fontStyle.h3Bold,
    marginTop: ms(8),
    marginBottom: ms(10),
    marginLeft: ms(6),
  },
});

export default styles;
