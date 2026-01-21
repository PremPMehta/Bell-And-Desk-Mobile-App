import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { styles } from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import ScheduleLivestreamModal from '@/Components/Generic/Modals/ScheduleLivestreamModal';

interface Props {
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityLiveStream = ({ onScroll, scrollEventThrottle }: Props) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showSettings, setShowSettings] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);

  const filters = ['All', 'Live', 'Upcoming', 'Completed'];

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Live Streams</Text>
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
      <Text style={styles.filterTitle}>Filter By Status</Text>
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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No upcoming streams available</Text>
      <Text style={styles.emptyStateSubTitle}>
        Check back later for new streams
      </Text>
    </View>
  );

  const handleScheduleSubmit = (data: any) => {
    console.log('Scheduled Stream Data:', data);
    // Add API call logic here when ready
    setIsScheduleModalVisible(false);
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
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
          {renderStreamingMinutes(false)}
          {renderFilters()}
          {renderEmptyState()}
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

