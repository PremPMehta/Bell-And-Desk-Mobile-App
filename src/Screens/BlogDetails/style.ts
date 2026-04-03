import { StyleSheet, Platform, Dimensions } from 'react-native';
import { ms, sc, vs } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  contentContainer: {
    paddingBottom: ms(40),
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(12),
  },
  backButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 101,
  },
  headerTitle: {
    ...THEME.fontStyle.h4SemiBold,
    flex: 1,
    marginLeft: ms(12),
    marginRight: ms(48), // Balance for back button
  },
  bannerContainer: {
    width: width,
    height: vs(350),
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ms(100),
  },
  blogContentWrapper: {
    paddingHorizontal: ms(16),
    marginTop: ms(-20), // Pull content up slightly over the gradient
    backgroundColor: COLORS.black,
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    paddingTop: ms(24),
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
    borderRadius: ms(20),
    alignSelf: 'flex-start',
    marginBottom: ms(12),
  },
  categoryText: {
    ...THEME.fontStyle.h6SemiBold,
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  title: {
    ...THEME.fontStyle.h2Bold,
    color: COLORS.white,
    marginBottom: ms(16),
    lineHeight: ms(30),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(24),
    paddingBottom: ms(20),
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    marginRight: ms(10),
  },
  authorAvatarPlaceholder: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(10),
  },
  authorName: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.lightGray,
    left: ms(4),
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    marginLeft: ms(4),
  },
  contentContainerStyle: {
    marginTop: ms(10),
  },
});

export default styles;
