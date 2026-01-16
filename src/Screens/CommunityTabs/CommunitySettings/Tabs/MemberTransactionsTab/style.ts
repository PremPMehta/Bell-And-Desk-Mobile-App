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
    marginBottom: ms(16),
  },
  headerTitle: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
    marginBottom: ms(4),
  },
  sectionDescription: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
  },
  statsContainer: {
    marginBottom: ms(20),
  },
  statsRow: {
    flexDirection: 'row',
  },
  statsCard: {
    flex: 1,
    backgroundColor: COLORS.black,
    borderRadius: ms(8),
    padding: ms(12),
    marginHorizontal: ms(4),
    justifyContent: 'space-between',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // marginBottom: ms(8),
  },
  statsLabel: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
    flex: 1,
  },
  statsIconContainer: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: COLORS.blackGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsValue: {
    ...THEME.fontStyle.h3Bold,
    color: COLORS.white,
  },
  filtersContainer: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(20),
  },
  searchContainer: {
    marginBottom: ms(16),
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterGroup: {
    flex: 1,
    marginRight: ms(12),
  },
  filterGroupLast: {
    flex: 1,
    marginRight: 0,
  },
  filterLabel: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.lightGray,
    marginBottom: ms(8),
  },
  filterButton: {
    borderWidth: 1,
    borderColor: COLORS.outlineGrey,
    borderRadius: ms(8),
    paddingHorizontal: ms(12),
    paddingVertical: ms(10),
    backgroundColor: 'transparent',
  },
  filterButtonText: {
    ...THEME.fontStyle.h5Regular,
    color: COLORS.white,
  },
  tableContainer: {},

  //   Table Row
  tableRow: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    paddingVertical: ms(12),
    paddingHorizontal: ms(16),
    marginBottom: ms(12),
  },
  listTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listTitleInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(12),
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(8),
  },
  avatarText: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
  },
  memberName: {
    ...THEME.fontStyle.h6Bold,
    color: COLORS.white,
    fontSize: ms(11),
  },
  memberEmail: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.lightGray,
    fontSize: ms(9),
  },
  commonListLabel: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.lightGray,
    fontSize: ms(11),
  },
  commonListText: {
    ...THEME.fontStyle.h6Regular,
    color: COLORS.white,
    fontSize: ms(11),
  },
  statusBadge: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: ms(12),
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
  },
  statusText: {
    ...THEME.fontStyle.h7Regular,
    color: COLORS.white,
    fontSize: ms(10),
  },
  space: {
    marginBottom: ms(20),
  },
});

export default styles;
