import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { COLORS } from '@/Assets/Theme/colors';

const ReferralTabSkeleton = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Skeleton */}
      <View style={styles.headerContainer}>
        <View>
          <Skeleton
            width={200}
            height={24}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <Skeleton width={250} height={16} borderRadius={4} />
        </View>
        <Skeleton width={40} height={24} borderRadius={12} />
      </View>

      {/* Commission Structure Skeleton */}
      <View style={styles.sectionContainer}>
        <Skeleton
          width={150}
          height={20}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />
        <Skeleton
          width="100%"
          height={56}
          borderRadius={8}
          style={{ marginBottom: 8 }}
        />
        <Skeleton width={200} height={16} borderRadius={4} />
      </View>

      {/* Access Control Skeleton */}
      <View style={styles.sectionContainer}>
        <Skeleton
          width={120}
          height={20}
          borderRadius={4}
          style={{ marginBottom: 12 }}
        />
        <Skeleton
          width={180}
          height={16}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />

        <View style={styles.radioItem}>
          <Skeleton
            width={20}
            height={20}
            borderRadius={10}
            style={{ marginRight: 12 }}
          />
          <Skeleton width={100} height={18} borderRadius={4} />
        </View>
        <View style={styles.radioItem}>
          <Skeleton
            width={20}
            height={20}
            borderRadius={10}
            style={{ marginRight: 12 }}
          />
          <Skeleton width={150} height={18} borderRadius={4} />
        </View>
      </View>

      {/* Commission Exceptions Skeleton */}
      <View style={styles.sectionContainer}>
        <Skeleton
          width={180}
          height={20}
          borderRadius={4}
          style={{ marginBottom: 12 }}
        />
        <Skeleton
          width="100%"
          height={32}
          borderRadius={4}
          style={{ marginBottom: 20 }}
        />

        <View style={styles.row}>
          <View style={{ flex: 2, marginRight: 12 }}>
            <Skeleton width="100%" height={56} borderRadius={8} />
          </View>
          <View style={{ flex: 1 }}>
            <Skeleton width="100%" height={56} borderRadius={8} />
          </View>
        </View>

        <Skeleton
          width={80}
          height={32}
          borderRadius={16}
          style={{ marginTop: 12 }}
        />

        <View style={styles.exceptionList}>
          {[1, 2].map(i => (
            <View key={i} style={styles.exceptionItem}>
              <Skeleton
                width={36}
                height={36}
                borderRadius={18}
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Skeleton
                  width={120}
                  height={16}
                  borderRadius={4}
                  style={{ marginBottom: 6 }}
                />
                <Skeleton width={150} height={14} borderRadius={4} />
              </View>
              <Skeleton width={40} height={18} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cardBG,
    padding: 16,
    marginTop: 24,
    borderRadius: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exceptionList: {
    marginTop: 20,
  },
  exceptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default ReferralTabSkeleton;
