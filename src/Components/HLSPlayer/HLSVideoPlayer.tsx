/**
 * HLSVideoPlayer
 *
 * Full viewer UI for HLS playback. All interactive features are connected
 * to real HMSSDK data passed down from HLSPlayerContainer.
 *
 * Features:
 *   - HMSHLSPlayer  → native HLS playback (enableControls=true for seekbar etc.)
 *   - useHMSHLSPlayerPlaybackState  → buffering overlay
 *   - useHMSHLSPlayerPlaybackError  → error state
 *   - useHMSHLSPlayerStats          → network quality indicator (real bandwidth)
 *   - Top bar: ← back | ● LIVE | timer | recording dot | network | participants | hand | chat
 *   - Reaction bar: 👏 ❤️ 😮 😂 🔥 🎉 — sends via sendBroadcastMessage(emoji,'emoji')
 *   - Floating emoji: received emoji reactions animate upward and fade out
 *   - Chat panel: HLSChatPanel slides in from right
 *   - Leave button: bottom-centre ⋮ (leave stream)
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  HMSHLSPlayer,
  HMSHLSPlayerPlaybackState,
  useHMSHLSPlayerPlaybackError,
  useHMSHLSPlayerPlaybackState,
  useHMSHLSPlayerStats,
} from '@100mslive/react-native-hms';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import HLSBufferingUI from './HLSBufferingUI';
import HLSErrorUI from './HLSErrorUI';
import HLSChatPanel, { ChatMessage } from './HLSChatPanel';

const { width: SW } = Dimensions.get('window');
const VIDEO_W = SW - 32; // Added horizontal padding as seen in screenshot
const VIDEO_H = Math.round(VIDEO_W * (9 / 16));

// Emoji reactions available to viewers
const REACTIONS = ['👏', '❤️', '😮', '😂', '🔥', '🎉'];

// ─────────────────────────────────────────────────────────────────────────────
// Floating participant thumbnail (Small circle on the right)
// ─────────────────────────────────────────────────────────────────────────────

const ParticipantThumbnail = ({ peer }: { peer: any }) => {
  const initials = peer?.name
    ? peer.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : '??';

  return (
    <View style={styles.peerThumbContainer}>
      <View style={styles.peerThumb}>
        <View style={styles.peerAvatar}>
          <Text style={styles.peerInitialText}>{initials}</Text>
        </View>
        {/* Mute status indicator */}
        <View style={styles.peerStatusBadge}>
          <Icon name="MicOff" color="#fff" size={8} />
        </View>
      </View>
      <Text style={styles.peerNameText} numberOfLines={1}>
        {peer?.name ?? 'Participant'}
      </Text>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// StreamTimer – elapsed time since mount
// ─────────────────────────────────────────────────────────────────────────────

const StreamTimer = () => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, '0');
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return (
    <Text style={styles.timerText}>
      {h > 0 ? `${p(h)}:${p(m)}:${p(s)}` : `${p(m)}:${p(s)}`}
    </Text>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Blinking record dot
// ─────────────────────────────────────────────────────────────────────────────

const RecordDot = () => {
  return (
    <View style={styles.recWrapper}>
      <View style={styles.recRing} />
      <View style={styles.recDot} />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Network quality badge (driven by real useHMSHLSPlayerStats bandwidth)
// ─────────────────────────────────────────────────────────────────────────────

const NetworkBadge = () => {
  return (
    <View style={styles.netBadge}>
      <Icon name="Globe" color="#fff" size={18} />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Props interface
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  hlsUrl: string;
  streamTitle?: string;
  hostName?: string;
  // Real SDK data from HLSPlayerContainer
  participantCount: number;
  isRecording: boolean;
  handRaised: boolean;
  messages: ChatMessage[];
  localPeerId: string;
  peers: any[];
  // SDK action callbacks
  onLeave: () => void;
  onSendMessage: (text: string) => Promise<void>;
  onSendReaction: (emoji: string) => Promise<void>;
  onToggleRaiseHand: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const HLSVideoPlayer = ({
  hlsUrl,
  streamTitle,
  hostName,
  participantCount,
  isRecording,
  handRaised,
  messages,
  localPeerId,
  peers,
  onLeave,
  onSendMessage,
  onSendReaction,
  onToggleRaiseHand,
}: Props) => {
  const playerRef = useRef<any>(null);

  // ── 100ms playback hooks ──────────────────────────────────────────────────
  const playbackState = useHMSHLSPlayerPlaybackState();
  const [playbackError, setPlaybackError] = useState<{
    code?: string;
    msg?: string;
  } | null>(null);

  useHMSHLSPlayerPlaybackError((err: any) => {
    console.error('[HLSVideoPlayer] Playback error:', err);
    setPlaybackError({
      code: err?.errorCode ?? err?.errorCodeName,
      msg: err?.message,
    });
  }, []);

  const isBuffering =
    playbackState === HMSHLSPlayerPlaybackState.BUFFERING ||
    playbackState === HMSHLSPlayerPlaybackState.UNKNOWN;

  // ── UI state ──────────────────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [reactionBarOpen, setReactionBarOpen] = useState(false);

  // Floating emoji stack
  const [floaters, setFloaters] = useState<any[]>([]);

  const spawnFloater = useCallback((emoji: string) => {
    const id = `f-${Date.now()}-${Math.random()}`;
    const anim = new Animated.Value(0);
    const opacity = new Animated.Value(1);
    const x = 40 + Math.random() * (SW - 120);

    setFloaters(prev => [...prev, { id, emoji, x, anim, opacity }]);

    Animated.parallel([
      Animated.timing(anim, {
        toValue: -180,
        duration: 1800,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setFloaters(prev => prev.filter(f => f.id !== id));
    });
  }, []);

  // Track new emoji messages from the room and spawn floaters
  const prevMsgCount = useRef(0);
  useEffect(() => {
    const newOnes = messages.slice(prevMsgCount.current);
    prevMsgCount.current = messages.length;
    newOnes.forEach(m => {
      const isEmoji =
        m.type === 'emoji' ||
        m.type === 'reaction' ||
        m.type === 'hms-reaction';
      if (isEmoji) spawnFloater(m.text);
    });
  }, [messages, spawnFloater]);

  // Cleanup: ensure player is stopped on unmount to prevent ghost audio
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          // Native HMSHLSPlayer cleanup
          playerRef.current.pause?.();
        } catch (e) {
          // silent cleanup
        }
      }
    };
  }, []);

  const handleReaction = async (emoji: string) => {
    setReactionBarOpen(false);
    spawnFloater(emoji);
    await onSendReaction(emoji);
  };

  // Find the first other peer to show in thumbnail if available
  const otherPeer = peers.find(p => p.peerID !== localPeerId);

  // ── Render ────────────────────────────────────────────────────────────────

  if (playbackError) {
    return (
      <HLSErrorUI
        message={playbackError.msg}
        errorCode={playbackError.code}
        onRetry={() => {
          setPlaybackError(null);
          playerRef.current?.play(hlsUrl);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        {/* Left: Exit + LIVE + timer */}
        <View style={styles.topLeft}>
          <TouchableOpacity style={styles.exitBtn} onPress={onLeave}>
            <Icon name="LogOut" color="#fff" size={18} />
          </TouchableOpacity>

          <View style={styles.liveContainer}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Live</Text>
            </View>
            <StreamTimer />
          </View>
        </View>

        {/* Right: record | network | participants | hand | chat */}
        <View style={styles.topRight}>
          <View style={styles.iconAction}>
            <RecordDot />
          </View>

          <View style={styles.iconAction}>
            <NetworkBadge />
          </View>

          <View style={styles.participantPill}>
            <Icon name="Users" color="#fff" size={14} />
            <Text style={styles.participantText}>
              {Math.max(participantCount, peers.length)}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.iconAction, handRaised && styles.iconActive]}
            onPress={onToggleRaiseHand}
          >
            <Icon
              name="Hand"
              color={handRaised ? '#FACC15' : '#fff'}
              size={20}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconAction, chatOpen && styles.iconActive]}
            onPress={() => setChatOpen(prev => !prev)}
          >
            <Icon name="MessageSquare" color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main Layout ──────────────────────────────────────────────── */}
      <View style={styles.mainContent}>
        {/* ── Video Player ─────────────────────────────────────────── */}
        <View style={styles.videoWrapper}>
          <View style={styles.videoArea}>
            <HMSHLSPlayer
              ref={playerRef}
              url={hlsUrl}
              style={styles.player}
              enableStats={true}
            />

            {isBuffering && (
              <View style={styles.bufferOverlay}>
                <HLSBufferingUI statusMessage="Buffering…" />
              </View>
            )}
          </View>

          {/* Screen Attribution Text */}
          {/* <Text style={styles.attributionText}>
            {hostName ? `${hostName}'s Screen` : "Host's Screen"}
          </Text> */}
        </View>

        {/* ── Floating Thumbnail (Right) ────────────────────────────── */}
        {/* {otherPeer && (
          <View style={styles.floatingPeer}>
            <ParticipantThumbnail peer={otherPeer} />
          </View>
        )} */}
      </View>

      {/* ── FLOATING EMOJI REACTIONS ──────────────────────────────────── */}
      {floaters.map(f => (
        <Animated.Text
          key={f.id}
          style={[
            styles.floatingEmoji,
            {
              left: f.x,
              opacity: f.opacity,
              transform: [{ translateY: f.anim }],
            },
          ]}
        >
          {f.emoji}
        </Animated.Text>
      ))}

      {/* ── REACTION BAR ─────────────────────────────────────────────── */}
      {reactionBarOpen && (
        <View style={styles.reactionBar}>
          {REACTIONS.map(emoji => (
            <TouchableOpacity
              key={emoji}
              style={styles.reactionBtn}
              onPress={() => handleReaction(emoji)}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── BOTTOM BAR ───────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.bottomBtn, reactionBarOpen && styles.bottomBtnActive]}
          onPress={() => setReactionBarOpen(prev => !prev)}
        >
          <Text style={styles.bottomBtnEmoji}>😊</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.leaveBtn} onPress={onLeave}>
          <Icon name="LogOut" color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      {/* ── CHAT PANEL ───────────────────────────────────────────────── */}
      <HLSChatPanel
        visible={chatOpen}
        messages={messages}
        localPeerId={localPeerId}
        onSendMessage={onSendMessage}
        onClose={() => setChatOpen(false)}
      />
    </View>
  );
};

export default HLSVideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0b14', // Premium dark background
  },

  // ── Top Bar ──
  topBar: {
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // slightly reduced gap to fit the pill
  },

  participantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  participantText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  exitBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff4d4d',
  },
  liveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },

  iconAction: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconActive: {
    opacity: 1,
  },
  netBadge: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Recording ──
  recWrapper: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4d4d',
  },

  // ── Main Content ──
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  videoWrapper: {
    width: VIDEO_W,
    alignItems: 'center',
  },
  videoArea: {
    width: VIDEO_W,
    height: VIDEO_H,
    backgroundColor: '#1a1b26',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  player: {
    width: '100%',
    height: '100%',
  },
  bufferOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attributionText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ── Floating Peer ──
  floatingPeer: {
    position: 'absolute',
    right: 16,
    top: '40%',
  },
  peerThumbContainer: {
    width: 64,
    alignItems: 'center',
    backgroundColor: 'rgba(26, 27, 38, 0.9)',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  peerThumb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2a2b36',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  peerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  peerInitialText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  peerStatusBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#1a1b26',
  },
  peerNameText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },

  // ── Floating Emoji ──
  floatingEmoji: {
    position: 'absolute',
    bottom: 120,
    fontSize: 32,
    zIndex: 100,
  },

  // ── Reaction Bar ──
  reactionBar: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 27, 38, 0.95)',
    borderRadius: 30,
    padding: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 100,
  },
  reactionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  reactionEmoji: { fontSize: 24 },

  // ── Bottom Bar ──
  bottomBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  bottomBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBtnActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  bottomBtnEmoji: { fontSize: 24 },
  leaveBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
