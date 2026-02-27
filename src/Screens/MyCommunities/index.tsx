import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import styles from './style';
import MyCommunityCard from '@/Components/Core/MyCommunityCard';
import { categories } from '@/Constants/customData';
import SearchBar from '@/Components/Core/SearchBar';
import AppHeader from '@/Components/Navigation/AppHeader';
import { ms } from '@/Assets/Theme/fontStyle';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { COLORS } from '@/Assets/Theme/colors';
import Icon from '@/Components/Core/Icons';
import MyCommunitiesSkeleton from '@/Components/Core/Skeleton/MyCommunitiesSkeleton';

const MyCommunities = () => {
  const navigation = useNavigation();
  const { getUserData, apiGetUserDataLoading } = useUserApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState<any[]>([]);
  const [planEntitlements, setPlanEntitlements] = useState<any[]>([]);

  // Filter communities by search query (name or description)
  const filteredCommunities = searchQuery.trim()
    ? communities.filter(
      c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : communities;

  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const categoryVisible = useSharedValue(1); // 1 = visible, 0 = hidden

  // Fixed height of the category tab row
  const TAB_HEIGHT = ms(36);
  const MARGIN_GAP = ms(12);
  const TOTAL_HEIGHT = TAB_HEIGHT + MARGIN_GAP;

  const SCROLL_THRESHOLD = ms(10); // how many px before toggling

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const response = await getUserData();
    if (response?.data?.allCommunities) {
      setCommunities(response.data.allCommunities);
    } else {
      setCommunities([]);
    }
    if (response?.data?.planEntitlements) {
      setPlanEntitlements(response.data.planEntitlements);
    } else {
      setPlanEntitlements([]);
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentY = event.contentOffset.y;
      const diff = currentY - lastScrollY.value;

      if (currentY <= 0) {
        // At the very top — always show the category
        if (categoryVisible.value !== 1) {
          categoryVisible.value = withTiming(1, {
            duration: 250,
            easing: Easing.out(Easing.cubic),
          });
        }
      } else if (diff > SCROLL_THRESHOLD && categoryVisible.value !== 0) {
        // Scrolling DOWN — hide category
        categoryVisible.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });
      } else if (diff < -SCROLL_THRESHOLD && categoryVisible.value !== 1) {
        // Scrolling UP — show category
        categoryVisible.value = withTiming(1, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });
      }

      lastScrollY.value = currentY;
      scrollY.value = currentY;
    },
    onBeginDrag: event => {
      lastScrollY.value = event.contentOffset.y;
    },
  });

  // Animated style for the outer clipping wrapper (fixed height, clips overflow)
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(categoryVisible.value, [0, 1], [0, TOTAL_HEIGHT]),
      opacity: interpolate(categoryVisible.value, [0, 1], [0, 1]),
    };
  });

  const renderItem = ({ item }: { item: any }) => (
    <MyCommunityCard
      name={item.name}
      description={item.description}
      bannerImage={{ uri: item.banner }}
      tags={[item.role ?? 'Member']}
      onViewPress={() =>
        navigation.navigate('CommunityLayout', {
          title: item.name,
          communityId: item._id || item.id,
        })
      }
      onSettingsPress={() => console.log('Settings Pressed', item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Icon name="Users" size={40} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>No Communities Yet</Text>
      <Text style={styles.emptySubtitle}>
        You haven't created or joined any communities yet. Start your journey by
        creating your own community or exploring existing ones.
      </Text>
      <View style={styles.emptyButtonRow}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={handleCreateCommunityPress}
        >
          <Text style={styles.createBtnText}>Create Community</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.discoverBtn}
          onPress={handleDiscoverPress}
        >
          <Text style={styles.discoverBtnText}>Discover Communities</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCreateCommunityPress = () => {
    navigation.navigate('ChoosePlan');
  };

  const handleDiscoverPress = () => {
    navigation.goBack();
  };

  // Pick the first entitlement that has a remaining count
  const activeEntitlement = planEntitlements?.[0] ?? null;
  const remainingSlots = activeEntitlement?.remaining ?? 0;
  const planName = activeEntitlement?.planName ?? activeEntitlement?.name ?? '';

  const renderCreateCommunityBanner = () => {
    if (
      !activeEntitlement ||
      remainingSlots <= 0 ||
      searchQuery.trim().length > 0
    )
      return null;
    return (
      <View style={styles.createBannerCard}>
        <Text style={styles.createBannerTitle}>Create New Community</Text>
        <Text style={styles.createBannerSubtitle}>
          You still have{' '}
          <Text style={styles.createBannerHighlight}>{remainingSlots}</Text>{' '}
          communit{remainingSlots === 1 ? 'y' : 'ies'} left under{' '}
          <Text style={styles.createBannerHighlight}>{planName}</Text>.
        </Text>
        <TouchableOpacity style={styles.createBannerBtn}>
          <Text style={styles.createBannerBtnText}>+ Create Community</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <AppHeader />

      {communities.length > 0 && (
        <>
          {/* SEARCH */}
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search communities..."
            />
          </View>

          {/* CATEGORY TABS — animated slide/fade on scroll */}
          <Animated.View
            style={[styles.scrollContainer, animatedContainerStyle]}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryContentContainer}
            >
              {categories.map((item, index) => (
                <TouchableOpacity key={index} style={styles.categoryBtn}>
                  <Text style={styles.categoryBtnText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </>
      )}

      {/* SKELETON / COMMUNITIES LIST */}
      {apiGetUserDataLoading ? (
        <MyCommunitiesSkeleton />
      ) : (
        /* COMMUNITIES LIST */
        <Animated.FlatList
          data={filteredCommunities}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderCreateCommunityBanner}
          contentContainerStyle={[
            styles.contentContainer,
            filteredCommunities.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </View>
  );
};

export default MyCommunities;
