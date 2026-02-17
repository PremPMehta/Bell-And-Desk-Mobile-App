import React, { useRef, useEffect, useState } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import styles from './style';

interface VideoPlayerProps {
  source: any;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
  resizeMode?: 'cover' | 'contain' | 'stretch';
  style?: StyleProp<ViewStyle>;
  onError?: (error: any) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  autoPlay = true,
  loop = true,
  controls = false,
  muted = true,
  resizeMode = 'cover',
  style,
  onError,
}) => {
  const videoRef = useRef<VideoRef>(null);
  const [paused, setPaused] = useState(!autoPlay);

  useEffect(() => {
    setPaused(!autoPlay);
  }, [autoPlay]);

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={videoRef}
        source={source}
        style={styles.video}
        paused={paused}
        repeat={loop}
        controls={controls}
        muted={muted}
        resizeMode={resizeMode}
        onError={onError}
        ignoreSilentSwitch="ignore"
      />
    </View>
  );
};

export default React.memo(VideoPlayer);
