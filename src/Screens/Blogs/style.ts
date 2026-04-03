import { StyleSheet, Platform } from 'react-native';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    paddingBottom: ms(40),
  },
  emptyContainer: {
    flex: 1,
    height: ms(400),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(40),
  },
  emptyIconCircle: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(20),
  },
  emptyTitle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: ms(8),
  },
  emptySubtitle: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: ms(20),
  },
});

export default styles;
