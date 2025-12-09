import React, { useState } from 'react';
import { View, Text, Animated, FlatList, TouchableOpacity } from 'react-native';
import styles from './style';
import MemberItem from './Components/MemberItem';
import FilterTabs from './Components/FilterTabs';
import SearchBar from '@/Components/Core/SearchBar';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { MEMBER_FILTER_TABS, MOCK_MEMBERS } from '@/Constants/customData';

interface Props {
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityMembers = ({ onScroll, scrollEventThrottle }: Props) => {
  const [activeTab, setActiveTab] = useState('Active');
  const [searchText, setSearchText] = useState('');

  const filteredMembers = MOCK_MEMBERS.filter(member => {
    const matchesTab =
      activeTab === 'All' ||
      member.status === activeTab ||
      (activeTab === 'Subscribers' && member.role === 'Subscriber'); // simplified logic
    const matchesSearch =
      member.name.toLowerCase().includes(searchText.toLowerCase()) ||
      member.email.toLowerCase().includes(searchText.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Members</Text>
      <FilterTabs
        tabs={MEMBER_FILTER_TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
      <View style={styles.searchRow}>
        <View style={styles.searchBarContainer}>
          <SearchBar
            value={searchText}
            onChangeText={setSearchText}
            // placeholder="Search user by name or email..."
          />
        </View>
        <TouchableOpacity style={styles.exportButton}>
          <Icon name="Download" size={18} color={COLORS.white} />
          <Text style={styles.exportText}>Export CSV</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Animated.FlatList
      data={filteredMembers}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <MemberItem
          name={item.name}
          email={item.email}
          joinedDate={item.joinedDate}
          status={item.status as any}
          role={item.role as any}
          type={item.type as any}
        />
      )}
      style={styles.animatedScroll}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={renderHeader()}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CommunityMembers;
