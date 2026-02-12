import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { ms, sc, vs } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollContent: {
    paddingHorizontal: sc(20),
    paddingBottom: vs(30),
  },
  section: {
    marginTop: vs(20),
  },
  sectionTitle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.outlineGrey,
    marginBottom: vs(12),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsCard: {
    backgroundColor: COLORS.newModalBG,
    borderRadius: ms(12),
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(16),
    paddingHorizontal: sc(16),
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sc(12),
  },
  iconBackground: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    ...THEME.fontStyle.h3SemiBold,
    color: COLORS.white,
  },
  itemSubText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.subText,
    marginTop: vs(2),
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: sc(64),
  },
});

export default styles;
