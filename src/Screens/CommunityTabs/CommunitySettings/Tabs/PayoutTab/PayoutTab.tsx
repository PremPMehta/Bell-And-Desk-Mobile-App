import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import { THEME } from '@/Assets/Theme';
import Icon from '@/Components/Core/Icons';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInputField from '@/Components/Core/TextInputField';
import styles from './style';

const PayoutTab = () => {
  const [isSubscriptionEnabled, setIsSubscriptionEnabled] = useState(false);
  const [description, setDescription] = useState('');
  const [monthlyPrice, setMonthlyPrice] = useState('0');
  const [yearlyPrice, setYearlyPrice] = useState('0');
  const [isMonthlyActive, setIsMonthlyActive] = useState(true);

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
            {/* <Icon name="Settings" size={ms(20)} color={COLORS.lightGray} /> */}
          </View>
          <View style={styles.divider} />

          <View style={styles.stripeConnectRow}>
            <View>
              <Text style={styles.connectedText}>Connected with Stripe</Text>
              <Text style={styles.uIdText}>
                Stripe account ID: acct_1NHW...
              </Text>
            </View>
            <TouchableOpacity style={styles.dashboardButton}>
              <Text style={styles.dashboardButtonText}>
                Go to Stripe Dashboard
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceTitle}>Balancce & Payouts</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceValue}>$0.00</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Pending</Text>
              <Text style={styles.balanceValue}>$38.70</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Total Balance</Text>
              <Text style={styles.balanceValue}>$38.70</Text>
            </View>
          </View>

          <View style={styles.payoutSchedule}>
            <Text style={styles.scheduleLabel}>Payout Schedule</Text>
            <Text style={styles.scheduleValue}>
              Daily payouts with 2 days delay
            </Text>
            <Text style={styles.nextPayout}>Next payout: December 3, 2025</Text>
          </View>

          {/* Recent Payout Card */}
          <View style={styles.recentContainer}>
            <Text style={styles.recentTitle}>Recent Transactions</Text>
            <View style={styles.recentPayoutRow}>
              <View>
                <Text style={styles.payoutAmount}>$45.00 USD</Text>
                <Text style={styles.payoutDate}>
                  payout - Available Dec 5, 2025
                </Text>
              </View>
              <View style={styles.paidBadge}>
                <Text style={styles.paidText}>Pending</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>Request Withdrawal</Text>
          </TouchableOpacity>

          {/* Info Cards */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Icon name="TriangleAlert" size={ms(20)} color={'#FFC107'} />
              <Text style={styles.infoTitle}>
                Cannot Withdraw Pending Funds
              </Text>
            </View>
            <Text style={styles.infoText}>
              You have $38.70 in pending funds, but $0.00 available to
              withdrawal.
            </Text>
            <Text style={styles.infoSubText}>
              Why you can't withdraw pending funds:{'\n'}• Pending funds are
              still being processed by Stripe{'\n'}• They are subject to a hold
              period (typically 2-7 business days){'\n'}• Only "Available
              balance" can be withdrawn{'\n'}
              {'\n'}
              When your funds will become available:{'\n'}
              $38.70 on December 4, 2025{'\n'}
              {'\n'}
              Why funds might still be pending:{'\n'}• Stripe may hold funds for
              new accounts (typically 7-14 days for first payout){'\n'}• The
              delay period is calculated in business days, not calendar days
              {'\n'}• Additional verification may be required for your account
              {'\n'}
              {'\n'}
              Check your Stripe Dashboard for exact availability date of your
              funds.
            </Text>
          </View>
          <View style={[styles.infoCard, { borderColor: COLORS.gray }]}>
            <View style={styles.infoHeader}>
              <Icon name="Info" size={ms(20)} color={COLORS.white} />
              <Text style={styles.infoTitle}> Instant Payouts:</Text>
            </View>
            <Text style={styles.infoText}>
              Instant Payouts allow you to receive funds within 30 minutes via
              an eligible debit card. This feature needs to be enabled by the
              platform. Contact support to check if Instant Payouts are
              available for your account.
            </Text>
          </View>
          <View style={[styles.infoCard, { borderColor: COLORS.gray }]}>
            <View style={styles.infoHeader}>
              <Icon name="Info" size={ms(20)} color={COLORS.white} />
              <Text style={styles.infoTitle}> How Withdrawals Work:</Text>
            </View>
            <Text style={styles.infoText}>
              You can request manual payouts at any time using the button above.
              Standard payouts are also automatically sent to your connected
              bank account based on your payout schedule. You can manage your
              payout schedule and bank account details via your Stripe Express
              Dashboard.
            </Text>
          </View>
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
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Refresh</Text>
            </View>
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

          {/* <Text style={styles.inputLabel}>Subscription Description</Text> */}
          <TextInputField
            label="Subscription Description"
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
            // theme={{ colors: { background: COLORS.innerCardBG } }}
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

          <Text style={styles.radioTitle}>Available Subscription Options</Text>
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
              onPress={() => setYearlyPrice(prev => prev)}
            >
              <Icon name="Circle" size={ms(20)} color={COLORS.gray} />
              <Text style={styles.radioLabel}>Yearly subscription</Text>
            </TouchableOpacity>
          </View>

          {/* <Text style={styles.inputLabel}>Monthly Price $</Text> */}
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

          {/* <Text style={[styles.inputLabel, { marginTop: ms(16) }]}>
            Yearly Price $
          </Text> */}
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

          <PrimaryButton
            title="Save Subscription Settings"
            onPress={() => {}}
            buttonStyle={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
        </View>
      </View>
      <View style={styles.space} />
    </>
  );
};

export default PayoutTab;
