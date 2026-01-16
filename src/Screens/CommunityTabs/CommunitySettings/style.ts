import { THEME } from '@/Assets/Theme';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: ms(16),
  },
  title: {
    ...THEME.fontStyle.h2Bold,
    color: COLORS.white,
  },
});

export default styles;
