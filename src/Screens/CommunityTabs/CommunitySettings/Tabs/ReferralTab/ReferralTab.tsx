import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import TextInputField from '@/Components/Core/TextInputField';
import DropdownField from '@/Components/Core/DropdownField';
import Icon from '@/Components/Core/Icons';
import UserSelectionModal from '@/Components/Generic/Modals/UserSelectionModal';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { useAtom } from 'jotai';
import { currentCommunityIdAtom } from '@/Jotai/Atoms';
import ReferralTabSkeleton from '@/Components/Core/Skeleton/ReferralTabSkeleton';
import Clipboard from '@react-native-clipboard/clipboard';
import ToastModule from '@/Components/Core/Toast';
import { ms } from '@/Assets/Theme/fontStyle';

interface Props {
  userRole?: string;
}

const ReferralTab = ({ userRole }: Props) => {
  const [communityId] = useAtom(currentCommunityIdAtom);
  const isOwner = userRole === 'owner';
  const [fetchInitiatedFor, setFetchInitiatedFor] = useState('');

  const {
    // Owner APIs
    getReferralSettings,
    apiGetReferralSettings,
    apiGetReferralSettingsLoading,
    getCommunityMembers,
    apiGetCommunityMembers,
    updateReferralSettings,
    apiUpdateReferralSettingsLoading,
    // Member APIs
    getReferralBalance,
    apiGetReferralBalance,
    apiGetReferralBalanceLoading,
    getReferralCode,
    apiGetReferralCode,
    apiGetReferralCodeLoading,
  } = useUserApi();

  // ── Member View State & Logic ──
  useEffect(() => {
    if (!isOwner && communityId) {
      setFetchInitiatedFor(communityId);
      getReferralBalance(communityId);
      getReferralCode(communityId, 'platform_signup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId, isOwner]);

  const formatCurrency = (value?: number | string) => {
    const numValue = Number(value || 0);
    // Convert cents to dollars and format
    return (numValue / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  const referralCode = apiGetReferralCode?.code || '';
  const referralLink = referralCode
    ? `https://bellndesk.com/pricing?ref=${referralCode}`
    : '';

  const handleCopyLink = () => {
    if (referralLink) {
      Clipboard.setString(referralLink);
      ToastModule.successTop({ msg: 'Referral link copied to clipboard!' });
    }
  };

  // ── Owner View State ──
  const [programEnabled, setProgramEnabled] = useState(false);
  const [commissionPercentage, setCommissionPercentage] = useState('15');
  const [accessControl, setAccessControl] = useState<'all' | 'specific'>('all');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<
    { id: string; name: string }[]
  >([]);
  const [customPercentage, setCustomPercentage] = useState('15');
  const [exceptions, setExceptions] = useState<
    { id: string; name: string; email: string; percentage: string }[]
  >([]);
  const [whitelistMembers, setWhitelistMembers] = useState<
    { id: string; name: string; email: string }[]
  >([]);
  const [activeSelectionType, setActiveSelectionType] = useState<
    'exception' | 'whitelist' | null
  >(null);

  useEffect(() => {
    if (isOwner && communityId) {
      setFetchInitiatedFor(communityId);
      getReferralSettings(communityId);
      getCommunityMembers(communityId, '?search=&page=1&limit=100');
    }
  }, [communityId, isOwner]);

  useEffect(() => {
    if (isOwner && apiGetReferralSettings?.settings) {
      const { settings } = apiGetReferralSettings;
      setProgramEnabled(settings.isEnabled ?? false);
      setCommissionPercentage(settings.commissionPercentage?.toString() ?? '0');
      setAccessControl(
        settings.accessType === 'whitelist' ? 'specific' : 'all',
      );

      if (settings.whitelistedUsers) {
        setWhitelistMembers(
          settings.whitelistedUsers.map((user: any) => ({
            id: user._id || user.id,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            email: user.email,
          })),
        );
      }

      if (settings.commissionOverrides) {
        setExceptions(
          settings.commissionOverrides.map((override: any) => ({
            id: override.userId?._id || override.userId?.id || override.userId,
            name: `${override.userId?.firstName || ''} ${
              override.userId?.lastName || ''
            }`.trim(),
            email: override.userId?.email || '',
            percentage: override.percentage?.toString() || '0',
          })),
        );
      }
    }
  }, [apiGetReferralSettings, isOwner]);

  // ── Shared Logic ──
  const isLoading =
    communityId !== fetchInitiatedFor ||
    (isOwner
      ? apiGetReferralSettingsLoading
      : apiGetReferralBalanceLoading || apiGetReferralCodeLoading);

  if (isLoading) {
    return <ReferralTabSkeleton />;
  }

  // ── Member View Components ──
  const renderMemberDashboard = () => {
    const balanceData = apiGetReferralBalance?.balance || {};
    const transactionsData = apiGetReferralBalance?.transactions || [];
    const referralData = apiGetReferralCode || {};

    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Referral Link Section */}
          <View style={styles.referralLinkSection}>
            <View style={styles.referralLinkHeader}>
              <Icon name="Store" size={18} color={COLORS.primary} />
              <Text style={styles.referralLinkTitle}>Partner Program</Text>
            </View>
            <Text style={styles.referralLinkSubTitle}>
              Refer creators to build their own communities on Bell n Desk. Earn
              wallet credits when they subscribe.
            </Text>
            <View style={styles.linkContainer}>
              <Text style={styles.referralLinkText} numberOfLines={1}>
                {referralLink || 'Loading link...'}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyLink}
              >
                <Icon name="Copy" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Referral Code & Commission Info */}
          <View style={styles.promoSection}>
            <View style={styles.promoCard}>
              <Text style={styles.promoLabel}>Referral Code</Text>
              <Text style={styles.promoValue}>{referralData.code || '—'}</Text>
            </View>
            <View style={[styles.promoCard, styles.commissionCard]}>
              <Text style={styles.promoLabel}>Commission</Text>
              <Text style={styles.promoValue}>
                {referralData.percentage || '0'}%
              </Text>
            </View>
          </View>

          {/* Wallet Balance Card (Per Image) */}
          <View style={styles.walletBalanceCard}>
            <View style={styles.walletWatermark}>
              <Icon name="Wallet" size={ms(120)} color={COLORS.white} />
            </View>

            <Text style={styles.walletTitle}>Wallet Balance</Text>

            <Text style={styles.availableBalanceLabel}>Available Balance</Text>
            <Text style={styles.availableBalanceValue}>
              {formatCurrency(balanceData.balance)}
            </Text>

            <View style={styles.statsInlineRow}>
              <View style={styles.inlineStatItem}>
                <Text style={styles.inlineStatLabel}>Total Earnings</Text>
                <Text style={styles.inlineStatValue}>
                  {formatCurrency(balanceData.totalEarnings)}
                </Text>
              </View>
              <View style={styles.inlineStatItem}>
                <Text style={styles.inlineStatLabel}>Pending Withdrawal</Text>
                <Text style={styles.pendingValue}>
                  {formatCurrency(balanceData.pendingWithdrawal)}
                </Text>
              </View>
            </View>

            <Text style={styles.minWithdrawalText}>
              Minimum withdrawal: {formatCurrency(balanceData.minWithdrawal)}
            </Text>
          </View>

          {/* Transaction History Section */}
          <View style={styles.transactionSection}>
            <Text style={styles.transactionTitle}>Transaction History</Text>
            {transactionsData.length > 0 ? (
              <View style={styles.transactionList}>
                {transactionsData.map((item: any, index: number) => (
                  <View key={index} style={styles.transactionItem}>
                    <View style={styles.transactionHeader}>
                      <Text style={styles.transactionType}>{item.type}</Text>
                      <Text style={styles.transactionDate}>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                    <Text style={styles.transactionDescription}>
                      {item.description}
                    </Text>
                    <View style={styles.transactionFooter}>
                      <Text style={styles.transactionAmount}>
                        {formatCurrency(item.amount)}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          item.status?.toLowerCase() === 'pending' &&
                            styles.pendingStatusBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            item.status?.toLowerCase() === 'pending' &&
                              styles.pendingStatusText,
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyTransactionContainer}>
                <Text style={styles.emptyTransactionText}>
                  No transactions found.{'\n'}Start referring to earn!
                </Text>
              </View>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  };

  // ── Owner View Components ──
  const renderOwnerSettings = () => {
    const handleUserSelect = (selectedIds: string[]) => {
      const allMembers = apiGetCommunityMembers?.data?.members || [];
      const members = selectedIds
        .map(id => allMembers.find((user: any) => (user._id || user.id) === id))
        .filter((user): user is any => !!user)
        .map((user: any) => ({
          id: user._id || user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
        }));

      if (activeSelectionType === 'exception') {
        setSelectedMembers(members);
      } else if (activeSelectionType === 'whitelist') {
        setWhitelistMembers(members);
      }
    };

    const handleAddException = () => {
      if (selectedMembers.length > 0 && customPercentage) {
        let addedCount = 0;
        let duplicateCount = 0;
        const newExceptions = [...exceptions] as any;

        selectedMembers.forEach(member => {
          if (!newExceptions.find(e => e.id === member.id)) {
            newExceptions.push({ ...member, percentage: customPercentage });
            addedCount++;
          } else {
            duplicateCount++;
          }
        });

        setExceptions(newExceptions);

        if (duplicateCount > 0) {
          Alert.alert(
            'Duplicates Found',
            `${duplicateCount} member(s) were already in the exception list and were not added again.`,
          );
        }

        setSelectedMembers([]);
        setCustomPercentage('15');
      }
    };

    const handleRemoveException = (id: string) => {
      setExceptions(exceptions.filter(e => e.id !== id));
    };

    const getSelectedMembersLabel = () => {
      if (selectedMembers.length === 0) return '';
      if (selectedMembers.length === 1) return selectedMembers[0].name;
      return `${selectedMembers.length} Members Selected`;
    };

    const getWhitelistMembersLabel = () => {
      if (whitelistMembers.length === 0) return '';
      if (whitelistMembers.length === 1) return whitelistMembers[0].name;
      return `${whitelistMembers.length} Members Selected`;
    };

    const openExceptionModal = () => {
      setActiveSelectionType('exception');
      setShowMemberModal(true);
    };

    const openWhitelistModal = () => {
      setActiveSelectionType('whitelist');
      setShowMemberModal(true);
    };

    const handleSaveSettings = async () => {
      if (!communityId) return;

      if (
        isNaN(Number(commissionPercentage)) ||
        Number(commissionPercentage) < 0 ||
        Number(commissionPercentage) > 100
      ) {
        Alert.alert(
          'Invalid Commission',
          'Please enter a valid commission percentage (0-100)',
        );
        return;
      }

      const payload = {
        _id: apiGetReferralSettings?.settings?._id,
        communityId: communityId,
        isEnabled: programEnabled,
        accessType: accessControl === 'specific' ? 'whitelist' : 'all',
        commissionPercentage: Number(commissionPercentage),
        whitelistedUsers: whitelistMembers.map(m => m.id),
        commissionOverrides: exceptions.map(e => ({
          userId: e.id,
          percentage: Number(e.percentage),
        })),
      };

      const res = await updateReferralSettings(communityId, payload);
      if (res?.success) {
        // Success handled in hook
      }
    };

    return (
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Header / Enable Toggle */}
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Member Referral Program</Text>
              <Text style={styles.subtitle}>
                Incentivize members to bring new students to your courses.
              </Text>
            </View>
            <Switch
              value={programEnabled}
              onValueChange={setProgramEnabled}
              trackColor={{ false: COLORS.outlineGrey, true: COLORS.primary }}
              thumbColor={COLORS.white}
              ios_backgroundColor={COLORS.outlineGrey}
            />
          </View>

          {/* Commission Structure */}
          <View
            style={[
              styles.sectionContainer,
              !programEnabled && { opacity: 0.5 },
            ]}
            pointerEvents={programEnabled ? 'auto' : 'none'}
          >
            <Text style={styles.sectionTitle}>Commission Structure</Text>
            <TextInputField
              label="Commission Percentage"
              value={commissionPercentage}
              onChangeText={setCommissionPercentage}
              keyboardType="numeric"
              rightIcon="percent"
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
            <Text style={styles.inputHelperText}>
              Percentage of course sales given to the referrer (0-100)
            </Text>
          </View>

          {/* Access Control */}
          <View
            style={[
              styles.sectionContainer,
              !programEnabled && { opacity: 0.5 },
            ]}
            pointerEvents={programEnabled ? 'auto' : 'none'}
          >
            <Text style={styles.sectionTitle}>Access Control</Text>
            <Text style={styles.sectionSubHeader}>
              Who can generate referral codes?
            </Text>

            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioItem}
                onPress={() => setAccessControl('all')}
                activeOpacity={0.8}
              >
                <RadioButton.Android
                  value="all"
                  status={accessControl === 'all' ? 'checked' : 'unchecked'}
                  onPress={() => setAccessControl('all')}
                  color={COLORS.primary}
                  uncheckedColor={COLORS.outlineGrey}
                />
                <Text style={styles.radioLabel}>All Members</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioItem}
                onPress={() => setAccessControl('specific')}
                activeOpacity={0.8}
              >
                <RadioButton.Android
                  value="specific"
                  status={
                    accessControl === 'specific' ? 'checked' : 'unchecked'
                  }
                  onPress={() => setAccessControl('specific')}
                  color={COLORS.primary}
                  uncheckedColor={COLORS.outlineGrey}
                />
                <Text style={styles.radioLabel}>
                  Specific Members (Whitelist)
                </Text>
              </TouchableOpacity>
            </View>

            {accessControl === 'specific' && (
              <View style={{ marginTop: 16 }}>
                <DropdownField
                  label="Search Members"
                  value={getWhitelistMembersLabel()}
                  placeholder="Select Members"
                  onPress={openWhitelistModal}
                  rightIcon="chevron-down"
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
                <Text style={styles.inputHelperText}>
                  Only whitelisted members will be able to generate referral
                  codes.
                </Text>
              </View>
            )}
          </View>

          {/* Commission Exceptions */}
          <View
            style={[
              styles.sectionContainer,
              !programEnabled && { opacity: 0.5 },
            ]}
            pointerEvents={programEnabled ? 'auto' : 'none'}
          >
            <Text style={styles.sectionTitle}>Commission Exceptions</Text>
            <Text style={styles.sectionSubHeader}>
              Set custom commission percentages for specific members (overrides
              default).
            </Text>

            <View style={styles.row}>
              <View style={[styles.exceptionInputContainer, { flex: 2 }]}>
                <DropdownField
                  label="Search Member for Exception"
                  value={getSelectedMembersLabel()}
                  placeholder="Select Member"
                  onPress={openExceptionModal}
                  rightIcon="chevron-down"
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
              </View>
              <View style={[styles.exceptionInputContainer, { flex: 1 }]}>
                <TextInputField
                  label="Custom %"
                  value={customPercentage}
                  onChangeText={setCustomPercentage}
                  keyboardType="numeric"
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
              </View>
            </View>
            <TouchableOpacity
              onPress={handleAddException}
              style={[
                styles.addButton,
                selectedMembers.length === 0 && { opacity: 0.5 },
              ]}
              disabled={selectedMembers.length === 0}
            >
              <Icon name="CirclePlus" size={14} color={COLORS.white} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>

            <View style={styles.exceptionListContainer}>
              {exceptions.length === 0 ? (
                <Text style={styles.emptyText}>No exceptions added yet.</Text>
              ) : (
                exceptions.map(item => (
                  <View key={item.id} style={styles.exceptionItem}>
                    <View style={styles.exceptionUserIcon}>
                      <Icon name="User" size={18} color={COLORS.white} />
                    </View>
                    <View style={styles.exceptionUserInfo}>
                      <Text style={styles.exceptionUser}>{item.name}</Text>
                      <Text style={styles.exceptionSubUser}>{item.email}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={styles.exceptionValue}>
                        {item.percentage}%
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveException(item.id)}
                        style={{ marginLeft: 16 }}
                      >
                        <Icon name="Trash2" size={18} color={COLORS.red} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSaveSettings}
            style={[
              styles.saveButtonContainer,
              apiUpdateReferralSettingsLoading && { opacity: 0.7 },
            ]}
            disabled={apiUpdateReferralSettingsLoading}
          >
            {apiUpdateReferralSettingsLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.saveButton}>Save Settings</Text>
            )}
          </TouchableOpacity>

          <UserSelectionModal
            visible={showMemberModal}
            onClose={() => setShowMemberModal(false)}
            onSelect={handleUserSelect}
            users={(apiGetCommunityMembers?.data?.members || []).map(
              (user: any) => ({
                id: user._id || user.id,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                email: user.email,
              }),
            )}
            initialSelectedIds={
              activeSelectionType === 'whitelist'
                ? whitelistMembers.map(m => m.id)
                : selectedMembers.map(m => m.id)
            }
          />
        </View>
      </KeyboardAwareScrollView>
    );
  };

  return isOwner ? renderOwnerSettings() : renderMemberDashboard();
};

export default ReferralTab;
