import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { fontStyle, height, ms, mvs, sc, vs } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.header,
  },
  innerContainer: {
    flexGrow: 1,
    paddingHorizontal: sc(15),
    paddingTop: vs(20),
  },
  card: {
    backgroundColor: COLORS.cardGridBG, // A dark navy/black color seen in the attachment
    borderRadius: ms(12),
    padding: ms(20),
    borderWidth: 1,
    borderColor: '#1E293B', // Subtle border
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: vs(10),
  },
  editIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ms(20),
    padding: ms(8),
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ms(20),
    padding: ms(8),
    marginRight: sc(10),
  },
  closeIconContainer: {
    backgroundColor: '#EF4444', // Red for close/cancel
    borderRadius: ms(20),
    padding: ms(8),
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: vs(30),
  },
  avatarWrapper: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    borderWidth: 2,
    borderColor: COLORS.white,
    padding: ms(2),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: ms(50),
  },
  withoutAvatar: {
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withoutAvatarText: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#334155',
    borderRadius: ms(15),
    padding: ms(6),
    borderWidth: 2,
    borderColor: COLORS.cardGridBG,
  },
  userName: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
    marginTop: vs(12),
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: vs(20),
  },
  label: {
    ...fontStyle.h5Regular,
    color: COLORS.gray,
    marginBottom: vs(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.header,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: sc(12),
    height: vs(50),
  },
  inputIcon: {
    marginRight: sc(10),
  },
  input: {
    flex: 1,
    ...fontStyle.h4Regular,
    color: COLORS.white,
  },
  helpText: {
    ...fontStyle.h7Regular,
    color: COLORS.gray,
    marginTop: vs(5),
    opacity: 0.7,
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: vs(20),
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.updateBtn,
    paddingVertical: vs(8),
    paddingHorizontal: sc(20),
    borderRadius: ms(8),
    marginRight: sc(10),
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: sc(20),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: COLORS.updateBtn,
  },
  buttonText: {
    ...fontStyle.h4Medium,
    color: COLORS.white,
    marginLeft: sc(8),
  },
});

export default styles;
