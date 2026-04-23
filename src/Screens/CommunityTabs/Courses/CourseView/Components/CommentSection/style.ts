import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import { ms, vs } from '@/Assets/Theme/fontStyle';

export default StyleSheet.create({
  commentSection: {
    paddingVertical: vs(10),
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(24),
    paddingHorizontal: ms(16),
    marginBottom: vs(20),
  },
  commentInput: {
    ...THEME.fontStyle.h5Regular,
    flex: 1,
    paddingVertical: ms(12),
  },
  sendButton: {
    marginLeft: ms(8),
  },
  commentItem: {
    marginBottom: vs(16),
    backgroundColor: COLORS.innerCardBG,
    padding: ms(12),
    borderRadius: ms(12),
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  commentAvatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: COLORS.cardBG,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  commentAvatarImage: {
    width: '100%',
    height: '100%',
  },
  commentUserDate: {
    marginLeft: ms(10),
    flex: 1,
  },
  commentUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUser: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  instructorBadge: {
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
    paddingHorizontal: ms(6),
    paddingVertical: vs(1),
    borderRadius: ms(4),
    marginLeft: ms(8),
    borderWidth: 0.5,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  instructorText: {
    ...THEME.fontStyle.h6Bold,
    color: '#3498db',
    fontSize: ms(10),
    textTransform: 'uppercase',
  },
  commentDate: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: vs(1),
  },
  commentText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    lineHeight: vs(20),
    marginTop: vs(4),
  },
  commentFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    borderTopWidth: 0.3,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: vs(8),
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: ms(16),
  },
  likeCount: {
    ...THEME.fontStyle.h6Medium,
    color: COLORS.subText,
    marginLeft: ms(4),
  },
  emptyText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.subText,
    textAlign: 'center',
    marginTop: vs(20),
  },
});
