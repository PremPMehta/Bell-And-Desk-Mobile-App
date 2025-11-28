import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc, vs, width } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    paddingBottom: ms(50),
  },

  bannerContainer: {
    width: '100%',
    height: width * 0.9,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    backgroundColor: COLORS.primary,
    padding: ms(5),
    borderRadius: ms(50),
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: vs(130), // adjust based on how strong you want the shadow
    zIndex: 6,
  },

  carousel: {
    paddingVertical: ms(12),
    paddingHorizontal: ms(10),
  },
  carouselContainer: {
    paddingRight: ms(10),
  },

  thumbWrapper: {
    marginRight: ms(10),
    borderRadius: ms(6),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    justifyContent: 'center',
  },
  activeThumb: {
    borderColor: COLORS.primary,
  },
  thumbnail: {
    height: vs(50),
    width: sc(90),
    borderRadius: ms(5),
  },
  videoSmallIcon: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    padding: ms(5),
    borderRadius: ms(50),
  },

  joinNow: {
    backgroundColor: COLORS.primary,
    paddingVertical: ms(10),
    borderRadius: ms(8),
    marginTop: ms(8),
    alignItems: 'center',
  },
  joinText: {
    ...THEME.fontStyle.h4SemiBold,
  },

  socialRow: {
    flexDirection: 'row',
    marginTop: ms(18),
    alignItems: 'center',
    gap: ms(10),
  },
  icon: {
    marginRight: ms(16),
  },

  linkRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: ms(12),
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.primary,
    marginRight: ms(10),
  },

  descTop: {
    ...THEME.fontStyle.h5Regular,
    marginTop: ms(12),
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: ms(22),
  },
  statCard: {
    flexDirection: 'row',
    gap: ms(10),
    width: '32%',
    backgroundColor: COLORS.cardBG,
    paddingVertical: ms(2),
    borderRadius: ms(5),
    alignItems: 'center',
  },
  statIcon: {
    backgroundColor: COLORS.primary,
    padding: ms(8),
    borderRadius: ms(5),
    marginLeft: ms(8),
  },
  statNumber: {
    ...THEME.fontStyle.h2Bold,
  },
  statLabel: {
    ...THEME.fontStyle.h5Regular,
  },

  heading: {
    ...THEME.fontStyle.h2Bold,
    marginTop: ms(28),
  },
  subText: {
    ...THEME.fontStyle.h5Regular,
    marginTop: ms(10),
    lineHeight: ms(18),
  },

  bulletRow: {
    flexDirection: 'row',
    marginTop: ms(10),
  },
  bullet: {
    ...THEME.fontStyle.h3Medium,
    color: COLORS.white,
    marginRight: ms(8),
  },
  bulletText: {
    ...THEME.fontStyle.h5Regular,
    flex: 1,
    lineHeight: ms(18),
  },
});

export default styles;
