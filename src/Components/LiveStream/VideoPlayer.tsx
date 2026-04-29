import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HMSVideoView } from '@100mslive/react-native-hms';

interface Props {
  trackId: string;
  mirror?: boolean;
}

const VideoPlayer = ({ trackId, mirror = false }: Props) => {
  return (
    <View style={styles.container}>
      <HMSVideoView
        trackId={trackId}
        mirror={mirror}
        scaleType="ASPECT_FIT"
        style={styles.videoView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoView: {
    flex: 1,
  },
});

export default VideoPlayer;
