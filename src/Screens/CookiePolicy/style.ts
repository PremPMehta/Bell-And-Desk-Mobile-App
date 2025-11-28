import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  content: {
    padding: ms(20),
  },

  /* Typography */
  title: {
    ...THEME.fontStyle.h1Bold,
    marginBottom: 8,
  },
  updated: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.termsColor,
    marginBottom: ms(20),
  },
  h2: {
    ...THEME.fontStyle.h2Bold,
    marginTop: ms(25),
    marginBottom: ms(10),
  },
  h3: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.termsColor,
    marginTop: ms(20),
    marginBottom: ms(10),
  },
  p: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.termsColor,
    lineHeight: ms(20),
    marginBottom: ms(12),
  },
  bold: {
    ...THEME.fontStyle.h4Bold,
  },

  /* Lists */
  ul: {
    marginBottom: ms(15),
  },
  li: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.termsColor,
    marginBottom: ms(6),
    lineHeight: ms(20),
  },

  /* Links */
  link: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.primary,
    marginBottom: ms(8),
  },

  /* Table */
  table: {
    borderWidth: ms(1),
    borderColor: COLORS.border, // #333
    borderRadius: ms(8),
    marginVertical: ms(15),
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBG, // #1c1c1c
    padding: ms(10),
  },
  tableHeader: {
    ...THEME.fontStyle.h5SemiBold,
    color: COLORS.lightGray,
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    padding: ms(10),
    borderTopWidth: ms(1),
    borderColor: COLORS.border,
  },
  tableCell: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.termsColor,
    flex: 1,
  },

  /* Note Box */
  noteBox: {
    backgroundColor: COLORS.cardBG,
    padding: ms(12),
    borderLeftWidth: ms(4),
    borderLeftColor: COLORS.primary,
    borderRadius: ms(6),
    marginVertical: ms(15),
  },
  noteText: {
    ...THEME.fontStyle.h4Regular,
    color: COLORS.termsColor,
    lineHeight: ms(18),
  },

  /* Contact Box */
  contactBox: {
    backgroundColor: COLORS.cardBG,
    padding: ms(15),
    borderRadius: ms(8),
    marginTop: ms(10),
  },
});

export default styles;
