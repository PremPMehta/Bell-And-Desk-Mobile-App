import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '@/Assets/Theme';
import { COLORS } from '@/Assets/Theme/colors';
import { ms } from '@/Assets/Theme/fontStyle';
import LinearGradient from 'react-native-linear-gradient';

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabPress(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
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

export default FilterTabs;

const styles = StyleSheet.create({
  container: {
    marginTop: ms(12),
  },
  scrollContent: {
    paddingRight: ms(16),
  },
  tab: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(6),
    borderRadius: ms(20), // Pill shape
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: ms(10),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    ...THEME.fontStyle.h5Medium,
    color: COLORS.placeholder,
  },
  activeTabText: {
    ...THEME.fontStyle.h5Bold,
  },
  gradient: {
    position: 'absolute',
    right: 0,
    top: 2,
    bottom: 2,
    width: ms(40),
    zIndex: 1,
  },
});
