import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, mvs } from '@/Assets/Theme/fontStyle';
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    paddingHorizontal: ms(20),
    paddingVertical: mvs(15),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  headerSubTitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.subText,
    marginTop: mvs(4),
  },
  section: {
    marginTop: mvs(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    marginBottom: mvs(10),
  },
  sectionTitle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: ms(8),
    paddingVertical: mvs(2),
    borderRadius: ms(10),
  },
  countText: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.primary,
  },
  listContainer: {
    paddingHorizontal: ms(10),
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(12),
    marginVertical: mvs(4),
    borderRadius: ms(12),
    backgroundColor: COLORS.cardBG,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconContainer: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: COLORS.innerCardBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(15),
  },
  avatarContainer: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(15),
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
  },
  itemLastMessage: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.subText,
    marginTop: mvs(2),
  },
  lastMessagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(2),
    flex: 1,
    minWidth: 0,
  },
  lastMessagePreviewIcon: {
    marginRight: ms(4),
  },
  itemMeta: {
    alignItems: 'flex-end',
  },
  itemTime: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    marginBottom: mvs(5),
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
    fontSize: ms(10),
  },
  emptyContainer: {
    padding: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelHash: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.cardBG,
  }
});

export default styles;
