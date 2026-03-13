import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginTop: ms(16),
    padding: ms(12),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: ms(16),
  },
  headerInnerRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  headerTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  sectionDescription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    width: sc(180),
    marginTop: ms(8),
  },

  list: {
    marginTop: ms(16),
  },
  addModeratorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(24),
    paddingHorizontal: ms(12),
    paddingVertical: ms(4),
  },
  addModerator: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.lightGray,
  },
  // Card Styles
  card: {
    backgroundColor: COLORS.black,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: ms(16),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  avatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: ms(20),
  },
  avatarText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    flexWrap: 'wrap',
  },
  name: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  email: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.placeholder,
    marginTop: ms(2),
  },
  roleBadge: {
    backgroundColor: COLORS.border,
    borderRadius: ms(12),
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
  },
  roleText: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.white,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: ms(12),
  },
  detailsContainer: {
    gap: ms(12),
  },
  permissionsContainer: {
    gap: ms(4),
  },
  label: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.placeholder,
  },
  permissionsText: {
    ...THEME.fontStyle.h6Medium,
    color: COLORS.white,
    lineHeight: ms(20),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(16),
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  activeBadge: {
    backgroundColor: COLORS.border,
    borderRadius: ms(12),
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
  },
  activeText: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.white,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: ms(16),
  },
  actionButton: {
    padding: ms(6),
    borderRadius: ms(20),
    backgroundColor: COLORS.border,
  },
  // Confirmation Modal Styles
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainModalView: {
    backgroundColor: COLORS.cardBG,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingTop: ms(16),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingBottom: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  modalBody: {
    padding: ms(20),
  },
  modalMessage: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.white,
    lineHeight: ms(22),
  },
  boldName: {
    ...THEME.fontStyle.h4Bold,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: ms(20),
    gap: ms(16),
  },
  modalCancelText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.placeholder,
  },
  modalRemoveButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: ms(20),
    paddingVertical: ms(10),
    borderRadius: ms(8),
  },
  modalRemoveText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
});

export default styles;
