import React from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { ms } from '@/Assets/Theme/fontStyle';

interface EmojiPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  anchor: {
    x: number;
    y: number;
    width: number;
    height: number;
    isMe: boolean;
  } | null;
  selectedEmoji?: string | null;
  emojis?: string[];
}

const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  isVisible,
  onClose,
  onSelectEmoji,
  anchor,
  selectedEmoji,
  emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'],
}) => {
  const renderContent = () => {
    if (!anchor) return null;

    const { width: screenW, height: screenH } = Dimensions.get('window');

    // Approx emoji bar size (6 emojis, padding, gaps)
    const approxPopoverW = 6 * 44 + 24;
    const approxPopoverH = 56;

    const preferredLeft = anchor.isMe
      ? anchor.x + anchor.width - approxPopoverW
      : anchor.x;

    const left = Math.max(
      8,
      Math.min(preferredLeft, screenW - approxPopoverW - 8),
    );

    // Prefer showing above bubble; if not enough space, show below
    const aboveTop = anchor.y - approxPopoverH - 10;
    const belowTop = anchor.y + anchor.height + 10;
    const top =
      aboveTop >= 8
        ? aboveTop
        : Math.min(belowTop, screenH - approxPopoverH - 8);

    return (
      <View style={[styles.emojiPopover, { left, top }]}>
        <View style={styles.emojiPickerContainer}>
          {emojis.map(emoji => (
            <TouchableOpacity
              key={emoji}
              style={[
                styles.emojiItem,
                selectedEmoji === emoji && styles.emojiItemSelected,
              ]}
              onPress={() => onSelectEmoji(emoji)}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.emojiModalOverlay} onPress={onClose}>
        {renderContent()}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  emojiModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  emojiPopover: {
    position: 'absolute',
  },
  emojiPickerContainer: {
    backgroundColor: '#2c2c2e',
    borderRadius: ms(30),
    paddingHorizontal: ms(8),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emojiItem: {
    padding: ms(8),
  },
  emojiItemSelected: {
    padding: ms(4),
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: ms(30),
  },
  emojiText: {
    fontSize: ms(24),
  },
});

export default EmojiPickerModal;
