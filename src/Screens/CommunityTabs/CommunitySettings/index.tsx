import { View, Text, Animated, Platform } from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './style';
import FilterTabs from '../CommunityMembers/Components/FilterTabs';
import { SETTINGS_MENU_TABS } from '@/Constants/customData';
import PayoutTab from './Tabs/PayoutTab/PayoutTab';
import MemberTransactionsTab from './Tabs/MemberTransactionsTab/MemberTransactionsTab';
import AccessRequestsTab from './Tabs/AccessRequestsTab/AccessRequestsTab';
import SubscriptionTab from './Tabs/SubscriptionTab/SubscriptionTab';
import CouponsTab from './Tabs/CouponsTab/CouponsTab';
import BillingsTab from './Tabs/BillingsTab/BillingsTab';
import ReferralTab from './Tabs/ReferralTab/ReferralTab';
import ModeratorsTab from './Tabs/ModeratorsTab/ModeratorsTab';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';

// Tabs visible only to members (not owners)
const MEMBER_ONLY_TABS = ['Subscription', 'Referrals'];

const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(
  KeyboardAwareScrollView,
);

interface Props {
  communityId?: string;
  slug?: string;
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunitySettings = ({
  communityId,
  slug,
  onScroll,
  scrollEventThrottle,
}: Props) => {
  const { apiGetCommunitiesSlug, apiGetUserData } = useUserApi();

  // ── Derive community name ──
  const communityName =
    apiGetCommunitiesSlug?.data?.community?.name ||
    apiGetCommunitiesSlug?.data?.community?.title ||
    '';

  // ── Derive user role (same pattern as CommunityLayout) ──
  const communityData = useMemo(
    () => apiGetCommunitiesSlug?.data?.community || {},
    [apiGetCommunitiesSlug],
  );

  const userRole = useMemo(() => {
    const allCommunities = apiGetUserData?.data?.allCommunities || [];
    const currentId = communityData?._id || communityId;
    const currentSlug = slug || communityData?.slug || communityData?.subdomain;

    const currentComm = allCommunities.find(
      (c: any) =>
        (currentId && (c._id === currentId || c.id === currentId)) ||
        (currentSlug && c.subdomain === currentSlug),
    );

    return currentComm?.role?.toLowerCase() || 'member';
  }, [apiGetUserData, communityData, communityId, slug]);

  // ── Filter tabs based on role ──
  const filteredTabs = useMemo(() => {
    if (userRole === 'owner') {
      return SETTINGS_MENU_TABS;
    }
    // Members only see Subscription + Referrals
    return SETTINGS_MENU_TABS.filter(tab => MEMBER_ONLY_TABS.includes(tab));
  }, [userRole]);

  const [activeTab, setActiveTab] = useState(filteredTabs[0] || 'Subscription');

  // ── Reset active tab if role changes or filtered tabs change ──
  useEffect(() => {
    if (!filteredTabs.includes(activeTab)) {
      setActiveTab(filteredTabs[0] || 'Subscription');
    }
  }, [filteredTabs, activeTab]);

  return (
    <AnimatedKeyboardAwareScrollView
      style={{ flex: 1 }}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 70 : 150}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <FilterTabs
          tabs={filteredTabs}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />

        {/* Owner-only tabs */}
        {activeTab === 'Payout' && <PayoutTab slug={slug} />}
        {activeTab === 'Member Transactions' && (
          <MemberTransactionsTab slug={slug} />
        )}
        {activeTab === 'Access Requests' && (
          <AccessRequestsTab slug={slug} communityId={communityId} />
        )}
        {activeTab === 'Coupons' && (
          <CouponsTab slug={slug} communityId={communityId} />
        )}
        {activeTab === 'Billings' && <BillingsTab slug={slug} />}
        {activeTab === 'Moderators' && (
          <ModeratorsTab communityId={communityId} />
        )}

        {/* Tabs visible to both owner and member */}
        {activeTab === 'Subscription' && (
          <SubscriptionTab slug={slug} communityName={communityName} userRole={userRole} />
        )}
        {activeTab === 'Referrals' && <ReferralTab userRole={userRole} />}
      </View>
    </AnimatedKeyboardAwareScrollView>
  );
};

export default CommunitySettings;
