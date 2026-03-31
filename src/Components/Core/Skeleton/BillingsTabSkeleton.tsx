import React from 'react';
import { View, ScrollView } from 'react-native';
import Skeleton from './index';
import styles from '../../../Screens/CommunityTabs/CommunitySettings/Tabs/BillingsTab/style';

const BillingsTabSkeleton = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Skeleton width={100} height={24} borderRadius={4} style={{ marginBottom: 4 }} />

      {/* Current Plan Skeleton */}
      <View style={styles.planMainContainer}>
        <View style={styles.planContainer}>
          <Skeleton width={120} height={20} borderRadius={4} />
          <Skeleton width={100} height={28} borderRadius={20} />
        </View>
        <View style={styles.durationContainer}>
          <View style={styles.dueContainer}>
             <Skeleton width={150} height={22} borderRadius={4} style={{ marginBottom: 8 }} />
             <Skeleton width={80} height={24} borderRadius={20} />
          </View>
          <Skeleton width={90} height={28} borderRadius={20} />
        </View>
      </View>

      {/* Usage Summary Skeleton */}
      <View style={styles.usageContainer}>
        <Skeleton width={140} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
        
        <View style={styles.usageRow}>
          <View style={styles.usageTextRow}>
             <Skeleton width={80} height={16} borderRadius={4} />
             <Skeleton width={40} height={16} borderRadius={4} />
          </View>
          <View style={styles.progressBarBG} />
          <Skeleton width={200} height={14} borderRadius={4} />
        </View>

        <View style={[styles.usageRow, { marginBottom: 0 }]}>
          <View style={styles.usageTextRow}>
             <Skeleton width={80} height={16} borderRadius={4} />
             <Skeleton width={40} height={16} borderRadius={4} />
          </View>
          <View style={styles.progressBarBG} />
          <Skeleton width={180} height={14} borderRadius={4} />
        </View>
      </View>

      {/* Payment History Skeleton */}
      <View style={styles.paymentContainer}>
        <Skeleton width={220} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
        {[1, 2].map(item => (
          <View key={item} style={styles.paymentRow}>
            <View style={styles.paymentTextRow}>
               <Skeleton width={200} height={16} borderRadius={4} />
               <Skeleton width={16} height={16} borderRadius={8} />
            </View>
            <View style={styles.paymentTextRow}>
               <Skeleton width={120} height={16} borderRadius={4} />
               <Skeleton width={60} height={24} borderRadius={20} />
            </View>
            <Skeleton width={100} height={14} borderRadius={4} style={{ marginTop: 8 }} />
          </View>
        ))}
      </View>

      {/* Payment Method Skeleton */}
      <View style={styles.cardContainer}>
         <Skeleton width={24} height={24} borderRadius={12} style={{ marginBottom: 12 }} />
         <Skeleton width={250} height={20} borderRadius={4} style={{ marginBottom: 6 }} />
         <View style={styles.cardInfo}>
            <Skeleton width={120} height={16} borderRadius={4} />
            <Skeleton width={60} height={16} borderRadius={4} />
         </View>
      </View>

      {/* Manage Payment Methods Skeleton */}
      <View style={styles.managePaymentContainer}>
        <View style={styles.manageContainer}>
           <Skeleton width={180} height={18} borderRadius={4} />
        </View>
      </View>

      {/* Recent Member Revenue Skeleton */}
      <View style={styles.RecentMemberContainer}>
         <Skeleton width={200} height={20} borderRadius={4} style={{ marginBottom: 16 }} />
         {[1, 2].map(item => (
          <View key={item} style={styles.paymentRow}>
            <View style={styles.paymentTextRow}>
               <Skeleton width={150} height={16} borderRadius={4} />
            </View>
            <View style={styles.paymentTextRow}>
               <Skeleton width={120} height={16} borderRadius={4} />
               <Skeleton width={60} height={24} borderRadius={20} />
            </View>
            <Skeleton width={160} height={16} borderRadius={4} />
            <View style={styles.space} />
            <Skeleton width={100} height={14} borderRadius={4} />
          </View>
        ))}
      </View>

      <View style={styles.saveChangesContainer}>
        <Skeleton width={110} height={20} borderRadius={4} />
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default BillingsTabSkeleton;
