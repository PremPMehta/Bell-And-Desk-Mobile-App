import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import AppHeader from '@/Components/Navigation/AppHeader';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import {
  ACCOUNT_SETTINGS,
  COMMUNITY_SETTINGS,
  SUPPORT_SETTINGS,
  LEGAL_SETTINGS,
} from '@/Constants/customData';
import { COLORS } from '@/Assets/Theme/colors';
import { useAtom } from 'jotai';
import { logoutVisibleAtom } from '@/Jotai/Atoms';
import { useTranslation } from 'react-i18next';

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
          <Icon name={icon} size={18} color={COLORS.white} />
        </View>
        <Text style={styles.itemText}>{label}</Text>
      </View>
      <Icon name="ChevronRight" size={20} color={COLORS.arrow} />
    </TouchableOpacity>
    {!isLast && <View style={styles.divider} />}
  </>
);

const Settings = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [, setIsLogoutModalVisible] = useAtom(logoutVisibleAtom);

  const handleNavigation = (routeName?: string) => {
    if (routeName) {
      navigation.navigate(routeName as any);
    }
  };

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  // Translate menu items
  const getTranslatedLabel = (label: string): string => {
    const labelMap: { [key: string]: string } = {
      'Edit Profile': t('settings.editProfile'),
      'Notifications': t('settings.notifications'),
      'Security & Privacy': t('settings.securityPrivacy'),
      'Payments': t('settings.payments'),
      'Language': t('settings.language'),
      'My Referral': t('settings.myReferral'),
      'Community Management': t('settings.communityManagement'),
      'FAQ': t('settings.faq'),
      'Support': t('settings.support'),
      'Pricing': t('settings.pricing'),
      'About Us': t('settings.aboutUs'),
      'Terms and Conditions': t('settings.termsAndConditions'),
      'Privacy Policy': t('settings.privacyPolicy'),
      'Cookie Policy': t('settings.cookiePolicy'),
    };
    return labelMap[label] || label;
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
          <View style={styles.itemsCard}>
            {ACCOUNT_SETTINGS.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={getTranslatedLabel(item.label)}
                iconBgColor={item.bgColor}
                isLast={index === ACCOUNT_SETTINGS.length - 1}
                onPress={() => handleNavigation(item.routeName)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.community')}</Text>
          <View style={styles.itemsCard}>
            {COMMUNITY_SETTINGS.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={getTranslatedLabel(item.label)}
                iconBgColor={item.bgColor}
                isLast={index === COMMUNITY_SETTINGS.length - 1}
                onPress={() => handleNavigation(item.routeName)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.supportInfo')}</Text>
          <View style={styles.itemsCard}>
            {SUPPORT_SETTINGS.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={getTranslatedLabel(item.label)}
                iconBgColor={item.bgColor}
                isLast={index === SUPPORT_SETTINGS.length - 1}
                onPress={() => handleNavigation(item.routeName)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.legal')}</Text>
          <View style={styles.itemsCard}>
            {LEGAL_SETTINGS.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={getTranslatedLabel(item.label)}
                iconBgColor={item.bgColor}
                isLast={index === LEGAL_SETTINGS.length - 1}
                onPress={() => handleNavigation(item.routeName)}
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Icon name="LogOut" size={20} color={COLORS.red} />
          <Text style={styles.logoutText}>{t('settings.logOut')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Settings;
