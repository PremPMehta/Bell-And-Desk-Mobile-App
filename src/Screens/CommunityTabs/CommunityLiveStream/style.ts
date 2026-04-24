import { StyleSheet } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { fontStyle, ms, mvs, sc, vs } from '@/Assets/Theme/fontStyle';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: ms(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mvs(20),
    marginBottom: mvs(20),
  },
  headerTitle: {
    ...fontStyle.h2Bold,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: ms(30),
    padding: ms(6),
    marginLeft: ms(10),
  },
  streamingCard: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    padding: ms(16),
    marginBottom: mvs(24),
  },
  cardTitle: {
    ...fontStyle.h4Medium,
    color: COLORS.white,
    marginBottom: mvs(16),
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.whiteLight,
    marginBottom: mvs(16),
  },
  progressInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(10),
  },
  progressText: {
    ...fontStyle.h5Regular,
    color: COLORS.white,
  },
  progressRemainingText: {
    ...fontStyle.h5Regular,
    color: COLORS.white,
  },
  progressBarContainer: {
    height: mvs(12),
    backgroundColor: COLORS.whiteLight,
    borderRadius: ms(6),
    overflow: 'hidden',
    marginBottom: mvs(16),
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  planInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planText: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
  },
  viewerLimitText: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
  },
  filterSection: {
    marginBottom: mvs(24),
  },
  filterTitle: {
    ...fontStyle.h4Medium,
    color: COLORS.white,
    marginBottom: mvs(16),
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingVertical: mvs(4),
    paddingHorizontal: ms(14),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: ms(10),
  },
  activeFilterChip: {
    backgroundColor: COLORS.innerCardBG,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    ...fontStyle.h5Regular,
    color: COLORS.gray,
  },
  activeFilterChipText: {
    color: COLORS.white,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(20),
    marginBottom: mvs(20),
  },
  backButton: {
    marginRight: ms(12),
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(30),
    padding: ms(6),
  },
  settingsHeaderTitle: {
    ...fontStyle.h2Bold,
    color: COLORS.white,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: mvs(16),
  },
  summaryTitleSection: {
    flex: 1,
  },
  cardSubTitle: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
    marginTop: mvs(4),
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'flex-end',
    marginLeft: ms(24),
  },
  metricDivider: {
    width: 1,
    height: mvs(30),
    backgroundColor: COLORS.whiteLight,
    marginLeft: ms(24),
  },
  metricValue: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
  },
  metricLabel: {
    ...fontStyle.h7Regular,
    color: COLORS.gray,
    marginTop: mvs(2),
  },
  bucketUsageLabel: {
    ...fontStyle.h5Regular,
    color: COLORS.white,
    marginBottom: mvs(10),
  },
  communitiesHeader: {
    // marginTop: mvs(24),
    marginBottom: mvs(16),
  },
  communitiesTitle: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
  },
  communitiesCountText: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
    marginTop: mvs(4),
  },
  communityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  communityCard: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(8),
    padding: ms(16),
    width: '48%',
    marginBottom: mvs(16),
  },
  communityName: {
    ...fontStyle.h5Bold,
    color: COLORS.white,
    marginBottom: mvs(16),
  },
  communityCardDivider: {
    height: 1,
    backgroundColor: COLORS.whiteLight,
    marginBottom: mvs(16),
  },
  usageMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  usageMetricBox: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    width: '48%',
    marginBottom: mvs(10),
  },
  usageMetricValue: {
    ...fontStyle.h6Bold,
    color: COLORS.white,
  },
  usageMetricLabel: {
    ...fontStyle.h7Regular,
    color: COLORS.gray,
    marginTop: mvs(4),
  },
  buyAddOnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: ms(20),
    paddingVertical: mvs(8),
    marginTop: mvs(8),
  },
  buyAddOnText: {
    ...fontStyle.h6Medium,
    color: COLORS.white,
    marginLeft: ms(6),
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(100),
  },
  emptyStateImage: {
    width: ms(45),
    height: ms(45),
    marginBottom: mvs(16),
  },
  emptyStateTitle: {
    ...fontStyle.h3Bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: mvs(8),
  },
  emptyStateSubTitle: {
    ...fontStyle.h5Regular,
    color: COLORS.gray,
    textAlign: 'center',
  },
  streamList: {
    paddingBottom: mvs(20),
  },
  streamCard: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    overflow: 'hidden',
    marginBottom: mvs(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thumbnailContainer: {
    width: '100%',
    height: vs(180),
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: mvs(12),
    left: ms(12),
    paddingHorizontal: ms(10),
    paddingVertical: mvs(4),
    borderRadius: ms(6),
  },
  statusText: {
    ...fontStyle.h6Bold,
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  streamInfo: {
    padding: ms(16),
  },
  streamTitle: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
    marginBottom: mvs(4),
  },
  streamDescription: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
    marginBottom: mvs(12),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...fontStyle.h6Regular,
    color: COLORS.gray,
    marginLeft: ms(8),
  },
  liveNowCard: {
    width: '100%',
    height: vs(150),
    borderRadius: ms(12),
    overflow: 'hidden',
    marginBottom: mvs(24),
    backgroundColor: COLORS.cardBG,
  },
  liveNowBg: {
    width: '100%',
    height: '100%',
  },
  liveNowGradient: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  liveNowContent: {
    padding: ms(16),
  },
  liveNowBadge: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    paddingHorizontal: ms(8),
    paddingVertical: mvs(6),
    borderRadius: ms(30),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  liveDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: COLORS.white,
    marginRight: ms(8),
  },
  liveNowText: {
    ...fontStyle.h6Bold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  liveNowTitle: {
    ...fontStyle.h2Bold,
    color: COLORS.white,
    marginBottom: mvs(8),
    lineHeight: mvs(32),
  },
  liveNowDescription: {
    ...fontStyle.h5Regular,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: mvs(20),
  },
  watchNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.red,
    alignSelf: 'flex-start',
    paddingHorizontal: ms(24),
    paddingVertical: mvs(12),
    borderRadius: ms(30),

    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  watchNowText: {
    ...fontStyle.h4Bold,
    color: COLORS.white,
    marginLeft: ms(10),
  },
});
