import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  mainModalView: {
    backgroundColor: COLORS.newModalBG,
    borderTopLeftRadius: ms(16),
    borderTopRightRadius: ms(16),
    paddingBottom: ms(30),
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.innerCardBG,
  },
  title: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.white,
  },
  sectionTitle: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
    marginTop: ms(16),
    marginBottom: ms(12),
    paddingHorizontal: ms(16),
  },
  searchContainer: {
    paddingHorizontal: ms(16),
    marginBottom: ms(12),
    marginTop: ms(12),
  },
  dropdownContainer: {
    paddingHorizontal: ms(16),
    marginBottom: ms(16),
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.innerCardBG,
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownPlaceholder: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  dropdownContent: {
    backgroundColor: COLORS.cardBG,
    borderBottomLeftRadius: ms(8),
    borderBottomRightRadius: ms(8),
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS.border,
    marginTop: -ms(4),
    paddingTop: ms(4),
  },
  listContainer: {
    paddingHorizontal: ms(16),
    height: ms(250),
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.innerCardBG,
  },
  checkbox: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(4),
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  avatar: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: COLORS.innerCardBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  avatarText: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
  },
  userEmail: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.subText,
  },
  permissionsContainer: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(16),
  },
  permissionGroup: {
    marginBottom: ms(24),
  },
  permissionParentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  permissionChildRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: ms(32), // Indentation for children
    marginBottom: ms(12),
  },
  permissionParentText: {
    ...THEME.fontStyle.h5Bold,
    color: COLORS.white,
  },
  permissionChildText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingTop: ms(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.innerCardBG,
    marginTop: ms(16),
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingVertical: ms(6),
    paddingHorizontal: ms(16),
  },
  cancelText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  saveButton: {
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingVertical: ms(6),
    paddingHorizontal: ms(20),
  },
  saveText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
});

export default styles;
