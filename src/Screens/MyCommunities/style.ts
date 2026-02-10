import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },

  searchContainer: {
    paddingHorizontal: ms(16),
  },

  /* --- Category Tabs --- */
  scrollContainer: {
    overflow: 'hidden',
  },

  categoryContentContainer: {
    paddingHorizontal: ms(16),
    alignItems: 'center',
  },

  categoryBtn: {
    marginRight: ms(10),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: COLORS.ctgColor,
    paddingVertical: ms(6),
    paddingHorizontal: ms(14),
  },

  categoryBtnText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.ctgColor,
  },

  communitiesContainer: {
    marginTop: ms(12),
  },
  contentContainer: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(20),
  },
});

export default styles;
