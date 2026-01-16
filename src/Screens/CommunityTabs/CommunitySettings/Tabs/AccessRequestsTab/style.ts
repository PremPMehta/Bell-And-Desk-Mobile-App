import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: ms(16),
    padding: ms(12),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
  },
  headerContainer: {
    marginBottom: ms(16),
  },
  title: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
    marginBottom: ms(4),
  },
  subtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },

  contentContainer: {
    marginBottom: ms(16),
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionContent: {
    width: sc(245),
  },
  optionTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  optionDescription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },

  infoContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.newInnerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    gap: ms(8),
    marginTop: ms(12),
  },
  infoText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
    width: '90%',
  },
  boldText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.lightGray,
  },

  buttonContainer: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
    paddingVertical: ms(6),
    paddingHorizontal: ms(14),
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  buttonText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
});

export default styles;
