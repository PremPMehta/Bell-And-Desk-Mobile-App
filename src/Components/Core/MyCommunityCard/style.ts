import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    overflow: 'hidden',
    marginBottom: ms(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bannerImage: {
    width: '100%',
    height: ms(140),
    resizeMode: 'cover',
  },
  contentContainer: {
    paddingHorizontal: ms(12),
    paddingVertical: ms(12),
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ms(12),
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
    marginBottom: ms(4),
  },
  description: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.gray,
    marginBottom: ms(16),
    lineHeight: ms(18),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ms(12),
  },
  viewButton: {
    backgroundColor: COLORS.uploadBG,
    width: '48%',
    alignItems: 'center',
    paddingVertical: ms(8),
    borderRadius: ms(20),
  },
  settingsButton: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    width: '48%',
    paddingVertical: ms(8),
    borderRadius: ms(20),
  },
  buttonText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    fontSize: ms(12),
  },
});

export default styles;
