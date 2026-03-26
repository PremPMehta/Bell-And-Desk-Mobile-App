import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '@/Assets/Theme/colors';
import styles from './style';

interface Props {
  tabs: Array<{ id: string; title: string }>;
  selectedTab: string;
  onTabPress: (id: string) => void;
}

const CommunityMenuTabs = ({ tabs, selectedTab, onTabPress }: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (selectedTab && tabLayouts[selectedTab] && scrollViewRef.current && containerWidth > 0) {
      const { x, width } = tabLayouts[selectedTab];
      const scrollX = x - (containerWidth / 2) + (width / 2);
      scrollViewRef.current.scrollTo({
        x: Math.max(0, scrollX),
        animated: true,
      });
    }
  }, [selectedTab, tabLayouts, containerWidth]);

  const handleTabLayout = (id: string) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => ({
      ...prev,
      [id]: { x, width },
    }));
  };

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.tabsWrapper} onLayout={handleContainerLayout}>
      <ScrollView
        ref={scrollViewRef}
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
            onLayout={handleTabLayout(tab.id)}
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
