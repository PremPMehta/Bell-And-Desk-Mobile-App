import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import { vs, sc, ms } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sc(16),
    backgroundColor: COLORS.header,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.innerCardBG,
  },
  backButton: {
    padding: sc(8),
    marginRight: sc(8),
    borderRadius: ms(30),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
    fontSize: ms(16),
  },
  headerSubTitle: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.subText,
    lineHeight: ms(18),
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: COLORS.newModalBG,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.newModalBG,
    zIndex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: sc(20),
  },
  errorText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.subText,
    textAlign: 'center',
    marginTop: vs(12),
  },
  retryButton: {
    marginTop: vs(20),
    paddingHorizontal: sc(24),
    paddingVertical: vs(10),
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.white,
  },
});

export default styles;
