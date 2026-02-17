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
import { cardData, categories, sliderData } from '@/Constants/customData';
import { AppImages } from '@/Assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import { useAtomValue } from 'jotai';
import { userTokenAtom } from '@/Jotai/Atoms';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData | null>(
    null,
  );
  const { getSiteSettings, apiGetSiteSettingsLoading } = useUserApi();
  const userToken = useAtomValue(userTokenAtom);
  const isLoggedIn = !!userToken;

  const scrollY = useRef(0);
  const [videoVisible, setVideoVisible] = useState(true);

  const onChangeSearch = query => setSearchQuery(query);

  // Fetch site settings only once on component mount
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await getSiteSettings();
        console.log('🚀 ~ fetchSiteSettings ~ response:', response);

        if (response?.success && response?.data) {
          setSiteSettings(response.data);
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();
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
  console.log('🚀 ~ Home ~ carouselData:', carouselData);

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

  return (
    <View style={styles.mainContainer}>
      <AppHeader />
      <ScrollView
        // style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={styles.contentContainerStyle}
      >
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
            primaryButtonText={isLoggedIn ? null : 'Ring the Bell'}
            onPressPrimaryButton={() => { }}
            buttonText={isLoggedIn ? 'My Communities' : null}
            onPressButton={() => {
              console.log('Carousel button clicked!');
              // navigation.navigate('SomeScreen')
            }}
            exploreButtonText={'Explore Communities'}
            onPressExploreButton={() => {
              console.log('Explore button clicked!');
              // navigation.navigate('SomeScreen')
            }}
          />

          {/* SEARCH */}
          <SearchBar
            value={searchQuery}
            onChangeText={onChangeSearch}
            placeholder="Search communities..."
          />

          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Categories</Text>
            {/* <TouchableOpacity style={styles.seeAll}>
            <Text style={styles.seeAllText}>See All</Text>
            <Icon name="ChevronRight" size={18} color={COLORS.white} />
          </TouchableOpacity> */}
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
          <HomeCardGrid data={cardData} onPressCard={() => { }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
