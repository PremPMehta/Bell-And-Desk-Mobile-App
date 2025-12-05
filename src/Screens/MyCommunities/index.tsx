import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@/Hooks/Utils/use-navigation';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';
import MyCommunityCard from '@/Components/Core/MyCommunityCard';
import { categories, MOCK_COMMUNITIES } from '@/Constants/customData';
import SearchBar from '@/Components/Core/SearchBar';

const MyCommunities = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const renderItem = ({ item }: { item: any }) => (
    <MyCommunityCard
      name={item.name}
      description={item.description}
      bannerImage={item.bannerImage}
      tags={item.tags}
      onViewPress={() => navigation.navigate('CommunityLayout')}
      onSettingsPress={() => console.log('Settings Pressed', item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="Menu" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Communities</Text>
        <TouchableOpacity>
          <Icon name="CircleUserRound" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search communities..."
        />
      </View>

      {/* CATEGORY TABS */}
      <View style={styles.scrollContainer}>
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
      </View>

      {/* COMMUNITIES LIST */}
      <FlatList
        data={MOCK_COMMUNITIES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default MyCommunities;
