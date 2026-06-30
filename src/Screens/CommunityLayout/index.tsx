import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, Animated } from 'react-native';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { useRoute } from '@react-navigation/native';
import styles from './style';
import { COMMUNITY_MENU_TABS } from '@/Constants/customData';
import CommunityMenuTabs from '@/Components/Core/CommunityMenuTabs';
import CommunityMenuTabsContent from '@/Components/Generic/CommunityMenuTabsContent';
import AppHeader from '@/Components/Navigation/AppHeader';
import { useAtom } from 'jotai';
import { currentCommunityIdAtom } from '@/Jotai/Atoms';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';

const TAB_HEIGHT = 50; // Height of the tab bar
const SCROLL_THRESHOLD = 20;

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

  // If user is not owner and somehow lands on members/videos tab, redirect to courses
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

  // ─── Animation Setup ─────────────────────────────────────────────────────
  const tabTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  // ─── Tab press ────────────────────────────────────────────────────────────
  const handleTabPress = useCallback(
    (tabKey: string) => {
      if (tabKey === 'mycommunities') {
        navigation.goBack();
        return;
      }
      setSelectedTab(tabKey);
    },
    [navigation],
  );

  // ─── Flicker-free scroll handler ─────────────────────────────────────────
  const handleScroll = useCallback(
    (event: any) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      // Always show when at the top
      if (currentScrollY <= 0) {
        if (isHidden.current) {
          isHidden.current = false;
          Animated.timing(tabTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
        return;
      }

      if (delta > SCROLL_THRESHOLD && !isHidden.current) {
        // Scrolling down - hide tabs
        isHidden.current = true;
        Animated.timing(tabTranslateY, {
          toValue: -TAB_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else if (delta < -SCROLL_THRESHOLD && isHidden.current) {
        // Scrolling up - show tabs
        isHidden.current = false;
        Animated.timing(tabTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
    [tabTranslateY],
  );

  return (
    <View style={styles.mainContainer}>
      <AppHeader />

      <View style={styles.middleContainer}>

        {/* Content area */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: -TAB_HEIGHT,
            paddingTop: TAB_HEIGHT,
            transform: [{ translateY: tabTranslateY }],
          }}
        >
          <CommunityMenuTabsContent
            selectedTab={selectedTab}
            communityId={communityId}
            slug={slug}
            userRole={userRole}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        </Animated.View>

        {/* Tab bar — absolutely positioned at top:0 of middleContainer */}
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

      </View>
    </View>
  );
};

export default CommunityLayout;

