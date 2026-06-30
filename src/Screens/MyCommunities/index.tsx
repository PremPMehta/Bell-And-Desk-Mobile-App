import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
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
import { useIsFocused } from '@react-navigation/native';
import ToastModule from '@/Components/Core/Toast';


const MyCommunities = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { getUserData, apiGetUserDataLoading, getCommunityModerators, user } =
    useUserApi();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [communities, setCommunities] = useState<any[]>([]);
  const [planEntitlements, setPlanEntitlements] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [screenLoading, setScreenLoading] = useState(true);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  // Filter communities by search query (name or description)
  const filteredCommunities = useMemo(() => communities.filter(c => {
    const matchesSearch = searchQuery.trim()
      ? c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory = selectedCategory === 'All';

    return matchesSearch && matchesCategory;
  }), [communities, searchQuery, selectedCategory]);

  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const categoryVisible = useSharedValue(1);

  // Fixed height of the category tab row
  const TAB_HEIGHT = ms(36);
  const MARGIN_GAP = ms(12);
  const TOTAL_HEIGHT = TAB_HEIGHT + MARGIN_GAP;

  const SCROLL_THRESHOLD = ms(10);

  // Fetch user data on mount and focus
  useEffect(() => {
    if (isFocused) {
      setScreenLoading(true);
      fetchUserData();
    } else {
      setScreenLoading(true);
    }
  }, [isFocused]);


  const fetchUserData = useCallback(async () => {
    try {
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
      if (response?.data?.reservations) {
        setReservations(response.data.reservations);
      } else {
        setReservations([]);
      }
      if (response?.data?.activePlanId) {
        setActivePlanId(response.data.activePlanId);
      } else {
        setActivePlanId(null);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    } finally {
      setScreenLoading(false);
    }
  }, [getUserData]);

  const handleOpenCommunity = useCallback(async (
    item: any,
    options?: { initialTab?: string },
  ) => {
    const communityId = item?._id || item?.id;
    const slug = item?.subdomain;

    try {
      if (communityId) {
        const res: any = await getCommunityModerators(communityId);
        const moderators: any[] = res?.data || [];
        const currentUserId = user?._id;

        if (currentUserId && Array.isArray(moderators)) {
          const me = moderators.find(m => {
            const mUserId =
              typeof m?.userId === 'string'
                ? m.userId
                : m?.userId?._id || m?.userId?.id;
            return mUserId === currentUserId;
          });

          const status = (me?.status || '').toString().toLowerCase();
          if (status === 'inactive') {
            ToastModule.errorBottom({
              msg: 'Your moderator access is inactive for this community.',
            });
            return;
          }
        }
      }
    } catch (e) {
      // Fail-open
    }

    navigation.navigate('CommunityLayout', {
      title: item.name,
      communityId,
      slug,
      ...(options?.initialTab ? { initialTab: options.initialTab } : {}),
    });
  }, [navigation, getCommunityModerators, user]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      const currentY = event.contentOffset.y;
      const diff = currentY - lastScrollY.value;

      if (currentY <= 0) {
        if (categoryVisible.value !== 1) {
          categoryVisible.value = withTiming(1, {
            duration: 250,
            easing: Easing.out(Easing.cubic),
          });
        }
      } else if (diff > SCROLL_THRESHOLD && categoryVisible.value !== 0) {
        categoryVisible.value = withTiming(0, {
          duration: 250,
          easing: Easing.out(Easing.cubic),
        });
      } else if (diff < -SCROLL_THRESHOLD && categoryVisible.value !== 1) {
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

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(categoryVisible.value, [0, 1], [0, TOTAL_HEIGHT]),
      opacity: interpolate(categoryVisible.value, [0, 1], [0, 1]),
    };
  });

  const renderItem = useCallback(({ item }: { item: any }) => (
    <MyCommunityCard
      name={item.name}
      description={item.description}
      bannerImage={item.banner}
      tags={item.role ?? 'Member'}
      onViewPress={() => handleOpenCommunity(item)}
      onSettingsPress={() => handleOpenCommunity(item, { initialTab: 'settings' })}
    />
  ), [handleOpenCommunity]);

  const handleCreateCommunityPress = useCallback(() => {
    if (remainingSlots > 0) {
      navigation.navigate('CreateCommunity', {
        isEditMode: false,
        planId: activeEntitlement?._id,
      });
    } else {
      navigation.navigate('ChoosePlan');
    }
  }, [navigation, remainingSlots, activeEntitlement]);

  const handleDiscoverPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Pick the active entitlement based on activePlanId, or fallback to the first one
  const activeEntitlement = useMemo(() => activePlanId
    ? planEntitlements?.find(plan => plan?.planId === activePlanId || plan?._id === activePlanId) ?? planEntitlements?.[0] ?? null
    : planEntitlements?.[0] ?? null, [activePlanId, planEntitlements]);
  const remainingSlots = activeEntitlement?.remaining ?? 0;
  const planName = activeEntitlement?.planName ?? activeEntitlement?.name ?? '';

  const renderCreateCommunityBanner = useMemo(() => {
    if (
      !activeEntitlement ||
      remainingSlots <= 0 ||
      searchQuery.trim().length > 0 ||
      selectedCategory !== 'All'
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
        <TouchableOpacity
          style={styles.createBannerBtn}
          onPress={() =>
            navigation.navigate('CreateCommunity', {
              isEditMode: false,
              planId: activeEntitlement?._id,
            })
          }
        >
          <Text style={styles.createBannerBtnText}>+ Create Community</Text>
        </TouchableOpacity>
      </View>
    );
  }, [activeEntitlement, remainingSlots, searchQuery, selectedCategory, navigation, planName]);

  const renderPaymentPendingBanner = useMemo(() => {
    if (
      reservations.length === 0 ||
      searchQuery.trim().length > 0 ||
      selectedCategory !== 'All'
    )
      return null;

    return (
      <>
        {reservations.map((reservation, index) => (
          <View
            key={reservation?._id || index}
            style={styles.paymentPendingCard}
          >
            <Text style={styles.paymentPendingTitle}>Payment Pending</Text>
            <Text style={styles.paymentPendingSubtitle}>
              Complete payment for{' '}
              <Text style={styles.paymentPendingHighlight}>
                /{reservation?.slug || reservation?.username || 'user'}
              </Text>{' '}
              to continue.
            </Text>
            <TouchableOpacity
              style={styles.completePaymentBtn}
              onPress={() => {
                if (reservation?.stripeCheckoutSessionUrl) {
                  Linking.openURL(reservation.stripeCheckoutSessionUrl);
                }
              }}
            >
              <Text style={styles.completePaymentBtnText}>
                Complete Payment
              </Text>
              <Icon name="ArrowRight" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ))}
      </>
    );
  }, [reservations, searchQuery, selectedCategory]);

  const ListHeader = useMemo(() => (
    <View>
      {renderPaymentPendingBanner}
      {renderCreateCommunityBanner}
    </View>
  ), [renderPaymentPendingBanner, renderCreateCommunityBanner]);

  const renderEmptyState = useCallback(() => (
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
  ), [handleCreateCommunityPress, handleDiscoverPress]);

  return (
    <View style={styles.mainContainer}>
      <AppHeader />

      {communities.length > 0 && !(apiGetUserDataLoading || screenLoading) && (
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
              {categories.map((item, index) => {
                const isActive = selectedCategory === item;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryBtn,
                      isActive && styles.categoryBtnActive,
                    ]}
                    onPress={() => setSelectedCategory(item)}
                  >
                    <Text
                      style={[
                        styles.categoryBtnText,
                        isActive && styles.categoryBtnTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        </>
      )}

      {/* SKELETON / COMMUNITIES LIST */}
      {apiGetUserDataLoading || screenLoading ? (
        <MyCommunitiesSkeleton />
      ) : (
        <Animated.FlatList
          data={filteredCommunities}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id || item.id}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[
            styles.contentContainer,
            filteredCommunities.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          ListEmptyComponent={renderEmptyState}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </View>
  );
};

export default MyCommunities;
