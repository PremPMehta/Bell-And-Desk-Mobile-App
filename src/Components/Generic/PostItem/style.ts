import { StyleSheet } from 'react-native';
import { ms, fontStyle } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.newModalBG,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: ms(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  avatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
  },
  headerInfo: {
    flex: 1,
    marginLeft: ms(12),
  },
  name: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
  },
  time: {
    ...fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: ms(2),
  },
  moreButton: {
    padding: ms(4),
  },
  content: {
    ...fontStyle.h4Regular,
    color: COLORS.white,
    marginBottom: ms(12),
  },
  mediaGrid: {
    marginTop: ms(4),
    marginBottom: ms(12),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mediaContainer: {
    // Kept for backward compat if needed, but not used in new grid directly
    marginTop: ms(4),
    marginBottom: ms(12),
  },
  mediaImage: {
    // Kept 
    width: '100%',
    height: ms(200),
    resizeMode: 'cover',
  },
  playIconContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    ...fontStyle.h2Bold,
    color: COLORS.white,
  },
  // Poll Styles
  pollContainer: {
    marginTop: ms(4),
    marginBottom: ms(12),
    borderRadius: ms(8),
    overflow: 'hidden',
    backgroundColor: COLORS.innerCardBG,
    padding: ms(16),
  },
  pollQuestion: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  pollSubText: {
    ...fontStyle.h6Regular,
    color: COLORS.subText,
    marginBottom: ms(12),
  },
  pollOptionRow: {
    height: ms(44),
    marginBottom: ms(12),
    borderRadius: ms(8),
    backgroundColor: '#303030', // Slightly lighter than bg
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pollOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(12),
    zIndex: 2,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 200, 83, 0.4)', // Green with opacity
  },
  progressBarWinner: {
    backgroundColor: 'rgba(0, 200, 83, 0.6)',
  },
  optionText: {
    ...fontStyle.h5Regular,
    color: COLORS.white,
    flex: 1,
    marginLeft: ms(8),
  },
  radioCircle: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    borderWidth: ms(2),
    borderColor: COLORS.subText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.green,
  },
  percentageText: {
    ...fontStyle.h6Bold,
    color: COLORS.white,
  },
  voteCountText: {
    ...fontStyle.h7Regular,
    color: COLORS.subText,
    marginLeft: ms(4),
  },
  totalVotes: {
    ...fontStyle.h6Regular,
    color: COLORS.subText,
    marginTop: ms(4),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: ms(8),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: ms(24),
  },
  footerText: {
    ...fontStyle.h5Medium,
    color: COLORS.white,
    marginLeft: ms(6),
  },
  editMenu: {
    position: 'absolute',
    right: ms(0),
    top: ms(50),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    padding: ms(8),
    zIndex: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: ms(100),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(8),
  },
  menuText: {
    ...fontStyle.h5Medium,
    color: COLORS.white,
    marginLeft: ms(8),
  },
  deleteText: {
    color: COLORS.red,
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.1)', // Optional
  },
});

export default styles;
