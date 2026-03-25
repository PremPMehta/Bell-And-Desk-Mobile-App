import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Skeleton from './index';
import { ms, sc } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

interface Props {
  isOneTime?: boolean;
}

const CourseSubscriptionSkeleton = ({ isOneTime = false }: Props) => {
  return (
    <View style={styles.container}>
      {/* ── Info Banner Skeleton ────────────────── */}
      <View style={styles.section}>
        <Skeleton width="100%" height={ms(44)} borderRadius={ms(10)} />
      </View>

      {/* ── Plans Skeleton (Subscription) ───────── */}
      {!isOneTime && (
        <View style={styles.section}>
          <Skeleton width={ms(120)} height={ms(20)} style={styles.sectionTitle} />
          <View style={styles.plansRow}>
            {[1, 2].map(i => (
              <View key={i} style={styles.planCard}>
                <View style={styles.radioRow}>
                  <Skeleton width={ms(18)} height={ms(18)} borderRadius={ms(9)} />
                  <Skeleton width={ms(60)} height={ms(14)} />
                </View>
                <Skeleton width={ms(80)} height={ms(24)} style={{ marginTop: ms(8) }} />
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.divider} />

      {/* ── Coupon Section Skeleton ─────────────── */}
      <View style={styles.section}>
        <Skeleton width={ms(110)} height={ms(20)} style={styles.sectionTitle} />
        <View style={styles.inputRow}>
          <Skeleton width="70%" height={ms(44)} borderRadius={ms(10)} />
          <Skeleton width="25%" height={ms(44)} borderRadius={ms(10)} />
        </View>
      </View>

      {/* ── Referral Section Skeleton ───────────── */}
      <View style={styles.section}>
        <Skeleton width={ms(150)} height={ms(20)} style={styles.sectionTitle} />
        <Skeleton width="100%" height={ms(44)} borderRadius={ms(10)} />
      </View>

      <View style={styles.divider} />

      {/* ── Benefits List Skeleton ──────────────── */}
      <View style={styles.section}>
        <Skeleton width={ms(100)} height={ms(20)} style={styles.sectionTitle} />
        {[1, 2, 3].map(i => (
          <View key={i} style={styles.benefitRow}>
            <Skeleton width={ms(32)} height={ms(32)} borderRadius={ms(8)} />
            <View style={styles.benefitText}>
              <Skeleton width="60%" height={ms(18)} style={{ marginBottom: ms(6) }} />
              <Skeleton width="90%" height={ms(14)} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: ms(20),
    paddingTop: ms(18),
  },
  sectionTitle: {
    marginBottom: ms(12),
  },
  plansRow: {
    flexDirection: 'row',
    gap: ms(10),
  },
  planCard: {
    flex: 1,
    minWidth: sc(130),
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: ms(12),
    padding: ms(14),
    backgroundColor: COLORS.innerCardBG,
    opacity: 0.6,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: ms(20),
    marginTop: ms(16),
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ms(12),
    paddingVertical: ms(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  benefitText: {
    flex: 1,
  },
});

export default CourseSubscriptionSkeleton;
