import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './index';
import { ms, mvs, vs } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CommunityLiveStreamSkeleton = () => {
  const renderCardSkeleton = (key: number) => (
    <View key={key} style={styles.card}>
      <Skeleton width="100%" height={vs(180)} />
      <View style={styles.info}>
        <Skeleton width="60%" height={mvs(20)} style={{ marginBottom: mvs(8) }} />
        <Skeleton width="40%" height={mvs(16)} style={{ marginBottom: mvs(16) }} />
        <View style={styles.timeRow}>
          <Skeleton width={ms(16)} height={ms(16)} borderRadius={ms(8)} />
          <Skeleton width={ms(120)} height={ms(14)} style={{ marginLeft: ms(8) }} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterRow}>
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} width={ms(80)} height={mvs(32)} borderRadius={ms(16)} style={{ marginRight: ms(10) }} />
        ))}
      </View>

      {/* Cards List */}
      {[1, 2].map(i => renderCardSkeleton(i))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: mvs(10),
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: mvs(24),
  },
  card: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    overflow: 'hidden',
    marginBottom: mvs(16),
  },
  info: {
    padding: ms(16),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CommunityLiveStreamSkeleton;
