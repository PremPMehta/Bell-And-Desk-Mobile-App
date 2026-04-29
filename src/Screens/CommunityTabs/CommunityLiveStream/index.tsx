import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  ImageBackground,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import ScheduleLivestreamModal from '@/Components/Generic/Modals/ScheduleLivestreamModal';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import CommunityLiveStreamSkeleton from '@/Components/Core/Skeleton/CommunityLiveStreamSkeleton';
import LinearGradient from 'react-native-linear-gradient';
import { AppImages } from '@/Assets/Images';

interface Props {
  communityId?: string;
  userRole?: string;
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityLiveStream = ({
  communityId,
  userRole,
  onScroll,
  scrollEventThrottle,
}: Props) => {
  const navigation = useNavigation<any>();
  const { getLiveStreamList, apiGetLiveStreamListLoading } = useUserApi();
  const [streams, setStreams] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('Upcoming');
  const [showSettings, setShowSettings] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);

  const filters = ['Upcoming', 'Live', 'Completed', 'All'];

  useEffect(() => {
    if (communityId && userRole === 'member') {
      fetchStreams();
    }
  }, [communityId, userRole]);

  const fetchStreams = async () => {
    if (!communityId) {
      return;
    }
    const res = await getLiveStreamList(communityId);
    if (res?.access || res?.streams) {
      setStreams(res?.streams || []);
    }
  };

  const onRefresh = async () => {
    if (communityId && userRole === 'member') {
      await fetchStreams();
    }
  };

  const liveNowStream = useMemo(() => {
    return streams.find(
      stream =>
        stream.status?.toLowerCase() === 'running' ||
        stream.status?.toLowerCase() === 'live',
    );
  }, [streams]);

  const filteredStreams = useMemo(() => {
    if (activeFilter === 'All') return streams;
    const filterLower = activeFilter.toLowerCase();
    return streams.filter(stream => {
      const statusLower = stream.status?.toLowerCase();
      if (filterLower === 'upcoming') {
        return statusLower === 'upcoming' || statusLower === 'scheduled';
      }
      return statusLower === filterLower;
    });
  }, [streams, activeFilter]);

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live':
      case 'running':
        return { label: 'LIVE', color: COLORS.live };
      case 'scheduled':
      case 'upcoming':
        return { label: 'UPCOMING', color: COLORS.upcoming }; // Dark blue from image
      case 'completed':
        return { label: 'COMPLETED', color: COLORS.completed }; // Green from image
      default:
        return { label: status?.toUpperCase(), color: COLORS.gray };
    }
  };

  const formatStreamTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      const timeStr = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      return `${isToday ? 'Today' : date.toLocaleDateString()} • ${timeStr}`;
    } catch (e) {
      return dateString;
    }
  };

  const handleStreamPress = (stream: any) => {
    const status = stream?.status?.toLowerCase();
    const isLive = status === 'live' || status === 'running';

    if (!isLive) {
      const statusLabel =
        status === 'upcoming' || status === 'scheduled'
          ? 'not started yet'
          : 'already ended';
      Alert.alert(
        'Stream Unavailable',
        `This stream has ${statusLabel}. Only live streams can be joined.`,
        [{ text: 'OK' }],
      );
      return;
    }

    navigation.navigate('LiveStream', { streamData: stream });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Live Streams</Text>
      {userRole !== 'member' && (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowSettings(true)}
          >
            <Icon name="Settings" color={COLORS.white} size={16} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setIsScheduleModalVisible(true)}
          >
            <Icon name="CirclePlus" color={COLORS.white} size={16} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderSettingsHeader = () => (
    <View style={styles.settingsHeader}>
      <TouchableOpacity
        onPress={() => setShowSettings(false)}
        style={styles.backButton}
      >
        <Icon name="ChevronLeft" color={COLORS.white} size={18} />
      </TouchableOpacity>
      <Text style={styles.settingsHeaderTitle}>Live Stream Settings</Text>
    </View>
  );

  const renderStreamingMinutes = (isSettings = false) => (
    <View style={styles.streamingCard}>
      {isSettings ? (
        <>
          <View style={styles.summaryHeaderRow}>
            <View style={styles.summaryTitleSection}>
              <Text style={[styles.cardTitle, { marginBottom: 0 }]}>
                Streaming Minutes
              </Text>
              <Text style={styles.cardSubTitle}>1 Community</Text>
            </View>
            <View style={styles.summaryMetricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>100 Min</Text>
                <Text style={styles.metricLabel}>Total Minutes</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>500</Text>
                <Text style={styles.metricLabel}>Viewer Limit</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardDivider} />
        </>
      ) : (
        <>
          <Text style={styles.cardTitle}>Streaming Minutes</Text>
          <View style={styles.cardDivider} />
        </>
      )}

      {isSettings && <Text style={styles.bucketUsageLabel}>Bucket Usage</Text>}

      <View style={styles.progressInfoRow}>
        <Text style={styles.progressText}>1 / 100 Minutes</Text>
        {isSettings ? (
          <Text style={styles.progressRemainingText}>99 Minutes Remaining</Text>
        ) : (
          <Text style={styles.progressRemainingText}>99 Remaining</Text>
        )}
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: '1%' }]} />
      </View>
      {!isSettings && (
        <View style={styles.planInfoRow}>
          <Text style={styles.planText}>Plan: Ring The Bell</Text>
          <Text style={styles.viewerLimitText}>Viewer Limit: 500</Text>
        </View>
      )}
    </View>
  );

  const renderCommunitiesUsage = () => (
    <View>
      <View style={styles.communitiesHeader}>
        <Text style={styles.communitiesTitle}>Communities</Text>
        <Text style={styles.communitiesCountText}>2 Community</Text>
      </View>
      <View style={styles.communityGrid}>
        {[
          {
            name: 'CryptoManji Academy',
            allocated: '100 Min',
            used: '1 Min',
            viewerLimit: '500',
          },
          {
            name: 'Bell N Desk',
            allocated: '100 Min',
            used: '1 Min',
            viewerLimit: '500',
          },
        ].map((community, index) => (
          <View key={index} style={styles.communityCard}>
            <Text style={styles.communityName} numberOfLines={1}>
              {community.name}
            </Text>
            <View style={styles.communityCardDivider} />
            <View style={styles.usageMetricsGrid}>
              <View style={styles.usageMetricBox}>
                <Text style={styles.usageMetricValue}>
                  {community.allocated}
                </Text>
                <Text style={styles.usageMetricLabel}>Allocated</Text>
              </View>
              <View style={styles.usageMetricBox}>
                <Text style={styles.usageMetricValue}>{community.used}</Text>
                <Text style={styles.usageMetricLabel}>Used</Text>
              </View>
              <View style={styles.usageMetricBox}>
                <Text style={styles.usageMetricValue}>{community.used}</Text>
                <Text style={styles.usageMetricLabel}>Used</Text>
              </View>
              <View style={styles.usageMetricBox}>
                <Text style={styles.usageMetricValue}>
                  {community.viewerLimit}
                </Text>
                <Text style={styles.usageMetricLabel}>Viewer Limit</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.buyAddOnButton}>
              <Icon name="CirclePlus" color={COLORS.white} size={14} />
              <Text style={styles.buyAddOnText}>Buy AddOns</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filterSection}>
      {/* <Text style={styles.filterTitle}>Filter By Status</Text> */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.activeFilterChip,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === filter && styles.activeFilterChipText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderEmptyState = () => {
    let message = 'No streams available';
    if (activeFilter === 'Live') {
      message = 'No live streams available';
    } else if (activeFilter === 'Upcoming') {
      message = 'No upcoming streams available';
    } else if (activeFilter === 'Completed') {
      message = 'No completed streams available';
    }

    return (
      <View style={styles.emptyState}>
        <Image source={AppImages.stream} style={styles.emptyStateImage} />
        <Text style={styles.emptyStateTitle}>{message}</Text>
        <Text style={styles.emptyStateSubTitle}>
          Check back later for new streams
        </Text>
      </View>
    );
  };

  const handleScheduleSubmit = (data: any) => {
    console.log('Scheduled Stream Data:', data);
    // Add API call logic here when ready
    setIsScheduleModalVisible(false);
  };

  const renderLiveNowCard = () => {
    if (!liveNowStream) return null;

    return (
      <View style={styles.liveNowCard}>
        <ImageBackground
          source={{
            uri:
              liveNowStream.thumbnailUrl ||
              'https://via.placeholder.com/800x400',
          }}
          style={styles.liveNowBg}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.95)']}
            style={styles.liveNowGradient}
          >
            <View style={styles.liveNowContent}>
              <View style={styles.liveNowBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveNowText}>LIVE NOW</Text>
              </View>

              <View>
                <Text style={styles.liveNowTitle} numberOfLines={2}>
                  {liveNowStream.title}
                </Text>
                <Text style={styles.liveNowDescription} numberOfLines={1}>
                  {liveNowStream.description}
                </Text>
                <TouchableOpacity
                  style={styles.watchNowButton}
                  onPress={() => handleStreamPress(liveNowStream)}
                >
                  <Icon
                    name="Play"
                    color={COLORS.white}
                    size={16}
                    fill={COLORS.white}
                  />
                  <Text style={styles.watchNowText}>Watch Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      refreshControl={
        <RefreshControl
          refreshing={apiGetLiveStreamListLoading}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      {showSettings ? (
        <>
          {renderSettingsHeader()}
          {renderStreamingMinutes(true)}
          {renderCommunitiesUsage()}
        </>
      ) : (
        <>
          {renderHeader()}
          {renderLiveNowCard()}
          {!userRole || userRole !== 'member' ? (
            <>
              {renderStreamingMinutes(false)}
              {renderFilters()}
              {renderEmptyState()}
            </>
          ) : (
            <View style={styles.streamList}>
              {apiGetLiveStreamListLoading ? (
                <CommunityLiveStreamSkeleton />
              ) : (
                <>
                  {renderFilters()}
                  {filteredStreams.length > 0
                    ? filteredStreams.map(stream => {
                        const statusConfig = getStatusConfig(stream.status);
                        return (
                          <TouchableOpacity
                            key={stream._id}
                            style={styles.streamCard}
                            onPress={() => handleStreamPress(stream)}
                          >
                            <View style={styles.thumbnailContainer}>
                              <Image
                                source={{
                                  uri:
                                    stream.thumbnailUrl ||
                                    'https://via.placeholder.com/400x200',
                                }}
                                style={styles.thumbnail}
                              />
                              <View
                                style={[
                                  styles.statusBadge,
                                  { backgroundColor: statusConfig.color },
                                ]}
                              >
                                <Text style={styles.statusText}>
                                  {statusConfig.label}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.streamInfo}>
                              <Text style={styles.streamTitle}>
                                {stream.title}
                              </Text>
                              <Text style={styles.streamDescription}>
                                {stream.description}
                              </Text>
                              <View style={styles.timeRow}>
                                <Icon
                                  name="Calendar"
                                  size={16}
                                  color={COLORS.gray}
                                />
                                <Text style={styles.timeText}>
                                  {formatStreamTime(stream.scheduledTime)}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    : renderEmptyState()}
                </>
              )}
            </View>
          )}
        </>
      )}

      <ScheduleLivestreamModal
        visible={isScheduleModalVisible}
        onClose={() => setIsScheduleModalVisible(false)}
        onSubmit={handleScheduleSubmit}
      />
    </Animated.ScrollView>
  );
};

export default CommunityLiveStream;
