import React from 'react';
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
import CommunityCard from '@/Components/CommunityCard';
import LinearGradient from 'react-native-linear-gradient';

// Mock Data
const MOCK_COMMUNITIES = [
  {
    id: '1',
    name: 'CryptoManji Academy',
    description:
      'Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y prosperar en el emocionante mundo de inversiones en activos digitales.',
    bannerImage: { uri: 'https://picsum.photos/seed/1/350/150' },
    logoImage: { uri: 'https://picsum.photos/seed/1/100/100' },
    tags: ['General', 'Owner'],
  },
  {
    id: '2',
    name: 'CryptoManji Academy',
    description:
      'Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y prosperar en el emocionante mundo de inversiones en activos digitales.',
    bannerImage: { uri: 'https://picsum.photos/seed/2/350/150' },
    logoImage: { uri: 'https://picsum.photos/seed/2/100/100' },
    tags: ['General', 'Owner'],
  },
  {
    id: '3',
    name: 'CryptoManji Academy',
    description:
      'Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y prosperar en el emocionante mundo de inversiones en activos digitales.',
    bannerImage: { uri: 'https://picsum.photos/seed/3/350/150' },
    logoImage: { uri: 'https://picsum.photos/seed/3/100/100' },
    tags: ['General', 'Owner'],
  },
  {
    id: '4',
    name: 'CryptoManji Academy',
    description:
      'Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y prosperar en el emocionante mundo de inversiones en activos digitales.',
    bannerImage: { uri: 'https://picsum.photos/seed/4/350/150' },
    logoImage: { uri: 'https://picsum.photos/seed/4/100/100' },
    tags: ['General', 'Owner'],
  },
];

const MyCommunities = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: any }) => (
    <CommunityCard
      name={item.name}
      description={item.description}
      bannerImage={item.bannerImage}
      logoImage={item.logoImage}
      tags={item.tags}
      onViewPress={() => console.log('View Pressed', item.id)}
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
        <Text style={styles.headerTitle}>CryptoManji Academy</Text>
        <TouchableOpacity>
          <Icon name="CircleUserRound" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          <TouchableOpacity style={[styles.tabItem, styles.activeTabItem]}>
            <Text style={[styles.tabText, styles.activeTabText]}>
              My Communities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabText}>Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabText}>Live Stream</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabText}>Board</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabText}>Members</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabText}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabText}>Settings</Text>
          </TouchableOpacity>
        </ScrollView>
        <LinearGradient
          colors={['transparent', COLORS.black]}
          start={{ x: 0, y: -0.5 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
          pointerEvents="none"
        />
      </View>

      {/* Content */}
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
