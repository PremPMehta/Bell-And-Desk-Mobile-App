import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
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
  const translationY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  // Tighter height and gap values
  const TAB_HEIGHT = ms(36);
  const MARGIN_GAP = ms(12);
  const TOTAL_HEIGHT = TAB_HEIGHT + MARGIN_GAP;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const diff = currentY - lastScrollY.value;

      if (currentY <= 0) {
        translationY.value = 0;
      } else {
        // Accumulate diff but clamp it
        const nextTranslationY = translationY.value - diff;
        translationY.value = Math.max(-TOTAL_HEIGHT, Math.min(0, nextTranslationY));
      }

      lastScrollY.value = currentY;
      scrollY.value = currentY;
    },
    // Reset or handle edge cases if needed
    onBeginDrag: (event) => {
      lastScrollY.value = event.contentOffset.y;
    }
  });

  const DYNAMIC_MARGIN = ms(4);

  const animatedStyle = useAnimatedStyle(() => {
    // Smoothly interpolate opacity but keep height/transform direct for performance
    const opacity = interpolate(translationY.value, [-TOTAL_HEIGHT, 0], [0, 1]);

    // Overscroll compensation to prevent gap at top
    const overscroll = scrollY.value < 0 ? -scrollY.value : 0;

    return {
      height: Math.max(0, TOTAL_HEIGHT + translationY.value),
      opacity: opacity,
      transform: [{ translateY: overscroll }],
      marginBottom: interpolate(
        translationY.value,
        [-TOTAL_HEIGHT, 0],
        [0, DYNAMIC_MARGIN],
      ), // Subtle dynamic margin
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

      {/* CATEGORY TABS */}
      <Animated.View style={[styles.scrollContainer, animatedStyle]}>
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
