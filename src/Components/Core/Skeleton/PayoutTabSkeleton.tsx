import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';

const PayoutTabSkeleton = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Skeleton */}
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}>
          <Skeleton
            width={220}
            height={24}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <Skeleton width="90%" height={16} borderRadius={4} />
        </View>
        <Skeleton width={32} height={32} borderRadius={16} />
      </View>

      {/* Stripe Account Card Skeleton */}
      <View style={styles.card}>
        <Skeleton
          width={150}
          height={20}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />
        <View style={styles.divider} />

        <View style={{ marginBottom: 20 }}>
          <Skeleton
            width={180}
            height={18}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <Skeleton width={220} height={14} borderRadius={4} />
        </View>

        <View style={styles.row}>
          <Skeleton
            width={150}
            height={34}
            borderRadius={20}
            style={{ marginRight: 12 }}
          />
          <Skeleton width={150} height={34} borderRadius={20} />
        </View>

        <Skeleton
          width={150}
          height={20}
          borderRadius={4}
          style={{ marginTop: 24, marginBottom: 16 }}
        />
        <View style={styles.balanceRow}>
          <View style={styles.balanceItem}>
            <Skeleton
              width={100}
              height={14}
              borderRadius={4}
              style={{ marginBottom: 8 }}
            />
            <Skeleton width={80} height={20} borderRadius={4} />
          </View>
          <View style={styles.balanceItem}>
            <Skeleton
              width={80}
              height={14}
              borderRadius={4}
              style={{ marginBottom: 8 }}
            />
            <Skeleton width={70} height={20} borderRadius={4} />
          </View>
          <View style={styles.balanceItem}>
            <Skeleton
              width={100}
              height={14}
              borderRadius={4}
              style={{ marginBottom: 8 }}
            />
            <Skeleton width={90} height={20} borderRadius={4} />
          </View>
        </View>

        {/* Payout Schedule Skeleton */}
        <View style={styles.sectionMargin}>
          <Skeleton
            width={120}
            height={16}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <Skeleton
            width={200}
            height={14}
            borderRadius={4}
            style={{ marginBottom: 6 }}
          />
          <Skeleton width={180} height={12} borderRadius={4} />
        </View>

        {/* Transactions Skeleton */}
        <View style={styles.sectionMargin}>
          <Skeleton
            width={150}
            height={20}
            borderRadius={4}
            style={{ marginBottom: 16 }}
          />
          {[1, 2, 3].map(item => (
            <View key={item} style={styles.transactionItem}>
              <View style={{ flex: 1 }}>
                <Skeleton
                  width={100}
                  height={16}
                  borderRadius={4}
                  style={{ marginBottom: 6 }}
                />
                <Skeleton width={150} height={12} borderRadius={4} />
              </View>
              <Skeleton width={70} height={24} borderRadius={12} />
            </View>
          ))}
        </View>

        {/* Recent Payouts Skeleton */}
        <View style={styles.sectionMargin}>
          <Skeleton
            width={150}
            height={20}
            borderRadius={4}
            style={{ marginBottom: 16 }}
          />
          {[1, 2].map(item => (
            <View key={item} style={styles.transactionItem}>
              <View style={{ flex: 1 }}>
                <Skeleton
                  width={100}
                  height={16}
                  borderRadius={4}
                  style={{ marginBottom: 6 }}
                />
                <Skeleton width={150} height={12} borderRadius={4} />
              </View>
              <Skeleton width={60} height={20} borderRadius={10} />
            </View>
          ))}
        </View>

        <View style={styles.row}>
          <Skeleton
            width={150}
            height={44}
            borderRadius={22}
            style={{ marginRight: 12 }}
          />
          <Skeleton width={150} height={44} borderRadius={22} />
        </View>
      </View>

      {/* Subscription Settings Skeleton */}
      <View style={styles.card}>
        <Skeleton
          width={250}
          height={20}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />
        <View style={styles.divider} />

        <View style={styles.switchRow}>
          <Skeleton
            width={48}
            height={24}
            borderRadius={12}
            style={{ marginRight: 12 }}
          />
          <Skeleton width={200} height={16} borderRadius={4} />
        </View>

        <Skeleton
          width="100%"
          height={100}
          borderRadius={8}
          style={{ marginBottom: 20 }}
        />

        <Skeleton
          width={180}
          height={18}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />
        <View style={styles.row}>
          <View style={styles.radioItem}>
            <Skeleton
              width={20}
              height={20}
              borderRadius={10}
              style={{ marginRight: 10 }}
            />
            <Skeleton width={120} height={16} borderRadius={4} />
          </View>
          <View style={styles.radioItem}>
            <Skeleton
              width={20}
              height={20}
              borderRadius={10}
              style={{ marginRight: 10 }}
            />
            <Skeleton width={120} height={16} borderRadius={4} />
          </View>
        </View>

        <Skeleton
          width="100%"
          height={56}
          borderRadius={8}
          style={{ marginTop: 20, marginBottom: 8 }}
        />
        <Skeleton
          width="100%"
          height={56}
          borderRadius={8}
          style={{ marginTop: 12, marginBottom: 24 }}
        />

        <Skeleton width="100%" height={50} borderRadius={25} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBG,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.cardBG,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 8,
  },
  balanceItem: {
    alignItems: 'center',
  },
  sectionMargin: {
    marginTop: 24,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
});

export default PayoutTabSkeleton;
