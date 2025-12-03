import { View, Text, Animated, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MOCK_COMMUNITIES } from '@/Constants/customData';
import CoursesCard from '@/Components/Core/CoursesCard';
import styles from './style';
import SearchBar from '@/Components/Core/SearchBar';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

interface Props {
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityCourses = ({ onScroll, scrollEventThrottle }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => setSearchQuery(query);
  const renderItem = ({ item }: { item: any }) => (
    <CoursesCard
      name={item.name}
      description={item.description}
      bannerImage={item.bannerImage}
      tags={item.tags}
      onEyePress={() => {}}
      onEditPress={() => {}}
      onDeletePress={() => {}}
    />
  );

  return (
    <View style={styles.container}>
      {/* <Text style={{ color: 'white' }}>CommunityCourses</Text> */}

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={onChangeSearch}
          placeholder="Search through your courses..."
          searchInputStyle={styles.searchInputStyle}
        />
        {/* <Text>Hello</Text> */}
        <TouchableOpacity style={styles.create}>
          <Icon name="CirclePlus" size={12} color={COLORS.white} />
          <Text style={styles.createTxt}>Create</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        data={MOCK_COMMUNITIES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      />
    </View>
  );
};

export default CommunityCourses;
