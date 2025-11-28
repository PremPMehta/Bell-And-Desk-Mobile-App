import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: ms(16),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: ms(50),
    paddingBottom: ms(16),
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  scrollContent: {
    paddingBottom: ms(40),
  },
  pageTitle: {
    ...THEME.fontStyle.h2Bold,
    textAlign: 'center',
    marginTop: ms(20),
    marginBottom: ms(25),
  },

  accordionContainer: {
    backgroundColor: COLORS.searchBarBG,
    borderRadius: ms(12),
    marginBottom: ms(12),
  },

  accordionHeader: {
    padding: ms(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  accordionTitle: {
    ...THEME.fontStyle.h4SemiBold,
    flex: 1,
    marginRight: ms(10),
  },

  accordionBody: {
    padding: ms(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  description: {
    ...THEME.fontStyle.h5Regular,
    lineHeight: ms(20),
    marginBottom: ms(12),
  },

  countryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  countryItem: {
    ...THEME.fontStyle.h5Regular,
    width: '50%',
    marginBottom: ms(6),
  },
});

export default styles;
