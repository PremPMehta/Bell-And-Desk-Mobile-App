import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CommunityCoursesSkeleton = () => {
  const renderSkeletonCard = (key: number) => (
    <View key={key} style={styles.cardContainer}>
      {/* Banner Skeleton */}
      <Skeleton
        height={ms(140)}
        width="95%"
        style={styles.bannerImage}
        borderRadius={ms(5)}
      />

      {/* Tags Skeleton */}
      <View style={styles.tagsContainer}>
        <Skeleton width={ms(80)} height={ms(24)} borderRadius={ms(12)} />
        <Skeleton width={ms(60)} height={ms(24)} borderRadius={ms(12)} />
        <Skeleton width={ms(70)} height={ms(24)} borderRadius={ms(12)} />
      </View>

      {/* Content Skeleton */}
      <View style={styles.contentContainer}>
        <Skeleton width="60%" height={ms(20)} style={styles.title} />
        <View style={styles.descriptionContainer}>
          <Skeleton
            width="100%"
            height={ms(12)}
            style={styles.descriptionLine}
          />
          <Skeleton
            width="90%"
            height={ms(12)}
            style={styles.descriptionLine}
          />
          <Skeleton
            width="40%"
            height={ms(12)}
            style={styles.descriptionLine}
          />
        </View>

        {/* Community Info Skeleton */}
        <View style={styles.communityContainer}>
          <Skeleton width={ms(30)} height={ms(30)} borderRadius={ms(30)} />
          <Skeleton width={ms(120)} height={ms(16)} />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Search and Create Button Row */}
      <View style={styles.headerRow}>
        <Skeleton
          height={ms(45)}
          width="70%"
          borderRadius={ms(20)}
          style={styles.searchBar}
        />
        <Skeleton
          height={ms(45)}
          width={ms(90)}
          borderRadius={ms(25)}
          style={styles.createBtn}
        />
      </View>

      {[1, 2, 3].map(i => renderSkeletonCard(i))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: ms(20),
    paddingHorizontal: ms(16),
  },
  cardContainer: {
    backgroundColor: COLORS.cardBG,
    borderRadius: ms(5),
    overflow: 'hidden',
    marginBottom: ms(16),
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bannerImage: {
    alignSelf: 'center',
    marginTop: ms(10),
  },
  tagsContainer: {
    flexDirection: 'row',
    marginLeft: ms(10),
    marginTop: ms(12),
    gap: ms(8),
  },
  contentContainer: {
    paddingHorizontal: ms(10),
    paddingVertical: ms(12),
  },
  title: {
    marginBottom: ms(12),
  },
  descriptionContainer: {
    gap: ms(6),
    marginBottom: ms(16),
  },
  descriptionLine: {
    // marginBottom: ms(4),
  },
  communityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(16),
  },
  searchBar: {
    // flex: 1,
  },
  createBtn: {
    // marginLeft: ms(12),
  },
});

export default CommunityCoursesSkeleton;
