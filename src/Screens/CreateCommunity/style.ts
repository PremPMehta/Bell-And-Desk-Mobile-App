import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

const { width } = Dimensions.get('window');
const MEDIA_ITEM_SIZE = (width - ms(32) - ms(8)) / 3; // 3 columns, 16px side padding, 8px gaps

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  contentContainer: {
    padding: ms(16),
    paddingBottom: ms(40),
  },
  title: {
    ...THEME.fontStyle.h2Bold,
    color: COLORS.white,
    marginBottom: ms(4),
  },
  subtitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
    marginBottom: ms(24),
  },
  sectionTitle: {
    ...THEME.fontStyle.h5SemiBold,
    color: COLORS.white,
    marginBottom: ms(6),
  },
  mediaHelpText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    marginBottom: ms(12),
  },
  addMediaBtn: {
    flexDirection: 'row',
    gap: ms(8),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    padding: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
  },
  addMediaBtnText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  // Media grid
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
    marginTop: ms(12),
  },
  mediaItemWrapper: {
    width: MEDIA_ITEM_SIZE,
    height: MEDIA_ITEM_SIZE,
    borderRadius: ms(8),
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  mediaItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mediaItemVideoBadge: {
    position: 'absolute',
    bottom: ms(4),
    left: ms(4),
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: ms(4),
    paddingHorizontal: ms(5),
    paddingVertical: ms(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(3),
  },
  mediaItemVideoBadgeText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    fontSize: ms(9),
  },
  mediaItemRemoveBtn: {
    position: 'absolute',
    top: ms(4),
    right: ms(4),
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: ms(12),
    padding: ms(3),
  },
  mediaItemVideoPlaceholder: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ms(4),
  },
  mediaItemVideoText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    fontSize: ms(9),
    textAlign: 'center',
    paddingHorizontal: ms(4),
  },
  // Submit
  createBtnStyle: {
    backgroundColor: COLORS.primary,
    borderRadius: ms(30),
    paddingHorizontal: ms(24),
    paddingVertical: ms(6),
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: ms(24),
  },
  createBtnText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  // Overrides for TextInputField
  inputLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  inputStyle: {
    backgroundColor: COLORS.cardBG,
  },
  descriptionStyle: {
    height: 100,
  },
  errorText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.red,
    marginTop: ms(5),
  },
  disabledButton: {
    backgroundColor: COLORS.outlineGrey,
    opacity: 0.5,
  },
});

export default styles;
