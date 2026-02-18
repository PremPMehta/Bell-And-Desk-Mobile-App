import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms, width } from '@/Assets/Theme/fontStyle';

const CARD_WIDTH = (width - 50) / 2;

const HomeSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Video Banner Skeleton */}
      <Skeleton height={ms(200)} borderRadius={0} style={styles.videoBanner} />

      <View style={styles.innerContainer}>
        {/* Carousel/Hero Skeleton */}
        <Skeleton
          height={ms(220)}
          borderRadius={ms(12)}
          style={styles.carousel}
        />

        {/* Search Bar Skeleton */}
        <Skeleton
          height={ms(50)}
          borderRadius={ms(25)}
          style={styles.searchBar}
        />

        {/* Categories Header Skeleton */}
        <Skeleton
          width={ms(120)}
          height={ms(24)}
          style={styles.sectionHeader}
        />

        {/* Categories Tabs Skeleton */}
        <View style={styles.row}>
          {[1, 2, 3, 4].map(i => (
            <Skeleton
              key={i}
              width={ms(80)}
              height={ms(32)}
              borderRadius={ms(16)}
              style={styles.categoryTab}
            />
          ))}
        </View>

        {/* Communities Header Skeleton */}
        <Skeleton
          width={ms(120)}
          height={ms(24)}
          style={styles.sectionHeader}
        />

        {/* Communities Grid Skeleton */}
        <View style={styles.grid}>
          {[1, 2, 4, 5].map(i => (
            <View key={i} style={styles.cardContainer}>
              <Skeleton
                width={CARD_WIDTH}
                height={ms(180)}
                borderRadius={ms(10)}
              />
              <Skeleton
                width={ms(40)}
                height={ms(16)}
                borderRadius={ms(8)}
                style={styles.cardCategory}
              />
              <Skeleton
                width={ms(100)}
                height={ms(20)}
                style={styles.cardTitle}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoBanner: {
    width: '100%',
    marginBottom: ms(16),
  },
  innerContainer: {
    paddingHorizontal: ms(16),
  },
  carousel: {
    marginBottom: ms(24),
  },
  searchBar: {
    marginBottom: ms(24),
  },
  sectionHeader: {
    marginBottom: ms(16),
  },
  row: {
    flexDirection: 'row',
    marginBottom: ms(24),
  },
  categoryTab: {
    marginRight: ms(10),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    marginBottom: ms(20),
  },
  cardCategory: {
    marginTop: ms(12),
    marginBottom: ms(8),
  },
  cardTitle: {
    marginBottom: ms(4),
  },
});

export default HomeSkeleton;
