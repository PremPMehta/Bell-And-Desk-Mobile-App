import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: ms(20),
  },
  scrollContent: {
    paddingBottom: ms(40),
  },
  mainText: {
    ...THEME.fontStyle.h2Bold,
    marginTop: ms(20),
    marginBottom: ms(8),
    alignSelf: 'center',
  },
  subText: {
    ...THEME.fontStyle.h5Regular,
    marginTop: ms(20),
    marginBottom: ms(20),
    alignSelf: 'center',
    textAlign: 'center',
    width: '80%',
  },
});

export default styles;
