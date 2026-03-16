import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

const CouponsSkeleton = () => {
  const renderCouponSkeleton = (key: number) => (
    <View key={key} style={styles.couponContainer}>
      <View style={styles.couponHeader}>
        <View style={styles.couponCodeContainer}>
          <Skeleton width={ms(18)} height={ms(18)} borderRadius={ms(4)} />
          <Skeleton width={ms(60)} height={ms(20)} />
          <Skeleton width={ms(40)} height={ms(20)} />
        </View>
        <Skeleton width={ms(50)} height={ms(20)} borderRadius={ms(12)} />
        <View style={styles.editDeleteContainer}>
          <Skeleton width={ms(30)} height={ms(30)} borderRadius={ms(15)} />
          <Skeleton width={ms(30)} height={ms(30)} borderRadius={ms(15)} />
        </View>
      </View>
      <View style={styles.couponFooter}>
        <View style={styles.couponFooterRow}>
          <Skeleton width={ms(14)} height={ms(14)} borderRadius={ms(4)} />
          <Skeleton width={ms(60)} height={ms(14)} />
        </View>
        <View style={styles.couponFooterRow}>
          <Skeleton width={ms(14)} height={ms(14)} borderRadius={ms(4)} />
          <Skeleton width={ms(40)} height={ms(14)} />
        </View>
        <View style={styles.couponFooterRow}>
          <Skeleton width={ms(14)} height={ms(14)} borderRadius={ms(4)} />
          <Skeleton width={ms(80)} height={ms(14)} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Skeleton width={ms(80)} height={ms(24)} />
      </View>

      <View style={styles.contentContainer}>
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.row}>
            <Skeleton width={ms(80)} height={ms(14)} style={styles.label} />
            <Skeleton width={ms(20)} height={ms(20)} style={styles.value} />
          </View>
        ))}
      </View>

      <View style={styles.addButtonWrapper}>
        <Skeleton width={ms(110)} height={ms(32)} borderRadius={ms(20)} />
      </View>

      <View style={styles.tableContainer}>
        {[1, 2, 3, 4, 5].map(i => renderCouponSkeleton(i))}
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
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    width: '31%',
    backgroundColor: COLORS.black,
    borderRadius: ms(8),
    paddingHorizontal: ms(7),
    paddingVertical: ms(8),
    marginBottom: ms(12),
  },
  label: {
    marginBottom: ms(4),
  },
  value: {
    marginTop: ms(4),
  },
  addButtonWrapper: {
    alignItems: 'flex-end',
    marginBottom: ms(16),
  },
  tableContainer: {
    marginTop: ms(16),
  },
  couponContainer: {
    backgroundColor: COLORS.black,
    borderRadius: ms(8),
    padding: ms(12),
    marginBottom: ms(12),
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(25),
    gap: ms(10),
  },
  couponCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    flex: 1,
  },
  editDeleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(12),
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
});

export default CouponsSkeleton;
