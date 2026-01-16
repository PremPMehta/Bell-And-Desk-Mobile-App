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

  subscriptionContainer: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(16),
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionTitle: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },

  subscriptionContent: {
    flexDirection: 'row',
    gap: ms(12),
    marginTop: ms(12),
  },
  subscriptionLabel: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.gray,
  },
  subscriptionValue: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },

  manageSubscriptionContainer: {
    alignItems: 'center',
    marginTop: ms(12),
  },
  manageSubscription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },
  contactSupport: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
  },

  cancelSubscriptionContainer: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
    paddingVertical: ms(6),
    paddingHorizontal: ms(14),
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  cancelSubscription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
});

export default styles;
