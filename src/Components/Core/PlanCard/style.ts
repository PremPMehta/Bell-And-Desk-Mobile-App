import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Card
  cardWrapper: {
    marginBottom: ms(25),
  },
  popularBadge: {
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: ms(4),
    paddingHorizontal: ms(14),
    borderRadius: ms(20),
    marginBottom: ms(-10),
    zIndex: ms(10),

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  badgeText: {
    ...THEME.fontStyle.h6SemiBold,
    color: COLORS.black,
  },

  card: {
    borderRadius: ms(15),
    padding: ms(18),
    paddingTop: ms(25),
    width: '100%',
  },
  cardBGStyle: {
    backgroundColor: COLORS.white,
  },
  gradientBorder: {
    borderRadius: ms(15),
  },
});

export default styles;
