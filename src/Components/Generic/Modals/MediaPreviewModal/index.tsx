import { View, TouchableOpacity, Image, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { useAtom } from 'jotai';
import { mediaPreviewAtom } from '@/Jotai/Atoms';
import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import Video, { type OnLoadData, type OnProgressData, VideoRef } from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms } from '@/Assets/Theme/fontStyle';
import ToastModule from '@/Components/Core/Toast';

const formatPlaybackTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const MediaPreviewModal = () => {
  const [mediaPreview, setMediaPreview] = useAtom(mediaPreviewAtom);
  const videoRef = React.useRef<VideoRef>(null);
  const insets = useSafeAreaInsets();
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasLoadError, setHasLoadError] = useState(false);

  const isAudio = mediaPreview.type === 'audio';
  const isVideo = mediaPreview.type === 'video';

  useEffect(() => {
    if (mediaPreview.visible && (isVideo || isAudio)) {
      setPaused(false);
      setCurrentTime(0);
      setDuration(0);
      setHasLoadError(false);
      return;
    }
    setPaused(true);
    setCurrentTime(0);
    setDuration(0);
    setHasLoadError(false);
  }, [mediaPreview.visible, mediaPreview.type, mediaPreview.uri, isAudio, isVideo]);

  const handleClose = () => {
    setPaused(true);
    setMediaPreview(prev => ({ ...prev, visible: false }));
  };

  const handleVideoLoad = useCallback((data: OnLoadData) => {
    setDuration(data.duration ?? 0);
    setHasLoadError(false);
  }, []);

  const handleVideoProgress = useCallback((data: OnProgressData) => {
    setCurrentTime(data.currentTime ?? 0);
  }, []);

  const handleVideoError = useCallback(() => {
    setHasLoadError(true);
    setPaused(true);
    if (isAudio) {
      ToastModule.errorBottom({ msg: 'Could not play audio file' });
    }
  }, [isAudio]);

  const toggleAudioPlayback = () => {
    if (hasLoadError) return;
    setPaused(prev => !prev);
  };

  const renderAudioPlayer = () => (
    <View style={styles.audioPanel}>
      <View style={styles.audioIconBox}>
        <Icon name="Headphones" size={32} color={COLORS.white} />
      </View>

      {mediaPreview.title ? (
        <Text style={styles.audioTitle} numberOfLines={2}>
          {mediaPreview.title}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.audioPlayButton}
        onPress={toggleAudioPlayback}
        activeOpacity={0.85}
        disabled={hasLoadError}
      >
        <Icon
          name={paused ? 'Play' : 'Pause'}
          size={28}
          color={COLORS.white}
          fill={paused ? COLORS.white : undefined}
        />
      </TouchableOpacity>

      <View style={styles.audioTimeRow}>
        <Text style={styles.audioTimeText}>
          {formatPlaybackTime(currentTime)}
        </Text>
        <Text style={styles.audioTimeText}>/</Text>
        <Text style={styles.audioTimeText}>
          {formatPlaybackTime(duration)}
        </Text>
      </View>

      <Video
        source={{ uri: mediaPreview.uri }}
        ref={videoRef}
        style={styles.audioHiddenVideo}
        paused={paused}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        onLoad={handleVideoLoad}
        onProgress={handleVideoProgress}
        onEnd={() => {
          setPaused(true);
          setCurrentTime(duration);
        }}
        onError={handleVideoError}
      />
    </View>
  );

  return (
    <Modal
      isVisible={mediaPreview.visible}
      style={styles.modalContainer}
      onBackdropPress={handleClose}
      onBackButtonPress={handleClose}
      onModalHide={() => {
        setPaused(true);
        setCurrentTime(0);
        setDuration(0);
        setHasLoadError(false);
      }}
      animationIn="fadeIn"
      animationOut="fadeOut"
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.closeButton, { top: insets.top + ms(10) }]}
          onPress={handleClose}
        >
          <Icon name="X" size={24} color={COLORS.white} />
        </TouchableOpacity>

        {mediaPreview.type === 'image' ? (
          <Image source={{ uri: mediaPreview.uri }} style={styles.image} />
        ) : isAudio ? (
          renderAudioPlayer()
        ) : (
          <Video
            source={{ uri: mediaPreview.uri }}
            ref={videoRef}
            style={styles.video}
            controls
            resizeMode="contain"
            paused={paused}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="ignore"
          />
        )}
      </View>
    </Modal>
  );
};

export default MediaPreviewModal;
