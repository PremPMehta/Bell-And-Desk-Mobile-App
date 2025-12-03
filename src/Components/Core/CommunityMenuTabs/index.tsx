import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';

interface Props {
  tabs: Array<{ id: string; title: string }>;
  selectedTab: string;
  onTabPress: (id: string) => void;
}

const CommunityMenuTabs = ({ tabs, selectedTab, onTabPress }: Props) => {
  console.log('checking the tabs ---> ', tabs);

  return (
    <View style={styles.tabsWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabItem,
              selectedTab === tab.id && styles.activeTabItem,
            ]}
            onPress={() => onTabPress(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <LinearGradient
        colors={['transparent', COLORS.black]}
        start={{ x: 0, y: -0.5 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
        pointerEvents="none"
      />
    </View>
  );
};

export default CommunityMenuTabs;
