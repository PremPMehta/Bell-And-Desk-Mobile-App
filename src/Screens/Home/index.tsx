import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import SearchBar from '@/Components/Core/SearchBar';
import Icon from '@/Components/Core/Icons';
import AppHeader from '@/Components/Navigation/AppHeader';

import ImageCarousel from '@/Components/Core/ImageCarousel';
import VideoPlayer from '@/Components/Core/VideoPlayer';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import HomeCardGrid from '@/Components/Core/HomeCardGrid';
import HomeSkeleton from '@/Components/Core/Skeleton/HomeSkeleton';
import { cardData, categories, sliderData } from '@/Constants/customData';
import { AppImages } from '@/Assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { useRequireAuth } from '@/Hooks/Utils/use-require-auth';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import { useAtom } from 'jotai';
import { userAtom } from '@/Jotai/Atoms';

const BANNER_HEIGHT = 220;

interface HeroSection {
  tag?: string;
  headingTitle?: string;
  heroImage?: string;
  heroImages?: string[] | Record<string, string> | string;
  paragraph?: string;
  subHeaderTitle?: string;
}

interface SiteSettingsData {
  heroSection?: HeroSection;
  postLoginHeroSection?: HeroSection;
}

const Home = () => {
  const navigation = useNavigation();
  const [user]: any = useAtom(userAtom);
  console.log('🚀 ~ Home ~ user:', user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(
    null,
  );
  const [communities, setCommunities] = useState<any[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const {
    getSiteSettings,
    apiGetSiteSettingsLoading,
    getCommunities,
    apiGetCommunitiesLoading,
  } = useUserApi();
  const { requireAuth, isLoggedIn } = useRequireAuth();
  const isLoading =
    isInitialLoading || apiGetSiteSettingsLoading || apiGetCommunitiesLoading;
  const isHavePlan = user?.planEntitlements?.length > 0;

  console.log('🚀 ~ Home ~ isLoggedIn:', isLoggedIn);

  const scrollY = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const categoriesY = useRef(0);
  const [videoVisible, setVideoVisible] = useState(true);

  const onChangeSearch = query => setSearchQuery(query);

  // Fetch site settings and communities on component mount
  useEffect(() => {
    const initFetch = async () => {
      try {
        // Run both fetches in parallel
        await Promise.all([
          (async () => {
            try {
              const response = await getSiteSettings();
              if (response?.success && response?.data) {
                setSiteSettings(response.data);
              }
            } catch (error) {
              console.error('Error fetching site settings:', error);
            }
          })(),
          (async () => {
            try {
              const response = await getCommunities();
              if (response?.success && response?.communities) {
                setCommunities(response.communities);
              }
            } catch (error) {
              console.error('Error fetching communities:', error);
            }
          })(),
        ]);
      } finally {
        setIsInitialLoading(false);
      }
    };

    initFetch();
  }, []); // Only fetch once on mount

  // Conditionally select carousel data based on login status
  const carouselData = useMemo(() => {
    const defaultData = sliderData.map((img: string) => ({ heroImage: img }));

    if (!siteSettings) {
      return defaultData;
    }

    // Get the appropriate hero section based on login status
    const heroData = isLoggedIn
      ? siteSettings.postLoginHeroSection
      : siteSettings.heroSection;

    // If heroData exists, return it as the first and only item in the array
    // This allows the Carousel to work correctly with the API response
    if (heroData) {
      return [heroData];
    }

    // Fallback to default if no heroData is found
    return defaultData;
  }, [siteSettings, isLoggedIn]); // Recalculate when siteSettings or login state changes

  const mappedCommunities = useMemo(() => {
    const dataToFilter =
      communities && communities.length > 0 ? communities : cardData;

    return dataToFilter
      .filter((item: any) => {
        // Category filtering
        const matchesCategory =
          selectedCategory === 'All' ||
          item.category?.toLowerCase() === selectedCategory.toLowerCase();

        // Search filtering
        const matchesSearch =
          !searchQuery ||
          (item.name || item.title)
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .map((item: any) => ({
        ...item,
        id: item.id || item._id,
        title: item.name || item.title,
        category: item.category,
        image: item.banner || item.image,
      }));
  }, [communities, selectedCategory, searchQuery]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = event.nativeEvent.contentOffset.y;
      scrollY.current = currentOffset;

      const shouldShowVideo = currentOffset <= BANNER_HEIGHT;

      // Prevent unnecessary re-renders
      setVideoVisible(prev => {
        if (prev !== shouldShowVideo) {
          return shouldShowVideo;
        }
        return prev;
      });
    },
    [],
  );

  const handlePrimaryButtonPress = () => {
    console.log('Primary Button Pressed');
    requireAuth('ChoosePlan');
  };

  const handleButtonPress = () => {
    console.log('Button Pressed');
    requireAuth('MyCommunities');
  };

  const handleExplorePress = () => {
    console.log('Explore Communities Pressed');
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: categoriesY.current,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <AppHeader />
      <ScrollView
        ref={scrollViewRef}
        // style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {isLoading ? (
          <HomeSkeleton />
        ) : (
          <>
            {/* VIDEO BANNER */}
            <View style={styles.videoContainer}>
              <VideoPlayer
                source={AppImages.videoBanner}
                autoPlay={videoVisible}
                loop={true}
                controls={false}
                muted={true}
                resizeMode="cover"
                style={styles.videoBanner}
              />

              {/* Bottom Gradient Shadow */}
              <LinearGradient
                colors={[COLORS.transparent, COLORS.grMedium2, COLORS.grDark]}
                style={styles.bottomShadow}
                pointerEvents="none"
              />
            </View>

            <View style={styles.container}>
              {/* CAROUSEL CONTAINER */}
              <ImageCarousel
                data={carouselData}
                primaryButtonText={
                  isLoggedIn
                    ? !isHavePlan
                      ? 'Start Your Own Community'
                      : null
                    : 'Ring the Bell'
                }
                onPressPrimaryButton={handlePrimaryButtonPress}
                buttonText={isLoggedIn ? 'My Communities' : null}
                onPressButton={handleButtonPress}
                exploreButtonText={'Explore Communities'}
                onPressExploreButton={handleExplorePress}
              />

              {/* SEARCH */}
              <SearchBar
                value={searchQuery}
                onChangeText={onChangeSearch}
                placeholder="Search communities..."
              />

              {/* HEADER */}
              <View
                style={styles.headerRow}
                onLayout={event => {
                  categoriesY.current = event.nativeEvent.layout.y;
                }}
              >
                <Text style={styles.headerText}>Categories</Text>
              </View>

              {/* CATEGORY TABS */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContentContainer}
              >
                {categories.map((item, index) => {
                  const isActive = selectedCategory === item;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.categoryBtn,
                        isActive && styles.activeCategoryBtn,
                      ]}
                      onPress={() => setSelectedCategory(item)}
                    >
                      <Text
                        style={[
                          styles.categoryBtnText,
                          isActive && styles.activeCategoryBtnText,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* CARDS GRID */}
              {mappedCommunities.length > 0 ? (
                <>
                  <Text style={styles.sectionTitle}>
                    {selectedCategory + ' Communities'}
                  </Text>
                  <HomeCardGrid
                    data={mappedCommunities}
                    onPressCard={item => {
                      console.log('Community card clicked:', item);
                      navigation.navigate('CategoryDetails', {
                        slug: item?.subdomain,
                      });
                      // navigation.navigate('MyCommunities', {
                      //   screen: 'CommunityLayout',
                      //   params: {
                      //     title: item?.title || item?.name,
                      //     itemData: item,
                      //   },
                      // });
                    }}
                  />
                </>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>No communities found</Text>
                  <Text style={styles.emptySubtitle}>
                    Try adjusting your search criteria or browse all categories
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;
