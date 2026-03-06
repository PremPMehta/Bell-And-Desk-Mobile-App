import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CommunityMembersSkeleton = () => {
  const renderSkeletonItem = (key: number) => (
    <View key={key} style={styles.itemContainer}>
      <View style={styles.topRow}>
        <View style={styles.userInfo}>
          {/* Avatar Skeleton */}
          <Skeleton
            width={ms(40)}
            height={ms(40)}
            borderRadius={ms(20)}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            {/* Name Skeleton */}
            <Skeleton width={ms(120)} height={ms(16)} style={styles.name} />
            {/* Email Skeleton */}
            <Skeleton width={ms(150)} height={ms(12)} />
          </View>
        </View>
        {/* Block Button Skeleton */}
        <Skeleton width={ms(35)} height={ms(35)} borderRadius={ms(8)} />
      </View>

      {/* Separator Skeleton */}
      <View style={styles.separator} />

      <View style={styles.bottomRow}>
        <View>
          {/* Joined Label/Date Skeleton */}
          <Skeleton width={ms(40)} height={ms(10)} style={styles.joinedLabel} />
          <Skeleton width={ms(100)} height={ms(14)} />
        </View>

        <View style={styles.badgesContainer}>
          {/* Badge Skeletons */}
          <Skeleton width={ms(60)} height={ms(24)} borderRadius={ms(12)} />
          <Skeleton
            width={ms(60)}
            height={ms(24)}
            borderRadius={ms(12)}
            style={styles.ownerBadge}
          />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {[1, 2, 3, 4, 5, 6].map(i => renderSkeletonItem(i))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: ms(16),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: ms(12),
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    marginBottom: ms(8),
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: ms(16),
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinedLabel: {
    marginBottom: ms(4),
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerBadge: {
    marginLeft: ms(8),
  },
});

export default CommunityMembersSkeleton;
