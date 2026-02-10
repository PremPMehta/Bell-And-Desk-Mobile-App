import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import { COMMUNITY_MENU_TABS, MOCK_COMMUNITIES } from '@/Constants/customData';
import CommunityMenuTabs from '@/Components/Core/CommunityMenuTabs';
import CommunityMenuTabsContent from '@/Components/Generic/CommunityMenuTabsContent';
import AppHeader from '@/Components/Navigation/AppHeader';

const TAB_HEIGHT = 50; // Height of the tab bar

const CommunityLayout = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('courses');

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
            tabs={COMMUNITY_MENU_TABS}
            selectedTab={selectedTab}
            onTabPress={handleTabPress}
          />
        </Animated.View>

        {/* Content with animated top padding */}
        <Animated.View style={{ flex: 1, paddingTop: contentPaddingTop }}>
          <CommunityMenuTabsContent
            selectedTab={selectedTab}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        </Animated.View>
      </View>
    </View>
  );
};


export default CommunityLayout;
