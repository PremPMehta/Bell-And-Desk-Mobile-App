import React, { act, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import Clipboard from '@react-native-clipboard/clipboard';
import ToastModule from '@/Components/Core/Toast';
import {
  BELLNDESK_REFERRALS,
  COMMUNITY_REFERRALS,
} from '@/Constants/customData';
import AppHeader from '@/Components/Navigation/AppHeader';

const MyReferral = () => {
  const [activeTab, setActiveTab] = useState<'community' | 'bellndesk'>(
    'community',
  );

  const handleCopy = (link: string) => {
    Clipboard.setString(link);
    ToastModule.successTop({ msg: 'Copied to Clipboard' });
  };

  const renderReferralItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.communityInfo}>
          <View style={styles.avatarContainer}>
            {item.logo ? (
              <Image
                source={{ uri: item.logo }}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <Text style={styles.avatarText}>{item.initial}</Text>
            )}
          </View>
          <View style={styles.communityNameContainer}>
            <Text style={styles.communityName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.program && (
              <View style={styles.communityProgramContainer}>
                <Text style={styles.communityProgram}>{item.program}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.commissionBadge}>
          <Icon name="CircleDollarSign" size={12} color={COLORS.green} />
          <Text style={styles.commissionText}>
            {item.commission} Commission
          </Text>
        </View>
      </View>
      <View style={styles.linkContainer}>
        <Text style={styles.linkText} numberOfLines={1}>
          {item.link}
        </Text>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => handleCopy(item.link)}
        >
          <Icon name="Copy" size={18} color={COLORS.subText} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <AppHeader /> */}

      {activeTab !== 'community' && (
        <View style={styles.balanceContainer}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceTitle}>Platform Referral Balance</Text>
            <Text style={styles.balanceValue}>$0.00</Text>
            <Text style={styles.totalEarnings}>Total Earnings: $0.00</Text>
          </View>
          <Icon name="CircleDollarSign" size={40} color={COLORS.primary} />
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'community' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('community')}
        >
          <Icon
            name="Users"
            size={18}
            color={activeTab === 'community' ? COLORS.white : COLORS.subText}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'community' && styles.activeTabText,
            ]}
          >
            Community Referrals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'bellndesk' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('bellndesk')}
        >
          <Icon
            name="Store"
            size={18}
            color={activeTab === 'bellndesk' ? COLORS.white : COLORS.subText}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'bellndesk' && styles.activeTabText,
            ]}
          >
            Bell n Desk Referrals
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={
          activeTab === 'community' ? COMMUNITY_REFERRALS : BELLNDESK_REFERRALS
        }
        renderItem={renderReferralItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyReferral;
