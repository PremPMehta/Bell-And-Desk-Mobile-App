import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import SearchBar from '@/Components/Core/SearchBar';
import Icon from '@/Components/Core/Icons';

import ImageCarousel from '@/Components/Core/ImageCarousel';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import HomeCardGrid from '@/Components/Core/HomeCardGrid';

const sliderData = [
  'https://picsum.photos/200/300/?blur',
  'https://picsum.photos/200/300/?blur',
  'https://picsum.photos/200/300/?blur',
];

const categories = ['All', 'Design', 'Development', 'Marketing', 'Sales'];

export const cardData = [
  {
    id: 1,
    title: 'Bell n Desk',
    category: 'Technology',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    id: 2,
    title: 'Bell n Desk',
    category: 'Technology',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    id: 3,
    title: 'Bell n Desk',
    category: 'Technology',
    image: 'https://picsum.photos/600/400?random=3',
  },
  {
    id: 4,
    title: 'Bell n Desk',
    category: 'Technology',
    image: 'https://picsum.photos/600/400?random=4',
  },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => setSearchQuery(query);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.black }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 40,
      }}
    >
      {/* CAROUSEL CONTAINER */}
      <ImageCarousel
        data={sliderData}
        buttonText="Start Your Own Community"
        onPressButton={() => {
          console.log('Carousel button clicked!');
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
        <TouchableOpacity style={styles.seeAll}>
          <Text style={styles.seeAllText}>See All</Text>
          <Icon name="ChevronRight" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* CATEGORY TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContentContainer}
      >
        {categories.map((item, index) => (
          <TouchableOpacity key={index} style={styles.categoryBtn}>
            <Text style={styles.categoryBtnText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CARDS GRID */}
      <HomeCardGrid data={cardData} onPressCard={() => {}} />
    </ScrollView>
  );
};

export default Home;
