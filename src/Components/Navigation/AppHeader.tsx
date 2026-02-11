import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import Icon from '../Core/Icons';
import { ms, sc, vs } from '@/Assets/Theme/fontStyle';
import { AppImages } from '@/Assets/Images';

const AppHeader = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const handleLoginPress = () => {
    // Navigate to login screen or handle login action
    console.log('Login pressed');
    (navigation as any).navigate('SignIn');
  };

  const getHeaderTitle = () => {
    // Check if a title was passed in route params (e.g. Community Name)
    const paramTitle = (route.params as any)?.title;
    if (paramTitle) return paramTitle;

    switch (route.name) {
      case 'MyCommunities':
      case 'MyCommunitiesMain':
        return 'My Communities';
      // case 'MyReferral':
      //   return 'My Referral';
      // case 'Support':
      //   return 'Support';
      // case 'ChoosePlan':
      //   return 'Pricing';
      case 'CommunityLayout':
        return 'Community Layout';
      case 'Settings':
        return 'Settings';
      default:
        return '';
    }
  };

  const title = getHeaderTitle();
  const isHome = route.name === 'Home' || !title;

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
      <TouchableOpacity
        onPress={handleMenuPress}
        style={styles.menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="Menu" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        {isHome ? (
          <Image source={AppImages.companyLogo} style={styles.logo} />
        ) : (
          <Text style={styles.headerTitle}>{title}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={handleLoginPress}
        style={styles.loginButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(12),
    paddingBottom: ms(12),
    backgroundColor: COLORS.header,
    // borderBottomWidth: 1,
    // borderBottomColor: COLORS.border,
  },
  menuButton: {},
  logoContainer: {
    justifyContent: 'center',
    marginLeft: ms(16),
  },
  headerTitle: {
    ...THEME.fontStyle.h4SemiBold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  logo: {
    width: sc(100),
    height: vs(16),
    resizeMode: 'contain',
  },
  loginButton: {},
  loginText: {
    ...THEME.fontStyle.h5SemiBold,
    color: COLORS.white,
    // letterSpacing: 0.5,
  },
});

export default AppHeader;
