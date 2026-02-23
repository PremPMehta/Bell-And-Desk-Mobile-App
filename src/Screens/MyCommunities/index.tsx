import React, { useState } from 'react';
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
import { categories, MOCK_COMMUNITIES } from '@/Constants/customData';
import SearchBar from '@/Components/Core/SearchBar';
import AppHeader from '@/Components/Navigation/AppHeader';
import { ms } from '@/Assets/Theme/fontStyle';

const MyCommunities = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const categoryVisible = useSharedValue(1); // 1 = visible, 0 = hidden

  // Fixed height of the category tab row
  const TAB_HEIGHT = ms(36);
  const MARGIN_GAP = ms(12);
  const TOTAL_HEIGHT = TAB_HEIGHT + MARGIN_GAP;

  const SCROLL_THRESHOLD = ms(10); // how many px before toggling

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
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
    onBeginDrag: (event) => {
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
      bannerImage={item.bannerImage}
      tags={item.tags}
      onViewPress={() =>
        navigation.navigate('CommunityLayout', { title: item.name })
      }
      onSettingsPress={() => console.log('Settings Pressed', item.id)}
    />
  );

  return (
    <View style={styles.mainContainer}>
      <AppHeader />

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search communities..."
        />
      </View>

      {/* CATEGORY TABS — animated slide/fade on scroll */}
      <Animated.View style={[styles.scrollContainer, animatedContainerStyle]}>
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

      {/* COMMUNITIES LIST */}
      <Animated.FlatList
        data={MOCK_COMMUNITIES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default MyCommunities;
