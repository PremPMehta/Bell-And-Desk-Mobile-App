import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { useRoute } from '@react-navigation/native';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import { COMMUNITY_MENU_TABS, MOCK_COMMUNITIES } from '@/Constants/customData';
import CommunityMenuTabs from '@/Components/Core/CommunityMenuTabs';
import CommunityMenuTabsContent from '@/Components/Generic/CommunityMenuTabsContent';
import AppHeader from '@/Components/Navigation/AppHeader';
import { useAtom } from 'jotai';
import { currentCommunityIdAtom } from '@/Jotai/Atoms';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';

const TAB_HEIGHT = 50; // Height of the tab bar

const CommunityLayout = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { communityId, slug } = route.params || {};
  const [, setCurrentCommunityId] = useAtom(currentCommunityIdAtom);

  const { apiGetUserData, apiGetCommunitiesSlug } = useUserApi();

  const communityData = useMemo(() => {
    return apiGetCommunitiesSlug?.data?.community || {};
  }, [apiGetCommunitiesSlug]);

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

  const filteredTabs = useMemo(() => {
    if (userRole === 'owner') {
      return COMMUNITY_MENU_TABS;
    }
    return COMMUNITY_MENU_TABS.filter(
      tab => tab.id !== 'members' && tab.id !== 'videos',
    );
  }, [userRole]);

  const [selectedTab, setSelectedTab] = useState(
    route.params?.initialTab || 'courses',
  );

  // If user is not owner and somehow lands on members tab, redirect to courses
  React.useEffect(() => {
    if (
      userRole !== 'owner' &&
      (selectedTab === 'members' || selectedTab === 'videos')
    ) {
      setSelectedTab('courses');
    }
  }, [userRole, selectedTab]);

  React.useEffect(() => {
    if (communityId) {
      setCurrentCommunityId(communityId);
    }
  }, [communityId, setCurrentCommunityId]);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const tabTranslateY = useRef(new Animated.Value(0)).current;
  const contentPaddingTop = useRef(new Animated.Value(TAB_HEIGHT)).current;
  const lastScrollY = useRef(0);
  const isAnimating = useRef(false);

  const handleMyCommunitiesPress = () => {
    navigation.goBack();
  };

  const handleTabPress = tabKey => {
    if (tabKey === 'mycommunities') {
      handleMyCommunitiesPress();
      return; // Prevent updating selectedTab
    }
    setSelectedTab(tabKey);
  };

  // Handle scroll event
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    // Prevent multiple animations at once
    if (isAnimating.current) return;

    // Only hide/show if scrolled more than a threshold
    if (Math.abs(scrollDiff) > 3) {
      if (scrollDiff > 0 && currentScrollY > 20) {
        // Scrolling down - hide tabs and reduce padding
        isAnimating.current = true;
        Animated.parallel([
          Animated.timing(tabTranslateY, {
            toValue: -TAB_HEIGHT,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(contentPaddingTop, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false,
          }),
        ]).start(() => {
          isAnimating.current = false;
        });
      } else if (scrollDiff < 0 || currentScrollY <= 0) {
        // Scrolling up or at top - show tabs and restore padding
        isAnimating.current = true;
        Animated.parallel([
          Animated.timing(tabTranslateY, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(contentPaddingTop, {
            toValue: TAB_HEIGHT,
            duration: 250,
            useNativeDriver: false,
          }),
        ]).start(() => {
          isAnimating.current = false;
        });
      }
    }

    lastScrollY.current = currentScrollY;
  };

  return (
    <View style={styles.mainContainer}>
      <AppHeader />

      {/* Container for tabs and content */}
      <View style={styles.middleContainer}>
        {/* Animated Tabs - Positioned absolutely */}
        <Animated.View
          style={[
            styles.animateStyle,
            { transform: [{ translateY: tabTranslateY }] },
          ]}
        >
          <CommunityMenuTabs
            tabs={filteredTabs}
            selectedTab={selectedTab}
            onTabPress={handleTabPress}
          />
        </Animated.View>

        {/* Content with animated top padding */}
        <Animated.View style={{ flex: 1, paddingTop: contentPaddingTop }}>
          <CommunityMenuTabsContent
            selectedTab={selectedTab}
            communityId={communityId}
            slug={slug}
            userRole={userRole}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        </Animated.View>
      </View>
    </View>
  );
};



export default CommunityLayout;
