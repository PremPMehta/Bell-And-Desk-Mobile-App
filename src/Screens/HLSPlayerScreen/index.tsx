/**
 * HLSPlayerScreen
 *
 * Entry-point screen for HLS live stream playback.
 *
 * Receives `streamData` from navigation params (passed by CommunityLiveStream
 * when user taps "Watch Now" on a live stream card).
 *
 * Extracts `viewerRoomCode` from streamData and delegates all SDK + playback
 * logic to HLSPlayerContainer.
 */

import React from 'react';
import { View, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import HLSPlayerContainer from '@/Components/HLSPlayer/HLSPlayerContainer';
import { styles } from './style';

const HLSPlayerScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { streamData } = route.params ?? {};

  // ── Extract viewerRoomCode ──────────────────────────────────────────────
  // The viewerRoomCode is the role-specific room code for the viewer/member
  // role in 100ms. It's set on the stream document from the backend.
  const viewerRoomCode: string | undefined =
    streamData?.viewerRoomCode ||
    streamData?.viewer_room_code ||
    streamData?.hmsViewerRoomCode;

  // Guard: if no room code is available, show an alert and go back
  if (!viewerRoomCode) {
    console.error('[HLSPlayerScreen] No viewerRoomCode found in streamData:', streamData);
    Alert.alert(
      'Cannot Play Stream',
      'Viewer room code is missing. Please try again later.',
      [
        {
          text: 'OK',
          onPress: () => {
            if (navigation.canGoBack()) navigation.goBack();
          },
        },
      ],
    );
    // Render nothing while the alert is shown
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {/*
       * HLSPlayerContainer handles:
       *   1. Building the 100ms SDK instance
       *   2. Joining the room with the viewerRoomCode
       *   3. Resolving the HLS stream URL from ON_JOIN / ON_ROOM_UPDATE
       *   4. Rendering the appropriate UI (buffering → playing → error)
       */}
      <HLSPlayerContainer
        viewerRoomCode={viewerRoomCode}
        streamData={streamData}
      />
    </View>
  );
};

export default HLSPlayerScreen;
