import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    paddingVertical: ms(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(12),
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(8),
  },
  activeStepCircle: {
    backgroundColor: COLORS.white,
  },
  completedStepCircle: {
    backgroundColor: COLORS.primary,
  },
  stepNumber: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
  },
  activeStepNumber: {
    color: COLORS.black,
  },
  stepLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
  },
  activeStepLabel: {
    color: COLORS.white,
  },
});

export default styles;
