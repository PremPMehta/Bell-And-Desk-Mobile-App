import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

const BillingsTab = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Billing</Text>

      <View style={styles.planMainContainer}>
        <View style={styles.planContainer}>
          <Text style={styles.planTitle}>Current Plan</Text>
          <Text style={styles.planDescription}>Final Testing</Text>
        </View>
        <View style={styles.durationContainer}>
          <View style={styles.dueContainer}>
            <Text style={styles.dueTitle}>$10.00 / month</Text>
            <Text style={styles.activeStyle}>active</Text>
          </View>
          <Text style={styles.manageStyle}>Manage</Text>
        </View>
      </View>

      <View style={styles.usageContainer}>
        <Text style={styles.usageTitle}>Usage Summary</Text>

        <View style={styles.usageRow}>
          <View style={styles.usageTextRow}>
            <Text style={styles.usageValue}>0.00/ 10</Text>
            <Text style={styles.usagePercentage}>30%</Text>
          </View>
          <View style={styles.progressBarBG}>
            <View style={[styles.progressBarFill, { width: '30%' }]} />
          </View>
          <Text style={styles.usageLabel}>
            Streaming Minutes Used(Total Bucket)
          </Text>
        </View>

        <View style={[styles.usageRow, { marginBottom: 0 }]}>
          <View style={styles.usageTextRow}>
            <Text style={styles.usageValue}>0 GB / 0 GB</Text>
            <Text style={styles.usagePercentage}>0%</Text>
          </View>
          <View style={styles.progressBarBG}>
            <View style={[styles.progressBarFill, { width: '0%' }]} />
          </View>
          <Text style={styles.usageLabel}>Storage Used(Not Implemented)</Text>
        </View>
      </View>

      <View style={styles.paymentContainer}>
        <Text style={styles.paymentTitle}>My Payment History(to Platform)</Text>
        <View style={styles.paymentRow}>
          <View style={styles.paymentTextRow}>
            <Text style={styles.paymentValue}>
              <Text style={styles.boldText}>Desc:</Text> 1 x Final testing (at
              $10.00 / month )
            </Text>
            <Icon name="Download" size={16} color={COLORS.primary} />
          </View>
          <View style={styles.paymentTextRow}>
            <Text style={styles.paymentValue}>
              <Text style={styles.boldText}>Amt:</Text> $10.00
            </Text>
            <Text style={styles.paidStyle}>paid</Text>
          </View>
          <Text style={styles.paymentDate}>Nov 26, 2025</Text>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <Icon name="CreditCard" size={24} color={COLORS.primary} />
        <Text style={styles.cardNumber}>Visa **** **** **** 1234</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>Test Card</Text>
          <Text style={styles.cardDate}>02 / 30</Text>
        </View>
      </View>

      <View style={styles.managePaymentContainer}>
        <TouchableOpacity style={styles.manageContainer}>
          <Text style={styles.managePayment}>Manage Payment Methods</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.RecentMemberContainer}>
        <Text style={styles.paymentTitle}>Recent Member Revenue</Text>
        <View style={styles.paymentRow}>
          <View style={styles.paymentTextRow}>
            <Text style={styles.paymentValue}>
              <Text style={styles.boldText}>Member:</Text> Crypto Community
            </Text>
            {/* <Icon name="Download" size={16} color={COLORS.primary} /> */}
          </View>
          <View style={styles.paymentTextRow}>
            <Text style={styles.paymentValue}>
              <Text style={styles.boldText}>Amt:</Text> $10.00
            </Text>
            <Text style={styles.paidStyle}>paid</Text>
          </View>
          <Text style={styles.paymentValue}>
            <Text style={styles.boldText}>Net Revenue:</Text> $0.00
          </Text>
          <View style={styles.space} />
          <Text style={styles.paymentDate}>Nov 26, 2025</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveChangesContainer}>
        <Text style={styles.saveChanges}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BillingsTab;
