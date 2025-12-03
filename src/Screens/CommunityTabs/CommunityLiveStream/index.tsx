import { View, Text, Animated } from 'react-native';
import React from 'react';

interface Props {
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityLiveStream = ({ onScroll, scrollEventThrottle }: Props) => {
  return (
    <Animated.ScrollView
      style={{ flex: 1 }}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
    >
      <View>
        <Text>CommunityLiveStream</Text>
      </View>
    </Animated.ScrollView>
  );
};

export default CommunityLiveStream;

