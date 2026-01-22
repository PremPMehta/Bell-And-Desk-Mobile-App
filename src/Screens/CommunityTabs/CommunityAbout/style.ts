import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { fontStyle, ms, vs, width } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    paddingBottom: vs(30),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: vs(16),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: COLORS.innerCardBG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
  },
  userName: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
    marginLeft: ms(10),
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: ms(10),
    paddingVertical: vs(4),
    borderRadius: ms(6),
  },
  editButtonText: {
    ...fontStyle.h5Bold,
    color: COLORS.white,
    marginLeft: ms(5),
  },
  mainVideoContainer: {
    width: '100%',
    height: vs(200),
    backgroundColor: COLORS.cardBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  playOverlay: {
    position: 'absolute',
    width: ms(40),
    height: ms(40),
    borderRadius: ms(40),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailList: {
    paddingHorizontal: ms(15),
    marginBottom: vs(16),
  },
  thumbnailItem: {
    width: ms(100),
    height: vs(50),
    borderRadius: ms(8),
    marginRight: ms(10),
    overflow: 'hidden',
    backgroundColor: COLORS.innerCardBG,
  },
  activeThumbnail: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailPlayIcon: {
    position: 'absolute',
    alignSelf: 'center',
    top: '30%',
  },
  communityInfo: {
    paddingHorizontal: ms(15),
    marginBottom: vs(20),
  },
  communityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(5),
  },
  communityTitle: {
    ...fontStyle.h2Bold,
    color: COLORS.white,
  },
  inviteButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: ms(12),
    paddingVertical: vs(6),
    borderRadius: ms(6),
  },
  inviteButtonText: {
    ...fontStyle.h6Bold,
    color: COLORS.white,
  },
  communityLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(15),
  },
  communityLink: {
    ...fontStyle.h6Regular,
    color: COLORS.subText,
    marginRight: ms(5),
  },
  socialIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialIcon: {
    marginRight: ms(20),
  },
  communityDescription: {
    ...fontStyle.h5Regular,
    color: COLORS.subText,
    lineHeight: vs(18),
    marginTop: vs(15),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ms(15),
    marginBottom: vs(20),
  },
  statCard: {
    flexDirection: 'row',
    gap: ms(10),
    width: (width - ms(50)) / 3,
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    padding: ms(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIconContainer: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(8),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValueContainer: {
    // backgroundColor: 'red',
  },
  statValue: {
    ...fontStyle.h2Bold,
    color: COLORS.white,
  },
  statLabel: {
    ...fontStyle.h6Regular,
    color: COLORS.subText,
  },
  welcomeSection: {
    paddingHorizontal: ms(15),
    marginTop: vs(10),
  },
  welcomeHeader: {
    ...fontStyle.h2Bold,
    color: COLORS.white,
    marginBottom: vs(15),
  },
  welcomeDescription: {
    ...fontStyle.h5Regular,
    color: COLORS.subText,
    lineHeight: vs(20),
    marginBottom: vs(15),
  },
  bulletPointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  bulletIcon: {
    marginTop: vs(4),
    marginRight: ms(10),
  },
  bulletTextContainer: {
    flex: 1,
  },
  bulletText: {
    ...fontStyle.h5Regular,
    color: COLORS.white,
    lineHeight: vs(20),
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    paddingHorizontal: ms(15),
  },
  footerNoteText: {
    ...fontStyle.h5Regular,
    color: COLORS.white,
    marginLeft: ms(10),
    flex: 1,
  },
});

export default styles;
