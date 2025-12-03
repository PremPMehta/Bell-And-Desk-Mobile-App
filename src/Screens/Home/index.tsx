import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import SearchBar from '@/Components/Core/SearchBar';
import Icon from '@/Components/Core/Icons';

import ImageCarousel from '@/Components/Core/ImageCarousel';
import styles from './style';
import { COLORS } from '@/Assets/Theme/colors';
import HomeCardGrid from '@/Components/Core/HomeCardGrid';
import { cardData, categories, sliderData } from '@/Constants/customData';

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
