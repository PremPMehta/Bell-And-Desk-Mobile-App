import { View, Text, Animated } from 'react-native';
import React from 'react';

interface Props {
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunitySettings = ({ onScroll, scrollEventThrottle }: Props) => {
  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    >
      <View>
        <Text>CommunitySettings</Text>
      </View>
    </Animated.ScrollView>
  );
};

export default CommunitySettings;

