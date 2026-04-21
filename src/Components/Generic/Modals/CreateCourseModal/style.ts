import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms, vs } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainModalView: {
    backgroundColor: COLORS.cardBG,
    borderTopLeftRadius: ms(16),
    borderTopRightRadius: ms(16),
    paddingTop: ms(20),
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    marginBottom: ms(20),
  },
  title: {
    ...THEME.fontStyle.h2Bold,
  },
  scrollContent: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(30),
  },
  sectionTitle: {
    ...THEME.fontStyle.h3SemiBold,
    marginBottom: ms(4),
  },
  sectionDescription: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
    marginBottom: ms(20),
  },
  inputStyle: {
    // marginBottom: 16,
  },
  descriptionStyle: {
    height: vs(80),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ms(16),
  },
  halfInput: {
    flex: 0.48,
  },
  primaryContentTitle: {
    ...THEME.fontStyle.h3SemiBold,
    marginTop: ms(10),
    marginBottom: ms(16),
  },
  thumbnailLabel: {
    ...THEME.fontStyle.h5Regular,
    marginBottom: ms(10),
    marginTop: ms(10),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(16),
    backgroundColor: COLORS.cardBG,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  cancelButton: {
    flex: 0.48,
    height: vs(32),
    borderRadius: ms(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
  },
  cancelButtonText: {
    ...THEME.fontStyle.h4Medium,
  },
  saveButton: {
    flex: 0.48,
    height: vs(32),
    borderRadius: ms(30),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    ...THEME.fontStyle.h4Medium,
  },
});
