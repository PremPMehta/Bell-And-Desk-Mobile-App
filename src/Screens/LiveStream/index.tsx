import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StatusBar,
  Alert,
  BackHandler,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import HMSSDK, {
  HMSUpdateListenerActions,
  HMSConfig,
  HMSPeer,
  HMSTrack,
  HMSTrackUpdate,
  HMSTrackType,
  HMSPeerUpdate,
  HMSTrackSettings,
  HMSVideoTrackSettings,
  HMSAudioTrackSettings,
  HMSTrackSettingsInitState,
  HMSRemoteAudioTrack,
  HMSAudioMode,
} from '@100mslive/react-native-hms';
import { useAtom } from 'jotai';
import { userAtom } from '@/Jotai/Atoms';
import { COLORS } from '@/Assets/Theme/colors';
import useUserApi from '@/Hooks/Apis/UserApis/use-user-api';
import ViewerHeader from '@/Components/LiveStream/ViewerHeader';
import ViewerControls from '@/Components/LiveStream/ViewerControls';
import EmptyState from '@/Components/LiveStream/EmptyState';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface PeerTrackNode {
  id: string;
  peer: HMSPeer;
  track?: HMSTrack;
}

// ─────────────────────────────────────────────────────────────────────────────
// LiveStreamScreen
// ─────────────────────────────────────────────────────────────────────────────

const LiveStreamScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { streamData } = route.params ?? {};
  const [user]: [any, any] = useAtom(userAtom);
  const { getLiveStreamToken } = useUserApi();
  console.log('🚀 ~ LiveStreamScreen ~ streamData:', streamData);

  // ── SDK state ────────────────────────────────────────────────────────────
  const hmsInstanceRef = useRef<HMSSDK | null>(null);
  const isLeavingRef = useRef(false);

  // ── CRITICAL FIX: HmsView must be stored in STATE, not read from ref.
  // Refs don't trigger re-renders. We need state so the component re-renders
  // once the SDK instance is built and HmsView becomes available.
  const [HmsView, setHmsView] = useState<any>(null);

  // ── UI state ─────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [joinStatus, setJoinStatus] = useState<string>('Joining stream...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isStreamEnded, setIsStreamEnded] = useState(false);

  // ── Track state: list of all remote peers with video tracks ───────────────
  // We do NOT filter by role name (host/teacher/etc.) because role names
  // vary per room template. Instead, show all remote (non-local) video tracks.
  const [remotePeerTrackNodes, setRemotePeerTrackNodes] = useState<
    PeerTrackNode[]
  >([]);

  // ── Leave room ───────────────────────────────────────────────────────────

  const leaveRoom = useCallback(async () => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;
    try {
      const hms = hmsInstanceRef.current;
      if (hms) {
        hms.removeAllListeners();
        await hms.leave();
        await hms.destroy();
        hmsInstanceRef.current = null;
      }
    } catch (e) {
      console.error('[HMS] Leave error:', e);
    } finally {
      navigation.goBack();
    }
  }, [navigation]);

  // ── Event: ON_JOIN ────────────────────────────────────────────────────────

  const onJoin = useCallback(
    async (data: { room: { localPeer: HMSPeer; peers?: HMSPeer[] } }) => {
      console.log('[HMS] ✅ Joined room successfully');
      console.log(
        '[HMS] Room peers:',
        data?.room?.peers?.map(p => ({
          name: p.name,
          role: p.role?.name,
          isLocal: p.isLocal,
        })),
      );

      // ── Audio Fix: Ensure all remote audio is unmuted for the viewer
      if (hmsInstanceRef.current) {
        try {
          console.log('[HMS] Explicitly enabling remote audio playback');
          await hmsInstanceRef.current.setPlaybackForAllAudio(false);
          // Set audio mode to communication for better routing on mobile devices
          await hmsInstanceRef.current.setAudioMode(HMSAudioMode.MODE_IN_COMMUNICATION);
        } catch (err) {
          console.warn('[HMS] Failed to enable audio playback:', err);
        }
      }

      setJoinStatus('Joined');
      setLoading(false);
    },
    [],
  );

  // ── Event: ON_PEER_UPDATE ─────────────────────────────────────────────────

  const onPeerUpdate = useCallback(
    (data: { peer: HMSPeer; type: HMSPeerUpdate }) => {
      const { peer, type } = data;

      console.log(
        '[HMS] Peer update:',
        peer.name,
        '| Role:',
        peer.role?.name,
        '| Type:',
        type,
        '| isLocal:',
        peer.isLocal,
      );

      if (type === HMSPeerUpdate.PEER_LEFT) {
        // Remove all nodes for this peer
        if (!peer.isLocal) {
          setRemotePeerTrackNodes(prev =>
            prev.filter(n => n.peer.peerID !== peer.peerID),
          );
        }
      }
    },
    [],
  );

  // ── Event: ON_TRACK_UPDATE ────────────────────────────────────────────────

  const onTrackUpdate = useCallback(
    (data: { peer: HMSPeer; track: HMSTrack; type: HMSTrackUpdate }) => {
      const { peer, track, type } = data;

      console.log(
        '[HMS] Track update:',
        '| Peer:',
        peer.name,
        '| Role:',
        peer.role?.name,
        '| isLocal:',
        peer.isLocal,
        '| TrackType:',
        track.type,
        '| UpdateType:',
        type,
        '| isMute:',
        track.isMute?.(),
      );

      // Skip local peer tracks — member/viewer publishes nothing
      if (peer.isLocal) return;
 
      // ── Audio Fix: Explicitly allow playback for remote audio tracks
      if (track.type === HMSTrackType.AUDIO) {
        if (
          type === HMSTrackUpdate.TRACK_ADDED ||
          type === HMSTrackUpdate.TRACK_UNMUTED
        ) {
          const remoteAudioTrack = track as HMSRemoteAudioTrack;
          if (typeof remoteAudioTrack.setPlaybackAllowed === 'function') {
            console.log('[HMS] Enabling playback for remote audio track:', track.trackId);
            remoteAudioTrack.setPlaybackAllowed(true);
          }
        }
        return; // Don't add audio tracks to remotePeerTrackNodes (only for video)
      }
 
      // We only care about video tracks for rendering
      if (track.type !== HMSTrackType.VIDEO) return;

      const nodeId = peer.peerID + track.trackId;

      if (type === HMSTrackUpdate.TRACK_ADDED) {
        setRemotePeerTrackNodes(prev => {
          const exists = prev.some(n => n.id === nodeId);
          if (exists) {
            return prev.map(n => (n.id === nodeId ? { ...n, peer, track } : n));
          }
          return [...prev, { id: nodeId, peer, track }];
        });
      }

      if (
        type === HMSTrackUpdate.TRACK_MUTED ||
        type === HMSTrackUpdate.TRACK_UNMUTED
      ) {
        setRemotePeerTrackNodes(prev => {
          const exists = prev.some(n => n.id === nodeId);
          if (exists) {
            return prev.map(n => (n.id === nodeId ? { ...n, peer, track } : n));
          }
          // If track update for a node we don't have yet, add it
          return [...prev, { id: nodeId, peer, track }];
        });
      }

      if (type === HMSTrackUpdate.TRACK_REMOVED) {
        setRemotePeerTrackNodes(prev => prev.filter(n => n.id !== nodeId));
      }
    },
    [],
  );

  // ── Event: ON_ERROR ───────────────────────────────────────────────────────

  const onError = useCallback((error: any) => {
    console.error(
      '[HMS] ❌ Error:',
      error?.code,
      error?.description,
      error?.message,
    );
    setLoading(false);
    setErrorMessage(error?.description ?? error?.message ?? 'Connection error');
  }, []);

  // ── Event: ON_REMOVED_FROM_ROOM ───────────────────────────────────────────

  const onRemovedFromRoom = useCallback((data: any) => {
    console.log('[HMS] Peer removed from room:', data);
    const { reason, roomEnded } = data;
    if (roomEnded || reason?.toLowerCase()?.includes('ended')) {
      setIsStreamEnded(true);
    }
  }, []);

  // ── Resolve auth token (3-method priority) ────────────────────────────────

  const resolveAuthToken = useCallback(
    async (hms: HMSSDK): Promise<string | null> => {
      // Method 1: Room Code (recommended by 100ms docs)
      // The 100ms SDK fetches a role-specific token using the room code.
      // Room codes are role-specific: get the "viewer" or "member" role's room code
      // from: 100ms Dashboard → Rooms → [room] → Join Room → copy room code
      const roomCode: string | undefined = 'hlx-zxik-hmd';
      // streamData?.roomCode || streamData?.hmsRoomCode || streamData?.room_code;

      if (roomCode) {
        try {
          console.log('[HMS] Getting token via room code:', roomCode);
          const token = await hms.getAuthTokenByRoomCode(roomCode);
          console.log('[HMS] ✅ Got token via room code');
          return token;
        } catch (e: any) {
          console.warn('[HMS] ⚠️ getAuthTokenByRoomCode failed:', e?.message);
        }
      }

      // Method 2: Direct auth token (testing — paste from 100ms dashboard)
      const directToken: string | undefined =
        streamData?.authToken ||
        streamData?.hmsAuthToken ||
        streamData?.auth_token;

      if (directToken) {
        console.log('[HMS] Using direct auth token (dashboard testing token)');
        return directToken;
      }

      // Method 3: Backend getLiveStreamToken API
      const roomId: string | undefined =
        streamData?.hmsRoomId || streamData?._id;
      if (roomId) {
        try {
          console.log('[HMS] Getting token via backend API, roomId:', roomId);
          const res = await getLiveStreamToken({ roomId, role: 'member' });
          const token = res?.data?.token || res?.token;
          if (token) {
            console.log('[HMS] ✅ Got token via backend API');
            return token;
          }
        } catch (e: any) {
          console.warn('[HMS] ⚠️ Backend token API failed:', e?.message);
        }
      }

      console.error(
        '[HMS] ❌ No token resolved. streamData:',
        JSON.stringify(streamData),
      );
      return null;
    },
    [streamData, getLiveStreamToken],
  );

  // ── SDK Init & Join ───────────────────────────────────────────────────────

  useEffect(() => {
    const joinRoom = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        setJoinStatus('Building SDK...');

        // ── Build viewer track settings: start with BOTH tracks MUTED.
        // This prevents the SDK from requesting camera/microphone permissions
        // because a viewer role does NOT publish audio or video.
        const viewerTrackSettings = new HMSTrackSettings({
          video: new HMSVideoTrackSettings({
            initialState: HMSTrackSettingsInitState.MUTED,
          }),
          audio: new HMSAudioTrackSettings({
            initialState: HMSTrackSettingsInitState.MUTED,
          }),
        });

        // Step 1: Build SDK instance with viewer track settings
        const hms = await HMSSDK.build({
          trackSettings: viewerTrackSettings,
        });
        hmsInstanceRef.current = hms;

        // ── CRITICAL FIX: Store HmsView in STATE so component re-renders
        // when it becomes available. DO NOT read it from the ref during render.
        setHmsView(() => hms.HmsView);

        setJoinStatus('Getting token...');

        // Step 2: Get auth token via viewer room code.
        // ⚠️  IMPORTANT: This room code MUST be the VIEWER/MEMBER room code
        //     from the 100ms Dashboard → Rooms → [room] → "Join Room".
        //     Each role (broadcaster, viewer, hls-viewer…) has its own unique
        //     room code. Pasting a BROADCASTER token here will ALWAYS trigger
        //     camera/mic permission errors. The room code below is for the
        //     viewer role — 100ms fetches the correct token automatically.
        const VIEWER_ROOM_CODE = streamData?.viewerRoomCode; // ← viewer/member room code
        console.log('🚀 ~ joinRoom ~ VIEWER_ROOM_CODE:', VIEWER_ROOM_CODE);
        // const VIEWER_ROOM_CODE = 'hlx-zxik-hmd'; // ← viewer/member room code
        let authToken: string | null = null;
        try {
          console.log(
            '[HMS] Fetching viewer token via room code:',
            VIEWER_ROOM_CODE,
          );
          authToken = await hms.getAuthTokenByRoomCode(VIEWER_ROOM_CODE);
          console.log('🚀 ~ joinRoom ~ authToken:', authToken);
          //authToken =
          //  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2OTBlMWZjYmJkMGRhYjVmOWEwMTQ2MDAiLCJyb2xlIjoidmlld2VyLXJlYWx0aW1lIiwicm9vbV9pZCI6IjY5ZjAzYmQ4NDE5MmVkMzI5ODUwNDY4YyIsInVzZXJfaWQiOiI2YmE0ZDE2OC03MDU0LTRjNWEtOTFkOS1jNjJhNTdiOGViMjgiLCJleHAiOjE3Nzc0Mzg2NTUsImp0aSI6ImMyMjVmZWFlLTgwOGQtNDE5Zi1iYWI1LTQ2MjYyYzk3NTIwYiIsImlhdCI6MTc3NzM1MjI1NSwiaXNzIjoiNjkwZTFmY2JiZDBkYWI1ZjlhMDE0NWZlIiwibmJmIjoxNzc3MzUyMjU1LCJzdWIiOiJhcGkifQ.A4EDeXuxQ9LviBLNkmB13p9Es_qJ-clSSXw2H8HxgW0';
          console.log('[HMS] ✅ Got viewer token via room code');
        } catch (e: any) {
          console.error('[HMS] ❌ getAuthTokenByRoomCode failed:', e?.message);
        }

        if (!authToken) {
          setLoading(false);
          setErrorMessage('Could not get stream token');
          Alert.alert(
            'Cannot Join Stream',
            'Unable to obtain an auth token.\n\nFor testing: add a "roomCode" or "authToken" field to your stream data.\n\nSee console logs for details.',
          );
          return;
        }

        setJoinStatus('Joining room...');

        // Step 3: Register ALL listeners BEFORE calling join (100ms docs requirement)
        hms.addEventListener(HMSUpdateListenerActions.ON_JOIN, onJoin);
        hms.addEventListener(
          HMSUpdateListenerActions.ON_PEER_UPDATE,
          onPeerUpdate,
        );
        hms.addEventListener(
          HMSUpdateListenerActions.ON_TRACK_UPDATE,
          onTrackUpdate,
        );
        hms.addEventListener(HMSUpdateListenerActions.ON_ERROR, onError);
        hms.addEventListener(
          HMSUpdateListenerActions.ON_REMOVED_FROM_ROOM,
          onRemovedFromRoom,
        );

        const userName = user
          ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Viewer'
          : 'Viewer';

        // Step 4: Join as a viewer/member (no publish permissions)
        await hms.join(new HMSConfig({ authToken, username: userName }));
      } catch (e: any) {
        console.error('[HMS] Init/Join error:', e);
        setLoading(false);
        setErrorMessage(e?.message ?? 'Failed to connect');
      }
    };

    joinRoom();

    return () => {
      leaveRoom();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hardware back button
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      leaveRoom();
      return true;
    });
    return () => handler.remove();
  }, [leaveRoom]);

  // ── Derive what to show ───────────────────────────────────────────────────

  // Get the first remote peer's video track that is available and not muted
  // const activeHostNode = remotePeerTrackNodes.find(
  //   n => n.track?.trackId && !n.track.isMute?.(),
  // );
  const activeHostNode = remotePeerTrackNodes.find(n => n.track?.trackId);
  console.log('🚀 ~ LiveStreamScreen ~ activeHostNode:', activeHostNode);

  // A remote peer is in the room (even if video is muted)
  const hasRemotePeer = remotePeerTrackNodes.length > 0;

  console.log('🚀 ~ LiveStreamScreen ~ HmsView:', HmsView);
  const canRenderVideo = HmsView && activeHostNode?.track?.trackId;
  console.log('🚀 ~ LiveStreamScreen ~ canRenderVideo:', canRenderVideo);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* ── Video area ── */}
      <View style={styles.videoArea}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.statusText}>{joinStatus}</Text>
          </View>
        ) : isStreamEnded ? (
          <EmptyState
            message="Live stream ended"
            subtext="Thank you for watching!"
          />
        ) : errorMessage ? (
          <EmptyState message={errorMessage} />
        ) : canRenderVideo ? (
          // Render the remote peer's live video
          <HmsView
            trackId={activeHostNode!.track!.trackId}
            mirror={false}
            style={styles.hmsView}
          />
        ) : hasRemotePeer ? (
          <EmptyState message="Host video is off" />
        ) : (
          // <EmptyState message="Host has paused the video" />
          <EmptyState message="Waiting for host to go live..." />
        )}
      </View>

      {/* ── Header overlay (only when joined and active) ── */}
      {!loading && !errorMessage && !isStreamEnded && (
        <ViewerHeader
          title={streamData?.title ?? 'Live Stream'}
          hostName={
            streamData?.hostName || streamData?.instructorName || 'Host'
          }
        />
      )}

      {/* ── Leave button ── */}
      <ViewerControls onLeave={leaveRoom} />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoArea: {
    flex: 1,
  },
  hmsView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  statusText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default LiveStreamScreen;
