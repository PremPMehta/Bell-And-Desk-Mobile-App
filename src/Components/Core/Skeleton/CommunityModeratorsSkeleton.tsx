import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CommunityModeratorsSkeleton = () => {
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
        {/* Switch Skeleton */}
        <Skeleton width={ms(40)} height={ms(24)} borderRadius={ms(12)} />
      </View>

      {/* Separator Skeleton */}
      <View style={styles.separator} />

      <View style={styles.detailsRow}>
        {/* Permissions Label/Text Skeleton */}
        <View style={styles.permissionItem}>
          <Skeleton width={ms(80)} height={ms(12)} style={styles.label} />
          <Skeleton width={ms(200)} height={ms(14)} />
        </View>
      </View>

      <View style={styles.footerRow}>
        {/* Action Buttons Skeleton */}
        <Skeleton
          width={ms(60)}
          height={ms(32)}
          borderRadius={ms(8)}
          style={styles.actionBtn}
        />
        <Skeleton width={ms(60)} height={ms(32)} borderRadius={ms(8)} />
      </View>
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {[1, 2, 3, 4].map(i => renderSkeletonItem(i))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: ms(16),
  },
  itemContainer: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(12),
    padding: ms(16),
    marginBottom: ms(16),
    borderWidth: 1,
    borderColor: COLORS.border,
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
  detailsRow: {
    marginBottom: ms(16),
  },
  permissionItem: {
    marginBottom: ms(8),
  },
  label: {
    marginBottom: ms(6),
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionBtn: {
    marginRight: ms(12),
  },
});

export default CommunityModeratorsSkeleton;
