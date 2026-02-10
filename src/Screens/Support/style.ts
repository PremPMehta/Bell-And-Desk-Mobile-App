import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { sc, vs } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: sc(80),
    height: vs(80),
  },
  title: {
    ...THEME.fontStyle.h2Bold,
  },
  subtitle: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.termsColor,
    width: '85%',
    textAlign: 'center',
    marginVertical: sc(16),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: sc(12),
    paddingVertical: sc(5),
    borderRadius: sc(20),
  },
  buttonText: {
    ...THEME.fontStyle.h4SemiBold,
    marginLeft: sc(8),
  },
});

export default styles;
