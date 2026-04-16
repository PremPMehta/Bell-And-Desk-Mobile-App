import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './index';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';

const SubscriptionTabSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.headerContainer}>
        <Skeleton
          width={200}
          height={ms(24)}
          borderRadius={ms(4)}
          style={{ marginBottom: ms(8) }}
        />
        <Skeleton width={150} height={ms(16)} borderRadius={ms(4)} />
      </View>

      {/* Subscription Card Skeleton */}
      <View style={styles.subscriptionContainer}>
        <View style={styles.subscriptionHeader}>
          <Skeleton width={180} height={ms(20)} borderRadius={ms(4)} />
          <Skeleton width={ms(18)} height={ms(18)} borderRadius={ms(9)} />
        </View>

        {[1, 2, 3, 4].map(item => (
          <View key={item} style={styles.subscriptionContent}>
            <Skeleton width={120} height={ms(16)} borderRadius={ms(4)} />
            <Skeleton width={100} height={ms(16)} borderRadius={ms(4)} />
          </View>
        ))}

        <View style={styles.manageSubscriptionContainer}>
          <Skeleton
            width="100%"
            height={ms(40)}
            borderRadius={ms(4)}
            style={{ marginTop: ms(12) }}
          />
        </View>
      </View>

      {/* Footer Refresh Button Skeleton */}
      <View style={{ alignSelf: 'flex-end' }}>
        <Skeleton width={100} height={ms(32)} borderRadius={ms(16)} />
      </View>
    </View>
  );
};

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
  subscriptionContainer: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(16),
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  subscriptionContent: {
    flexDirection: 'row',
    gap: ms(12),
    marginTop: ms(12),
  },
  manageSubscriptionContainer: {
    alignItems: 'center',
    marginTop: ms(12),
  },
});

export default SubscriptionTabSkeleton;
