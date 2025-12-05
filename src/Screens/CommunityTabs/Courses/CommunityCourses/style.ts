import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    alignItems: 'center',
  },
  searchInputStyle: {
    width: sc(210),
  },
  create: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: ms(10),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    padding: ms(10),
    marginTop: ms(16),
  },
  createTxt: {
    ...THEME.fontStyle.h6Regular,
  },
  contentContainer: {
    padding: ms(16),
    paddingBottom: ms(40),
  },
});

export default styles;
