/**
 * HLSPlayerContainer
 *
 * Stateful orchestrator for the HLS Player viewer flow.
 *
 * SDK interactions handled here:
 *   1. Build HMSSDK → join room with viewerRoomCode
 *   2. ON_JOIN / ON_ROOM_UPDATE → extract HLS stream URL
 *   3. ON_MESSAGE → receive chat + emoji messages
 *   4. ON_PEER_UPDATE → track visible peer count & hand-raise status
 *   5. ON_REMOVED_FROM_ROOM → detect stream ended
 *   6. sendBroadcastMessage('text')            → chat (type='chat')
 *   7. sendBroadcastMessage('emoji', 'emoji')  → emoji reaction
 *   8. raiseLocalPeerHand() / lowerLocalPeerHand() → official Raise Hand (DASHBOARD INTEGRATED)
 *   9. leave() + destroy() on unmount
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, BackHandler, StyleSheet, StatusBar } from 'react-native';
import HMSSDK, {
  HMSUpdateListenerActions,
  HMSConfig,
  HMSTrackSettings,
  HMSVideoTrackSettings,
  HMSAudioTrackSettings,
  HMSTrackSettingsInitState,
  HMSPeerUpdate,
} from '@100mslive/react-native-hms';
import { useNavigation } from '@react-navigation/native';
import { useAtom } from 'jotai';
import { userAtom } from '@/Jotai/Atoms';

import HLSBufferingUI from './HLSBufferingUI';
import HLSErrorUI from './HLSErrorUI';
import HLSVideoPlayer from './HLSVideoPlayer';
import { ChatMessage } from './HLSChatPanel';

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  viewerRoomCode: string;
  streamData?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extracts the m3u8 HLS stream URL from room.hlsStreamingState.
 * Handles both Map (Android) and Array/Object (iOS) variant shapes.
 */
const extractHlsUrl = (room: any): string | null => {
  try {
    const state = room?.hlsStreamingState;
    if (!state?.running) return null;
    const variants = state?.variants;
    if (!variants) return null;
    if (typeof variants.get === 'function') return variants.get(0)?.hlsStreamUrl ?? null;
    if (Array.isArray(variants)) return variants[0]?.hlsStreamUrl ?? null;
    const first = Object.values(variants)[0] as any;
    return first?.hlsStreamUrl ?? null;
  } catch {
    return null;
  }
};

/**
 * Returns true if HLS recording is currently running in the room.
 */
const extractRecordingState = (room: any): boolean => {
  return !!(
    room?.hlsRecordingState?.running ||
    room?.browserRecordingState?.running
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'joining' | 'waiting_hls' | 'playing' | 'error' | 'ended';

const HLSPlayerContainer = ({ viewerRoomCode, streamData }: Props) => {
  const navigation = useNavigation();
  const [user]: [any, any] = useAtom(userAtom);

  const hmsRef = useRef<HMSSDK | null>(null);
  const isLeavingRef = useRef(false);
  // Track local peerID so chat can mark "my" messages
  const localPeerIdRef = useRef<string>('');

  // ── Phase & stream ────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('joining');
  const [statusMsg, setStatusMsg] = useState('Joining room…');
  const [hlsUrl, setHlsUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | undefined>();

  // ── Real SDK state ────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [peers, setPeers] = useState<any[]>([]);

  // ── Leave ─────────────────────────────────────────────────────────────────

  const leaveRoom = useCallback(async () => {
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;

    try {
      // 1. Start navigation IMMEDIATELY for instant UI feedback
      if (navigation.canGoBack()) {
        navigation.goBack();
      }

      // 2. Perform cleanup in the background without awaiting it for the UI
      const hms = hmsRef.current;
      if (hms) {
        console.log('[HLSContainer] Background cleanup started...');
        // We use fire-and-forget here so the UI isn't blocked by native module lag
        hms.setPlaybackForAllAudio(true).catch(() => {});
        hms.removeAllListeners();
        hms.leave()
          .then(() => hms.destroy())
          .catch(e => console.error('[HLSContainer] Background leave error:', e))
          .finally(() => {
            hmsRef.current = null;
          });
      }
    } catch (e) {
      console.error('[HLSContainer] Leave error:', e);
      if (navigation.canGoBack()) navigation.goBack();
    }
  }, [navigation]);

  // ── ON_JOIN ───────────────────────────────────────────────────────────────

  const onJoin = useCallback((data: any) => {
    console.log('[HLSContainer] ✅ Joined room');
    const room = data?.room;

    // Store local peerID for chat message attribution
    const localPeer = room?.localPeer;
    if (localPeer?.peerID) localPeerIdRef.current = localPeer.peerID;

    // Initial hand raise state
    setHandRaised(!!localPeer?.isHandRaised);

    // Initial participant count & peers from room
    const currentPeers: any[] = room?.peers ?? [];
    setPeers(currentPeers);
    // Use room.peerCount if available for accurate viewer count in HLS
    setParticipantCount(room?.peerCount ?? currentPeers.length);

    // Check recording state
    setIsRecording(extractRecordingState(room));

    // Try to get HLS URL immediately
    const url = extractHlsUrl(room);
    if (url) {
      console.log('[HLSContainer] HLS URL from ON_JOIN:', url);
      setHlsUrl(url);
      setPhase('playing');
    } else {
      console.log('[HLSContainer] HLS not yet started, waiting for ON_ROOM_UPDATE…');
      setStatusMsg('Waiting for stream to start…');
      setPhase('waiting_hls');
    }
  }, []);

  // ── ON_ROOM_UPDATE ────────────────────────────────────────────────────────

  const onRoomUpdate = useCallback((data: any) => {
    const room = data?.room ?? data;
    console.log('[HLSContainer] Room update');

    setIsRecording(extractRecordingState(room));

    const url = extractHlsUrl(room);
    if (url) {
      console.log('[HLSContainer] HLS URL from ON_ROOM_UPDATE:', url);
      setHlsUrl(url);
      setPhase('playing');
    }

    if (room?.peerCount !== undefined) {
      setParticipantCount(room.peerCount);
    }
  }, []);

  /**
   * ON_PEER_UPDATE → track participant count and hand-raise changes
   */
  const onPeerUpdate = useCallback((data: any) => {
    const { peer, type, room } = data;
    
    // Maintain peer list
    const updatedPeers: any[] = room?.peers ?? [];
    setPeers(updatedPeers);

    // Update participant count from room
    if (room?.peerCount !== undefined) {
      setParticipantCount(room.peerCount);
    } else {
      setParticipantCount(updatedPeers.length);
    }

    // Sync hand-raise state if it changed for the local peer
    if (peer?.peerID === localPeerIdRef.current) {
      setHandRaised(!!peer?.isHandRaised);
    }
  }, []);

  // ── ON_MESSAGE → chat, emoji ─────────────────────────────────────────────

  const onMessage = useCallback((msg: any) => {
    // msg is an HMSMessage: { messageId, message, type, time, sender }
    console.log('[HLSContainer] Message received:', msg?.type, msg?.message);

    const chatMsg: ChatMessage = {
      id: msg?.messageId ?? String(Date.now()),
      senderName: msg?.sender?.name ?? 'Viewer',
      senderId: msg?.sender?.peerID ?? '',
      text: msg?.message ?? '',
      type: msg?.type ?? 'chat',
      time: msg?.time ?? new Date(),
    };

    setMessages(prev => [...prev, chatMsg]);
  }, []);

  // ── ON_ERROR ──────────────────────────────────────────────────────────────

  const onError = useCallback((error: any) => {
    console.error('[HLSContainer] ❌ Error:', error?.code, error?.description);
    setErrorMsg(error?.description ?? error?.message ?? 'Connection error');
    setErrorCode(String(error?.code ?? ''));
    setPhase('error');
  }, []);

  // ── ON_REMOVED_FROM_ROOM ──────────────────────────────────────────────────

  const onRemovedFromRoom = useCallback(() => {
    console.log('[HLSContainer] Removed from room (stream ended)');
    setPhase('ended');
  }, []);

  // ── SDK Send helpers ──────────────────────────────────────────────────────

  /**
   * Sends a plain chat message to all room participants.
   * Uses sendBroadcastMessage with default type='chat'.
   */
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    try {
      await hmsRef.current?.sendBroadcastMessage(text);
      // Also add it locally so sender sees their own message immediately
      setMessages(prev => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          senderName: user
            ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'You'
            : 'You',
          senderId: localPeerIdRef.current,
          text,
          type: 'chat',
          time: new Date(),
        },
      ]);
    } catch (e) {
      console.error('[HLSContainer] sendMessage error:', e);
    }
  }, [user]);

  /**
   * Sends an emoji reaction broadcast.
   * type = 'hms-reaction' is the official type recognized by the 
   * 100ms HLS Player Dashboard to trigger flying emojis.
   */
  const sendReaction = useCallback(async (emoji: string) => {
    try {
      await hmsRef.current?.sendBroadcastMessage(emoji, 'hms-reaction');
      // Add locally so sender sees their own reaction
      setMessages(prev => [
        ...prev,
        {
          id: `local-emoji-${Date.now()}`,
          senderName: 'You',
          senderId: localPeerIdRef.current,
          text: emoji,
          type: 'hms-reaction',
          time: new Date(),
        },
      ]);
    } catch (e) {
      console.error('[HLSContainer] sendReaction error:', e);
    }
  }, []);

  /**
   * Toggles raise-hand state using first-class SDK APIs.
   * This integrates directly with the 100ms dashboard's "Hand Raised" list.
   */
  const toggleRaiseHand = useCallback(async () => {
    const hms = hmsRef.current;
    if (!hms) return;

    const next = !handRaised;
    try {
      if (next) {
        console.log('[HLSContainer] Raising hand…');
        await hms.raiseLocalPeerHand();
      } else {
        console.log('[HLSContainer] Lowering hand…');
        await hms.lowerLocalPeerHand();
      }
      setHandRaised(next);
    } catch (e) {
      console.error('[HLSContainer] toggleRaiseHand error:', e);
    }
  }, [handRaised]);

  // ── SDK Init + Join ───────────────────────────────────────────────────────

  useEffect(() => {
    const joinRoom = async () => {
      try {
        setPhase('joining');
        setStatusMsg('Building SDK…');

        // Build HMSSDK with viewer track settings (camera + mic both MUTED).
        // This prevents any camera/microphone permission requests.
        const hms = await HMSSDK.build({
          trackSettings: new HMSTrackSettings({
            video: new HMSVideoTrackSettings({
              initialState: HMSTrackSettingsInitState.MUTED,
            }),
            audio: new HMSAudioTrackSettings({
              initialState: HMSTrackSettingsInitState.MUTED,
            }),
          }),
        });
        hmsRef.current = hms;

        setStatusMsg('Getting auth token…');

        let authToken: string | null = null;
        try {
          console.log('[HLSContainer] Fetching token for room code:', viewerRoomCode);
          authToken = await hms.getAuthTokenByRoomCode(viewerRoomCode);
          console.log('[HLSContainer] ✅ Token received');
        } catch (e: any) {
          console.error('[HLSContainer] ❌ getAuthTokenByRoomCode failed:', e?.message);
          setErrorMsg('Could not obtain stream token. Check the viewer room code.');
          setPhase('error');
          return;
        }

        if (!authToken) {
          setErrorMsg('Stream token was empty. Please try again.');
          setPhase('error');
          return;
        }

        // Register all listeners BEFORE calling join (100ms requirement)
        hms.addEventListener(HMSUpdateListenerActions.ON_JOIN, onJoin);
        hms.addEventListener(HMSUpdateListenerActions.ON_ROOM_UPDATE, onRoomUpdate);
        hms.addEventListener(HMSUpdateListenerActions.ON_PEER_UPDATE, onPeerUpdate);
        hms.addEventListener(HMSUpdateListenerActions.ON_MESSAGE, onMessage);
        hms.addEventListener(HMSUpdateListenerActions.ON_ERROR, onError);
        hms.addEventListener(
          HMSUpdateListenerActions.ON_REMOVED_FROM_ROOM,
          onRemovedFromRoom,
        );
        hms.addEventListener(HMSUpdateListenerActions.ON_PEER_COUNT_UPDATE, (data: any) => {
          console.log('[HLSContainer] Peer count update:', data?.count);
          if (data?.count !== undefined) setParticipantCount(data.count);
        });

        const userName = user
          ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Viewer'
          : 'Viewer';

        setStatusMsg('Joining room…');
        const room: any = await hms.join(new HMSConfig({ authToken, username: userName }));
        
        // Initial count after join
        if (room?.peerCount !== undefined) {
          setParticipantCount(room.peerCount);
        } else {
          setParticipantCount(room?.peers?.length ?? 0);
        }

        // Periodic count refresh as a fallback for ON_PEER_COUNT_UPDATE
        const intervalId = setInterval(async () => {
          try {
            if (hmsRef.current) {
              const count = await hmsRef.current.getPeerCount();
              console.log('[HLSContainer] Polled peer count:', count);
              if (count !== undefined && count !== null) {
                setParticipantCount(Number(count));
              }
            }
          } catch (e) {
            // silent catch
          }
        }, 10000); // refresh every 10s

        return () => {
          clearInterval(intervalId);
          leaveRoom();
        };
      } catch (e: any) {
        console.error('[HLSContainer] Init/Join error:', e);
        setErrorMsg(e?.message ?? 'Failed to connect to stream');
        setPhase('error');
      }
    };

    joinRoom();

    return () => { leaveRoom(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Android hardware back
  useEffect(() => {
    const h = BackHandler.addEventListener('hardwareBackPress', () => {
      leaveRoom();
      return true;
    });
    return () => h.remove();
  }, [leaveRoom]);

  // ── Render ────────────────────────────────────────────────────────────────

  const renderContent = () => {
    switch (phase) {
      case 'joining':
      case 'waiting_hls':
        return <HLSBufferingUI statusMessage={statusMsg} />;

      case 'error':
        return <HLSErrorUI message={errorMsg ?? undefined} errorCode={errorCode} />;

      case 'ended':
        return <HLSErrorUI message="The live stream has ended. Thank you for watching!" />;

      case 'playing':
        if (!hlsUrl) return <HLSBufferingUI statusMessage="Preparing playback…" />;
        return (
          <HLSVideoPlayer
            hlsUrl={hlsUrl}
            streamTitle={streamData?.title}
            hostName={streamData?.hostName ?? streamData?.instructorName}
            // Real SDK data passed down
            participantCount={participantCount}
            isRecording={isRecording}
            handRaised={handRaised}
            messages={messages}
            localPeerId={localPeerIdRef.current}
            peers={peers}
            // SDK action callbacks
            onLeave={leaveRoom}
            onSendMessage={sendMessage}
            onSendReaction={sendReaction}
            onToggleRaiseHand={toggleRaiseHand}
          />
        );

      default:
        return <HLSBufferingUI />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" translucent={false} />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
});

export default HLSPlayerContainer;
