import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import AppHeader from '@/Components/Navigation/AppHeader';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { useNavigation } from '@/Hooks/Utils/use-navigation';

interface SettingItemProps {
  icon: string;
  label: string;
  iconBgColor: string;
  isLast?: boolean;
  onPress?: () => void;
}

const SettingItem = ({
  icon,
  label,
  iconBgColor,
  isLast,
  onPress,
}: SettingItemProps) => (
  <>
    <TouchableOpacity
      style={styles.itemContainer}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.itemContent}>
        <View style={[styles.iconBackground, { backgroundColor: iconBgColor }]}>
          <Icon name={icon} size={18} color="#fff" />
        </View>
        <Text style={styles.itemText}>{label}</Text>
      </View>
      <Icon name="ChevronRight" size={20} color="#38383A" />
    </TouchableOpacity>
    {!isLast && <View style={styles.divider} />}
  </>
);

const Settings = () => {
  const navigation = useNavigation();

  const accountSettings = [
    {
      icon: 'User',
      label: 'Edit Profile',
      bgColor: '#007AFF',
      onPress: () => navigation.navigate('Profile'),
    },
    { icon: 'Bell', label: 'Notifications', bgColor: '#FF9500' },
    { icon: 'Shield', label: 'Security & Privacy', bgColor: '#4CD964' },
    { icon: 'CreditCard', label: 'Payments', bgColor: '#5856D6' },
  ];

  const communitySettings = [
    {
      icon: 'Link',
      label: 'My Referral',
      bgColor: '#FF2D55',
      onPress: () => navigation.navigate('MyReferral'),
    },
    { icon: 'Users', label: 'Community Management', bgColor: '#AF52DE' },
  ];

  const supportSettings = [
    {
      icon: 'MessageCircleQuestionMark',
      label: 'FAQ',
      bgColor: '#8E8E93',
      onPress: () => navigation.navigate('FAQ'),
    },
    {
      icon: 'LifeBuoy',
      label: 'Support',
      bgColor: '#007AFF',
      onPress: () => navigation.navigate('Support'),
    },
    {
      icon: 'DollarSign',
      label: 'Pricing',
      bgColor: '#34C759',
      onPress: () => navigation.navigate('ChoosePlan'),
    },
    { icon: 'Info', label: 'About Us', bgColor: '#5AC8FA' },
  ];

  const legalSettings = [
    {
      icon: 'FileText',
      label: 'Terms and Conditions',
      bgColor: '#34C759',
      onPress: () => navigation.navigate('TermsAndConditions'),
    },
    {
      icon: 'Lock',
      label: 'Privacy Policy',
      bgColor: '#FF3B30',
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      icon: 'Cookie',
      label: 'Cookie Policy',
      bgColor: '#FF9500',
      onPress: () => navigation.navigate('CookiePolicy'),
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.itemsCard}>
            {accountSettings.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                iconBgColor={item.bgColor}
                isLast={index === accountSettings.length - 1}
                onPress={item.onPress}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community</Text>
          <View style={styles.itemsCard}>
            {communitySettings.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                iconBgColor={item.bgColor}
                isLast={index === communitySettings.length - 1}
                onPress={item.onPress}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Info</Text>
          <View style={styles.itemsCard}>
            {supportSettings.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                iconBgColor={item.bgColor}
                isLast={index === supportSettings.length - 1}
                onPress={item.onPress}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.itemsCard}>
            {legalSettings.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                iconBgColor={item.bgColor}
                isLast={index === legalSettings.length - 1}
                onPress={item.onPress}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
          <Icon name="LogOut" size={20} color="#FF453A" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Settings;
