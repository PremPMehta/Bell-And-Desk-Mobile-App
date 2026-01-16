import { View, Text, Animated } from 'react-native';
import React, { useState } from 'react';
import styles from './style';
import FilterTabs from '../CommunityMembers/Components/FilterTabs';
import { SETTINGS_MENU_TABS } from '@/Constants/customData';
import PayoutTab from './Tabs/PayoutTab/PayoutTab';
import MemberTransactionsTab from './Tabs/MemberTransactionsTab/MemberTransactionsTab';
import AccessRequestsTab from './Tabs/AccessRequestsTab/AccessRequestsTab';
import SubscriptionTab from './Tabs/SubscriptionTab/SubscriptionTab';
import CouponsTab from './Tabs/CouponsTab/CouponsTab';

interface Props {
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunitySettings = ({ onScroll, scrollEventThrottle }: Props) => {
  const [activeTab, setActiveTab] = useState('Payout');

  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <FilterTabs
          tabs={SETTINGS_MENU_TABS}
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
        {activeTab === 'Payout' && <PayoutTab />}
        {activeTab === 'Member Transactions' && <MemberTransactionsTab />}
        {activeTab === 'Access Requests' && <AccessRequestsTab />}
        {activeTab === 'Subscription' && <SubscriptionTab />}
        {activeTab === 'Coupons' && <CouponsTab />}
      </View>
    </Animated.ScrollView>
  );
};

export default CommunitySettings;
