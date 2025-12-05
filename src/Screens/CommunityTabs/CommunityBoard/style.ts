import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  animatedScrollView: {
    flex: 1,
    // backgroundColor: COLORS.header,
  },
  animatedContent: {
    paddingBottom: ms(100),
  },
  container: {
    flex: 1,
    paddingHorizontal: ms(16),
  },
  title: {
    ...THEME.fontStyle.h2Bold,
    color: COLORS.white,
    marginTop: ms(10),
  },
  subTitle: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.ctgColor,
    marginTop: ms(5),
    marginBottom: ms(24),
  },

  // Create Post Section
  createPostCard: {
    backgroundColor: COLORS.newModalBG,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: ms(24),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  avatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  avatarText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  input: {
    flex: 1,
    justifyContent: 'center',
    height: ms(40),
    backgroundColor: COLORS.uploadBG,
    borderRadius: ms(20),
    paddingHorizontal: ms(16),
  },
  inputPlaceholder: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.uploadBG,
    paddingVertical: ms(10),
    borderRadius: ms(8),
    marginHorizontal: ms(4),
  },
  actionBtnText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    marginTop: ms(6),
  },

  // Empty State Section
  emptyStateCard: {
    backgroundColor: COLORS.newModalBG,
    borderRadius: ms(12),
    padding: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    minHeight: ms(250),
  },
  emptyStateTitle: {
    ...THEME.fontStyle.h3Bold,
    marginTop: ms(16),
    marginBottom: ms(8),
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    textAlign: 'center',
    marginBottom: ms(24),
    lineHeight: ms(18),
  },
  createPostButton: {
    paddingHorizontal: ms(12),
    paddingVertical: ms(8),
    backgroundColor: COLORS.primary,
    borderRadius: ms(8),
  },
  createPostButtonText: {
    ...THEME.fontStyle.h6Regular,
  },
});

export default styles;
