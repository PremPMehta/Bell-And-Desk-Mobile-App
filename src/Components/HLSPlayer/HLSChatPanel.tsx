import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

export interface ChatMessage {
  id: string;
  senderName: string;
  senderId: string;
  text: string;
  type: string;
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

  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  // ── Helper: scroll to the last message ───────────────────────────────────
  const scrollToBottom = (delay = 100) => {
    const id = setTimeout(
      () => listRef.current?.scrollToEnd({ animated: true }),
      delay,
    );
    return id;
  };

  // Dismiss keyboard when the panel closes
  useEffect(() => {
    if (!visible) {
      Keyboard.dismiss();
    }
  }, [visible]);

  // ── Scroll to bottom when keyboard opens (user taps the input) ────────────
  useEffect(() => {
    if (!visible) return undefined;

    // Give the layout time to resize before scrolling
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      scrollToBottom(150);
    });

    return () => {
      showSub.remove();
    };
  }, [visible]);

  // ── Auto-scroll on new messages ───────────────────────────────────────────
  useEffect(() => {
    if (visible && messages.length > 0) {
      const id = scrollToBottom(100);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [messages.length, visible]);

  // ── Send ──────────────────────────────────────────────────────────────────
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
        <View
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}
        >
          {!isMe && <Text style={styles.senderName}>{item.senderName}</Text>}
          <Text style={styles.msgText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  // Bottom padding for home indicator / soft nav bar
  const composerBottom = Math.max(insets.bottom, 8);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={320}
      animationOutTiming={280}
      useNativeDriver
      useNativeDriverForBackdrop
      backdropTransitionInTiming={320}
      backdropTransitionOutTiming={0}
      avoidKeyboard={Platform.OS === 'ios'}
      style={styles.modalStyle}
    >
      <View style={styles.sheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Live Chat</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Icon name="X" color={COLORS.white} size={18} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={chatMessages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No messages yet. Say hi! 👋</Text>
            </View>
          }
        />

        {/* Composer */}
        <View style={[styles.inputRow, { paddingBottom: composerBottom }]}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            maxLength={300}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!inputText.trim() || sending) && styles.sendBtnOff,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            <Icon name="Send" color={COLORS.white} size={16} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default HLSChatPanel;

const styles = StyleSheet.create({
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  // Visible chat sheet
  sheet: {
    backgroundColor: 'rgba(10,10,26,0.99)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '55%',
    overflow: 'hidden',
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  list: { flex: 1 },
  listContent: {
    padding: 12,
    gap: 8,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
    gap: 8,
  },
  rowMe: { flexDirection: 'row-reverse' },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary ?? '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  bubble: {
    maxWidth: '74%',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 14,
  },
  bubbleThem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 4,
  },
  bubbleMe: {
    backgroundColor: COLORS.primary ?? '#6C63FF',
    borderBottomRightRadius: 4,
  },
  senderName: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 3,
  },
  msgText: { color: '#fff', fontSize: 13, lineHeight: 18 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    gap: 8,
    backgroundColor: 'rgba(10,10,26,0.99)',
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary ?? '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnOff: { opacity: 0.4 },
});
