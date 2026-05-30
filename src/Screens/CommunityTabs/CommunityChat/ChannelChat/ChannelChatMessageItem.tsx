import React from 'react';
import { View, Text, Pressable, TouchableOpacity, Image } from 'react-native';

import styles from './style';
import Icon from '@/Components/Core/Icons';
import { COLORS } from '@/Assets/Theme/colors';
import { getFullImageUrl } from '@/Utils/ImageUtils';
import ChatVideoAttachment from './ChatVideoAttachment';
import ChatFileAttachment from './ChatFileAttachment';
import {
  getMessageAttachments,
  getAttachmentKind,
  resolveAttachmentUrl,
} from './chatAttachmentUtils';
import { resolveMessageSender } from './chatSenderUtils';

type ChannelChatMessageItemProps = {
  item: any;
  nextMessage?: any;
  currentUser: any;
  members?: any[];
  selectedMessageId: string | null;
  navigation: any;
  messageBubbleRefs: React.MutableRefObject<Map<string, any>>;
  getMessageId: (msg: any) => string;
  normalizeId: (value: any) => string;
  formatDateLabel: (dateString: string) => string;
  formatTime: (dateString: string) => string;
  toggleMessageDeleteSelection: (item: any) => void;
  openEmojiPickerForMessage: (item: any, nativeEvent?: any) => void;
  onPressReactions: (item: any) => void;
  openImageViewer: (messageAttachments: any[], tappedUri: string) => void;
};

const ChannelChatMessageItem = ({
  item,
  nextMessage,
  currentUser,
  members = [],
  selectedMessageId,
  navigation,
  messageBubbleRefs,
  getMessageId,
  normalizeId,
  formatDateLabel,
  formatTime,
  toggleMessageDeleteSelection,
  openEmojiPickerForMessage,
  onPressReactions,
  openImageViewer,
}: ChannelChatMessageItemProps) => {
  const myId = normalizeId(currentUser?._id || currentUser?.id);
  const senderId = normalizeId(
    item?.sender?._id || item?.sender?.id || item?.senderId,
  );
  const isMe = !!myId && !!senderId && myId === senderId;

  const { sender, displayName: senderName, initials } = resolveMessageSender(
    item,
    members,
    normalizeId,
  );

  const currentMsgDate = new Date(item?.createdAt).toDateString();
  const nextMsgDate = nextMessage
    ? new Date(nextMessage?.createdAt).toDateString()
    : null;
  const showDateSeparator = currentMsgDate !== nextMsgDate;

  const hasReactions =
    Array.isArray(item?.reactions) && item.reactions.length > 0;
  const attachments = getMessageAttachments(item);
  const hasAttachments = attachments.length > 0;
  const messageText = String(item?.content || item?.text || '').trim();
  const hasText = messageText.length > 0;

  const itemId = getMessageId(item);
  const isSelectedForDelete =
    !!isMe && !!selectedMessageId && !!itemId && selectedMessageId === itemId;

  const renderMessageAttachments = () => {
    if (!attachments.length) return null;

    return (
      <View style={styles.attachmentsContainer}>
        {attachments.map((att, idx) => {
          const key =
            att?._id ||
            att?.id ||
            `${att?.url || att?.filename || 'att'}-${idx}`;
          const kind = getAttachmentKind(att);
          const uri = resolveAttachmentUrl(att);

          if (kind === 'image' && uri) {
            return (
              <TouchableOpacity
                key={String(key)}
                activeOpacity={0.9}
                onPress={() => openImageViewer(attachments, uri)}
                style={styles.attachmentImageWrap}
              >
                <Image
                  source={{ uri }}
                  style={styles.attachmentImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          }

          if (kind === 'video' && uri) {
            return (
              <ChatVideoAttachment
                key={String(key)}
                uri={uri}
                attachment={att}
              />
            );
          }

          return (
            <ChatFileAttachment
              key={String(key)}
              attachment={att}
              navigation={navigation}
            />
          );
        })}
      </View>
    );
  };

  const renderReactions = () => {
    const reactions = item?.reactions || [];
    if (!reactions.length) return null;

    const totalCount = reactions.reduce(
      (acc: number, reaction: any) =>
        acc + (reaction?.count || reaction?.users?.length || 0),
      0,
    );
    const uniqueEmojis = reactions
      .map((reaction: any) => reaction?.emoji)
      .filter(Boolean)
      .slice(0, 3);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPressReactions(item)}
        style={[
          styles.reactionContainer,
          isMe ? styles.reactionContainerMe : styles.reactionContainerThem,
        ]}
      >
        <View style={styles.reactionItem}>
          {uniqueEmojis.map((emoji: string, idx: number) => (
            <Text key={`${emoji}-${idx}`} style={styles.reactionEmoji}>
              {emoji}
            </Text>
          ))}
          {totalCount > 1 && (
            <Text style={styles.reactionCount}>{totalCount}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const messageBubble = (
    <Pressable
      ref={(ref: any) => {
        const messageId = getMessageId(item);
        if (!messageId) return;

        if (ref) {
          messageBubbleRefs.current.set(messageId, ref);
        } else {
          messageBubbleRefs.current.delete(messageId);
        }
      }}
      collapsable={false}
      android_disableSound={true}
      delayLongPress={450}
      hitSlop={12}
      pressRetentionOffset={{
        top: 40,
        left: 40,
        right: 40,
        bottom: 40,
      }}
      onPress={() => {
        if (isMe && !item?.isOptimistic && selectedMessageId) {
          toggleMessageDeleteSelection(item);
        }
      }}
      onLongPress={event => {
        if (item?.isOptimistic) return;
        if (isMe) {
          toggleMessageDeleteSelection(item);
        }
        openEmojiPickerForMessage(item, event.nativeEvent);
      }}
      style={({ pressed }) => [
        styles.bubble,
        isMe ? styles.bubbleMe : styles.bubbleThem,
        hasReactions && styles.bubbleWithReaction,
        hasAttachments && styles.bubbleWithMedia,
        pressed && isMe && !isSelectedForDelete && { opacity: 0.92 },
      ]}
    >
      {!isMe && (
        <Text
          style={styles.senderName}
          selectable={false}
          suppressHighlighting
        >
          {senderName}
        </Text>
      )}

      {hasAttachments && renderMessageAttachments()}

      {hasText ? (
        <Text style={styles.msgText} selectable={false} suppressHighlighting>
          {messageText}
          <Text style={styles.timeSpacer} selectable={false}>
            {'   '}
          </Text>
          <Text style={styles.timeTextInline} selectable={false}>
            {formatTime(item?.createdAt)}
          </Text>
        </Text>
      ) : hasAttachments ? (
        <Text
          style={[styles.msgText, styles.timeTextBlock]}
          selectable={false}
          suppressHighlighting
        >
          <Text style={styles.timeTextInline} selectable={false}>
            {formatTime(item?.createdAt)}
          </Text>
        </Text>
      ) : (
        <Text style={styles.msgText} selectable={false} suppressHighlighting>
          <Text style={styles.timeTextInline} selectable={false}>
            {formatTime(item?.createdAt)}
          </Text>
        </Text>
      )}
    </Pressable>
  );

  return (
    <View>
      {showDateSeparator && (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateSeparatorText}>
            {formatDateLabel(item?.createdAt)}
          </Text>
        </View>
      )}

      <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
        {!isMe && (
          <View style={styles.avatar}>
            {sender?.profilePicture?.url ? (
              <Image
                source={{
                  uri:
                    getFullImageUrl(sender.profilePicture.url) ||
                    sender.profilePicture.url,
                }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>
        )}

        <View style={isMe ? styles.bubbleWrapperMe : styles.bubbleWrapperThem}>
          {isSelectedForDelete ? (
            <View key={`${itemId}-selected`} style={styles.bubbleSelectedWrap}>
              {messageBubble}
              <View style={styles.selectionBadge} pointerEvents="none">
                <Icon name="Check" size={14} color={COLORS.primary} />
              </View>
            </View>
          ) : (
            <React.Fragment key={`${itemId}-normal`}>{messageBubble}</React.Fragment>
          )}

          {renderReactions()}
        </View>
      </View>
    </View>
  );
};

export default React.memo(ChannelChatMessageItem);
