import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { ms } from '@/Assets/Theme/fontStyle';
import { COLORS } from '@/Assets/Theme/colors';

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
    touchX?: number | null;
    touchY?: number | null;
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
  const { width: screenW, height: screenH } = useWindowDimensions();

  const [pickerSize, setPickerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const scaleAnim = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    if (isVisible) {
      setPickerSize(null);
      setReady(false);
      scaleAnim.setValue(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (ready) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
      }).start();
    }
  }, [ready]);

  const handleLayout = useCallback((e: any) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setPickerSize({ width, height });
      setReady(true);
    }
  }, []);

  const computePosition = (): { left: number; top: number } => {
    if (!anchor) return { left: 8, top: 100 };

    const popW = pickerSize?.width ?? emojis.length * 46 + 20;
    const popH = pickerSize?.height ?? 60;

    let anchorCenterX: number;
    if (anchor.touchX != null) {
      anchorCenterX = anchor.touchX;
    } else if (anchor.width > 0) {
      anchorCenterX = anchor.x + anchor.width / 2;
    } else {
      anchorCenterX = screenW / 2;
    }

    let left = anchorCenterX - popW / 2;
    left = Math.max(8, Math.min(left, screenW - popW - 8));

    const anchorTopY = anchor.touchY != null ? anchor.touchY : anchor.y;
    const aboveTop = anchorTopY - popH - 12;
    const belowTop = anchor.y + anchor.height + 12;

    let top: number;
    if (aboveTop >= 60) {
      top = aboveTop;
    } else {
      top = Math.min(belowTop, screenH - popH - 8);
    }

    return { left, top };
  };

  const { left, top } = computePosition();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        {anchor && (
          <Animated.View
            style={[
              styles.popoverWrapper,
              {
                left,
                top,
                opacity: ready ? 1 : 0,
                transform: [{ scale: scaleAnim }],
              },
            ]}
            onStartShouldSetResponder={() => true}
            onLayout={handleLayout}
          >
            <View style={styles.pickerRow}>
              {emojis.map(emoji => {
                const isSelected = selectedEmoji === emoji;
                return (
                  <TouchableOpacity
                    key={emoji}
                    activeOpacity={0.7}
                    style={[
                      styles.emojiBtn,
                      isSelected && styles.emojiBtnSelected,
                    ]}
                    onPress={() => onSelectEmoji(emoji)}
                  >
                    <Text
                      style={[
                        styles.emojiText,
                        isSelected && styles.emojiTextSelected,
                      ]}
                    >
                      {emoji}
                    </Text>
                    {isSelected && <View style={styles.selectedDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  popoverWrapper: {
    position: 'absolute',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    borderRadius: ms(30),
    paddingHorizontal: ms(6),
    paddingVertical: ms(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  emojiBtn: {
    padding: ms(8),
    borderRadius: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiBtnSelected: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  emojiText: {
    fontSize: ms(20),
  },
  emojiTextSelected: {
    fontSize: ms(20),
  },
  selectedDot: {
    position: 'absolute',
    bottom: ms(2),
    width: ms(5),
    height: ms(5),
    borderRadius: ms(3),
    backgroundColor: COLORS.primary,
  },
});

export default EmojiPickerModal;
