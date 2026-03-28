import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  ScrollView,
  AppState,
} from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';
import Icon from '@/Components/Core/Icons';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInputField from '@/Components/Core/TextInputField';
import styles from './style';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import PayoutTabSkeleton from '@/Components/Core/Skeleton/PayoutTabSkeleton';
import CommonListModal from '@/Components/Generic/Modals/CommonListModal';
import { STRIPE_COUNTRIES } from '@/Constants/Countries';
import { Linking } from 'react-native';
import Modal from 'react-native-modal';
import { useIsFocused } from '@react-navigation/native';

interface Props {
  slug?: string;
}

const PayoutTab = ({ slug }: Props) => {
  const {
    getStripeAccountStatus,
    apiGetStripeAccountStatus,
    getStripePayouts,
    apiGetStripePayouts,
    getSubscriptionSettings,
    apiGetSubscriptionSettings,
    apiGetStripeAccountStatusLoading,
    apiGetStripePayoutsLoading,
    apiGetSubscriptionSettingsLoading,
    updateSubscriptionSettings,
    apiUpdateSubscriptionSettingsLoading,
    clearStripeSettings,
    createStripeConnectAccount,
    apiCreateStripeConnectAccountLoading,
    unlinkStripeAccount,
    apiUnlinkStripeAccountLoading,
    setApiGetStripeAccountStatusLoading,
    setApiGetStripePayoutsLoading,
    setApiGetSubscriptionSettingsLoading,
  } = useUserApi();

  const [activeSlug, setActiveSlug] = useState(slug);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [isSubscriptionEnabled, setIsSubscriptionEnabled] = useState(false);
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('0');
  const [yearlyPrice, setYearlyPrice] = useState('0');
  const [isMonthlyActive, setIsMonthlyActive] = useState(true);
  const [isYearlyActive, setIsYearlyActive] = useState(false);
  const [isUnlinkModalVisible, setIsUnlinkModalVisible] = useState(false);

  const isFocused = useIsFocused();

  if (slug !== activeSlug) {
    setActiveSlug(slug);
  }

  useEffect(() => {
    if (slug) {
      clearStripeSettings();
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

  const fetchData = async () => {
    if (!slug) return;
    try {
      const accountStatusRes = await getStripeAccountStatus(slug);
      const promises: any[] = [getSubscriptionSettings(slug)];

      // Check both top-level and nested structure for resilience
      const onboardingComplete =
        accountStatusRes?.isOnboardingComplete ||
        accountStatusRes?.data?.isOnboardingComplete;

      if (onboardingComplete) {
        promises.push(getStripePayouts(slug));
      } else {
        // If not calling payouts, ensure it's not marked as loading
        setApiGetStripePayoutsLoading(false);
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error in fetchData:', error);
      // Ensure loading flags are cleared on error
      setApiGetStripeAccountStatusLoading(false);
      setApiGetStripePayoutsLoading(false);
      setApiGetSubscriptionSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (apiGetSubscriptionSettings?.data) {
      const settings =
        apiGetSubscriptionSettings.data.subscriptionSettings || {};
      setIsSubscriptionEnabled(settings.isEnabled || false);
      setDescription(settings.description || '');
      setMonthlyPrice(((settings.monthlyPrice || 0) / 100).toString());
      setYearlyPrice(((settings.yearlyPrice || 0) / 100).toString());
      setIsMonthlyActive(settings.availableOptions?.monthly || false);
      setIsYearlyActive(settings.availableOptions?.yearly || false);
    }
  }, [apiGetSubscriptionSettings]);

  const onSave = async () => {
    if (!slug) return;
    const body = {
      subscriptionSettings: {
        isEnabled: isSubscriptionEnabled,
        monthlyPrice: parseFloat(monthlyPrice) * 100,
        yearlyPrice: parseFloat(yearlyPrice) * 100,
        currency: 'USD',
        availableOptions: {
          monthly: isMonthlyActive,
          yearly: isYearlyActive,
        },
        description: description,
      },
    };
    await updateSubscriptionSettings(slug, body);
    fetchData(); // Refresh data after update
  };

  const onConnectStripe = async () => {
    if (!slug || !selectedCountry) return;
    const res = await createStripeConnectAccount(slug, selectedCountry.id);
    if (res?.url) {
      Linking.openURL(res.url);
    }
  };

  const onUnlinkStripe = async () => {
    if (!slug) return;
    const res = await unlinkStripeAccount(slug);
    if (res) {
      setIsUnlinkModalVisible(false);
      clearStripeSettings();
      fetchData(); // Refresh data after unlinking
    }
  };

  // Calculations for payouts
  const calculateFinalPayout = (price: string) => {
    const p = parseFloat(price) || 0;
    const stripeFee = p * 0.03; // Approximate 3%
    const platformFee = p * 0.1; // 10%
    const final = p - stripeFee - platformFee;
    return {
      stripeFee: stripeFee.toFixed(2),
      platformFee: platformFee.toFixed(2),
      final: final.toFixed(2),
    };
  };

  const monthlyPayout = calculateFinalPayout(monthlyPrice);
  const yearlyPayout = calculateFinalPayout(yearlyPrice);

  const isOnboardingComplete =
    apiGetStripeAccountStatus?.isOnboardingComplete || false;
  console.log('🚀 ~ PayoutTab ~ isOnboardingComplete:', isOnboardingComplete);
  const stripeAccountId = apiGetStripeAccountStatus?.stripeAccountId;
  const stripeConnectAccountLink =
    apiGetStripeAccountStatus?.stripeConnectAccountLink;
  const isStripeConnected = !!stripeAccountId;
  const payoutsData = apiGetStripePayouts?.data || {};
  const hasSubscriptionData =
    !!apiGetSubscriptionSettings?.data && isOnboardingComplete;
  const balance = payoutsData.total || 0;
  const availableBalance = payoutsData.available || 0;
  const pendingBalance = payoutsData.pending || 0;
  const currency = (payoutsData.currency || 'usd').toUpperCase();

  const payoutSchedule = payoutsData.payoutSchedule || {};
  const recentTransactions = payoutsData.balanceTransactions || [];
  const recentPayouts = payoutsData.recentPayouts || [];

  if (
    slug !== activeSlug ||
    apiGetStripeAccountStatusLoading ||
    apiGetStripePayoutsLoading ||
    apiGetSubscriptionSettingsLoading
  ) {
    return <PayoutTabSkeleton />;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerInnerRow}>
            <Text style={styles.headerTitle}>
              Payouts & Subscription Settings
            </Text>
            <Text style={styles.sectionDescription}>
              Manage your Stripe account and configure subscription options for
              your community.
            </Text>
          </View>
          <Icon name="Settings" size={ms(20)} color={COLORS.lightGray} />
        </View>
        {/* Stripe Account Section */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Stripe Account</Text>
          </View>
          <View style={styles.divider} />

          {isStripeConnected ? (
            <>
              <View style={styles.connectedContainer}>
                <Text style={styles.connectedText}>
                  {isOnboardingComplete
                    ? 'Connected with Stripe'
                    : 'Connection with Stripe - In Progress'}
                </Text>
                <Text style={styles.uIdText}>
                  Stripe account ID: {stripeAccountId || 'N/A'}
                </Text>
              </View>

              <View style={styles.stripeConnectRow}>
                <TouchableOpacity
                  style={styles.dashboardButton}
                  onPress={() => {
                    if (isOnboardingComplete) {
                      Linking.openURL('https://dashboard.stripe.com/');
                    } else if (stripeConnectAccountLink) {
                      Linking.openURL(stripeConnectAccountLink);
                    }
                  }}
                >
                  <Text style={styles.dashboardButtonText}>
                    Go to Stripe Dashboard
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.unlinkButton}
                  onPress={() => setIsUnlinkModalVisible(true)}
                >
                  <Text style={styles.unlinkButtonText}>
                    Unlink Stripe Account
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <CommonListModal
                textInputLabel="Select Country"
                textInputValue={selectedCountry?.value || ''}
                placeholder="Select Country"
                dropDownData={STRIPE_COUNTRIES}
                dropDownSelectedValue={selectedCountry?.value}
                onDropDownSelect={(item: any) => setSelectedCountry(item)}
              />
              <PrimaryButton
                title="Connect with Stripe"
                onPress={onConnectStripe}
                loading={apiCreateStripeConnectAccountLoading}
                disabled={!selectedCountry}
                buttonStyle={styles.connectButton}
                textStyle={styles.saveButtonText}
              />
            </>
          )}

          {hasSubscriptionData && (
            <>
              <Text style={styles.balanceTitle}>Balance & Payouts</Text>
              <View style={styles.balanceRow}>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Available Balance</Text>
                  <Text style={styles.balanceValue}>
                    ${availableBalance.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Pending</Text>
                  <Text style={styles.balanceValue}>
                    ${pendingBalance.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.balanceItem}>
                  <Text style={styles.balanceLabel}>Total Balance</Text>
                  <Text style={styles.balanceValue}>${balance.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.payoutSchedule}>
                <Text style={styles.scheduleLabel}>Payout Schedule</Text>
                <Text style={styles.scheduleValue}>
                  {payoutSchedule.interval
                    ? `${
                        payoutSchedule.interval.charAt(0).toUpperCase() +
                        payoutSchedule.interval.slice(1)
                      } payouts with ${payoutSchedule.delayDays} days delay`
                    : 'No payout schedule configured'}
                </Text>
                {payoutsData.nextPayoutDate && (
                  <Text style={styles.nextPayout}>
                    Next payout:{' '}
                    {new Date(payoutsData.nextPayoutDate).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      },
                    )}
                  </Text>
                )}
              </View>

              {/* Recent Transactions Section */}
              <View style={styles.recentContainer}>
                <Text style={styles.recentTitle}>Recent Transactions</Text>
                {recentTransactions.length > 0 ? (
                  recentTransactions.slice(0, 5).map((txn: any) => (
                    <View key={txn.id} style={styles.recentPayoutRow}>
                      <View>
                        <Text style={styles.payoutAmount}>
                          ${txn.amount.toFixed(2)} {txn.currency.toUpperCase()}
                        </Text>
                        <Text style={styles.payoutDate}>
                          {txn.description
                            ? txn.description
                            : txn.type.charAt(0).toUpperCase() +
                                txn.type.slice(1) || 'Transaction'}{' '}
                          • {txn.status}{' '}
                          {new Date(txn.availableOn).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            },
                          )}
                        </Text>
                      </View>
                      <View style={styles.paidBadge}>
                        <Text style={styles.paidText}>{txn.status}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.infoText, { marginTop: ms(8) }]}>
                    No recent transactions
                  </Text>
                )}
              </View>

              {/* Recent Payouts Section */}
              <View style={styles.recentContainer}>
                <Text style={styles.recentTitle}>Recent Payouts</Text>
                {recentPayouts.length > 0 ? (
                  recentPayouts.slice(0, 5).map((payout: any) => (
                    <View key={payout.id} style={styles.recentPayoutRow}>
                      <View>
                        <Text style={styles.payoutAmount}>
                          ${payout.amount.toFixed(2)}{' '}
                          {(payout.currency || 'usd').toUpperCase()}
                        </Text>
                        <Text style={styles.payoutDate}>
                          {payout.status.charAt(0).toUpperCase() +
                            payout.status.slice(1)}{' '}
                          • Arrives{' '}
                          {new Date(
                            payout.arrivalDate * 1000,
                          ).toLocaleDateString('en-GB', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                      <View style={styles.paidBadge}>
                        <Text style={styles.paidText}>
                          {payout.status.charAt(0).toUpperCase() +
                            payout.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.infoText, { marginTop: ms(8) }]}>
                    No recent payouts
                  </Text>
                )}
              </View>

              <View style={styles.withdrawRow}>
                <TouchableOpacity style={styles.withdrawButton}>
                  <Text style={styles.withdrawButtonText}>
                    Request Withdrawal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.withdrawButton}>
                  <Text style={styles.withdrawButtonText}>
                    Withdraw All(${balance.toFixed(2)})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Info Cards */}
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Icon name="TriangleAlert" size={ms(20)} color={'#FFC107'} />
                  <Text style={styles.infoTitle}>
                    Cannot Withdraw Pending Funds
                  </Text>
                </View>
                <Text style={styles.infoText}>
                  You have ${pendingBalance.toFixed(2)} in pending funds, but $
                  {availableBalance.toFixed(2)} available to withdrawal.
                </Text>
                <Text style={styles.infoSubText}>
                  Why you can't withdraw pending funds:{'\n'}• Pending funds are
                  still being processed by Stripe{'\n'}• They are subject to a
                  hold period (typically 2-7 business days){'\n'}• Only
                  "Available balance" can be withdrawn{'\n'}
                </Text>
              </View>
              <View style={[styles.infoCard, { borderColor: COLORS.gray }]}>
                <View style={styles.infoHeader}>
                  <Icon name="Info" size={ms(20)} color={COLORS.white} />
                  <Text style={styles.infoTitle}> Instant Payouts:</Text>
                </View>
                <Text style={styles.infoText}>
                  Instant Payouts allow you to receive funds within 30 minutes
                  via an eligible debit card. This feature needs to be enabled
                  by the platform. Contact support to check if Instant Payouts
                  are available for your account.
                </Text>
              </View>
              <View style={[styles.infoCard, { borderColor: COLORS.gray }]}>
                <View style={styles.infoHeader}>
                  <Icon name="Info" size={ms(20)} color={COLORS.white} />
                  <Text style={styles.infoTitle}> How Withdrawals Work:</Text>
                </View>
                <Text style={styles.infoText}>
                  You can request manual payouts at any time using the button
                  above. Standard payouts are also automatically sent to your
                  connected bank account based on your payout schedule. You can
                  manage your payout schedule and bank account details via your
                  Stripe Express Dashboard.
                </Text>
              </View>
            </>
          )}
        </View>

        {/* RedFi Card */}
        <View style={[styles.card, styles.redFiCard]}>
          <Text style={styles.redFiTitle}>
            <Text style={{ color: COLORS.red }}>RED</Text>Fi
          </Text>
          <View style={styles.divider} />
          <View style={styles.redFiTextContainer}>
            <Text style={styles.redFiText}>
              Open REDFi and Take Your Digital Business Global
            </Text>
            <TouchableOpacity style={styles.claimButton}>
              <Text style={styles.claimButtonText}>Apply Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Community Subscription Settings */}
        <View style={styles.card}>
          <View style={styles.sectionMainContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>
                Community Subscription Settings
              </Text>
              <Text style={styles.subSubtitle}>
                Configure subscription tiers for members to access paid content
                in your community.
              </Text>
            </View>
            <TouchableOpacity onPress={fetchData} style={styles.badge}>
              <Text style={styles.badgeText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <Switch
              trackColor={{ false: COLORS.gray, true: COLORS.primary }}
              thumbColor={COLORS.white}
              onValueChange={setIsSubscriptionEnabled}
              value={isSubscriptionEnabled}
            />
            <Text style={styles.switchLabel}>
              Enable community subscription
            </Text>
          </View>

          {isSubscriptionEnabled && (
            <>
              <TextInputField
                label="Subscription Description"
                placeholder="Enter description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={styles.textArea}
                theme={{
                  colors: {
                    background: COLORS.innerCardBG,
                    text: COLORS.white,
                    placeholder: COLORS.outlineGrey,
                  },
                }}
                textColor={COLORS.white}
                outlineColor={COLORS.outlineGrey}
                activeOutlineColor={COLORS.white}
              />

              <Text style={styles.radioTitle}>
                Available Subscription Options
              </Text>
              <View style={styles.optionRow}>
                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setIsMonthlyActive(!isMonthlyActive)}
                >
                  <Icon
                    name={isMonthlyActive ? 'CircleCheck' : 'Circle'}
                    size={ms(20)}
                    color={isMonthlyActive ? COLORS.primary : COLORS.gray}
                  />
                  <Text style={styles.radioLabel}>Monthly subscription</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.radioContainer}
                  onPress={() => setIsYearlyActive(!isYearlyActive)}
                >
                  <Icon
                    name={isYearlyActive ? 'CircleCheck' : 'Circle'}
                    size={ms(20)}
                    color={isYearlyActive ? COLORS.primary : COLORS.gray}
                  />
                  <Text style={styles.radioLabel}>Yearly subscription</Text>
                </TouchableOpacity>
              </View>

              {isMonthlyActive && (
                <>
                  <TextInputField
                    label="Monthly Price $"
                    placeholder="Enter monthly price"
                    value={monthlyPrice}
                    onChangeText={setMonthlyPrice}
                    keyboardType="numeric"
                    style={styles.inputStyle}
                    theme={{
                      colors: {
                        background: COLORS.innerCardBG,
                        text: COLORS.white,
                        placeholder: COLORS.outlineGrey,
                      },
                    }}
                    textColor={COLORS.white}
                    outlineColor={COLORS.outlineGrey}
                    activeOutlineColor={COLORS.white}
                  />
                  <Text style={styles.feeText}>
                    Final payout: ${monthlyPayout.final} - 3% Stripe ($
                    {monthlyPayout.stripeFee}) - 10% platform ($
                    {monthlyPayout.platformFee}) = ${monthlyPayout.final}
                  </Text>
                </>
              )}

              {isYearlyActive && (
                <>
                  <TextInputField
                    label="Yearly Price $"
                    placeholder="Enter yearly price"
                    value={yearlyPrice}
                    onChangeText={setYearlyPrice}
                    keyboardType="numeric"
                    style={styles.inputStyle}
                    theme={{
                      colors: {
                        background: COLORS.innerCardBG,
                        text: COLORS.white,
                        placeholder: COLORS.outlineGrey,
                      },
                    }}
                    textColor={COLORS.white}
                    outlineColor={COLORS.outlineGrey}
                    activeOutlineColor={COLORS.white}
                  />
                  <Text style={styles.feeText}>
                    Final payout: ${yearlyPayout.final} - 3% Stripe ($
                    {yearlyPayout.stripeFee}) - 10% platform ($
                    {yearlyPayout.platformFee}) = ${yearlyPayout.final}
                  </Text>
                </>
              )}
            </>
          )}

          <PrimaryButton
            title="Save Subscription Settings"
            onPress={onSave}
            loading={apiUpdateSubscriptionSettingsLoading}
            buttonStyle={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
        </View>
      </View>
      <View style={styles.space} />

      <Modal
        isVisible={isUnlinkModalVisible}
        onBackdropPress={() => setIsUnlinkModalVisible(false)}
        style={styles.modalContainer}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View style={styles.mainModalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Unlink Stripe Account</Text>
            <TouchableOpacity onPress={() => setIsUnlinkModalVisible(false)}>
              <Icon name="X" size={ms(24)} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>
              Are you sure you want to unlink your Stripe account? This action
              will:
            </Text>

            <View style={styles.warningBox}>
              <View style={styles.warningIconContainer}>
                <Icon
                  name="TriangleAlert"
                  size={ms(20)}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.warningTextContainer}>
                <Text style={styles.warningText}>
                  • Disconnect your Stripe account from this community.
                </Text>
                <Text style={styles.warningText}>
                  • Prevent future payouts from being processed.
                </Text>
                <Text style={styles.warningText}>
                  • Require you to reconnect your account to receive payouts
                  again.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={() => setIsUnlinkModalVisible(false)}
              style={styles.modalCancelButton}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <PrimaryButton
              title="Unlink Account"
              onPress={onUnlinkStripe}
              loading={apiUnlinkStripeAccountLoading}
              buttonStyle={styles.modalUnlinkButton}
              textStyle={styles.modalUnlinkText}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PayoutTab;
