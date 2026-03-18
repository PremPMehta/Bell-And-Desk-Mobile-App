import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

export const StatsSkeleton = () => (
  <View style={styles.statsContainer}>
    <View style={styles.statsRow}>
      <Skeleton width="48%" height={ms(80)} borderRadius={ms(8)} style={styles.statsCard} />
      <Skeleton width="48%" height={ms(80)} borderRadius={ms(8)} style={styles.statsCard} />
    </View>
    <View style={[styles.statsRow, { marginTop: ms(10) }]}>
      <Skeleton width="48%" height={ms(80)} borderRadius={ms(8)} style={styles.statsCard} />
      <Skeleton width="48%" height={ms(80)} borderRadius={ms(8)} style={styles.statsCard} />
    </View>
  </View>
);

export const TransactionListSkeleton = () => (
  <View>
    {[1, 2, 3, 4, 5].map(i => (
      <View key={i} style={styles.tableRow}>
        <View style={styles.listTitleContainer}>
          <View style={styles.memberInfo}>
            <Skeleton
              width={ms(32)}
              height={ms(32)}
              borderRadius={ms(16)}
              style={styles.avatar}
            />
            <View>
              <Skeleton width={ms(100)} height={ms(14)} style={styles.name} />
              <Skeleton width={ms(150)} height={ms(10)} />
            </View>
          </View>
          <Skeleton width={ms(60)} height={ms(20)} borderRadius={ms(12)} />
        </View>
        {[1, 2, 3, 4].map(j => (
          <View key={j} style={styles.listTitleInnerContainer}>
            <Skeleton width={ms(80)} height={ms(12)} />
            <Skeleton width={ms(60)} height={ms(12)} />
          </View>
        ))}
      </View>
    ))}
  </View>
);

const MemberTransactionsSkeleton = () => {
  return (
    <View style={styles.container}>
      <StatsSkeleton />
      <View style={styles.filtersContainer}>
        <Skeleton width="100%" height={ms(40)} borderRadius={ms(8)} style={styles.searchBar} />
        <View style={styles.filterRow}>
          <Skeleton width="30%" height={ms(50)} borderRadius={ms(8)} />
          <Skeleton width="30%" height={ms(50)} borderRadius={ms(8)} />
          <Skeleton width="30%" height={ms(50)} borderRadius={ms(8)} />
        </View>
      </View>
      <TransactionListSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsContainer: {
    marginBottom: ms(20),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsCard: {
    marginHorizontal: ms(0),
  },
  filtersContainer: {
    backgroundColor: COLORS.innerCardBG,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(20),
  },
  searchBar: {
    marginBottom: ms(16),
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
    marginBottom: ms(12),
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: ms(8),
  },
  name: {
    marginBottom: ms(4),
  },
  listTitleInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: ms(12),
  },
});

export default MemberTransactionsSkeleton;
