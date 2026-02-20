import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions } from '@react-navigation/native';
import { COLORS } from '@/Assets/Theme/colors';
import { THEME } from '@/Assets/Theme';
import Icon from '../Core/Icons';
import { ms, sc, vs } from '@/Assets/Theme/fontStyle';
import { AppImages } from '@/Assets/Images';

import { useAtomValue } from 'jotai';
import { userTokenAtom, userAtom } from '@/Jotai/Atoms';
import { useRequireAuth } from '@/Hooks/Utils/use-require-auth';

const AppHeader = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const token = useAtomValue(userTokenAtom);
  const user: any = useAtomValue(userAtom);
  const profileImage = user?.profilePicture?.url;

  const { requireAuth } = useRequireAuth();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // const handleLoginPress = () => {
  //   // Navigate to login screen or handle login action
  //   console.log('Login pressed');
  //   navigation.navigate('SignIn');
  // };
  const handleLoginPress = () => {
    // Open SignIn and redirect back to current screen after login
    navigation.navigate('SignIn', {
      redirectTo: route.name,
      redirectParams: route.params,
    });
  };

  const handleProfilePress = () => {
    requireAuth('Profile');
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
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 30) }]}>
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

      {token ? (
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.loginButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {profileImage ? (
            <Image
              source={
                profileImage ? { uri: profileImage } : AppImages.communityLogo
              }
              style={styles.profileImg}
            />
          ) : (
            <Icon name="CircleUser" size={28} color={COLORS.white} />
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={handleLoginPress}
          style={styles.loginButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>
      )}
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
    marginLeft: ms(8),
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
  profileImg: {
    width: sc(24),
    height: sc(24),
    borderRadius: sc(16),
    // backgroundColor: COLORS.gray,
  },
  loginButton: {},
  loginText: {
    ...THEME.fontStyle.h5SemiBold,
    color: COLORS.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default AppHeader;
