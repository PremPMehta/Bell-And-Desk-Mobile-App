import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc, vs } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(5),
    overflow: 'hidden',
    marginBottom: ms(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bannerImage: {
    width: '95%',
    height: ms(140),
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: ms(10),
    borderRadius: ms(5),
  },
  actionContainer: {
    position: 'absolute',
    zIndex: 1,
    right: ms(12),
  },
  eyeStyle: {
    top: ms(14),
    backgroundColor: COLORS.white,
    padding: ms(6),
    borderRadius: ms(20),
  },
  editStyle: {
    top: ms(22),
    backgroundColor: COLORS.white,
    padding: ms(6),
    borderRadius: ms(20),
  },
  deleteStyle: {
    top: ms(32),
    backgroundColor: COLORS.white,
    padding: ms(6),
    borderRadius: ms(20),
  },
  contentContainer: {
    paddingHorizontal: ms(10),
    paddingVertical: ms(12),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ms(10),
    marginTop: ms(12),
    gap: ms(8),
  },
  tag: {
    paddingHorizontal: ms(10),
    paddingVertical: ms(4),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    backgroundColor: 'transparent',
  },
  tagText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    fontSize: ms(10),
  },
  communityName: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  description: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.gray,
    marginTop: ms(10),
    lineHeight: ms(18),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
    marginTop: ms(16),
  },
  communityLogo: {
    width: sc(20),
    height: vs(20),
    borderRadius: ms(20),
  },
  communityText: {
    ...THEME.fontStyle.h6Regular,
  },
});

export default styles;
