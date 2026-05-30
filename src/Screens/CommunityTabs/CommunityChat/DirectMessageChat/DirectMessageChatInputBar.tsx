import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import { KeyboardStickyView } from 'react-native-keyboard-controller';

import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';

type DirectMessageChatInputBarProps = {
  bottomInset: number;
  pendingAttachment: any;
  inputText: string;
  canSendMessage: boolean;
  isUploadingAttachment: boolean;
  typingIndicator?: React.ReactNode;
  pendingAttachmentPreview?: React.ReactNode;
  onChangeText: (text: string) => void;
  onOpenAttachmentOptions: () => void;
  onSendMessage: () => void;
};

const DirectMessageChatInputBar = ({
  bottomInset,
  pendingAttachment,
  inputText,
  canSendMessage,
  isUploadingAttachment,
  typingIndicator,
  pendingAttachmentPreview,
  onChangeText,
  onOpenAttachmentOptions,
  onSendMessage,
}: DirectMessageChatInputBarProps) => {
  return (
    <KeyboardStickyView>
      <View
        style={[
          styles.inputMainContainer,
          {
            paddingBottom: bottomInset,
          },
        ]}
      >
        {typingIndicator}
        {pendingAttachmentPreview}

        <View style={styles.inputInnerContainer}>
          <TouchableOpacity
            style={styles.fileContainer}
            onPress={() => {
              Keyboard.dismiss();
              onOpenAttachmentOptions();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            disabled={isUploadingAttachment}
          >
            <Icon name="Paperclip" size={22} color={COLORS.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder={
              pendingAttachment ? 'Add a caption...' : 'Type a message...'
            }
            placeholderTextColor={COLORS.pageDots}
            value={inputText}
            multiline
            editable={!isUploadingAttachment}
            onChangeText={onChangeText}
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              !canSendMessage && styles.sendBtnDisabled,
            ]}
            onPress={onSendMessage}
            disabled={!canSendMessage}
          >
            {isUploadingAttachment ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Icon name="SendHorizontal" size={20} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardStickyView>
  );
};

export default React.memo(DirectMessageChatInputBar);
