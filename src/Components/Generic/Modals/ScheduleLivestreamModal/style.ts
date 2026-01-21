import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { fontStyle, ms, mvs, vs } from '@/Assets/Theme/fontStyle';

export default StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainModalView: {
    backgroundColor: '#151515',
    borderTopLeftRadius: ms(16),
    borderTopRightRadius: ms(16),
    paddingBottom: vs(20),
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingVertical: mvs(16),
    borderBottomWidth: 1,
    borderBottomColor: '#252525',
  },
  title: {
    ...fontStyle.h3Regular,
    color: COLORS.white,
  },
  formContainer: {
    paddingHorizontal: ms(20),
    paddingTop: mvs(16),
    // marginTop: mvs(20),
  },
  label: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
    marginBottom: mvs(8),
  },
  inputStyle: {
    marginBottom: mvs(16),
  },
  descriptionStyle: {
    height: vs(120),
  },
  thumbnailContainer: {
    marginBottom: mvs(20),
  },
  thumbnailLabel: {
    ...fontStyle.h5Regular,
    color: COLORS.gray,
    marginBottom: mvs(8),
  },
  uploadBox: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: ms(8),
    height: vs(180),
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  uploadText: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
    marginTop: mvs(12),
  },
  uploadSubText: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
    marginTop: mvs(4),
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: ms(8),
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: ms(10),
    right: ms(10),
    backgroundColor: COLORS.primary,
    borderRadius: ms(20),
    padding: ms(5),
    zIndex: 1,
  },
  dateInputContainer: {
    marginBottom: mvs(16),
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    height: vs(40),
  },
  dateInputText: {
    ...fontStyle.h5Regular,
    color: COLORS.white,
  },
  dateInputPlaceholder: {
    ...fontStyle.h5Regular,
    color: COLORS.outlineGrey,
  },
  helperText: {
    ...fontStyle.h7Regular,
    color: COLORS.gray,
    marginTop: mvs(8),
    lineHeight: ms(14),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(20),
    marginBottom: mvs(24),
  },
  checkbox: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(4),
    borderWidth: 1,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  checkboxLabel: {
    ...fontStyle.h5Regular,
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ms(20),
    marginTop: mvs(10),
  },
  cancelButton: {
    paddingVertical: mvs(12),
    paddingHorizontal: ms(32),
    borderRadius: ms(30),
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  cancelButtonText: {
    ...fontStyle.h5Medium,
    color: COLORS.white,
  },
  scheduleButton: {
    paddingVertical: mvs(12),
    paddingHorizontal: ms(24),
    borderRadius: ms(30),
    // backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  scheduleButtonText: {
    ...fontStyle.h5Medium,
    color: COLORS.white,
  },
});
