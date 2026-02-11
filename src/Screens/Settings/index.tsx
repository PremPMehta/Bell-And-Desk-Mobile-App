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
            {ACCOUNT_SETTINGS.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                iconBgColor={item.bgColor}
                isLast={index === ACCOUNT_SETTINGS.length - 1}
                onPress={() => handleNavigation(item.routeName)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community</Text>
          <View style={styles.itemsCard}>
            {COMMUNITY_SETTINGS.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                iconBgColor={item.bgColor}
                isLast={index === COMMUNITY_SETTINGS.length - 1}
                onPress={() => handleNavigation(item.routeName)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Info</Text>
          <View style={styles.itemsCard}>
            {SUPPORT_SETTINGS.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                iconBgColor={item.bgColor}
                isLast={index === SUPPORT_SETTINGS.length - 1}
                onPress={() => handleNavigation(item.routeName)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.itemsCard}>
            {LEGAL_SETTINGS.map((item, index) => (
              <SettingItem
                key={item.label}
                icon={item.icon}
                label={item.label}
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
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Settings;
