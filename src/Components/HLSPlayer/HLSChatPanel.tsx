/**
 * HLSChatPanel
 *
 * Slide-in chat panel for HLS viewers.
 * Messages are sent via HMSSDK.sendBroadcastMessage (type = 'chat').
 * Emoji reactions use type = 'emoji'.
 * Raise-hand uses type = 'raise-hand'.
 *
 * Props:
 *   visible        – whether the panel is open
 *   messages       – array of received HMSMessage-shaped objects
 *   localPeerId    – peerID of the local viewer (to distinguish own messages)
 *   onSendMessage  – sends a plain-text broadcast message
 *   onClose        – closes the panel
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

const { width: SW } = Dimensions.get('window');
const PANEL_WIDTH = SW * 0.82;

export interface ChatMessage {
  id: string;          // messageId from HMSMessage
  senderName: string;  // sender?.name
  senderId: string;    // sender?.peerID
  text: string;        // message
  type: string;        // 'chat' | 'emoji' | 'raise-hand'
  time: Date;
}

interface Props {
  visible: boolean;
  messages: ChatMessage[];
  localPeerId: string;
  onSendMessage: (text: string) => Promise<void>;
  onClose: () => void;
}

const HLSChatPanel = ({
  visible,
  messages,
  localPeerId,
  onSendMessage,
  onClose,
}: Props) => {
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const slideX = useRef(new Animated.Value(PANEL_WIDTH)).current;
  const listRef = useRef<FlatList>(null);

  // Slide in/out
  useEffect(() => {
    Animated.timing(slideX, {
      toValue: visible ? 0 : PANEL_WIDTH,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, slideX]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (visible && messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages.length, visible]);

  const handleSend = async () => {
    const txt = inputText.trim();
    if (!txt || sending) return;
    setSending(true);
    try {
      await onSendMessage(txt);
      setInputText('');
    } finally {
      setSending(false);
    }
  };

  // Only show plain chat messages in the panel (not emoji/raise-hand)
  const chatMessages = messages.filter(m => !m.type || m.type === 'chat');

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = item.senderId === localPeerId;
    return (
      <View style={[styles.row, isMe && styles.rowMe]}>
        {!isMe && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(item.senderName || '?').charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
          {!isMe && <Text style={styles.senderName}>{item.senderName}</Text>}
          <Text style={styles.msgText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View
      style={[styles.panel, { transform: [{ translateX: slideX }] }]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Chat</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Icon name="X" color={COLORS.white} size={18} />
        </TouchableOpacity>
      </View>

      {/* Message list */}
      <FlatList
        ref={listRef}
        data={chatMessages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No messages yet. Say hi! 👋</Text>
          </View>
        }
      />

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            maxLength={300}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnOff]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            <Icon name="Send" color={COLORS.white} size={16} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default HLSChatPanel;

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: 'rgba(10,10,26,0.97)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.08)',
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: Platform.OS === 'android' ? 20 : 52,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  list: { flex: 1 },
  listContent: { padding: 12, gap: 8, flexGrow: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 6, gap: 8 },
  rowMe: { flexDirection: 'row-reverse' },
  avatar: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.primary ?? '#6C63FF',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  bubble: { maxWidth: '74%', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 14 },
  bubbleThem: { backgroundColor: 'rgba(255,255,255,0.1)', borderBottomLeftRadius: 4 },
  bubbleMe: { backgroundColor: COLORS.primary ?? '#6C63FF', borderBottomRightRadius: 4 },
  senderName: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600', marginBottom: 3 },
  msgText: { color: '#fff', fontSize: 13, lineHeight: 18 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: '#fff',
    fontSize: 14,
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.primary ?? '#6C63FF',
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnOff: { opacity: 0.4 },
});
