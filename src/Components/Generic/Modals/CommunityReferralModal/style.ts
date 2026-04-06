import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { fontStyle, ms, vs, width } from '@/Assets/Theme/fontStyle';

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainModalView: {
    backgroundColor: COLORS.cardBG,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingHorizontal: ms(20),
    paddingTop: vs(20),
    paddingBottom: vs(40),
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: ms(10),
  },
  title: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
    marginLeft: ms(10),
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: vs(15),
  },
  contentSection: {
    marginTop: vs(5),
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  label: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
  },
  codeBadge: {
    backgroundColor: 'rgba(52, 168, 83, 0.2)',
    paddingHorizontal: ms(10),
    paddingVertical: vs(4),
    borderRadius: ms(6),
  },
  codeText: {
    ...fontStyle.h6Bold,
    color: '#4ADE80',
  },
  description: {
    ...fontStyle.h5Regular,
    color: COLORS.subText,
    lineHeight: vs(20),
    marginBottom: vs(20),
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(10),
    padding: ms(12),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  linkIcon: {
    marginRight: ms(10),
  },
  linkText: {
    ...fontStyle.h6Regular,
    color: COLORS.white,
    flex: 1,
    marginRight: ms(10),
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: ms(12),
    paddingVertical: vs(8),
    borderRadius: ms(8),
  },
  copyButtonText: {
    ...fontStyle.h6Bold,
    color: COLORS.white,
    marginLeft: ms(5),
  },
  loadingContainer: {
    padding: vs(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
