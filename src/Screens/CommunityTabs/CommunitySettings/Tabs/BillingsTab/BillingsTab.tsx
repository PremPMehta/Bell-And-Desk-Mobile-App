import { View, Text, TouchableOpacity, AppState } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import BillingsTabSkeleton from '@/Components/Core/Skeleton/BillingsTabSkeleton';

interface Props {
  slug?: string;
}

const BillingsTab = ({ slug }: Props) => {
  const {
    getOwnerDashboardBilling,
    apiGetOwnerDashboardBillingLoading,
    apiGetOwnerDashboardBilling,
    setApiGetOwnerDashboardBilling,
    setApiGetOwnerDashboardBillingLoading,
  } = useUserApi();

  const [activeSlug, setActiveSlug] = useState(slug);
  const isFocused = useIsFocused();

  if (slug !== activeSlug) {
    setActiveSlug(slug);
  }

  const fetchData = async () => {
    if (!slug) return;
    try {
      await getOwnerDashboardBilling(slug);
    } catch (error) {
      setApiGetOwnerDashboardBillingLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      setApiGetOwnerDashboardBilling(null);
      fetchData();
    }
  }, [slug]);

  useEffect(() => {
    if (isFocused && slug) {
      fetchData();
    }
  }, [isFocused, slug]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && slug) {
        fetchData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [slug]);

  const isLoading =
    slug !== activeSlug ||
    apiGetOwnerDashboardBillingLoading ||
    !apiGetOwnerDashboardBilling;
  const billingData = apiGetOwnerDashboardBilling?.data || {};

  const platformSubscription = billingData?.platformSubscription || {};
  const details = platformSubscription?.details || null;

  const usageSummary = billingData?.usageSummary || {};
  const streaming = usageSummary?.streaming || {};

  const paymentHistory = billingData?.platformPaymentHistory || [];
  const paymentMethodInfo = billingData?.paymentMethod || null;
  const recentTransactions = billingData?.recentTransactions || [];

  if (isLoading) {
    return <BillingsTabSkeleton />;
  }

  // Formatting helpers
  const getPercentage = (used: number, total: number) => {
    if (!total || total === 0) return 0;
    const val = (used / total) * 100;
    return val > 100 ? 100 : val;
  };

  const streamingPercentage = getPercentage(
    streaming.bucketUsedMinutes || 0,
    streaming.bucketTotalMinutes || 0,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Billing</Text>

      {/* Current Plan */}
      <View style={styles.planMainContainer}>
        <View style={styles.planContainer}>
          <Text style={styles.planTitle}>Current Plan</Text>
          <Text style={styles.planDescription}>
            {details?.planName || 'N/A'}
          </Text>
        </View>
        <View style={styles.durationContainer}>
          <View style={styles.dueContainer}>
            <Text style={styles.dueTitle}>
              ${details?.planPrice || 0} / {details?.planPeriod || 'month'}
            </Text>
            {details?.status && (
              <Text style={styles.activeStyle}>{details.status}</Text>
            )}
          </View>
          <Text style={styles.manageStyle}>Manage</Text>
        </View>
      </View>

      {/* Usage Summary */}
      <View style={styles.usageContainer}>
        <Text style={styles.usageTitle}>Usage Summary</Text>

        <View style={styles.usageRow}>
          <View style={styles.usageTextRow}>
            <Text style={styles.usageValue}>
              {streaming.bucketUsedMinutes || 0} /{' '}
              {streaming.bucketTotalMinutes || 0}
            </Text>
            <Text style={styles.usagePercentage}>
              {streamingPercentage.toFixed(0)}%
            </Text>
          </View>
          <View style={styles.progressBarBG}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${streamingPercentage}%` },
              ]}
            />
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
        {paymentHistory.length > 0 ? (
          paymentHistory.map((history: any, index: number) => (
            <View key={index} style={styles.paymentRow}>
              <View style={styles.paymentTextRow}>
                <Text style={styles.paymentValue}>
                  <Text style={styles.boldText}>Desc:</Text>{' '}
                  {history?.description || 'N/A'}
                </Text>
                <Icon name="Download" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.paymentTextRow}>
                <Text style={styles.paymentValue}>
                  <Text style={styles.boldText}>Amt:</Text> $
                  {history?.amount ? (history.amount / 100).toFixed(2) : '0.00'}
                </Text>
                <Text style={styles.paidStyle}>{history?.status || 'N/A'}</Text>
              </View>
              <Text style={styles.paymentDate}>
                {history?.createdAt
                  ? new Date(history.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No payment history found</Text>
        )}
      </View>

      {/* Payment Method */}
      {paymentMethodInfo ? (
        <View style={styles.cardContainer}>
          <Icon name="CreditCard" size={24} color={COLORS.primary} />
          <Text style={styles.cardNumber}>
            {paymentMethodInfo?.card?.brand
              ? paymentMethodInfo.card.brand.charAt(0).toUpperCase() +
                paymentMethodInfo.card.brand.slice(1)
              : 'Card'}{' '}
            **** **** **** {paymentMethodInfo?.card?.last4 || '****'}
          </Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>
              {paymentMethodInfo?.billing_details?.name || 'Cardholder'}
            </Text>
            <Text style={styles.cardDate}>
              {paymentMethodInfo?.card?.exp_month || '00'} /{' '}
              {paymentMethodInfo?.card?.exp_year || '00'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.noPaymentMethodView}>
          <Text style={styles.noData}>No payment method on file</Text>
        </View>
      )}

      <View style={styles.managePaymentContainer}>
        <TouchableOpacity style={styles.manageContainer}>
          <Text style={styles.managePayment}>Manage Payment Methods</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.RecentMemberContainer}>
        <Text style={styles.paymentTitle}>Recent Member Revenue</Text>
        {recentTransactions.length > 0 ? (
          recentTransactions.map((tx: any, index: number) => (
            <View key={tx._id || index} style={styles.paymentRow}>
              <View style={styles.paymentTextRow}>
                <Text style={styles.paymentValue}>
                  <Text style={styles.boldText}>Member:</Text>{' '}
                  {tx?.student?.firstName} {tx?.student?.lastName}
                </Text>
              </View>
              <View style={styles.paymentTextRow}>
                <Text style={styles.paymentValue}>
                  <Text style={styles.boldText}>Amt:</Text> $
                  {tx?.amount ? (tx.amount / 100).toFixed(2) : '0.00'}
                </Text>
                <Text style={styles.paidStyle}>
                  {tx?.status === 'succeeded' ? 'paid' : tx?.status}
                </Text>
              </View>
              <Text style={styles.paymentValue}>
                <Text style={styles.boldText}>Net Revenue:</Text> $
                {tx?.platformFee ? (tx.platformFee / 100).toFixed(2) : '0.00'}
                {/* {tx?.amount
                  ? ((tx.amount - (tx.platformFee || 0)) / 100).toFixed(2)
                  : '0.00'} */}
              </Text>
              <View style={styles.space} />
              <Text style={styles.paymentDate}>
                {tx?.createdAt
                  ? new Date(tx.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : ''}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No recent member revenue found</Text>
        )}
      </View>

      <TouchableOpacity style={styles.saveChangesContainer}>
        <Text style={styles.saveChanges}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BillingsTab;
