import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';

const SubscriptionTab = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Platform Subscription</Text>
        <Text style={styles.subtitle}>Community: Elton Hale</Text>
      </View>

      <View style={styles.subscriptionContainer}>
        <View style={styles.subscriptionHeader}>
          <Text style={styles.subscriptionTitle}>Subscription Details</Text>
          <Icon name="RotateCw" size={ms(18)} color={COLORS.lightGray} />
        </View>
        <View style={styles.subscriptionContent}>
          <Text style={styles.subscriptionLabel}>Status :</Text>
          <Text style={styles.subscriptionValue}>Active</Text>
        </View>
        <View style={styles.subscriptionContent}>
          <Text style={styles.subscriptionLabel}>Plan :</Text>
          <Text style={styles.subscriptionValue}>Monthly</Text>
        </View>
        <View style={styles.subscriptionContent}>
          <Text style={styles.subscriptionLabel}>Current Period Start :</Text>
          <Text style={styles.subscriptionValue}>26 November 2025</Text>
        </View>
        <View style={styles.subscriptionContent}>
          <Text style={styles.subscriptionLabel}>Next Renewal Date :</Text>
          <Text style={styles.subscriptionValue}>26 December 2025</Text>
        </View>

        <View style={styles.manageSubscriptionContainer}>
          <Text style={styles.manageSubscription}>
            Manage your subscription through your payment provider. Need help?{' '}
            <Text style={styles.contactSupport}>Contact Support.</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.cancelSubscriptionContainer}>
        <Text style={styles.cancelSubscription}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubscriptionTab;
