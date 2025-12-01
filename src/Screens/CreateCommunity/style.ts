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
  contentContainer: {
    padding: ms(16),
    paddingBottom: ms(40),
  },
  title: {
    ...THEME.fontStyle.h2Bold,
    color: COLORS.white,
    marginBottom: ms(4),
  },
  subtitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.outlineGrey,
    marginBottom: ms(24),
  },
  sectionTitle: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  mediaHelpText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.outlineGrey,
    marginBottom: ms(12),
  },
  addMediaBtn: {
    flexDirection: 'row',
    gap: ms(8),
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    padding: ms(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMediaBtnText: {
    ...THEME.fontStyle.h4Bold,
  },
  createBtnStyle: {
    backgroundColor: COLORS.primary, // Assuming blue is primary, or use specific hex
    borderRadius: ms(30),
    height: ms(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ms(20),
  },
  createBtnText: {
    ...THEME.fontStyle.h4Bold,
    color: COLORS.white,
  },
  // Overrides for TextInputField to match design (dark bg)
  inputLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
    marginBottom: ms(8),
  },
  inputStyle: {
    backgroundColor: '#1A1A1A',
  },
});

export default styles;
