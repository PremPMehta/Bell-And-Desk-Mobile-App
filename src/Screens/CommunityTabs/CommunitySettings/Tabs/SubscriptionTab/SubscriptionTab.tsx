import {
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useEffect } from 'react';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import SubscriptionTabSkeleton from '@/Components/Core/Skeleton/SubscriptionTabSkeleton';

interface Props {
  slug?: string;
  communityName?: string;
  userRole?: string;
}

const SubscriptionTab = ({ slug, communityName, userRole }: Props) => {
  const isMember = userRole === 'member';
  const [fetchInitiatedFor, setFetchInitiatedFor] = React.useState<string | undefined>(undefined);

  const {
    // Owner API
    getSubscriptionCheck,
    apiGetSubscriptionCheckLoading,
    apiGetSubscriptionCheck,
    // Member API
    getSubscriptionDetails,
    apiGetSubscriptionDetailsLoading,
    apiGetSubscriptionDetails,
  } = useUserApi();

  useEffect(() => {
    if (!slug) return;
    if (isMember) {
      getSubscriptionDetails(slug);
    } else {
      getSubscriptionCheck(slug);
    }
    setFetchInitiatedFor(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, isMember]);

  // ── Resolve data from the correct API ──
  const isLoading = isMember
    ? apiGetSubscriptionDetailsLoading
    : apiGetSubscriptionCheckLoading;

  const responseData = isMember
    ? apiGetSubscriptionDetails?.data
    : apiGetSubscriptionCheck?.data;

  const hasSubscription: boolean = responseData?.hasSubscription ?? false;
  const details = responseData?.details ?? null;
  const paymentLink: string = responseData?.payment_link ?? '';

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleRefresh = () => {
    if (!slug) return;
    if (isMember) {
      getSubscriptionDetails(slug);
    } else {
      getSubscriptionCheck(slug);
    }
  };

  const handleSubscribeNow = () => {
    if (paymentLink) {
      Linking.openURL(paymentLink).catch(err =>
        console.error('Could not open payment link:', err),
      );
    }
  };

  const isDataStale = fetchInitiatedFor !== slug;

  if (isLoading || isDataStale || !responseData) {
    return <SubscriptionTabSkeleton />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Platform Subscription</Text>
        {!!communityName && (
          <Text style={styles.subtitle}>Community: {communityName}</Text>
        )}
      </View>

      {hasSubscription && details ? (
        /* ── Active subscription details ── */
        <>
          <View style={styles.subscriptionContainer}>
            <View style={styles.subscriptionHeader}>
              <Text style={styles.subscriptionTitle}>Subscription Details</Text>
              <TouchableOpacity onPress={handleRefresh}>
                <Icon name="RotateCw" size={ms(18)} color={COLORS.lightGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.subscriptionContent}>
              <Text style={styles.subscriptionLabel}>Status :</Text>
              <Text style={styles.subscriptionValue}>
                {details?.status
                  ? details.status.charAt(0).toUpperCase() +
                    details.status.slice(1)
                  : 'Active'}
              </Text>
            </View>

            <View style={styles.subscriptionContent}>
              <Text style={styles.subscriptionLabel}>Plan :</Text>
              <Text style={styles.subscriptionValue}>
                {details?.plan?.interval
                  ? details.plan.interval.charAt(0).toUpperCase() +
                    details.plan.interval.slice(1)
                  : details?.interval
                  ? details.interval.charAt(0).toUpperCase() +
                    details.interval.slice(1)
                  : '—'}
              </Text>
            </View>

            <View style={styles.subscriptionContent}>
              <Text style={styles.subscriptionLabel}>
                Current Period Start :
              </Text>
              <Text style={styles.subscriptionValue}>
                {formatDate(
                  details?.current_period_start
                    ? new Date(
                        details.current_period_start * 1000,
                      ).toISOString()
                    : details?.currentPeriodStart,
                )}
              </Text>
            </View>

            <View style={styles.subscriptionContent}>
              <Text style={styles.subscriptionLabel}>Next Renewal Date :</Text>
              <Text style={styles.subscriptionValue}>
                {formatDate(
                  details?.current_period_end
                    ? new Date(
                        details.current_period_end * 1000,
                      ).toISOString()
                    : details?.currentPeriodEnd,
                )}
              </Text>
            </View>

            <View style={styles.manageSubscriptionContainer}>
              <Text style={styles.manageSubscription}>
                Manage your subscription through your payment provider. Need
                help?{' '}
                <Text style={styles.contactSupport}>Contact Support.</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.cancelSubscriptionContainer}
            onPress={handleRefresh}
          >
            <Text style={styles.cancelSubscription}>Refresh</Text>
          </TouchableOpacity>
        </>
      ) : (
        /* ── No active subscription empty state ── */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Icon name="Info" size={ms(28)} color={COLORS.lightGray} />
          </View>
          <Text style={styles.emptyTitle}>No Active Subscription</Text>
          <Text style={styles.emptySubtitle}>
            You do not have an active subscription for this community. Visit the
            community page to subscribe.
          </Text>
          {!!paymentLink && (
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={handleSubscribeNow}
            >
              <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.refreshLinkContainer}
            onPress={handleRefresh}
          >
            <Icon name="RotateCw" size={ms(14)} color={COLORS.lightGray} />
            <Text style={styles.refreshLink}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SubscriptionTab;
